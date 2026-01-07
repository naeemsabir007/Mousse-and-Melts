import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ShoppingBag, X, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StateContext';
import { Product } from '../types';

interface AddToCartNotificationProps {
    item: Product | null;
    onClose: () => void;
}

const AddToCartNotification: React.FC<AddToCartNotificationProps> = ({ item, onClose }) => {
    const { navigate, cart } = useStore();
    const [progress, setProgress] = useState(100);

    const cartItemCount = cart.reduce((acc, i) => acc + i.quantity, 0);
    const cartTotal = cart.reduce((acc, i) => acc + (i.salePrice || i.price) * i.quantity, 0);

    // Auto-dismiss timer with progress bar
    useEffect(() => {
        if (!item) return;

        setProgress(100);
        const duration = 4000; // 4 seconds
        const interval = 50;
        const decrement = (interval / duration) * 100;

        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev <= 0) {
                    clearInterval(timer);
                    onClose();
                    return 0;
                }
                return prev - decrement;
            });
        }, interval);

        return () => clearInterval(timer);
    }, [item, onClose]);

    const handleViewCart = () => {
        onClose();
        navigate('/cart');
    };

    const handleCheckout = () => {
        onClose();
        navigate('/checkout');
    };

    return (
        <AnimatePresence>
            {item && (
                <>
                    {/* Backdrop for mobile - subtle */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/10 backdrop-blur-[2px] z-[100] md:hidden"
                        onClick={onClose}
                    />

                    {/* Desktop: Floating card top-right */}
                    <motion.div
                        initial={{ opacity: 0, x: 100, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 100, scale: 0.9 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed top-24 right-6 z-[100] hidden md:block"
                    >
                        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden w-[340px]">
                            {/* Progress bar */}
                            <div className="h-1 bg-gray-100">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-chocolate to-velvet-red"
                                    initial={{ width: '100%' }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.05 }}
                                />
                            </div>

                            {/* Header */}
                            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                        <Check size={16} className="text-green-600" />
                                    </div>
                                    <span className="font-bold text-chocolate text-sm">Added to Cart!</span>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X size={16} className="text-gray-400" />
                                </button>
                            </div>

                            {/* Item */}
                            <div className="p-4 flex gap-4">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-16 h-16 rounded-xl object-cover shadow-sm"
                                />
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-serif font-bold text-chocolate truncate">{item.name}</h4>
                                    <p className="text-velvet-red font-bold">Rs. {item.salePrice || item.price}</p>
                                </div>
                            </div>

                            {/* Cart Summary */}
                            <div className="px-4 pb-2">
                                <div className="flex justify-between items-center text-sm text-chocolate/60 bg-cream/50 rounded-lg px-3 py-2">
                                    <span>{cartItemCount} item{cartItemCount !== 1 ? 's' : ''} in cart</span>
                                    <span className="font-bold text-chocolate">Rs. {cartTotal.toFixed(0)}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="p-4 pt-2 flex gap-2">
                                <button
                                    onClick={handleViewCart}
                                    className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-chocolate font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
                                >
                                    <ShoppingBag size={16} />
                                    View Cart
                                </button>
                                <button
                                    onClick={handleCheckout}
                                    className="flex-1 py-3 px-4 bg-chocolate hover:bg-velvet-red text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
                                >
                                    Checkout
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Mobile: Bottom bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 z-[100] md:hidden safe-area-inset-bottom"
                    >
                        <div className="bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-2xl">
                            {/* Progress bar */}
                            <div className="h-1 bg-gray-100">
                                <div
                                    className="h-full bg-gradient-to-r from-chocolate to-velvet-red transition-all duration-50"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>

                            <div className="p-4 space-y-3">
                                {/* Item preview */}
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Check size={12} className="text-green-600" />
                                    </div>
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-12 h-12 rounded-lg object-cover"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-chocolate text-sm truncate">{item.name}</p>
                                        <p className="text-velvet-red font-bold text-sm">Rs. {item.salePrice || item.price}</p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <X size={18} className="text-gray-400" />
                                    </button>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleViewCart}
                                        className="flex-1 py-3.5 px-4 bg-gray-100 hover:bg-gray-200 text-chocolate font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
                                    >
                                        <ShoppingBag size={16} />
                                        Cart ({cartItemCount})
                                    </button>
                                    <button
                                        onClick={handleCheckout}
                                        className="flex-1 py-3.5 px-4 bg-chocolate hover:bg-velvet-red text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
                                    >
                                        Checkout
                                        <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AddToCartNotification;
