'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Plus, Edit, Trash2, Loader, Search, PlusCircle, MinusCircle,
  Image as ImageIcon, Check, X, Upload, HardDrive, Globe, Sparkles,
  Package, RefreshCw, Filter, ChevronDown, Star, Layers, Link2,
  ArrowDown, ImagePlus, CheckSquare, Square
} from 'lucide-react';
import InstagramPostModal, { InstagramIcon } from 'src/components/admin/InstagramPostModal';

/* ═══════════════════════════════════════════════════════════
   QUICK TAG PRESETS
═══════════════════════════════════════════════════════════ */
const POPULAR_QUICK_TAGS = [
  'iPhone 15 Pro', 'Samsung Galaxy S24', 'MacBook Pro M3', 'Gaming Laptop RTX',
  'NVIDIA RTX 4090', 'Gaming PC Tower', 'Logitech MX Master', 'Mechanical Keyboard',
  'Sony WH-1000XM5', 'Curved Monitor 4K', 'AirPods Pro 2', 'PlayStation 5',
  'iPad Pro M2', 'Apple Watch Ultra', 'Razer DeathAdder', 'Xbox Series X',
];

/* ═══════════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════════ */
interface Category { _id: string; name: string; }

interface Product {
  _id: string;
  name: string;
  brand: string;
  price: number;
  stock: number;
  category: Category | string;
  specifications: Record<string, string>;
  images: string[];
  warrantyInfo?: string;
  isFeatured: boolean;
  availabilityStatus: string;
  description: string;
}

interface SearchImageResult {
  id: string;
  name: string;
  url: string;
  source?: string;
}

/* ═══════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════ */
const inputCls =
  'w-full bg-black/40 border border-[#38383a] focus:border-[#0077ED] text-white rounded-2xl p-3 outline-none transition-all placeholder:text-[#636366] text-sm';

const labelCls = 'block text-[10px] font-extrabold text-[#8e8e93] uppercase tracking-widest mb-1.5';

/* ═══════════════════════════════════════════════════════════
   BRAND PRESETS — Smart Auto-Fill for Product Creation
═══════════════════════════════════════════════════════════ */
const BRAND_PRESETS: Record<string, {
  color: string;
  defaultWarranty: string;
  descriptionTemplate: string;
  specTemplate: { key: string; val: string }[];
}> = {
  Apple: {
    color: '#f5f5f7',
    defaultWarranty: '1 Year Apple Lebanon Warranty',
    descriptionTemplate: 'Genuine Apple product sold factory sealed with all original accessories and warranty card. Covered under official Apple Lebanon warranty.',
    specTemplate: [
      { key: 'Operating System', val: 'iOS / macOS' },
      { key: 'Chip', val: 'Apple Silicon' },
      { key: 'Storage', val: '256GB' },
      { key: 'RAM', val: '8GB Unified Memory' },
      { key: 'Display', val: 'Super Retina XDR' },
      { key: 'Color', val: 'Natural Titanium' },
    ],
  },
  Samsung: {
    color: '#4A90D9',
    defaultWarranty: '1 Year Samsung Lebanon Warranty',
    descriptionTemplate: 'Original Samsung device. Factory sealed with full local warranty and all accessories included.',
    specTemplate: [
      { key: 'Display', val: '6.8" Dynamic AMOLED 2X' },
      { key: 'Processor', val: 'Snapdragon 8 Gen 3' },
      { key: 'RAM', val: '12GB LPDDR5X' },
      { key: 'Storage', val: '256GB' },
      { key: 'Camera', val: '200MP Main + 12MP Ultra Wide' },
      { key: 'Battery', val: '5000mAh with 45W fast charge' },
      { key: 'Color', val: 'Titanium Black' },
    ],
  },
  ASUS: {
    color: '#74b9ff',
    defaultWarranty: '2 Year ASUS Lebanon Warranty',
    descriptionTemplate: 'High-performance ASUS device built for professionals and gamers. Factory sealed with full warranty.',
    specTemplate: [
      { key: 'Processor', val: 'Intel Core i9 / AMD Ryzen 9' },
      { key: 'GPU', val: 'NVIDIA RTX 4090' },
      { key: 'RAM', val: '32GB DDR5' },
      { key: 'Storage', val: '2TB NVMe SSD' },
      { key: 'Display', val: '15.6" QHD 240Hz' },
      { key: 'Color', val: 'Eclipse Gray' },
    ],
  },
  Sony: {
    color: '#dfe6e9',
    defaultWarranty: '1 Year Sony Lebanon Warranty',
    descriptionTemplate: 'Premium Sony product with industry-leading audio and display technology. Factory sealed.',
    specTemplate: [
      { key: 'Driver Unit', val: '40mm dome type' },
      { key: 'Frequency Response', val: '4Hz – 40,000Hz' },
      { key: 'ANC', val: 'Dual Noise Sensor Technology' },
      { key: 'Battery Life', val: '30h (ANC on) / 40h (ANC off)' },
      { key: 'Connectivity', val: 'Bluetooth 5.2 / 3.5mm jack' },
      { key: 'Color', val: 'Midnight Black' },
    ],
  },
  NVIDIA: {
    color: '#76B900',
    defaultWarranty: '3 Year NVIDIA Warranty',
    descriptionTemplate: 'Professional-grade NVIDIA GPU for gaming and AI workloads. Brand new sealed in box.',
    specTemplate: [
      { key: 'Architecture', val: 'Ada Lovelace' },
      { key: 'CUDA Cores', val: '16384' },
      { key: 'VRAM', val: '24GB GDDR6X' },
      { key: 'Memory Bandwidth', val: '1008 GB/s' },
      { key: 'TDP', val: '450W' },
      { key: 'Connectors', val: '3x DisplayPort 1.4a, 1x HDMI 2.1' },
    ],
  },
  Dell: {
    color: '#0076CE',
    defaultWarranty: '1 Year Dell Lebanon Warranty',
    descriptionTemplate: 'Dell workstation-class device built for professional use. Original factory sealed with full warranty.',
    specTemplate: [
      { key: 'Processor', val: 'Intel Core Ultra 9' },
      { key: 'RAM', val: '32GB LPDDR5x' },
      { key: 'Storage', val: '1TB PCIe Gen5 SSD' },
      { key: 'Display', val: '15.6" OLED 3.5K Touch' },
      { key: 'Battery', val: '86Wh, 130W USB-C' },
      { key: 'Color', val: 'Platinum Silver' },
    ],
  },
};

