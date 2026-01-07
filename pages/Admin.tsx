import React, { useState } from 'react';
import { useStore } from '../context/StateContext';
import { Product, AppSettings, Coupon, Stats } from '../types';
import { saveProducts, saveSettings, saveCoupons } from '../services/mockData';
import {
  Plus, Trash2, Save, Loader2, LayoutDashboard, Package,
  Store, Megaphone, LogOut, ExternalLink, Image as ImageIcon,
  Menu, X, GripVertical
} from 'lucide-react';

/**
 * Converts Google Drive sharing links to direct image URLs.
 * Supports multiple Drive link formats:
 * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/uc?id=FILE_ID
 * 
 * Returns the lh3.googleusercontent.com direct link format.
 * Non-Drive URLs are returned unchanged.
 */
const convertDriveLink = (url: string): string => {
  if (!url) return url;

  // Check if it's a Google Drive URL
  if (!url.includes('drive.google.com')) {
    return url;
  }

  let fileId: string | null = null;

  // Pattern 1: /file/d/FILE_ID/
  const filePattern = /\/file\/d\/([a-zA-Z0-9_-]+)/;
  const fileMatch = url.match(filePattern);
  if (fileMatch) {
    fileId = fileMatch[1];
  }

  // Pattern 2: ?id=FILE_ID or &id=FILE_ID
  if (!fileId) {
    const idPattern = /[?&]id=([a-zA-Z0-9_-]+)/;
    const idMatch = url.match(idPattern);
    if (idMatch) {
      fileId = idMatch[1];
    }
  }

  // If we found a file ID, convert to direct link
  if (fileId) {
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }

  // If no pattern matched, return original URL
  return url;
};

// --- Sub-Components (Defined OUTSIDE Admin to prevent re-render bugs) ---

const DashboardView = ({ stats }: { stats: Stats }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Visits</p>
        <p className="text-4xl font-bold text-chocolate mt-2">{stats.totalVisits}</p>
      </div>
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Orders (Leads)</p>
        <p className="text-4xl font-bold text-green-600 mt-2">{stats.leadsGenerated}</p>
        <p className="text-xs text-gray-400 mt-2">Clicks on Checkout</p>
      </div>
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Active Products</p>
        <p className="text-4xl font-bold text-blue-600 mt-2">{stats.activeProducts}</p>
      </div>
    </div>
  </div>
);

interface ProductsViewProps {
  products: Product[];
  onUpdate: (id: string, field: keyof Product, value: any) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  onReorder: (dragIndex: number, dropIndex: number) => void;
}

