import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Tag, Check, X, MessageCircle, User, MapPin, ShoppingBag, Sparkles } from 'lucide-react';
import { useStore } from '../context/StateContext';
import SEO from '../components/SEO';

const Checkout: React.FC = () => {
    const { cart, coupons, navigate, recordCheckout, clearCart } = useStore();
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
    const [couponError, setCouponError] = useState('');
    const [couponSuccess, setCouponSuccess] = useState(false);

    // Scroll to top when page loads
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Calculate totals
    const subtotal = cart.reduce((acc, item) => {
        const price = item.salePrice || item.price;
        return acc + price * item.quantity;
    }, 0);

    const discount = appliedCoupon ? (subtotal * appliedCoupon.discount) / 100 : 0;
    const total = subtotal - discount;
    const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    // Apply coupon
    const handleApplyCoupon = () => {
        setCouponError('');
        setCouponSuccess(false);

        if (!couponCode.trim()) {
            setCouponError('Please enter a coupon code');
            return;
        }

        const foundCoupon = coupons.find(
            c => c.code.toLowerCase() === couponCode.trim().toLowerCase() && c.active
        );

        if (foundCoupon) {
            setAppliedCoupon({ code: foundCoupon.code, discount: foundCoupon.discountPercent });
            setCouponSuccess(true);
            setTimeout(() => setCouponSuccess(false), 2000);
        } else {
            setCouponError('Invalid or expired coupon code');
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
    };

    // WhatsApp checkout
    const handleWhatsAppCheckout = () => {
        if (!name.trim() || !address.trim()) {
            alert('Please fill in your name and address');
            return;
        }

        recordCheckout();

        // Build the message
        const itemList = cart.map(item => {
            const price = item.salePrice || item.price;
            const itemTotal = price * item.quantity;
            return `• ${item.quantity}x ${item.name} (Rs. ${itemTotal})`;
        }).join('\n');

        let message = `*🛍️ NEW ORDER from Mousse & Melts*\n\n`;
        message += `*Customer:* ${name}\n`;
        message += `*Address:* ${address}\n\n`;
        message += `*📦 Order Details:*\n${itemList}\n\n`;

        if (appliedCoupon) {
            message += `*Coupon:* ${appliedCoupon.code} (-${appliedCoupon.discount}%)\n`;
            message += `*Subtotal:* Rs. ${subtotal.toFixed(0)}\n`;
            message += `*Discount:* Rs. ${discount.toFixed(0)}\n`;
        }

        message += `*Total:* Rs. ${total.toFixed(0)}\n\n`;
        message += `Thank you! 🎂`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/923290033863?text=${encodedMessage}`, '_blank');

        // Clear cart after checkout
        clearCart();
        navigate('/');
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-cream via-soft-pink/10 to-cream pt-32 pb-20">
                <SEO title="Checkout" />
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-md mx-auto text-center py-20"
                    >
                        <div className="w-24 h-24 bg-chocolate/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag size={48} className="text-chocolate/30" />
                        </div>
                        <h1 className="font-serif text-3xl text-chocolate mb-4">No Items to Checkout</h1>
                        <p className="text-chocolate/60 mb-8">Add some delicious treats to your cart first!</p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-chocolate text-cream px-8 py-4 rounded-xl font-bold hover:bg-velvet-red transition-colors inline-flex items-center gap-2"
                        >
                            <ArrowLeft size={18} />
                            Browse Menu
                        </button>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-cream via-soft-pink/10 to-cream pt-24 md:pt-32 pb-16 md:pb-20">
            <SEO title="Checkout" />
            <div className="container mx-auto px-3 md:px-4">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/cart')}
                        className="text-chocolate/60 hover:text-chocolate text-sm font-medium flex items-center gap-1 mb-2 transition-colors"
                    >
                        <ArrowLeft size={14} />
                        Back to Cart
                    </button>
                    <h1 className="font-serif text-3xl md:text-4xl text-chocolate">Checkout</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Form Section */}
                    <div className="space-y-6">
                        {/* Coupon Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/50 shadow-lg"
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <Tag size={20} className="text-chocolate" />
                                <h2 className="font-serif text-xl text-chocolate font-bold">Have a Coupon?</h2>
                            </div>

                            {appliedCoupon ? (
                                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                            <Check size={20} className="text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-green-700">{appliedCoupon.code}</p>
                                            <p className="text-green-600 text-sm">{appliedCoupon.discount}% off applied!</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={removeCoupon}
                                        className="p-2 hover:bg-green-100 rounded-full transition-colors"
                                    >
                                        <X size={18} className="text-green-600" />
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) => {
                                                setCouponCode(e.target.value.toUpperCase());
                                                setCouponError('');
                                            }}
                                            placeholder="Enter coupon code"
                                            className="flex-1 px-4 py-3 bg-white rounded-xl border border-chocolate/10 focus:border-chocolate/30 focus:ring-4 focus:ring-chocolate/10 outline-none transition-all text-chocolate uppercase font-mono font-bold tracking-wider placeholder:font-normal placeholder:text-chocolate/30"
                                        />
                                        <button
                                            onClick={handleApplyCoupon}
                                            className="px-6 py-3 bg-chocolate text-white font-bold rounded-xl hover:bg-velvet-red transition-colors flex items-center gap-2"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                    <AnimatePresence>
                                        {couponError && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                className="text-red-500 text-sm font-medium"
                                            >
                                                {couponError}
                                            </motion.p>
                                        )}
                                        {couponSuccess && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                className="text-green-600 text-sm font-medium flex items-center gap-1"
                                            >
                                                <Sparkles size={14} /> Coupon applied successfully!
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}
                        </motion.div>

                        {/* Customer Details */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/50 shadow-lg"
                        >
                            <h2 className="font-serif text-xl text-chocolate font-bold mb-4">Delivery Details</h2>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-chocolate/70 uppercase tracking-wider">
                                        Your Name
                                    </label>
                                    <div className="relative">
                                        <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-chocolate/40" />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Enter your full name"
                                            className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border border-chocolate/10 focus:border-chocolate/30 focus:ring-4 focus:ring-chocolate/10 outline-none transition-all text-chocolate placeholder:text-chocolate/30"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-chocolate/70 uppercase tracking-wider">
                                        Delivery Address
                                    </label>
                                    <div className="relative">
                                        <MapPin size={18} className="absolute left-4 top-4 text-chocolate/40" />
                                        <textarea
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            placeholder="Enter your complete delivery address"
                                            rows={3}
                                            className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border border-chocolate/10 focus:border-chocolate/30 focus:ring-4 focus:ring-chocolate/10 outline-none transition-all text-chocolate placeholder:text-chocolate/30 resize-none"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* WhatsApp Checkout Button - Mobile */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="lg:hidden"
                        >
                            <button
                                onClick={handleWhatsAppCheckout}
                                disabled={!name.trim() || !address.trim()}
                                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-3 ${name.trim() && address.trim()
                                        ? 'bg-[#25D366] text-white hover:brightness-110 active:scale-95'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                <MessageCircle size={24} />
                                {name.trim() && address.trim() ? 'Checkout on WhatsApp' : 'Fill Details Above to Checkout'}
                            </button>
                            {(!name.trim() || !address.trim()) && (
                                <p className="text-center text-amber-600 text-xs mt-2 font-medium">
                                    ⚠️ Please enter your name and delivery address
                                </p>
                            )}
                        </motion.div>
                    </div>

                    {/* Right: Order Summary */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="lg:sticky lg:top-24 h-fit"
                    >
                        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/50 shadow-xl">
                            <h2 className="font-serif text-xl text-chocolate font-bold mb-4">Order Summary</h2>

                            {/* Items */}
                            <div className="space-y-3 max-h-64 overflow-y-auto mb-6">
                                {cart.map((item) => {
                                    const price = item.salePrice || item.price;
                                    return (
                                        <div key={item.id} className="flex items-center gap-3">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-14 h-14 rounded-lg object-cover"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-chocolate text-sm truncate">{item.name}</h4>
                                                <p className="text-chocolate/60 text-xs">Qty: {item.quantity}</p>
                                            </div>
                                            <span className="font-bold text-chocolate text-sm">
                                                Rs. {(price * item.quantity).toFixed(0)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Totals */}
                            <div className="space-y-3 border-t border-chocolate/10 pt-4">
                                <div className="flex justify-between text-chocolate/70">
                                    <span>Subtotal ({itemCount} items)</span>
                                    <span className="font-medium">Rs. {subtotal.toFixed(0)}</span>
                                </div>

                                {appliedCoupon && (
                                    <div className="flex justify-between text-green-600">
                                        <span className="flex items-center gap-1">
                                            <Tag size={14} />
                                            Discount ({appliedCoupon.discount}%)
                                        </span>
                                        <span className="font-medium">-Rs. {discount.toFixed(0)}</span>
                                    </div>
                                )}

                                <div className="flex justify-between items-center pt-3 border-t border-chocolate/10">
                                    <span className="font-bold text-chocolate text-lg">Total</span>
                                    <span className="font-bold text-2xl text-chocolate font-serif">Rs. {total.toFixed(0)}</span>
                                </div>
                            </div>

                            {/* WhatsApp Checkout Button - Desktop */}
                            <button
                                onClick={handleWhatsAppCheckout}
                                disabled={!name.trim() || !address.trim()}
                                className="hidden lg:flex w-full mt-6 bg-[#25D366] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:brightness-110 transition-all items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <MessageCircle size={24} />
                                Checkout on WhatsApp
                            </button>

                            <p className="text-center text-chocolate/40 text-xs mt-4">
                                Your order will be sent to us via WhatsApp for confirmation
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