const SPEC_TEMPLATES: Record<string, { key: string; val: string }[]> = {
  Smartphone: [
    { key: 'Display', val: '' },
    { key: 'Processor', val: '' },
    { key: 'RAM', val: '' },
    { key: 'Storage', val: '' },
    { key: 'Camera', val: '' },
    { key: 'Battery', val: '' },
    { key: 'OS', val: '' },
    { key: 'Color', val: '' },
  ],
  Laptop: [
    { key: 'Processor', val: '' },
    { key: 'GPU', val: '' },
    { key: 'RAM', val: '' },
    { key: 'Storage', val: '' },
    { key: 'Display', val: '' },
    { key: 'Battery', val: '' },
    { key: 'OS', val: '' },
    { key: 'Color', val: '' },
  ],
  'Gaming PC': [
    { key: 'CPU', val: '' },
    { key: 'GPU', val: '' },
    { key: 'RAM', val: '' },
    { key: 'Storage', val: '' },
    { key: 'Motherboard', val: '' },
    { key: 'PSU', val: '' },
    { key: 'Case', val: '' },
    { key: 'Cooling', val: '' },
  ],
  Headphones: [
    { key: 'Driver Unit', val: '' },
    { key: 'Frequency Response', val: '' },
    { key: 'ANC', val: '' },
    { key: 'Battery Life', val: '' },
    { key: 'Connectivity', val: '' },
    { key: 'Color', val: '' },
  ],
  GPU: [
    { key: 'Architecture', val: '' },
    { key: 'CUDA Cores', val: '' },
    { key: 'VRAM', val: '' },
    { key: 'Memory Bandwidth', val: '' },
    { key: 'TDP', val: '' },
    { key: 'Connectors', val: '' },
  ],
};

