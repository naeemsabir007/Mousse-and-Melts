import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, ArrowRight, Package } from 'lucide-react';
import { useStore } from '../context/StateContext';
import SEO from '../components/SEO';

const Cart: React.FC = () => {
    const { cart, products, removeFromCart, updateQuantity, navigate } = useStore();

    // Scroll to top when page loads
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    // Calculate totals
    const subtotal = cart.reduce((acc, item) => {
        const price = item.salePrice || item.price;
        return acc + price * item.quantity;
    }, 0);

    const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    // Get recommended products (products not in cart)
    const recommendedProducts = useMemo(() => {
        const cartIds = new Set(cart.map(item => item.id));
        return products
            .filter(p => !cartIds.has(p.id))
            .sort(() => Math.random() - 0.5)
            .slice(0, 4);
    }, [cart, products]);

    const { addToCart } = useStore();

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-cream via-soft-pink/10 to-cream pt-32 pb-20">
                <SEO title="Your Cart" />
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-md mx-auto text-center py-20"
                    >
                        <div className="w-24 h-24 bg-chocolate/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag size={48} className="text-chocolate/30" />
                        </div>
                        <h1 className="font-serif text-3xl text-chocolate mb-4">Your Cart is Empty</h1>
                        <p className="text-chocolate/60 mb-8">Looks like you haven't added any sweet treats yet!</p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-chocolate text-cream px-8 py-4 rounded-xl font-bold hover:bg-velvet-red transition-colors inline-flex items-center gap-2"
                        >
                            <ArrowLeft size={18} />
                            Start Shopping
                        </button>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-cream via-soft-pink/10 to-cream pt-32 pb-20">
            <SEO title="Your Cart" />
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <button
                            onClick={() => navigate('/')}
                            className="text-chocolate/60 hover:text-chocolate text-sm font-medium flex items-center gap-1 mb-2 transition-colors"
                        >
                            <ArrowLeft size={14} />
                            Continue Shopping
                        </button>
                        <h1 className="font-serif text-4xl text-chocolate">Your Cart</h1>
                    </div>
                    <div className="text-chocolate/60">
                        <span className="font-bold text-chocolate">{itemCount}</span> item{itemCount !== 1 ? 's' : ''}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        <AnimatePresence mode="popLayout">
                            {cart.map((item) => {
                                const price = item.salePrice || item.price;
                                return (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-white/50 shadow-lg flex gap-4 md:gap-6"
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-24 h-24 md:w-32 md:h-32 rounded-xl object-cover flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                                            <div>
                                                <h3 className="font-serif text-lg md:text-xl font-bold text-chocolate truncate">{item.name}</h3>
                                                <p className="text-chocolate/60 text-sm hidden md:block line-clamp-1">{item.description}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-velvet-red font-bold">Rs. {price}</span>
                                                    {item.salePrice && (
                                                        <span className="text-chocolate/40 text-sm line-through">Rs. {item.price}</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mt-4">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-3 bg-cream/50 rounded-xl p-1">
                                                    <button
                                                        onClick={() => item.quantity === 1 ? removeFromCart(item.id) : updateQuantity(item.id, -1)}
                                                        className="w-8 h-8 rounded-lg bg-white flex items-center justify-center hover:bg-chocolate hover:text-white transition-colors shadow-sm"
                                                    >
                                                        {item.quantity === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
                                                    </button>
                                                    <span className="w-8 text-center font-bold text-chocolate">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                        className="w-8 h-8 rounded-lg bg-chocolate text-white flex items-center justify-center hover:bg-velvet-red transition-colors"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>

                                                {/* Item Total */}
                                                <span className="font-bold text-chocolate text-lg">
                                                    Rs. {(price * item.quantity).toFixed(0)}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-xl sticky top-24">
                            <h2 className="font-serif text-xl text-chocolate font-bold mb-6">Order Summary</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-chocolate/70">
                                    <span>Subtotal ({itemCount} items)</span>
                                    <span className="font-medium">Rs. {subtotal.toFixed(0)}</span>
                                </div>
                                <div className="flex justify-between text-chocolate/70">
                                    <span>Delivery</span>
                                    <span className="text-green-600 font-medium">Calculated at checkout</span>
                                </div>
                            </div>

                            <div className="border-t border-chocolate/10 pt-4 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-chocolate text-lg">Total</span>
                                    <span className="font-bold text-2xl text-chocolate font-serif">Rs. {subtotal.toFixed(0)}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full bg-gradient-to-r from-chocolate to-velvet-red text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                            >
                                Proceed to Checkout
                                <ArrowRight size={18} />
                            </button>

                            <p className="text-center text-chocolate/40 text-xs mt-4">
                                Secure checkout via WhatsApp
                            </p>
                        </div>
                    </div>
                </div>

                {/* Recommended Products */}
                {recommendedProducts.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-16"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <Package size={24} className="text-chocolate" />
                            <h2 className="font-serif text-2xl text-chocolate font-bold">You Might Also Like</h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {recommendedProducts.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + index * 0.1 }}
                                    className="bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/50 shadow-md hover:shadow-lg transition-shadow group"
                                >
                                    <div className="aspect-square overflow-hidden">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-serif font-bold text-chocolate truncate text-sm">{product.name}</h3>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-velvet-red font-bold text-sm">
                                                Rs. {product.salePrice || product.price}
                                            </span>
                                            <button
                                                onClick={() => addToCart(product)}
                                                className="w-8 h-8 bg-chocolate text-white rounded-lg flex items-center justify-center hover:bg-velvet-red transition-colors"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                )}
            </div>
        </div>
    );
};

export default Cart;
