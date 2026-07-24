import React from 'react';
import Link from 'next/link';
import { Button } from 'src/components/ui/Button';
import {
  ShieldCheck, Award, Users, Cpu, Clock, CheckCircle2,
  ArrowRight, MessageSquare, MapPin, PhoneCall, Sparkles
} from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Cedar Tech - Built on 18 Years of Trust',
  description: 'Learn how Cedar Tech evolved from a small local Bekaa workshop in 2008 into Lebanon\'s most trusted premier electronics and custom PC hub.',
};

export default function AboutPage() {
  const milestones = [
    {
      year: '2008',
      title: 'The Humble Beginning',
      desc: 'Founded as a small local hardware repair and component shop in Kabelias, Bekaa. Driven by a passion for technology and honest service.',
    },
    {
      year: '2011',
      title: 'Official Distribution & Expansion',
      desc: 'Partnered with official distributors to bring factory-sealed laptops, smartphones, and genuine accessories with local warranty to Bekaa.',
    },
    {
      year: '2018',
      title: 'Custom PC Workstation Lab',
      desc: 'Launched custom gaming rig assembly and professional workstation builds, becoming the go-to hub for Lebanese gamers and creators.',
    },
    {
      year: 'Present',
      title: 'Lebanon’s Most Trusted Tech Hub',
      desc: 'Serving thousands of customers across Lebanon with nationwide 24h Express delivery, 1-year local warranties, and USD Cash on Delivery.',
    },
  ];

  const values = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-green-500" />,
      title: 'Uncompromising Authenticity',
      desc: 'Every device we sell is 100% genuine, factory-sealed, and backed by an official 1-year local warranty in Lebanon.',
    },
    {
      icon: <Award className="w-6 h-6 text-accent-bright" />,
      title: '20+ Years of Proven Trust',
      desc: 'Two decades of consistent customer satisfaction, transparent pricing, and technical excellence.',
    },
    {
      icon: <Cpu className="w-6 h-6 text-purple-500" />,
      title: 'Custom Engineering',
      desc: 'Our specialists hand-build and stress-test custom gaming PCs and workstations tailored to your exact performance targets.',
    },
    {
      icon: <Users className="w-6 h-6 text-amber-500" />,
      title: 'Customer-First Service',
      desc: 'Direct real-time support over WhatsApp and in-person concierge assistance at our Kabelias hub.',
    },
  ];

  return (
    <div className="bg-brand-deep text-brand-text-primary min-h-screen">
      
      {/* 1. HERO BANNER */}
      <section className="relative w-full pt-20 pb-20 border-b border-border-default overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-border-default text-xs font-semibold text-brand-text-secondary">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Established in 2008 · Kabelias, Bekaa, Lebanon</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-brand-text-primary max-w-4xl leading-tight">
            Built on Experience.<br />
            <span className="text-accent-blue">Defined by 18 Years of Trust.</span>
          </h1>

          <p className="text-base sm:text-xl text-brand-text-secondary max-w-2xl leading-relaxed">
            From a small local Bekaa workshop in 2005 to Lebanon’s premier technology destination — our commitment to quality, genuine products, and customer satisfaction has never wavered.
          </p>

        </div>
      </section>

      {/* 2. STATS BAR */}
      <section className="w-full py-12 border-b border-border-default bg-brand-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: '2008', label: 'Founded in Bekaa' },
              { num: '18+', label: 'Years of Experience' },
              { num: '10,000+', label: 'Delivered Orders' },
              { num: '100%', label: 'Official Local Warranty' },
            ].map((stat, i) => (
              <div key={i} className="space-y-1">
                <p className="text-3xl sm:text-4xl font-black text-brand-text-primary tracking-tight">{stat.num}</p>
                <p className="text-xs font-semibold text-brand-text-tertiary uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. OUR JOURNEY / TIMELINE */}
      <section className="w-full py-24 border-b border-border-default bg-brand-deep">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-accent-bright">Our Evolution</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-text-primary">
              Day Over Day, Building Lebanon’s Most Trusted Store
            </h2>
            <p className="text-sm sm:text-base text-brand-text-secondary leading-relaxed">
              We started small, prioritizing customer relationships above everything else. Over two decades, that relentless dedication transformed Cedar Tech into a household name.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map((item, i) => (
              <div
                key={i}
                className="p-8 rounded-3xl bg-brand-surface border border-border-default flex flex-col justify-between space-y-6 relative group hover:border-border-strong hover:bg-brand-elevated transition-all"
              >
                <div className="space-y-4">
                  <span className="text-2xl font-black text-accent-bright font-mono">{item.year}</span>
                  <h3 className="text-lg font-bold text-brand-text-primary">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-brand-text-secondary leading-relaxed">{item.desc}</p>
                </div>
                <div className="pt-4 border-t border-border-default flex items-center gap-2 text-xs font-semibold text-green-500">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Milestone Completed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CORE VALUES */}
      <section className="w-full py-24 border-b border-border-default bg-brand-deep">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-green-500">Why Choose Us</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-text-primary">
              Our Unshakable Pillars of Quality
            </h2>
            <p className="text-sm sm:text-base text-brand-text-secondary">
              Everything we do is designed to give you total peace of mind when investing in your technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((v, i) => (
              <div key={i} className="p-8 rounded-3xl bg-brand-surface border border-border-default flex items-start gap-6 hover:bg-brand-elevated transition-colors">
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

      {/* 5. LOCATION & CONTACT CTA */}
      <section className="w-full py-24 bg-brand-surface">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-text-primary tracking-tight">
            Visit Our Showroom or Chat With Us
          </h2>
          <p className="text-base text-brand-text-secondary max-w-xl mx-auto leading-relaxed">
            Located on the Main Highway in Kabelias, Bekaa. Our technical specialists are ready to guide your next upgrade.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/products">
              <Button size="lg">
                Explore Catalog <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <a
              href="https://wa.me/96179115521?text=Hello%20Cedar%20Tech%2C%20I%20would%20like%20to%20know%20more%20about%20your%20store."
              target="_blank" rel="noopener noreferrer"
            >
              <Button variant="ghost" size="lg">
                <MessageSquare className="w-4 h-4 text-green-500 mr-1" />
                Contact on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
