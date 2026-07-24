'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus, Edit, Trash2, Loader, Layers, Search, Sparkles, X,
  Smartphone, Laptop, Cpu, Gamepad2, Headphones, Keyboard,
  Monitor, HardDrive, Wifi, Watch, Camera, Speaker, Tablet,
  CheckCircle2, ArrowRight
} from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

/* ═══════════════════════════════════════════════════════════
   PRESET ICON & SMART DESCRIPTION CATALOG
═══════════════════════════════════════════════════════════ */
const CATEGORY_PRESETS = [
  {
    name: 'Smartphones',
    slug: 'phones',
    iconName: 'Smartphone',
    icon: <Smartphone className="w-5 h-5" />,
    tag: 'Flagship Mobile',
    description: 'iPhone 16 Pro, Samsung Galaxy S25, and flagship mobile devices with official warranty.',
  },
  {
    name: 'Laptops',
    slug: 'laptops',
    iconName: 'Laptop',
    icon: <Laptop className="w-5 h-5" />,
    tag: 'Pro Workstations',
    description: 'Apple M4 MacBook Pro, ASUS ROG gaming laptops, and ultra-portable workstations.',
  },
  {
    name: 'Desktops & Rigs',
    slug: 'desktops',
    iconName: 'Cpu',
    icon: <Cpu className="w-5 h-5" />,
    tag: 'Custom Desktop Rigs',
    description: 'Custom-engineered gaming towers, liquid-cooled PCs, and high-performance workstations.',
  },
  {
    name: 'Gaming Gear',
    slug: 'gaming',
    iconName: 'Gamepad2',
    icon: <Gamepad2 className="w-5 h-5" />,
    tag: 'High-FPS Gaming',
    description: 'NVIDIA RTX 4090 GPUs, mechanical keyboards, gaming mice, and VR headsets.',
  },
  {
    name: 'Audio & ANC',
    slug: 'accessories',
    iconName: 'Headphones',
    icon: <Headphones className="w-5 h-5" />,
    tag: 'ANC Sound & Audio',
    description: 'AirPods Max, Sony WH-1000XM5, studio monitors, and noise-canceling audio gear.',
  },
  {
    name: 'Components & Parts',
    slug: 'parts',
    iconName: 'Keyboard',
    icon: <Keyboard className="w-5 h-5" />,
    tag: 'Hardware Upgrades',
    description: 'DDR5 RAM, PCIe Gen4 NVMe SSDs, modular PSUs, and motherboard upgrades.',
  },
  {
    name: 'Monitors & Displays',
    slug: 'monitors',
    iconName: 'Monitor',
    icon: <Monitor className="w-5 h-5" />,
    tag: '4K & High Refresh',
    description: 'Curved OLED gaming monitors, 240Hz esports displays, and color-accurate 4K panels.',
  },
  {
    name: 'Storage & NAS',
    slug: 'storage',
    iconName: 'HardDrive',
    icon: <HardDrive className="w-5 h-5" />,
    tag: 'High-Speed Storage',
    description: 'External RAID arrays, high-speed NVMe drives, and NAS cloud servers.',
  },
  {
    name: 'Smart Wearables',
    slug: 'wearables',
    iconName: 'Watch',
    icon: <Watch className="w-5 h-5" />,
    tag: 'Wearable Tech',
    description: 'Apple Watch Ultra, Samsung Galaxy Watch, and health-tracking wearables.',
  },
];

const AVAILABLE_ICONS = [
  { name: 'Smartphone', component: Smartphone },
  { name: 'Laptop', component: Laptop },
  { name: 'Cpu', component: Cpu },
  { name: 'Gamepad2', component: Gamepad2 },
  { name: 'Headphones', component: Headphones },
  { name: 'Keyboard', component: Keyboard },
  { name: 'Monitor', component: Monitor },
  { name: 'HardDrive', component: HardDrive },
  { name: 'Wifi', component: Wifi },
  { name: 'Watch', component: Watch },
  { name: 'Camera', component: Camera },
  { name: 'Speaker', component: Speaker },
  { name: 'Tablet', component: Tablet },
  { name: 'Layers', component: Layers },
];