const ProductsView: React.FC<ProductsViewProps> = ({ products, onUpdate, onDelete, onAdd, editingId, setEditingId, onReorder }) => {
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (index: number) => {
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      onReorder(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Product Inventory</h2>
          <p className="text-xs text-gray-400 mt-1">Drag products to reorder how they appear in "All Products"</p>
        </div>
        <button onClick={onAdd} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-chocolate text-white rounded-xl hover:bg-chocolate/90 text-sm font-bold shadow-sm active:scale-95 transition-transform">
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="space-y-2">
        {products.map((p, index) => (
          <div
            key={p.id}
            draggable={editingId !== p.id}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDragEnter={() => handleDragEnter(index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${draggedIndex === index ? 'opacity-50 scale-[0.98] border-chocolate' : ''
              } ${dragOverIndex === index ? 'border-chocolate border-2 bg-chocolate/5' : 'border-gray-200'
              }`}
          >
            {editingId === p.id ? (
              <div className="p-4 md:p-6 bg-gray-50/50">
                {/* Edit Mode */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Product Name</label>
                      <input
                        className="w-full border border-gray-300 rounded-lg p-3 text-base focus:ring-2 focus:ring-chocolate/20 outline-none transition-all"
                        value={p.name}
                        onChange={e => onUpdate(p.id, 'name', e.target.value)}
                        placeholder="e.g. Chocolate Lava Cake"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Price (Rs)</label>
                        <input
                          type="number"
                          step="0.01"
                          className="w-full border border-gray-300 rounded-lg p-3 text-base focus:ring-2 focus:ring-chocolate/20 outline-none"
                          value={p.price}
                          onChange={e => onUpdate(p.id, 'price', Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2 text-red-500">Sale Price</label>
                        <input
                          type="number"
                          step="0.01"
                          className="w-full border border-gray-300 rounded-lg p-3 text-base focus:ring-2 focus:ring-red-500/20 outline-none"
                          value={p.salePrice || ''}
                          onChange={e => onUpdate(p.id, 'salePrice', e.target.value ? Number(e.target.value) : undefined)}
                          placeholder="Optional"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Category</label>
                      <select
                        className="w-full border border-gray-300 rounded-lg p-3 text-base bg-white focus:ring-2 focus:ring-chocolate/20 outline-none"
                        value={p.category}
                        onChange={e => onUpdate(p.id, 'category', e.target.value)}
                      >
                        {['Cupcakes', 'Sundaes', 'Cakes & Pastries', 'Breads', 'Coffee & Shakes'].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Description</label>
                      <textarea
                        className="w-full border border-gray-300 rounded-lg p-3 text-base focus:ring-2 focus:ring-chocolate/20 outline-none"
                        rows={3}
                        value={p.description}
                        onChange={e => onUpdate(p.id, 'description', e.target.value)}
                      />
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors">
                      <input
                        type="checkbox"
                        className="w-5 h-5 text-chocolate rounded focus:ring-chocolate"
                        checked={p.isBestSeller}
                        onChange={e => onUpdate(p.id, 'isBestSeller', e.target.checked)}
                      />
                      <span className="text-sm font-bold text-gray-700">Mark as Best Seller</span>
                    </label>
                  </div>

                  {/* Image Handler */}
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Image URL</label>
                      <div className="relative">
                        <ImageIcon size={18} className="absolute top-3.5 left-3.5 text-gray-400" />
                        <input
                          className="w-full border border-gray-300 rounded-lg p-3 pl-10 text-sm focus:ring-2 focus:ring-chocolate/20 outline-none"
                          value={p.image}
                          onChange={e => onUpdate(p.id, 'image', e.target.value)}
                          placeholder="https://imgur.com/..."
                        />
                      </div>
                      <p className="text-[10px] text-gray-400 mt-2">Paste a direct link from Imgur, Unsplash, or Google Drive.</p>
                    </div>
                    <div className="aspect-video w-full bg-white rounded-xl flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-200 shadow-inner">
                      {p.image ? (
                        <img src={p.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = "https://placehold.co/400?text=Invalid+URL")} />
                      ) : (
                        <div className="text-center text-gray-400">
                          <ImageIcon size={32} className="mx-auto mb-2 opacity-50" />
                          <span className="text-xs">No Image Preview</span>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end pt-4">
                      <button
                        onClick={() => setEditingId(null)}
                        className="w-full sm:w-auto px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-900 text-sm font-bold shadow-sm active:scale-95 transition-transform"
                      >
                        Done Editing
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 flex flex-col sm:flex-row items-center gap-4 hover:bg-gray-50 group">
                {/* Drag Handle */}
                <div className="hidden sm:flex items-center justify-center cursor-grab active:cursor-grabbing text-gray-300 hover:text-chocolate transition-colors">
                  <GripVertical size={20} />
                </div>
                <div className="w-full sm:w-20 h-40 sm:h-20 flex-shrink-0">
                  <img src={p.image || "https://placehold.co/100"} className="w-full h-full rounded-lg object-cover bg-gray-100" />
                </div>
                <div className="flex-1 w-full text-center sm:text-left">
                  <h3 className="font-bold text-gray-800 text-lg">{p.name}</h3>
                  <p className="text-sm text-gray-500 mb-2 sm:mb-0">
                    {p.category} • <span className="font-bold text-chocolate">Rs. {p.price}</span>
                    {p.salePrice && <span className="text-red-500 font-bold ml-2">(Sale: {p.salePrice})</span>}
                  </p>
                </div>
                <div className="flex w-full sm:w-auto gap-2">
                  <button onClick={() => setEditingId(p.id)} className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-white hover:border-chocolate hover:text-chocolate transition-colors">Edit</button>
                  <button onClick={() => onDelete(p.id)} className="px-3 py-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

interface StorefrontViewProps {
  settings: AppSettings;
  products: Product[];
  onUpdateHero: (field: string, value: any) => void;
}

const StorefrontView: React.FC<StorefrontViewProps> = ({ settings, products, onUpdateHero }) => {
  const { hero } = settings;
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-800">Hero Section Configuration</h2>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Headline (Title)</label>
            <input
              className="w-full border border-gray-300 rounded-lg p-3 text-base focus:ring-2 focus:ring-chocolate/20 outline-none"
              value={hero.title}
              onChange={e => onUpdateHero('title', e.target.value)}
            />
            <p className="text-xs text-gray-400 mt-2">Use a comma to split lines (e.g., "Sweetness, Elevated").</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Subtitle</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 text-base focus:ring-2 focus:ring-chocolate/20 outline-none"
              rows={3}
              value={hero.subtitle}
              onChange={e => onUpdateHero('subtitle', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Display Price</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-lg p-3 text-base focus:ring-2 focus:ring-chocolate/20 outline-none"
                value={hero.price}
                onChange={e => onUpdateHero('price', Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Link to Product</label>
              <select
                className="w-full border border-gray-300 rounded-lg p-3 text-base bg-white focus:ring-2 focus:ring-chocolate/20 outline-none"
                value={hero.linkedProductId || ''}
                onChange={e => onUpdateHero('linkedProductId', e.target.value)}
              >
                <option value="">No Link (Just Scroll)</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Hero Image URL</label>
            <input
              className="w-full border border-gray-300 rounded-lg p-3 text-base focus:ring-2 focus:ring-chocolate/20 outline-none"
              value={hero.image}
              onChange={e => onUpdateHero('image', e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-800">Live Preview</h2>
        <div className="bg-gray-100 p-4 sm:p-8 rounded-2xl border border-gray-200 flex justify-center items-center overflow-hidden relative min-h-[400px]">
          {/* Mini version of Hero */}
          <div className="relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden bg-white shadow-xl flex flex-col transform scale-95 sm:scale-100 transition-transform">
            <img src={hero.image} className="w-full h-2/3 object-cover" onError={(e) => (e.currentTarget.src = "https://placehold.co/400")} />
            <div className="p-5 bg-white flex-1 text-center flex flex-col justify-center items-center">
              <h3 className="font-serif font-bold text-2xl text-chocolate leading-tight">{hero.title.replace(',', '\n')}</h3>
              <p className="text-xs text-gray-500 mt-2 line-clamp-2">{hero.subtitle}</p>
              <div className="mt-4 bg-chocolate text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">Order for Rs. {hero.price}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface MarketingViewProps {
  settings: AppSettings;
  coupons: Coupon[];
  onUpdateAnnounce: (field: string, value: any) => void;
  onUpdateCoupon: (id: string, field: string, value: any) => void;
  onAddCoupon: () => void;
  onDeleteCoupon: (id: string) => void;
}

const MarketingView: React.FC<MarketingViewProps> = ({ settings, coupons, onUpdateAnnounce, onUpdateCoupon, onAddCoupon, onDeleteCoupon }) => {
  const { announcement } = settings;
  return (
    <div className="space-y-8">
      {/* Announcement Bar */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2 text-lg"><Megaphone size={20} /> Announcement Bar</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-5">
            <input
              className="w-full border border-gray-300 rounded-lg p-3 text-base focus:ring-2 focus:ring-chocolate/20 outline-none"
              value={announcement.text}
              onChange={e => onUpdateAnnounce('text', e.target.value)}
              placeholder="Text displayed on top..."
            />
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
              <label className="flex items-center gap-3 text-sm font-medium cursor-pointer p-2 rounded hover:bg-gray-50">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-chocolate rounded focus:ring-chocolate"
                  checked={announcement.active}
                  onChange={e => onUpdateAnnounce('active', e.target.checked)}
                />
                Show Announcement
              </label>
              <label className="flex items-center gap-3 text-sm font-medium cursor-pointer p-2 rounded hover:bg-gray-50">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-chocolate rounded focus:ring-chocolate"
                  checked={announcement.isMarquee}
                  onChange={e => onUpdateAnnounce('isMarquee', e.target.checked)}
                />
                Animate (Marquee)
              </label>
            </div>
          </div>
          <div className="bg-gray-100 rounded-xl p-6 flex flex-col justify-center items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase">Preview</span>
            {announcement.active ? (
              <div className="bg-chocolate text-white px-4 py-3 text-xs font-bold rounded shadow-md w-full max-w-md text-center overflow-hidden">
                {announcement.isMarquee ? "Scrolling Text Animation..." : announcement.text}
              </div>
            ) : <span className="text-gray-400 text-sm italic">Bar is disabled</span>}
          </div>
        </div>
      </div>

      {/* Coupons */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-gray-800 text-lg">Coupons</h3>
          <button onClick={onAddCoupon} className="text-xs bg-chocolate text-white px-4 py-2 rounded-lg font-bold hover:bg-chocolate/90">Add Coupon</button>
        </div>
        {coupons.length === 0 ? <p className="text-gray-400 text-sm italic text-center py-8">No coupons created yet.</p> : (
          <div className="space-y-3">
            {coupons.map(c => (
              <div key={c.id} className="flex flex-col sm:flex-row items-center gap-4 border border-gray-100 p-4 rounded-xl bg-gray-50/50">
                <input
                  className="font-mono font-bold uppercase border-b-2 border-gray-300 focus:border-chocolate bg-transparent outline-none w-full sm:w-32 text-center sm:text-left py-1"
                  value={c.code}
                  onChange={e => onUpdateCoupon(c.id, 'code', e.target.value)}
                />
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    className="w-16 border rounded-lg p-2 text-center text-sm"
                    value={c.discountPercent}
                    onChange={e => onUpdateCoupon(c.id, 'discountPercent', Number(e.target.value))}
                  />
                  <span className="text-sm font-medium">% Off</span>
                </div>
                <label className="flex items-center gap-2 text-xs ml-auto cursor-pointer">
                  <input type="checkbox" checked={c.active} onChange={e => onUpdateCoupon(c.id, 'active', e.target.checked)} /> Active
                </label>
                <button onClick={() => onDeleteCoupon(c.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main Admin Component ---

const Admin: React.FC = () => {
  const { products, settings, coupons, stats, refreshData, isAdmin, logoutAdmin, navigate } = useStore();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'storefront' | 'marketing'>('dashboard');
  const [isSaving, setIsSaving] = useState(false);
  const [savingSuccess, setSavingSuccess] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Local State
  const [localProducts, setLocalProducts] = useState<Product[]>(products);
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [localCoupons, setLocalCoupons] = useState<Coupon[]>(coupons);

  React.useEffect(() => {
    if (!isAdmin) navigate('/login');
  }, [isAdmin, navigate]);

  // Sync on load
  React.useEffect(() => {
    setLocalProducts(products);
    setLocalSettings(settings);
    setLocalCoupons(coupons);
  }, [products, settings, coupons]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await Promise.all([
        saveProducts(localProducts),
        saveSettings(localSettings),
        saveCoupons(localCoupons)
      ]);
      await refreshData();
      setSavingSuccess(true);
      setTimeout(() => setSavingSuccess(false), 3000);
    } catch (e) {
      alert('Error saving data.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handlers for Child Components
  const updateProduct = (id: string, field: keyof Product, value: any) => {
    // Auto-convert Google Drive links for image field
    if (field === 'image' && typeof value === 'string') {
      value = convertDriveLink(value);
    }
    setLocalProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };
  const deleteProduct = (id: string) => {
    if (confirm("Are you sure?")) setLocalProducts(prev => prev.filter(p => p.id !== id));
  };
  const addNewProduct = () => {
    // Find the highest displayOrder and add 1 for new product
    const maxOrder = localProducts.reduce((max, p) => Math.max(max, p.displayOrder ?? 0), 0);
    const newP: Product = {
      id: Date.now().toString(),
      name: "New Product",
      description: "",
      price: 0,
      category: "Cupcakes",
      image: "",
      isBestSeller: false,
      displayOrder: maxOrder + 1
    };
    setLocalProducts([...localProducts, newP]);
    setEditingId(newP.id);
  };

  // Handler for drag-and-drop reordering
  const reorderProducts = (dragIndex: number, dropIndex: number) => {
    const reordered = [...localProducts];
    const [draggedItem] = reordered.splice(dragIndex, 1);
    reordered.splice(dropIndex, 0, draggedItem);
    // Update displayOrder for all products based on new positions
    const updated = reordered.map((p, index) => ({ ...p, displayOrder: index }));
    setLocalProducts(updated);
  };

  const updateHero = (field: string, value: any) => {
    // Auto-convert Google Drive links for image field
    if (field === 'image' && typeof value === 'string') {
      value = convertDriveLink(value);
    }
    setLocalSettings(prev => ({ ...prev, hero: { ...prev.hero, [field]: value } }));
  };

  const updateAnnounce = (field: string, value: any) => {
    setLocalSettings(prev => ({ ...prev, announcement: { ...prev.announcement, [field]: value } }));
  };

  const updateCoupon = (id: string, field: string, value: any) => {
    setLocalCoupons(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };
  const addCoupon = () => {
    setLocalCoupons([...localCoupons, { id: Date.now().toString(), code: 'NEW20', discountPercent: 20, active: true }]);
  };
  const deleteCoupon = (id: string) => {
    setLocalCoupons(prev => prev.filter(c => c.id !== id));
  };


  // --- Main Layout ---

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-gray-100">
          <h1 className="font-serif italic text-2xl text-chocolate font-bold">M&M Admin</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-chocolate/5 text-chocolate' : 'text-gray-600 hover:bg-gray-50'}`}>
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button onClick={() => setActiveTab('products')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'products' ? 'bg-chocolate/5 text-chocolate' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Package size={18} /> Products
          </button>
          <button onClick={() => setActiveTab('storefront')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'storefront' ? 'bg-chocolate/5 text-chocolate' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Store size={18} /> Storefront
          </button>
          <button onClick={() => setActiveTab('marketing')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'marketing' ? 'bg-chocolate/5 text-chocolate' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Megaphone size={18} /> Marketing
          </button>
        </nav>
        <div className="p-4 border-t border-gray-100 space-y-2">
          <button onClick={() => window.open('/', '_blank')} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-500 hover:text-chocolate">
            <ExternalLink size={16} /> View Website
          </button>
          <button onClick={() => { logoutAdmin(); navigate('/'); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-600">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 md:hidden flex justify-around items-center p-3 z-50 pb-safe">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center gap-1 p-2 rounded-lg ${activeTab === 'dashboard' ? 'text-chocolate' : 'text-gray-400'}`}>
          <LayoutDashboard size={20} /> <span className="text-[10px] font-bold">Home</span>
        </button>
        <button onClick={() => setActiveTab('products')} className={`flex flex-col items-center gap-1 p-2 rounded-lg ${activeTab === 'products' ? 'text-chocolate' : 'text-gray-400'}`}>
          <Package size={20} /> <span className="text-[10px] font-bold">Products</span>
        </button>
        <button onClick={() => setActiveTab('storefront')} className={`flex flex-col items-center gap-1 p-2 rounded-lg ${activeTab === 'storefront' ? 'text-chocolate' : 'text-gray-400'}`}>
          <Store size={20} /> <span className="text-[10px] font-bold">Design</span>
        </button>
        <button onClick={() => setActiveTab('marketing')} className={`flex flex-col items-center gap-1 p-2 rounded-lg ${activeTab === 'marketing' ? 'text-chocolate' : 'text-gray-400'}`}>
          <Megaphone size={20} /> <span className="text-[10px] font-bold">Promo</span>
        </button>
      </nav>

      {/* Content Area */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto pb-24 md:pb-8">
        {/* Mobile Header with Save + Logout */}
        <div className="md:hidden flex justify-between items-center mb-6 bg-white -mx-4 -mt-4 px-4 py-3 border-b border-gray-200 sticky top-0 z-30">
          <h1 className="font-serif italic text-xl text-chocolate font-bold">M&M Admin</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-sm font-bold transition-all ${savingSuccess ? 'bg-green-500' : 'bg-chocolate hover:bg-chocolate/90'} disabled:opacity-50`}
            >
              {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              {savingSuccess ? 'Saved!' : 'Save'}
            </button>
            <button onClick={() => { logoutAdmin(); navigate('/'); }} className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100"><LogOut size={20} /></button>
          </div>
        </div>

        {/* Desktop Header Actions */}
        <div className="hidden md:flex justify-between items-center mb-8 sticky top-0 bg-gray-50/95 backdrop-blur-sm z-20 py-4 -mt-4 -mx-8 px-8 border-b border-gray-200/50">
          <h2 className="text-2xl font-bold text-gray-800 capitalize">{activeTab}</h2>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-bold transition-all shadow-md ${savingSuccess ? 'bg-green-500' : 'bg-chocolate hover:bg-chocolate/90'} disabled:opacity-50`}
          >
            {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {savingSuccess ? 'Changes Saved!' : 'Save Changes'}
          </button>
        </div>

        {/* Tab Content */}
        <div className="max-w-5xl mx-auto">
          {activeTab === 'dashboard' && <DashboardView stats={stats} />}
          {activeTab === 'products' && (
            <ProductsView
              products={localProducts}
              onUpdate={updateProduct}
              onDelete={deleteProduct}
              onAdd={addNewProduct}
              editingId={editingId}
              setEditingId={setEditingId}
              onReorder={reorderProducts}
            />
          )}
          {activeTab === 'storefront' && <StorefrontView settings={localSettings} products={localProducts} onUpdateHero={updateHero} />}
          {activeTab === 'marketing' && (
            <MarketingView
              settings={localSettings}
              coupons={localCoupons}
              onUpdateAnnounce={updateAnnounce}
              onUpdateCoupon={updateCoupon}
              onAddCoupon={addCoupon}
              onDeleteCoupon={deleteCoupon}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;