/* ═══════════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════════ */
export default function AdminProductsPage() {
  /* ── Data ── */
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  /* ── Product Modal ── */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formError, setFormError] = useState('');

  /* ── Form Fields ── */
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');
  const [warrantyInfo, setWarrantyInfo] = useState('1 Year Warranty');
  const [isFeatured, setIsFeatured] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState('in_stock');
  const [description, setDescription] = useState('');
  const [imageList, setImageList] = useState<string[]>([]);
  const [specList, setSpecList] = useState<{ key: string; val: string }[]>([{ key: 'Color', val: 'Black' }]);
  const [activeSpecTemplate, setActiveSpecTemplate] = useState<string>('');

  /* ── Photo Picker State ── */
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [transparentOnly, setTransparentOnly] = useState(true);
  const [pickerTab, setPickerTab] = useState<'search' | 'upload' | 'url'>('search');
  const [pickerSearch, setPickerSearch] = useState('');
  const [liveResults, setLiveResults] = useState<SearchImageResult[]>([]);
  const [isSearchingLive, setIsSearchingLive] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [selectedPickerUrls, setSelectedPickerUrls] = useState<string[]>([]);
  const [searchPage, setSearchPage] = useState(1);
  const [hasMoreResults, setHasMoreResults] = useState(true);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedPreviews, setUploadedPreviews] = useState<{ url: string; name: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── Instagram Generator Modal ── */
  const [instagramProduct, setInstagramProduct] = useState<Product | null>(null);
  const [isInstagramModalOpen, setIsInstagramModalOpen] = useState(false);
  const [isNewInstagramProduct, setIsNewInstagramProduct] = useState(false);

  const openInstagramModal = (prod: Product, isNew = false) => {
    setInstagramProduct(prod);
    setIsNewInstagramProduct(isNew);
    setIsInstagramModalOpen(true);
  };

  /* ════════════════════════════════════════════════════════
     DATA LOADING
  ════════════════════════════════════════════════════════ */
  const loadData = async () => {
    try {
      setIsLoading(true);
      const [prodRes, catRes] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/admin/categories'),
      ]);
      const prodData = await prodRes.json();
      const catData = await catRes.json();
      if (prodData.success) setProducts(prodData.products);
      if (catData.success) setCategories(catData.categories);
    } catch (e) {
      console.error('Failed to load data', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  /* ════════════════════════════════════════════════════════
     LIVE IMAGE SEARCH  (with pagination)
  ════════════════════════════════════════════════════════ */
  const performLiveImageSearch = useCallback(async (query: string, page: number = 1, isTransparent: boolean = transparentOnly) => {
    if (!query.trim()) return;
    if (page === 1) {
      setIsSearchingLive(true);
    } else {
      setIsLoadingMore(true);
    }
    try {
      const queryToSend = isTransparent ? `${query.trim()} png transparent no background` : query.trim();
      const res = await fetch(
        `/api/admin/image-search?q=${encodeURIComponent(queryToSend)}&page=${page}`
      );
      const data = await res.json();
      if (data.success && data.results) {
        const incoming: SearchImageResult[] = data.results;
        setLiveResults((prev) => (page === 1 ? incoming : [...prev, ...incoming]));
        setHasMoreResults(incoming.length >= 10); // assume more exist if we got a full batch
      } else {
        setHasMoreResults(false);
      }
    } catch (err) {
      console.error('Live web image search failed', err);
      setHasMoreResults(false);
    } finally {
      setIsSearchingLive(false);
      setIsLoadingMore(false);
    }
  }, [transparentOnly]);

  /* Auto-search on type (debounced) */
  useEffect(() => {
    if (!isPickerOpen || pickerTab !== 'search') return;
    const timer = setTimeout(() => {
      if (pickerSearch.trim()) {
        setSearchPage(1);
        setHasMoreResults(true);
        performLiveImageSearch(pickerSearch, 1);
      }
    }, 480);
    return () => clearTimeout(timer);
  }, [pickerSearch, isPickerOpen, pickerTab, performLiveImageSearch]);

  /* ════════════════════════════════════════════════════════
     MODAL OPEN HELPERS
  ════════════════════════════════════════════════════════ */
  const openCreateModal = () => {
    setEditingProduct(null);
    setName(''); setBrand(''); setPrice(''); setStock('');
    setCategory(categories[0]?._id || '');
    setWarrantyInfo('1 Year Warranty');
    setIsFeatured(false);
    setAvailabilityStatus('in_stock');
    setDescription('');
    setImageList([]);
    setSpecList([{ key: 'Warranty', val: '1 Year Local' }]);
    setActiveSpecTemplate('');
    setFormError('');
    setIsModalOpen(true);
  };

  /* ── Smart brand auto-fill ── */
  const applyBrandPreset = (brandName: string) => {
    const preset = BRAND_PRESETS[brandName];
    if (!preset) return;
    setBrand(brandName);
    setWarrantyInfo(preset.defaultWarranty);
    setDescription(preset.descriptionTemplate);
    setSpecList(preset.specTemplate);
    setActiveSpecTemplate('');
  };

  /* ── Apply spec template ── */
  const applySpecTemplate = (templateKey: string) => {
    const tmpl = SPEC_TEMPLATES[templateKey];
    if (tmpl) {
      setSpecList(tmpl.map(s => ({ ...s })));
      setActiveSpecTemplate(templateKey);
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setBrand(product.brand);
    setPrice(product.price.toString()); setStock(product.stock.toString());
    setCategory(typeof product.category === 'object' ? product.category._id : product.category);
    setWarrantyInfo(product.warrantyInfo || '');
    setIsFeatured(product.isFeatured);
    setAvailabilityStatus(product.availabilityStatus);
    setDescription(product.description);
    setImageList(product.images || []);
    const parsedSpecs = Object.entries(product.specifications || {}).map(([k, v]) => ({ key: k, val: v }));
    setSpecList(parsedSpecs.length > 0 ? parsedSpecs : [{ key: '', val: '' }]);
    setFormError('');
    setIsModalOpen(true);
  };

  const openPicker = () => {
    setSelectedPickerUrls([...imageList]);
    const defaultQuery = name || brand || 'technology product';
    setPickerSearch(defaultQuery);
    setCustomUrlInput('');
    setPickerTab('search');
    setSearchPage(1);
    setHasMoreResults(true);
    setLiveResults([]);
    setUploadedPreviews([]);
    setIsPickerOpen(true);
    performLiveImageSearch(defaultQuery, 1);
  };

  /* ════════════════════════════════════════════════════════
     SPEC HELPERS
  ════════════════════════════════════════════════════════ */
  const handleAddSpecRow = () => setSpecList([...specList, { key: '', val: '' }]);
  const handleRemoveSpecRow = (i: number) => setSpecList(specList.filter((_, idx) => idx !== i));
  const handleSpecChange = (i: number, field: 'key' | 'val', value: string) => {
    const updated = [...specList];
    updated[i][field] = value;
    setSpecList(updated);
  };

  /* ════════════════════════════════════════════════════════
     DELETE
  ════════════════════════════════════════════════════════ */
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (res.ok) setProducts(products.filter((p) => p._id !== id));
    } catch (e) {
      console.error('Delete failed', e);
    }
  };

  /* ════════════════════════════════════════════════════════
     DEVICE FILE UPLOAD  (with drag-and-drop)
  ════════════════════════════════════════════════════════ */
  const processFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        if (!result) return;
        setUploadedPreviews((prev) => {
          if (prev.find((p) => p.url === result)) return prev;
          return [...prev, { url: result, name: file.name }];
        });
        setSelectedPickerUrls((prev) => {
          if (prev.includes(result)) return prev;
          return [...prev, result];
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDeviceFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    processFiles(e.dataTransfer.files);
  };

  /* ════════════════════════════════════════════════════════
     FORM SUBMIT
  ════════════════════════════════════════════════════════ */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!name || !brand || !price || !stock || !category || !description) {
      setFormError('Please fill in all required fields.');
      return;
    }
    setSubmitLoading(true);
    const specifications: Record<string, string> = {};
    specList.forEach((s) => { if (s.key.trim() && s.val.trim()) specifications[s.key.trim()] = s.val.trim(); });

    const payload = {
      name, brand, price: parseFloat(price), stock: parseInt(stock),
      category, warrantyInfo, isFeatured, availabilityStatus, description,
      images: imageList.length > 0 ? imageList : ['/images/placeholder.jpg'],
      specifications,
    };
    try {
      const url = editingProduct ? `/api/admin/products/${editingProduct._id}` : '/api/admin/products';
      const method = editingProduct ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsModalOpen(false);
        loadData();
        // Automatically open the Instagram Post Studio for newly created items!
        if (!editingProduct && (data.product || payload)) {
          openInstagramModal(data.product || { ...payload, _id: data.product?._id || 'new' }, true);
        }
      } else {
        setFormError(data.error || 'Operation failed.');
      }
    } catch {
      setFormError('Connection error occurred.');
    } finally {
      setSubmitLoading(false);
    }
  };

  /* ════════════════════════════════════════════════════════
     DERIVED
  ════════════════════════════════════════════════════════ */
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ════════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════════ */
  return (
    <div className="space-y-6 font-sans">

      {/* ── Page Header ─────────────────────────────────── */}
      <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 rounded-3xl p-6 sm:p-7 overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#1c1c1e 0%,#2c2c2e 100%)', border: '1px solid #38383a', boxShadow: '0 20px 60px rgba(0,0,0,.5)' }}>
        <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(94,92,230,.18) 0%,transparent 70%)' }} />
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest" style={{ color: '#5e5ce6' }}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>Store Inventory</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Products Management</h1>
          <p className="text-xs" style={{ color: '#8e8e93' }}>
            {products.length} products · iOS-style admin panel · live web image search
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="relative z-10 flex items-center gap-2 text-white font-bold py-2.5 px-5 rounded-2xl text-sm transition-all active:scale-95"
          style={{ background: 'linear-gradient(135deg,#5e5ce6,#7c7af8)', boxShadow: '0 6px 24px rgba(94,92,230,.4)' }}
        >
          <Plus className="w-4 h-4" />
          <span>New Product</span>
        </button>
      </div>

      {/* ── Search Bar ─────────────────────────────────── */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#636366' }} />
        <input
          type="text"
          placeholder="Search products by name or brand…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border text-white rounded-2xl py-2.5 pl-10 pr-4 outline-none text-sm transition-all"
          style={{ background: '#1c1c1e', borderColor: '#38383a', color: 'white' }}
          onFocus={(e) => (e.target.style.borderColor = '#5e5ce6')}
          onBlur={(e) => (e.target.style.borderColor = '#38383a')}
        />
      </div>

      {/* ── Products Table ─────────────────────────────── */}
      {isLoading ? (
        <div className="flex justify-center items-center py-28">
          <Loader className="w-8 h-8 animate-spin" style={{ color: '#5e5ce6' }} />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 rounded-3xl border border-dashed" style={{ background: '#1c1c1e', borderColor: '#38383a' }}>
          <Package className="w-10 h-10 mx-auto mb-3" style={{ color: '#48484a' }} />
          <p className="text-sm font-semibold" style={{ color: '#636366' }}>No products found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden md:block rounded-3xl overflow-hidden" style={{ background: '#1c1c1e', border: '1px solid #38383a', boxShadow: '0 12px 40px rgba(0,0,0,.4)' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr style={{ background: '#111113', borderBottom: '1px solid #38383a', color: '#636366' }}
                    className="font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-4 w-16">Photo</th>
                    <th className="p-4">Product</th>
                    <th className="p-4">Brand</th>
                    <th className="p-4">Category</th>
                    <th className="p-4 text-center">Price</th>
                    <th className="p-4 text-center">Stock</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((prod, idx) => (
                    <tr
                      key={prod._id}
                      style={{ borderBottom: idx < filteredProducts.length - 1 ? '1px solid #2c2c2e' : 'none', color: '#e5e5ea' }}
                      className="transition-all hover:bg-[#2c2c2e]/60"
                    >
                      <td className="p-4">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center p-1 overflow-hidden relative"
                          style={{ background: '#111113', border: '1px solid #38383a' }}>
                          {prod.images?.[0] ? (
                            <img src={prod.images[0]} alt={prod.name} className="max-h-full max-w-full object-contain" />
                          ) : (
                            <ImageIcon className="w-5 h-5" style={{ color: '#48484a' }} />
                          )}
                          {prod.images?.length > 1 && (
                            <span className="absolute bottom-0.5 right-0.5 text-[8px] font-mono text-white px-1 rounded-full"
                              style={{ background: '#5e5ce6' }}>
                              +{prod.images.length - 1}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 font-bold text-white max-w-[200px] truncate">{prod.name}</td>
                      <td className="p-4 font-mono text-sm" style={{ color: '#8e8e93' }}>{prod.brand}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold"
                          style={{ background: '#2c2c2e', color: '#aeaeb2', border: '1px solid #38383a' }}>
                          {typeof prod.category === 'object' ? prod.category.name : 'General'}
                        </span>
                      </td>
                      <td className="p-4 text-center font-mono font-bold text-white">${prod.price.toLocaleString()}</td>
                      <td className="p-4 text-center">
                        <span className={`px-3 py-1 rounded-full font-bold text-[10px] font-mono ${
                          prod.stock <= 0
                            ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                            : prod.stock <= 3
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {prod.stock <= 0 ? 'Out of Stock' : `${prod.stock} units`}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-1 shrink-0">
                        <button
                          onClick={() => openInstagramModal(prod)}
                          className="p-2 rounded-xl transition-all inline-block hover:scale-105"
                          style={{ background: 'linear-gradient(135deg,#f58529,#dd2a7b,#8134af)', color: 'white', boxShadow: '0 2px 10px rgba(221,42,123,0.35)' }}
                          title="Generate Instagram Post & Link"
                        >
                          <InstagramIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(prod)}
                          className="p-2 rounded-xl transition-colors inline-block"
                          style={{ color: '#8e8e93' }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'white'; (e.currentTarget as HTMLButtonElement).style.background = '#2c2c2e'; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#8e8e93'; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(prod._id)}
                          className="p-2 rounded-xl transition-colors inline-block"
                          style={{ color: '#636366' }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#ff453a'; (e.currentTarget as HTMLButtonElement).style.background = '#2c2c2e'; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#636366'; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden space-y-3">
            {filteredProducts.map((prod) => (
              <div
                key={prod._id}
                className="p-4 rounded-3xl border flex flex-col gap-3.5 transition-all"
                style={{ background: '#1c1c1e', borderColor: '#2c2c2e', boxShadow: '0 8px 30px rgba(0,0,0,.2)' }}
              >
                {/* Header: Photo + Info */}
                <div className="flex gap-3">
                  <div className="w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center p-1.5 overflow-hidden relative"
                    style={{ background: '#111113', border: '1px solid #2c2c2e' }}>
                    {prod.images?.[0] ? (
                      <img src={prod.images[0]} alt={prod.name} className="max-h-full max-w-full object-contain" />
                    ) : (
                      <ImageIcon className="w-6 h-6" style={{ color: '#48484a' }} />
                    )}
                    {prod.images?.length > 1 && (
                      <span className="absolute bottom-1 right-1 text-[8px] font-mono text-white px-1.5 py-0.5 rounded-full"
                        style={{ background: '#5e5ce6' }}>
                        +{prod.images.length - 1}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-extrabold text-white text-sm truncate leading-snug">{prod.name}</p>
                    <p className="text-[11px] font-mono mt-1" style={{ color: '#8e8e93' }}>{prod.brand}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold"
                        style={{ background: '#111113', color: '#aeaeb2', border: '1px solid #2c2c2e' }}>
                        {typeof prod.category === 'object' ? prod.category.name : 'General'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer: Price, Stock & Actions */}
                <div className="flex justify-between items-center pt-3.5 border-t border-white/5" style={{ borderColor: '#2c2c2e' }}>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#636366]">Price &amp; Stock</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-white text-sm">${prod.price.toLocaleString()}</span>
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[9px] font-mono ${
                        prod.stock <= 0
                          ? 'bg-red-500/15 text-red-400 border border-red-500/20'
                          : prod.stock <= 3
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                          : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {prod.stock <= 0 ? 'Out' : `${prod.stock} items`}
                      </span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openInstagramModal(prod)}
                      className="p-2.5 rounded-xl transition-all flex items-center justify-center text-white"
                      style={{ background: 'linear-gradient(135deg,#f58529,#dd2a7b,#8134af)', boxShadow: '0 2px 10px rgba(221,42,123,0.35)' }}
                      title="Generate Instagram Post & Link"
                    >
                      <InstagramIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEditModal(prod)}
                      className="p-2.5 rounded-xl transition-all flex items-center justify-center border text-[#8e8e93] active:bg-[#2c2c2e] hover:text-white"
                      style={{ background: '#111113', borderColor: '#2c2c2e' }}
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(prod._id)}
                      className="p-2.5 rounded-xl transition-all flex items-center justify-center border text-[#636366] active:bg-red-500/10 hover:text-[#ff453a]"
                      style={{ background: '#111113', borderColor: '#2c2c2e' }}
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          CREATE / EDIT PRODUCT MODAL
      ══════════════════════════════════════════════════ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-md p-4 pt-8 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl shadow-2xl p-6 md:p-7 space-y-5 my-4"
            style={{ background: '#111113', border: '1px solid #2c2c2e' }}>

            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4" style={{ borderBottom: '1px solid #2c2c2e' }}>
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5" style={{ color: '#0077ED' }} />
                  <span>{editingProduct ? 'Edit Product' : 'New Product'}</span>
                </h2>
                <p className="text-xs mt-0.5" style={{ color: '#636366' }}>
                  Smart brand presets · Live image search · Auto-spec fill
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl transition-colors"
                style={{ color: '#636366' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'white')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#636366')}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="text-xs p-3.5 rounded-2xl text-center"
                style={{ background: 'rgba(255,69,58,.12)', border: '1px solid rgba(255,69,58,.3)', color: '#ff453a' }}>
                {formError}
              </div>
            )}

            {/* ── Smart Brand Quick-Pick ── */}
            <div className="space-y-2">
              <label className={labelCls}>Quick Brand Presets — Auto-fills Specs &amp; Warranty</label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(BRAND_PRESETS).map(([bName, preset]) => (
                  <button
                    key={bName}
                    type="button"
                    onClick={() => applyBrandPreset(bName)}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl border transition-all"
                    style={{
                      background: brand === bName ? '#0077ED22' : '#1c1c1e',
                      borderColor: brand === bName ? '#0077ED' : '#38383a',
                      color: brand === bName ? '#fff' : preset.color,
                    }}
                  >
                    {bName}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Name */}
                <div>
                  <label className={labelCls}>Product Name</label>
                  <input type="text" required placeholder="e.g. iPhone 15 Pro Max"
                    value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
                </div>

                {/* Brand */}
                <div>
                  <label className={labelCls}>Brand</label>
                  <input type="text" required placeholder="e.g. Apple, Samsung, ASUS"
                    value={brand} onChange={(e) => setBrand(e.target.value)} className={inputCls} />
                </div>

                {/* Price */}
                <div>
                  <label className={labelCls}>Price (USD)</label>
                  <input type="number" step="0.01" min="0" required placeholder="e.g. 1199"
                    value={price} onChange={(e) => setPrice(e.target.value)} className={inputCls} />
                </div>

                {/* Stock */}
                <div>
                  <label className={labelCls}>Stock Quantity</label>
                  <input type="number" min="0" required placeholder="e.g. 10"
                    value={stock} onChange={(e) => setStock(e.target.value)} className={inputCls} />
                </div>

                {/* Category */}
                <div>
                  <label className={labelCls}>Category</label>
                  <select required value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
                    <option value="">Select Category</option>
                    {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>

                {/* Warranty */}
                <div>
                  <label className={labelCls}>Warranty Info</label>
                  <input type="text" placeholder="e.g. 1 Year Official Warranty"
                    value={warrantyInfo} onChange={(e) => setWarrantyInfo(e.target.value)} className={inputCls} />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className={labelCls}>Product Description</label>
                <textarea rows={3} required placeholder="Detailed description of the product..."
                  value={description} onChange={(e) => setDescription(e.target.value)} className={inputCls} />
              </div>

              {/* ── Product Photos Section ── */}
              <div className="space-y-3 p-4 rounded-2xl" style={{ background: '#111113', border: '1px solid #38383a' }}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="block text-xs font-black text-white uppercase tracking-wider">
                      Product Photos ({imageList.length})
                    </label>
                    <p className="text-[11px] mt-0.5" style={{ color: '#636366' }}>
                      Photos cycle automatically on storefront cards
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={openPicker}
                    className="flex items-center gap-2 text-white font-bold py-2 px-4 rounded-xl text-xs transition-all active:scale-95 shrink-0"
                    style={{ background: 'linear-gradient(135deg,#5e5ce6,#7c7af8)', boxShadow: '0 4px 16px rgba(94,92,230,.35)' }}
                  >
                    <ImagePlus className="w-4 h-4" />
                    <span>Search & Pick Photos</span>
                  </button>
                </div>

                {imageList.length === 0 ? (
                  <div className="text-center py-6 rounded-2xl border border-dashed text-xs" style={{ borderColor: '#38383a', color: '#48484a' }}>
                    No photos yet. Click "Search & Pick Photos" to find real-time web images.
                  </div>
                ) : (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-1">
                    {imageList.map((url, idx) => (
                      <div key={idx}
                        className="relative group aspect-square rounded-xl p-1 flex items-center justify-center overflow-hidden"
                        style={{ background: '#1c1c1e', border: '1px solid #38383a' }}>
                        <img src={url} alt={`Product ${idx + 1}`} className="max-h-full max-w-full object-contain" />
                        <button
                          type="button"
                          onClick={() => setImageList(imageList.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ background: '#ff453a' }}
                          title="Remove"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className={labelCls}>Description</label>
                <textarea required placeholder="Detailed tech specifications and key features…"
                  value={description} onChange={(e) => setDescription(e.target.value)}
                  rows={3} className={inputCls} />
              </div>

              {/* Specs */}
              <div className="space-y-3 p-4 rounded-2xl" style={{ background: '#1c1c1e', border: '1px solid #2c2c2e' }}>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3" style={{ borderBottom: '1px solid #2c2c2e' }}>
                  <div>
                    <label className={labelCls} style={{ marginBottom: 0 }}>Technical Specifications</label>
                    <p className="text-[10px] mt-0.5" style={{ color: '#48484a' }}>Pick a template or add rows manually</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                    {Object.keys(SPEC_TEMPLATES).map((tmpl) => (
                      <button
                        key={tmpl}
                        type="button"
                        onClick={() => applySpecTemplate(tmpl)}
                        className="text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all"
                        style={{
                          background: activeSpecTemplate === tmpl ? '#0077ED22' : '#111113',
                          borderColor: activeSpecTemplate === tmpl ? '#0077ED' : '#38383a',
                          color: activeSpecTemplate === tmpl ? '#fff' : '#8e8e93',
                        }}
                      >
                        {tmpl}
                      </button>
                    ))}
                    <button type="button" onClick={handleAddSpecRow}
                      className="flex items-center gap-1 font-bold text-xs transition-colors shrink-0 ml-1"
                      style={{ color: '#0077ED' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#4d9fee')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#0077ED')}>
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  {specList.map((spec, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input type="text" placeholder="Key (e.g. RAM)"
                        value={spec.key} onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                        className="flex-1 border text-white rounded-xl p-2.5 text-xs outline-none transition-all placeholder:text-[#48484a]"
                        style={{ background: '#111113', borderColor: '#2c2c2e' }}
                        onFocus={(e) => (e.target.style.borderColor = '#0077ED')}
                        onBlur={(e) => (e.target.style.borderColor = '#2c2c2e')} />
                      <input type="text" placeholder="Value (e.g. 16GB DDR5)"
                        value={spec.val} onChange={(e) => handleSpecChange(index, 'val', e.target.value)}
                        className="flex-1 border text-white rounded-xl p-2.5 text-xs outline-none transition-all placeholder:text-[#48484a]"
                        style={{ background: '#111113', borderColor: '#2c2c2e' }}
                        onFocus={(e) => (e.target.style.borderColor = '#0077ED')}
                        onBlur={(e) => (e.target.style.borderColor = '#2c2c2e')} />
                      <button type="button" onClick={() => handleRemoveSpecRow(index)}
                        className="shrink-0 transition-colors" style={{ color: '#48484a' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#ff453a')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#48484a')}>
                        <MinusCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded accent-indigo-600" />
                  <span className="text-xs font-semibold text-white">Feature on Homepage</span>
                </label>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#8e8e93' }}>Status:</label>
                  <select value={availabilityStatus} onChange={(e) => setAvailabilityStatus(e.target.value)}
                    className="border text-white rounded-xl p-2 text-xs outline-none"
                    style={{ background: '#111113', borderColor: '#38383a' }}>
                    <option value="in_stock">In Stock</option>
                    <option value="low_stock">Low Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              {/* Footer CTA */}
              <div className="flex gap-3 justify-end pt-4" style={{ borderTop: '1px solid #38383a' }}>
                <button type="button" onClick={() => setIsModalOpen(false)}
                  className="font-semibold py-2.5 px-5 rounded-2xl text-xs transition-colors text-white"
                  style={{ background: '#2c2c2e', border: '1px solid #38383a' }}>
                  Cancel
                </button>
                <button type="submit" disabled={submitLoading}
                  className="font-bold py-2.5 px-7 rounded-2xl text-xs transition-colors text-white disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg,#5e5ce6,#7c7af8)', boxShadow: '0 4px 16px rgba(94,92,230,.35)' }}>
                  {submitLoading ? 'Saving…' : editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          PHOTO PICKER MODAL  (Mini Web Image Browser)
      ══════════════════════════════════════════════════ */}
      {isPickerOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="relative w-full max-w-4xl rounded-3xl shadow-2xl p-5 flex flex-col max-h-[92vh] space-y-4"
            style={{ background: '#1c1c1e', border: '1px solid #38383a', boxShadow: '0 30px 80px rgba(0,0,0,.7)' }}>

            {/* Picker Header */}
            <div className="flex justify-between items-center pb-3" style={{ borderBottom: '1px solid #38383a' }}>
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 animate-pulse" style={{ color: '#5e5ce6' }} />
                  <span>Real-Time Web Image Search</span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(94,92,230,.15)', color: '#5e5ce6', border: '1px solid rgba(94,92,230,.3)' }}>
                    LIVE
                  </span>
                </h3>
                <p className="text-xs mt-0.5" style={{ color: '#8e8e93' }}>
                  Search the internet for product photos · upload from device · or paste a direct URL
                </p>
              </div>
              <button onClick={() => setIsPickerOpen(false)}
                className="p-1.5 rounded-xl transition-colors"
                style={{ color: '#8e8e93' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'white')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#8e8e93')}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Bar */}
            <div className="flex rounded-2xl p-1 gap-1" style={{ background: '#111113', border: '1px solid #38383a' }}>
              {([
                { id: 'search', icon: Search, label: 'Web Image Search' },
                { id: 'upload', icon: HardDrive, label: 'Upload from Device' },
                { id: 'url',    icon: Link2,    label: 'Direct URL' },
              ] as { id: 'search' | 'upload' | 'url'; icon: React.ElementType; label: string }[]).map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setPickerTab(id)}
                  className="flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all"
                  style={
                    pickerTab === id
                      ? { background: 'linear-gradient(135deg,#5e5ce6,#7c7af8)', color: 'white', boxShadow: '0 4px 12px rgba(94,92,230,.35)' }
                      : { color: '#8e8e93' }
                  }
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* ── TAB 1: LIVE WEB SEARCH ── */}
            {pickerTab === 'search' && (
              <div className="flex-1 flex flex-col min-h-0 space-y-3">

                {/* Search Input */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#636366' }} />
                    <input
                      type="text"
                      placeholder="Search for any product (e.g. iPhone 15 Pro, RTX 4090)…"
                      value={pickerSearch}
                      onChange={(e) => setPickerSearch(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setSearchPage(1);
                          setHasMoreResults(true);
                          performLiveImageSearch(pickerSearch, 1);
                        }
                      }}
                      className="w-full border text-white rounded-2xl pl-10 pr-4 py-2.5 text-xs outline-none"
                      style={{ background: '#111113', borderColor: '#38383a' }}
                      onFocus={(e) => (e.target.style.borderColor = '#5e5ce6')}
                      onBlur={(e) => (e.target.style.borderColor = '#38383a')}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => { setSearchPage(1); setHasMoreResults(true); performLiveImageSearch(pickerSearch, 1); }}
                    disabled={isSearchingLive}
                    className="text-white text-xs font-bold px-4 py-2.5 rounded-2xl flex items-center gap-1.5 transition-all shrink-0 disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg,#5e5ce6,#7c7af8)', boxShadow: '0 4px 12px rgba(94,92,230,.35)' }}
                  >
                    {isSearchingLive ? <Loader className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    <span>Search</span>
                  </button>
                </div>

                {/* Transparent Filter Toggle */}
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-[#8e8e93] hover:text-white transition-colors">
                    <input
                      type="checkbox"
                      checked={transparentOnly}
                      onChange={(e) => {
                        setTransparentOnly(e.target.checked);
                        if (pickerSearch.trim()) {
                          setSearchPage(1);
                          setHasMoreResults(true);
                          performLiveImageSearch(pickerSearch, 1, e.target.checked);
                        }
                      }}
                      className="w-4 h-4 rounded accent-[#5e5ce6]"
                    />
                    <span>Transparent PNG Only (Remove backgrounds like Adobe Premiere)</span>
                  </label>
                </div>

                {/* Quick Tags */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  <Filter className="w-3 h-3 shrink-0" style={{ color: '#5e5ce6' }} />
                  <span className="text-[9px] font-black uppercase tracking-widest shrink-0 mr-1" style={{ color: '#636366' }}>Quick Tags:</span>
                  {POPULAR_QUICK_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        setPickerSearch(tag);
                        setSearchPage(1);
                        setHasMoreResults(true);
                        performLiveImageSearch(tag, 1);
                      }}
                      className="text-[10px] px-2.5 py-1 rounded-full shrink-0 transition-all border font-medium"
                      style={{ background: '#111113', borderColor: '#38383a', color: '#aeaeb2' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#5e5ce6'; (e.currentTarget as HTMLButtonElement).style.color = 'white'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#38383a'; (e.currentTarget as HTMLButtonElement).style.color = '#aeaeb2'; }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                {/* Select All / Deselect All controls */}
                {liveResults.length > 0 && (
                  <div className="flex items-center gap-3 text-xs" style={{ color: '#8e8e93' }}>
                    <button
                      type="button"
                      onClick={() => setSelectedPickerUrls((prev) => {
                        const incoming = liveResults.map((r) => r.url).filter((u) => !prev.includes(u));
                        return [...prev, ...incoming];
                      })}
                      className="flex items-center gap-1 font-semibold transition-colors"
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#5e5ce6')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#8e8e93')}
                    >
                      <CheckSquare className="w-3.5 h-3.5" /> Select All
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPickerUrls((prev) => {
                        const liveUrls = new Set(liveResults.map((r) => r.url));
                        return prev.filter((u) => !liveUrls.has(u));
                      })}
                      className="flex items-center gap-1 font-semibold transition-colors"
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#ff453a')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#8e8e93')}
                    >
                      <Square className="w-3.5 h-3.5" /> Deselect All
                    </button>
                    <span className="ml-auto font-mono">{liveResults.length} results</span>
                  </div>
                )}

                {/* Image Grid */}
                <div className="flex-1 overflow-y-auto pr-1 space-y-3 min-h-[260px]">
                  {isSearchingLive ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-3">
                      <Loader className="w-8 h-8 animate-spin" style={{ color: '#5e5ce6' }} />
                      <p className="text-xs font-semibold" style={{ color: '#636366' }}>
                        Searching the web for "{pickerSearch}"…
                      </p>
                    </div>
                  ) : liveResults.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-2">
                      <Globe className="w-10 h-10" style={{ color: '#38383a' }} />
                      <p className="text-xs" style={{ color: '#636366' }}>
                        Type a keyword above to fetch real-time product photos from the internet.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {liveResults.map((item) => {
                          const isSelected = selectedPickerUrls.includes(item.url);
                          return (
                            <div
                              key={item.id || item.url}
                              onClick={() => {
                                if (isSelected) {
                                  setSelectedPickerUrls(selectedPickerUrls.filter((u) => u !== item.url));
                                } else {
                                  setSelectedPickerUrls([...selectedPickerUrls, item.url]);
                                }
                              }}
                              className="relative aspect-square rounded-2xl p-2 cursor-pointer transition-all flex flex-col justify-between overflow-hidden group"
                              style={{
                                background: isSelected ? 'rgba(94,92,230,.12)' : '#111113',
                                border: isSelected ? '2px solid #5e5ce6' : '1px solid #38383a',
                                boxShadow: isSelected ? '0 0 0 3px rgba(94,92,230,.2)' : 'none',
                              }}
                            >
                              <img
                                src={item.url}
                                alt={item.name}
                                className="max-h-[78%] max-w-full object-contain mx-auto transition-transform duration-300 group-hover:scale-105"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                              />
                              <div className="flex justify-between items-center text-[9px] pt-1 mt-auto"
                                style={{ borderTop: '1px solid #2c2c2e', color: '#636366' }}>
                                <span className="truncate max-w-[65%]">{item.name}</span>
                                <div className="flex items-center gap-1 shrink-0">
                                  {item.source && (
                                    <span className="px-1.5 py-0.5 rounded-full"
                                      style={{ background: '#2c2c2e', color: '#aeaeb2', fontSize: '8px' }}>
                                      {item.source}
                                    </span>
                                  )}
                                  {isSelected && (
                                    <span className="p-0.5 rounded-full text-white"
                                      style={{ background: '#5e5ce6' }}>
                                      <Check className="w-2.5 h-2.5" />
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Load More */}
                      {hasMoreResults && (
                        <button
                          type="button"
                          disabled={isLoadingMore}
                          onClick={() => {
                            const nextPage = searchPage + 1;
                            setSearchPage(nextPage);
                            performLiveImageSearch(pickerSearch, nextPage);
                          }}
                          className="w-full py-3 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold transition-all disabled:opacity-60"
                          style={{ background: '#111113', border: '1px solid #38383a', color: '#8e8e93' }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#5e5ce6'; (e.currentTarget as HTMLButtonElement).style.color = '#5e5ce6'; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#38383a'; (e.currentTarget as HTMLButtonElement).style.color = '#8e8e93'; }}
                        >
                          {isLoadingMore
                            ? <><Loader className="w-4 h-4 animate-spin" /><span>Loading more…</span></>
                            : <><ArrowDown className="w-4 h-4" /><span>Load More Images</span></>
                          }
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* ── TAB 2: DEVICE UPLOAD ── */}
            {pickerTab === 'upload' && (
              <div className="flex-1 flex flex-col min-h-0 space-y-3">
                {/* Drop Zone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center rounded-3xl p-10 text-center space-y-3 cursor-pointer transition-all"
                  style={{
                    background: isDragOver ? 'rgba(94,92,230,.08)' : '#111113',
                    border: `2px dashed ${isDragOver ? '#5e5ce6' : '#38383a'}`,
                  }}
                >
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ background: 'rgba(94,92,230,.12)', border: '1px solid rgba(94,92,230,.25)' }}>
                    <Upload className="w-8 h-8" style={{ color: '#5e5ce6' }} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">Drop images here</h4>
                    <p className="text-xs mt-1" style={{ color: '#8e8e93' }}>or click to browse · PNG, JPG, WEBP, GIF</p>
                  </div>
                  <span className="text-xs font-bold py-2.5 px-7 rounded-2xl text-white"
                    style={{ background: 'linear-gradient(135deg,#5e5ce6,#7c7af8)', boxShadow: '0 4px 16px rgba(94,92,230,.35)' }}>
                    Browse Device Files
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleDeviceFileUpload}
                    className="hidden"
                  />
                </div>

                {/* Uploaded Previews */}
                {uploadedPreviews.length > 0 && (
                  <div className="flex-1 overflow-y-auto">
                    <p className="text-xs font-bold mb-2" style={{ color: '#8e8e93' }}>
                      {uploadedPreviews.length} file(s) loaded:
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                      {uploadedPreviews.map(({ url, name: fname }, i) => {
                        const isSelected = selectedPickerUrls.includes(url);
                        return (
                          <div
                            key={i}
                            onClick={() => {
                              if (isSelected) setSelectedPickerUrls(selectedPickerUrls.filter((u) => u !== url));
                              else setSelectedPickerUrls([...selectedPickerUrls, url]);
                            }}
                            className="relative aspect-square rounded-xl p-1.5 cursor-pointer transition-all overflow-hidden"
                            style={{
                              background: '#111113',
                              border: isSelected ? '2px solid #5e5ce6' : '1px solid #38383a',
                              boxShadow: isSelected ? '0 0 0 3px rgba(94,92,230,.2)' : 'none',
                            }}
                          >
                            <img src={url} alt={fname} className="max-h-full max-w-full object-contain mx-auto" />
                            {isSelected && (
                              <div className="absolute top-1 right-1 rounded-full p-0.5 text-white"
                                style={{ background: '#5e5ce6' }}>
                                <Check className="w-2.5 h-2.5" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── TAB 3: DIRECT URL ── */}
            {pickerTab === 'url' && (
              <div className="space-y-4 py-2 flex-1">
                <div>
                  <label className={labelCls}>Paste Direct Image Link</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="https://example.com/product-image.jpg"
                      value={customUrlInput}
                      onChange={(e) => setCustomUrlInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && customUrlInput.trim() && !selectedPickerUrls.includes(customUrlInput.trim())) {
                          setSelectedPickerUrls([...selectedPickerUrls, customUrlInput.trim()]);
                          setCustomUrlInput('');
                        }
                      }}
                      className="flex-1 border text-white rounded-2xl px-4 py-3 text-xs outline-none"
                      style={{ background: '#111113', borderColor: '#38383a' }}
                      onFocus={(e) => (e.target.style.borderColor = '#5e5ce6')}
                      onBlur={(e) => (e.target.style.borderColor = '#38383a')}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customUrlInput.trim() && !selectedPickerUrls.includes(customUrlInput.trim())) {
                          setSelectedPickerUrls([...selectedPickerUrls, customUrlInput.trim()]);
                          setCustomUrlInput('');
                        }
                      }}
                      className="text-white text-xs font-bold px-5 py-3 rounded-2xl transition-all shrink-0"
                      style={{ background: 'linear-gradient(135deg,#5e5ce6,#7c7af8)' }}
                    >
                      Add URL
                    </button>
                  </div>
                </div>

                {customUrlInput.trim() && (
                  <div className="flex items-start gap-4">
                    <div className="w-32 h-32 rounded-2xl p-2 flex items-center justify-center overflow-hidden"
                      style={{ background: '#111113', border: '1px solid #38383a' }}>
                      <img src={customUrlInput.trim()} alt="URL Preview" className="max-h-full max-w-full object-contain" />
                    </div>
                    <p className="text-xs mt-2" style={{ color: '#636366' }}>
                      Preview of the image URL. Click "Add URL" to add it to the selection.
                    </p>
                  </div>
                )}

                {/* Currently added URLs from URL tab */}
                {selectedPickerUrls.filter((u) => u.startsWith('http')).length > 0 && (
                  <div>
                    <p className="text-xs font-bold mb-2" style={{ color: '#8e8e93' }}>
                      Added URLs ({selectedPickerUrls.filter((u) => u.startsWith('http')).length}):
                    </p>
                    <div className="space-y-1">
                      {selectedPickerUrls.filter((u) => u.startsWith('http')).map((url, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs rounded-xl px-3 py-2"
                          style={{ background: '#111113', border: '1px solid #38383a' }}>
                          <span className="flex-1 truncate" style={{ color: '#aeaeb2' }}>{url}</span>
                          <button type="button" onClick={() => setSelectedPickerUrls(selectedPickerUrls.filter((u2) => u2 !== url))}
                            style={{ color: '#636366' }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#ff453a')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = '#636366')}>
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Picker Footer ── */}
            <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid #38383a' }}>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white"
                  style={{ background: '#5e5ce6' }}>
                  {selectedPickerUrls.length}
                </span>
                <span className="text-xs" style={{ color: '#8e8e93' }}>photo(s) selected</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsPickerOpen(false)}
                  className="font-semibold px-4 py-2 rounded-2xl text-xs border text-white transition-colors"
                  style={{ background: '#2c2c2e', borderColor: '#38383a' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setImageList(selectedPickerUrls);
                    setIsPickerOpen(false);
                  }}
                  className="font-bold px-6 py-2 rounded-2xl text-xs text-white transition-all"
                  style={{ background: 'linear-gradient(135deg,#5e5ce6,#7c7af8)', boxShadow: '0 4px 16px rgba(94,92,230,.35)' }}
                >
                  ✓ Apply {selectedPickerUrls.length} Photo{selectedPickerUrls.length !== 1 ? 's' : ''}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          INSTAGRAM POST & LINK GENERATOR MODAL
      ══════════════════════════════════════════════════ */}
      {isInstagramModalOpen && instagramProduct && (
        <InstagramPostModal
          product={instagramProduct}
          isOpen={isInstagramModalOpen}
          onClose={() => {
            setIsInstagramModalOpen(false);
            setInstagramProduct(null);
          }}
          isNew={isNewInstagramProduct}
        />
      )}

    </div>
  );
}