function getCategoryIcon(name: string, imageUrl?: string) {
  const matchingPreset = CATEGORY_PRESETS.find(
    (p) => p.slug === name.toLowerCase() || p.name.toLowerCase() === name.toLowerCase() || p.iconName === imageUrl
  );
  if (matchingPreset) return matchingPreset.icon;

  const foundIcon = AVAILABLE_ICONS.find((i) => i.name === imageUrl);
  if (foundIcon) {
    const IconComponent = foundIcon.component;
    return <IconComponent className="w-5 h-5" />;
  }

  return <Layers className="w-5 h-5" />;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal and Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Form Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIconName, setSelectedIconName] = useState('Layers');
  const [iconSearchTerm, setIconSearchTerm] = useState('');

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (e) {
      console.error('Failed to load categories', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setSelectedIconName('Layers');
    setIconSearchTerm('');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setSelectedIconName(cat.imageUrl || 'Layers');
    setIconSearchTerm('');
    setFormError('');
    setIsModalOpen(true);
  };

  // Smart Pre-fill when admin types category name or clicks a preset
  const handleNameChange = (val: string) => {
    setName(val);
    const matchedPreset = CATEGORY_PRESETS.find(
      (p) => p.name.toLowerCase().includes(val.toLowerCase().trim()) || p.slug.toLowerCase().includes(val.toLowerCase().trim())
    );
    if (matchedPreset) {
      setSelectedIconName(matchedPreset.iconName);
      if (!description || description.trim() === '') {
        setDescription(matchedPreset.description);
      }
    }
  };

  const handleApplyPreset = (preset: typeof CATEGORY_PRESETS[0]) => {
    setName(preset.name);
    setDescription(preset.description);
    setSelectedIconName(preset.iconName);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? All products using it will be affected.')) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setCategories(categories.filter((c) => c._id !== id));
      }
    } catch (e) {
      console.error('Failed to delete category', e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name) {
      setFormError('Category name is required.');
      return;
    }

    setSubmitLoading(true);

    const payload = { name, description, imageUrl: selectedIconName };

    try {
      const url = editingCategory ? `/api/admin/categories/${editingCategory._id}` : '/api/admin/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsModalOpen(false);
        loadCategories();
      } else {
        setFormError(data.error || 'Failed to submit category');
      }
    } catch {
      setFormError('A connection error occurred. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredIcons = AVAILABLE_ICONS.filter((i) =>
    i.name.toLowerCase().includes(iconSearchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 font-sans">
      
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-brand-surface border border-border-default rounded-3xl p-6 sm:p-7 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-accent-bright">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Taxonomy Management</span>
          </div>
          <h1 className="text-2xl font-black text-brand-text-primary tracking-tight">Product Categories</h1>
          <p className="text-xs text-brand-text-secondary">
            {categories.length} categories active in Cedar Tech catalog
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-accent-blue hover:bg-blue-600 text-white font-bold py-2.5 px-5 rounded-2xl text-xs transition-all shadow-lg active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {/* ── Search Bar ──────────────────────────────────────────── */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-tertiary" />
        <input
          type="text"
          placeholder="Search categories by name or description…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-brand-surface border border-border-default focus:border-accent-bright text-brand-text-primary rounded-2xl py-2.5 pl-10 pr-4 outline-none text-sm transition-all placeholder:text-brand-text-tertiary"
        />
      </div>

      {/* ── Categories Table ────────────────────────────────────── */}
      {isLoading ? (
        <div className="flex justify-center items-center py-24">
          <Loader className="w-8 h-8 text-accent-bright animate-spin" />
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="text-center py-20 bg-brand-surface border border-dashed border-border-default rounded-3xl">
          <Layers className="w-10 h-10 mx-auto mb-3 text-brand-text-tertiary" />
          <p className="text-brand-text-secondary text-sm font-semibold">No categories found matching your query.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden md:block bg-brand-surface border border-border-default rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-brand-deep border-b border-border-default text-brand-text-tertiary font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-4 w-14 text-center">Icon</th>
                    <th className="p-4">Category Name</th>
                    <th className="p-4">Slug</th>
                    <th className="p-4">Smart Description</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-default">
                  {filteredCategories.map((cat) => (
                    <tr key={cat._id} className="hover:bg-white/5 transition-all text-brand-text-primary">
                      <td className="p-4 text-center">
                        <div className="w-10 h-10 rounded-2xl bg-accent-blue/10 border border-accent-blue/20 text-accent-bright flex items-center justify-center mx-auto">
                          {getCategoryIcon(cat.name, cat.imageUrl)}
                        </div>
                      </td>
                      <td className="p-4 font-bold text-sm text-brand-text-primary">{cat.name}</td>
                      <td className="p-4 font-mono text-brand-text-tertiary text-xs">{cat.slug}</td>
                      <td className="p-4 text-brand-text-secondary text-xs line-clamp-2 max-w-md">{cat.description || '—'}</td>
                      <td className="p-4 text-right space-x-1 shrink-0">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="text-brand-text-secondary hover:text-white p-2 hover:bg-brand-elevated rounded-xl transition-colors inline-block"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id)}
                          className="text-brand-text-tertiary hover:text-red-400 p-2 hover:bg-brand-elevated rounded-xl transition-colors inline-block"
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
            {filteredCategories.map((cat) => (
              <div
                key={cat._id}
                className="p-4 rounded-3xl border flex flex-col gap-3.5 transition-all"
                style={{ background: '#1c1c1e', borderColor: '#2c2c2e', boxShadow: '0 8px 30px rgba(0,0,0,.2)' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-accent-blue/10 border border-accent-blue/20 text-accent-bright flex items-center justify-center shrink-0">
                    {getCategoryIcon(cat.name, cat.imageUrl)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-extrabold text-white text-sm truncate leading-snug">{cat.name}</p>
                    <p className="text-[11px] font-mono text-brand-text-tertiary mt-0.5">{cat.slug}</p>
                  </div>
                </div>
                {cat.description && (
                  <p className="text-xs text-brand-text-secondary leading-relaxed bg-[#111113]/50 p-3 rounded-2xl border border-white/5">
                    {cat.description}
                  </p>
                )}
                
                {/* Footer: Actions */}
                <div className="flex justify-end gap-1.5 pt-3 border-t border-white/5" style={{ borderColor: '#2c2c2e' }}>
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-2.5 rounded-xl transition-all flex items-center justify-center border text-[#8e8e93] active:bg-[#2c2c2e] hover:text-white"
                    style={{ background: '#111113', borderColor: '#2c2c2e' }}
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="p-2.5 rounded-xl transition-all flex items-center justify-center border text-[#636366] active:bg-red-500/10 hover:text-[#ff453a]"
                    style={{ background: '#111113', borderColor: '#2c2c2e' }}
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          CREATIVE CATEGORY MODAL (With Smart Icon & Desc Picker)
      ══════════════════════════════════════════════════ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-brand-surface border border-border-default rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 my-4">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 border-b border-border-default">
              <div>
                <h2 className="text-lg font-black text-brand-text-primary flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent-bright" />
                  <span>{editingCategory ? 'Edit Category' : 'Create Category'}</span>
                </h2>
                <p className="text-xs text-brand-text-secondary mt-0.5">
                  Select a smart preset or custom icon with automated description
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-brand-text-tertiary hover:text-white p-1.5 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3.5 rounded-xl text-center">
                {formError}
              </div>
            )}

            {/* Smart Presets Quick-Pick */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-brand-text-tertiary uppercase tracking-widest">
                Recommended Category Presets (Auto-Fills Icon &amp; Desc)
              </label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1">
                {CATEGORY_PRESETS.map((preset) => (
                  <button
                    key={preset.slug}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-brand-elevated border border-border-default hover:border-accent-bright hover:text-white text-brand-text-secondary transition-all"
                  >
                    <span className="text-accent-bright">{preset.icon}</span>
                    <span>{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              
              {/* Category Name */}
              <div>
                <label className="block text-[10px] font-bold text-brand-text-tertiary uppercase tracking-widest mb-1.5">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Smartphones, Gaming, Laptops…"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full bg-black/40 border border-border-default focus:border-accent-bright text-brand-text-primary rounded-xl py-3 px-4 outline-none text-sm transition-all placeholder:text-brand-text-tertiary"
                />
              </div>

              {/* Icon Selector Grid with Live Search */}
              <div className="space-y-2.5 p-4 rounded-2xl bg-brand-elevated border border-border-default">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-extrabold text-brand-text-primary uppercase tracking-wider">
                    Select Icon Symbol
                  </label>
                  <span className="text-[10px] font-mono text-accent-bright px-2 py-0.5 rounded-full bg-accent-blue/10 border border-accent-blue/20">
                    Selected: {selectedIconName}
                  </span>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-text-tertiary" />
                  <input
                    type="text"
                    placeholder="Search icons (e.g. phone, laptop, cpu)…"
                    value={iconSearchTerm}
                    onChange={(e) => setIconSearchTerm(e.target.value)}
                    className="w-full bg-black/40 border border-border-default text-brand-text-primary rounded-xl py-2 pl-9 pr-3 text-xs outline-none"
                  />
                </div>

                <div className="grid grid-cols-7 gap-2 pt-1">
                  {filteredIcons.map(({ name: iName, component: IconComp }) => {
                    const isSelected = selectedIconName === iName;
                    return (
                      <button
                        key={iName}
                        type="button"
                        onClick={() => setSelectedIconName(iName)}
                        title={iName}
                        className={`aspect-square rounded-xl flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-accent-blue text-white shadow-md border border-accent-bright scale-105'
                            : 'bg-black/20 text-brand-text-secondary hover:text-white hover:bg-black/40 border border-border-default'
                        }`}
                      >
                        <IconComp className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Smart Description */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[10px] font-bold text-brand-text-tertiary uppercase tracking-widest">
                    Smart Description
                  </label>
                  <span className="text-[10px] text-brand-text-tertiary">Visible on storefront cards</span>
                </div>
                <textarea
                  placeholder="Detailed description of hardware included in this category…"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-black/40 border border-border-default focus:border-accent-bright text-brand-text-primary rounded-xl p-3 outline-none text-xs transition-all placeholder:text-brand-text-tertiary leading-relaxed"
                />
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t border-border-default">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-brand-elevated hover:bg-white/5 text-brand-text-primary font-semibold py-2.5 px-5 rounded-2xl text-xs border border-border-default transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="bg-accent-blue hover:bg-blue-600 text-white font-bold py-2.5 px-6 rounded-2xl text-xs transition-all shadow-lg active:scale-95 flex items-center gap-1.5"
                >
                  {submitLoading ? (
                    <><Loader className="w-4 h-4 animate-spin" /><span>Saving…</span></>
                  ) : (
                    <><span>Save Category</span><ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
