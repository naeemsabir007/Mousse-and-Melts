import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, MessageCircle } from 'lucide-react';
import { useStore } from '../context/StateContext';

const CartDrawer: React.FC = () => {
  const { isCartOpen, toggleCart, cart, removeFromCart, updateQuantity, recordCheckout, navigate } = useStore();

  const subtotal = cart.reduce((acc, item) => {
    const price = item.salePrice || item.price;
    return acc + price * item.quantity;
  }, 0);

  const handleCheckout = () => {
    recordCheckout(); // Track this lead

    // 1. Build the Item List
    const itemList = cart.map(item => {
      const price = item.salePrice || item.price;
      return `• ${item.quantity}x ${item.name} (Rs. ${price})`;
    }).join('\n');

    // 2. Format the Final Message
    const message = `*Hello Mousse & Melts!* 👋\nI'd like to place an order:\n\n${itemList}\n\n*Total Estimate: Rs. ${subtotal.toFixed(2)}*\n\nMy Delivery Address:\n[Please type address here]`;

    // 3. Open WhatsApp
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/923290033863?text=${encodedMessage}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => toggleCart(false)}
            className="fixed inset-0 bg-chocolate/20 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white/90 backdrop-blur-xl border-l border-white/50 shadow-2xl z-50 flex flex-col"
          >
            <div className="p-6 flex justify-between items-center border-b border-chocolate/5 bg-white/50">
              <h2 className="font-serif text-2xl text-chocolate font-bold flex items-center gap-2">
                <ShoppingBag size={24} /> Your Box
              </h2>
              <button onClick={() => toggleCart(false)} className="p-2 hover:bg-chocolate/10 rounded-full transition-colors">
                <X size={24} className="text-chocolate" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-chocolate/50 space-y-4">
                  <div className="w-20 h-20 bg-chocolate/5 rounded-full flex items-center justify-center">
                    <ShoppingBag size={40} className="opacity-50" />
                  </div>
                  <p className="font-serif text-xl">Your cart is empty.</p>
                  <button onClick={() => toggleCart(false)} className="text-velvet-red font-bold hover:underline">
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map(item => {
                  const price = item.salePrice || item.price;
                  return (
                    <div key={item.id} className="flex gap-4 items-center bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif font-bold text-chocolate truncate">{item.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-velvet-red font-bold">Rs. {price}</span>
                          {item.salePrice && <span className="text-gray-400 text-xs line-through">Rs. {item.price}</span>}
                        </div>

                        <div className="flex items-center gap-3 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-chocolate hover:text-white transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-7 h-7 rounded-lg bg-chocolate text-white flex items-center justify-center hover:bg-velvet-red transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                        <X size={18} />
                      </button>
                    </div>
                  )
                })
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 bg-white border-t border-gray-100 space-y-3">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-chocolate/70 font-medium">Subtotal</span>
                  <span className="font-bold text-3xl text-chocolate font-serif">Rs. {subtotal.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => { toggleCart(false); navigate('/cart'); }}
                  className="w-full bg-gradient-to-r from-chocolate to-velvet-red text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all transform active:scale-95 shadow-lg flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={24} /> View Cart & Checkout
                </button>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#25D366] text-white py-3 rounded-xl font-bold text-base hover:brightness-110 transition-all transform active:scale-95 shadow-md flex items-center justify-center gap-2"
                >
                  <MessageCircle size={20} /> Quick Checkout via WhatsApp
                </button>
                <p className="text-center text-[10px] text-gray-400 mt-1">Apply coupons and see recommendations in cart</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;