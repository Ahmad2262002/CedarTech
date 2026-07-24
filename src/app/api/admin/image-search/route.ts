import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get('q') || 'technology').trim();
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));

    if (!query) {
      return NextResponse.json({ success: true, results: [] });
    }

    const results: { id: string; name: string; url: string; source: string }[] = [];

    // ── SOURCE 1: Unsplash Live API (with pagination) ────────────────────────
    try {
      const unsplashRes = await fetch(
        `https://unsplash.com/napi/search/photos?query=${encodeURIComponent(query)}&per_page=20&page=${page}`,
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            Accept: 'application/json',
          },
        }
      );

      if (unsplashRes.ok) {
        const data = await unsplashRes.json();
        if (data.results && Array.isArray(data.results)) {
          data.results.forEach((img: any) => {
            const url = img.urls?.small || img.urls?.regular || img.urls?.full;
            if (url) {
              results.push({
                id: `us_${img.id}`,
                name: img.alt_description || img.description || `${query} image`,
                url,
                source: 'Unsplash',
              });
            }
          });
        }
      }
    } catch (e) {
      console.warn('Unsplash search failed', e);
    }

    // ── SOURCE 2: Wikimedia Commons (with offset-based pagination) ───────────
    try {
      const gsroffset = (page - 1) * 15;
      const wikiUrl =
        `https://commons.wikimedia.org/w/api.php` +
        `?action=query&generator=search` +
        `&gsrsearch=${encodeURIComponent(query)}` +
        `&gsrnamespace=6&gsrlimit=15` +
        (gsroffset > 0 ? `&gsroffset=${gsroffset}` : '') +
        `&prop=imageinfo&iiprop=url|extmetadata&format=json&origin=*`;

      const wikiRes = await fetch(wikiUrl, {
        headers: { 'User-Agent': 'CedarTechAdminStore/1.0 (contact@cedartech.com)' },
      });

      if (wikiRes.ok) {
        const wikiData = await wikiRes.json();
        const pages = wikiData.query?.pages;
        if (pages) {
          Object.values(pages).forEach((p: any) => {
            const imageUrl = p.imageinfo?.[0]?.url;
            if (imageUrl && /\.(jpg|jpeg|png|webp)$/i.test(imageUrl)) {
              results.push({
                id: `wiki_${p.pageid}`,
                name: p.title?.replace('File:', '') || `${query} photo`,
                url: imageUrl,
                source: 'Wikimedia',
              });
            }
          });
        }
      }
    } catch (e) {
      console.warn('Wikimedia search failed', e);
    }

    // ── SOURCE 3: DuckDuckGo Instant Image API ───────────────────────────────
    // Only fetch DDG on page 1 (no native pagination support)
    if (page === 1) {
      try {
        const ddgTokenRes = await fetch(
          `https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`,
          {
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
          }
        );
        const text = await ddgTokenRes.text();
        const vqdMatch = text.match(/vqd=['"]([^'"]+)['"]/);

        if (vqdMatch?.[1]) {
          const vqd = vqdMatch[1];
          const ddgImgRes = await fetch(
            `https://duckduckgo.com/i.js?l=us-en&o=json&q=${encodeURIComponent(query)}&vqd=${vqd}&f=,,,`,
            {
              headers: {
                'User-Agent':
                  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              },
            }
          );

          if (ddgImgRes.ok) {
            const ddgData = await ddgImgRes.json();
            if (ddgData.results && Array.isArray(ddgData.results)) {
              ddgData.results.slice(0, 20).forEach((item: any, idx: number) => {
                if (item.image) {
                  results.push({
                    id: `ddg_${idx}_${Date.now()}`,
                    name: item.title || `${query} product photo`,
                    url: item.image,
                    source: 'Web Search',
                  });
                }
              });
            }
          }
        }
      } catch (e) {
        console.warn('DuckDuckGo search failed', e);
      }
    }

    // ── Deduplicate by URL ───────────────────────────────────────────────────
    const seen = new Set<string>();
    const uniqueResults: typeof results = [];
    for (const item of results) {
      if (!seen.has(item.url)) {
        seen.add(item.url);
        uniqueResults.push(item);
      }
    }

    return NextResponse.json({
      success: true,
      query,
      page,
      count: uniqueResults.length,
      results: uniqueResults,
    });
  } catch (error) {
    console.error('Live Web Image Search Error:', error);
    return NextResponse.json(
      { success: false, error: 'Live web image search failed' },
      { status: 500 }
    );
  }
}
