import React from 'react';
import Link from 'next/link';
import { Button } from 'src/components/ui/Button';
import {
  ShieldCheck, Award, Users, Cpu, Clock, CheckCircle2,
  ArrowRight, MessageSquare, Globe, PhoneCall, Sparkles,
  Package, Truck, Eye, Check, HelpCircle
} from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Agha Tech plus - Global Standards, Direct Lebanon Delivery',
  description: 'Discover the story behind Agha Tech plus: a digital-first tech platform operating with international standards, sourcing genuine electronics and delivering in custom branded packaging across all Lebanon.',
};

export default function AboutPage() {
  const steps = [
    {
      num: '01',
      title: 'Online Order & Confirmation',
      desc: 'You select your desired flagship phone, laptop, or tech gear on our online store. Our team promptly verifies stock and confirms order specifications directly with you on WhatsApp.',
      icon: <Globe className="w-5 h-5 text-accent-blue" />,
    },
    {
      num: '02',
      title: 'Direct Sourcing from Official Distributors',
      desc: 'Instead of stocking aging inventory on dusty shelves, every ordered item is freshly sourced directly from authorized brand distributors with genuine manufacturer seals intact.',
      icon: <Award className="w-5 h-5 text-emerald-400" />,
    },
    {
      num: '03',
      title: 'Custom Agha Tech plus Packaging',
      desc: 'Each unit undergoes a strict packaging and serial-number inspection, then is securely enclosed inside our signature Agha Tech plus protective, tamper-proof packaging.',
      icon: <Package className="w-5 h-5 text-purple-400" />,
    },
    {
      num: '04',
      title: 'Inspect First, Cash on Delivery',
      desc: 'Our nationwide courier brings the package straight to your doorstep anywhere in Lebanon. You inspect the sealed package first, then pay USD cash with 100% peace of mind.',
      icon: <Truck className="w-5 h-5 text-amber-400" />,
    },
  ];

  const pillars = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
      title: '100% Factory Sealed & Genuine',
      desc: 'No refurbished items, no grey-market clones, and no opened packages. Every product features verified original serial numbers with 1-Year Local Warranty support.',
    },
    {
      icon: <Globe className="w-6 h-6 text-accent-bright" />,
      title: 'Global Operating Standards',
      desc: 'Managing our platform with North American attention to detail, precision logistics, and transparent communication, while serving clients on the ground in Lebanon.',
    },
    {
      icon: <Package className="w-6 h-6 text-purple-400" />,
      title: 'Official Agha Tech plus Packaging',
      desc: 'Every client receives their order packaged with pride under our own brand packaging, reinforced for safety and verified before handoff to couriers.',
    },
    {
      icon: <Users className="w-6 h-6 text-amber-400" />,
      title: 'Direct WhatsApp Concierge',
      desc: 'No automated bots or endless hold times. You communicate directly with our tech team on WhatsApp (+961 76 743 718) for quotes, inquiries, and real-time tracking.',
    },
  ];

  return (
    <div className="bg-brand-deep text-brand-text-primary min-h-screen">
      
      {/* 1. HERO BANNER */}
      <section className="relative w-full pt-20 pb-20 border-b border-border-default overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-border-default text-xs font-semibold text-brand-text-secondary">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Digital-First E-Commerce · Operating Globally, Delivering All Across Lebanon</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-brand-text-primary max-w-4xl leading-tight">
            World-Class Tech.<br />
            <span className="text-accent-blue">Curated Globally. Delivered Locally.</span>
          </h1>

          <p className="text-base sm:text-xl text-brand-text-secondary max-w-3xl leading-relaxed">
            Founded with a vision connecting international e-commerce standards with Lebanon&apos;s tech enthusiasts, <span className="text-white font-semibold">Agha Tech plus</span> was built to bring total transparency, authentic factory-sealed devices, and zero-risk Cash on Delivery to your door.
          </p>

        </div>
      </section>

      {/* 2. STATS BAR */}
      <section className="w-full py-12 border-b border-border-default bg-brand-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: '100% Online', label: 'Digital-First Store' },
              { num: 'All Lebanon', label: 'Doorstep Courier Delivery' },
              { num: 'Zero Risk', label: 'Inspect Before COD Payment' },
              { num: '1 Year', label: 'Official Local Warranty' },
            ].map((stat, i) => (
              <div key={i} className="space-y-1">
                <p className="text-2xl sm:text-3xl font-black text-brand-text-primary tracking-tight">{stat.num}</p>
                <p className="text-xs font-semibold text-brand-text-tertiary uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. OUR STORY & THE AGHA TECH PLUS MODEL */}
      <section className="w-full py-24 border-b border-border-default bg-brand-deep">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-blue-500/10 text-accent-bright border border-blue-500/20">
                <span>The Story of Agha Tech plus</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-snug">
                Why We Built A Modern, Boundaryless Online Store
              </h2>
              
              <p className="text-sm sm:text-base text-brand-text-secondary leading-relaxed">
                For years, buying high-end technology in Lebanon meant dealing with inflated brick-and-mortar showroom markups, unclear warranty terms, and the lingering fear of receiving opened or grey-market boxes.
              </p>

              <p className="text-sm sm:text-base text-brand-text-secondary leading-relaxed">
                Whether our management operates from North America (like Canada) or coordinates on the ground, <strong className="text-white font-semibold">Agha Tech plus</strong> functions as a streamlined, modern e-commerce enterprise. We cut out unnecessary physical overhead, negotiate directly with top authorized distributors, and pass that value directly to you.
              </p>

              <div className="p-4 rounded-2xl bg-white/5 border border-border-default text-xs sm:text-sm text-slate-350 space-y-2">
                <p className="font-semibold text-white flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>The Agha Tech plus Promise:</span>
                </p>
                <p>
                  Every order is sourced fresh from verified distributors, hand-inspected for factory seals, safely sealed under our custom <strong className="text-white">Agha Tech plus</strong> packaging, and delivered Cash on Delivery across Lebanon. You inspect the parcel with the delivery courier before paying.
                </p>
              </div>
            </div>

            <div className="bg-brand-surface border border-border-default rounded-3xl p-8 shadow-2xl space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-accent-bright" />
                <span>How Our Fulfillment Process Works</span>
              </h3>

              <div className="space-y-6">
                {steps.map((step) => (
                  <div key={step.num} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-brand-deep border border-border-default flex items-center justify-center shrink-0">
                      {step.icon}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-accent-bright font-bold">{step.num}</span>
                        <h4 className="text-sm font-bold text-white">{step.title}</h4>
                      </div>
                      <p className="text-xs text-brand-text-secondary leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PILLARS OF TRUST */}
      <section className="w-full py-24 border-b border-border-default bg-brand-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">Pillars of Integrity</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-text-primary">
              Engineered for Complete Peace of Mind
            </h2>
            <p className="text-sm sm:text-base text-brand-text-secondary">
              Everything we do is designed to give you total confidence when purchasing your technology online.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pillars.map((v, i) => (
              <div key={i} className="p-8 rounded-3xl bg-brand-deep border border-border-default flex items-start gap-6 hover:bg-brand-elevated transition-colors">
                <div className="p-3 rounded-2xl bg-white/5 border border-border-default shrink-0">
                  {v.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-brand-text-primary">{v.title}</h3>
                  <p className="text-sm text-brand-text-secondary leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. ONLINE CONTACT & WHATSAPP CONCIERGE */}
      <section className="w-full py-24 bg-brand-deep">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="w-16 h-16 rounded-3xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto text-green-500">
            <MessageSquare className="w-8 h-8" />
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-text-primary tracking-tight">
              Have Questions or Need a Custom Quote?
            </h2>
            <p className="text-base text-brand-text-secondary max-w-xl mx-auto leading-relaxed">
              Our direct WhatsApp concierge is open 6 days a week. Speak directly with our team for stock checks, custom PC builds, or delivery inquiries.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link href="/products">
              <Button size="lg">
                Explore All Products <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <a
              href="https://wa.me/96176743718?text=Hello%20Agha%20Tech%20plus%2C%20I%20have%20an%20inquiry%20about%20your%20store."
              target="_blank" rel="noopener noreferrer"
            >
              <Button variant="ghost" size="lg" className="border-green-500/30 hover:border-green-500 text-green-400">
                <MessageSquare className="w-4 h-4 text-green-500 mr-2" />
                Chat on WhatsApp (+961 76 743 718)
              </Button>
            </a>
          </div>

          <p className="text-xs text-brand-text-tertiary">
            Agha Tech plus · Online Operations · Rapid Doorstep Delivery Nationwide (Lebanon) · Cash on Delivery USD
          </p>
        </div>
      </section>

    </div>
  );
}
