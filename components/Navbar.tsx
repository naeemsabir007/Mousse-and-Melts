import React, { useState, useEffect } from 'react';
import { ShoppingBag, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../context/StateContext';
import logoImage from '../logo.png';

const Navbar: React.FC = () => {
  const { toggleCart, cart, settings, navigate } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const { announcement } = settings;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <AnimatePresence>
        {announcement.active && (
          <div className="fixed top-0 left-0 w-full bg-chocolate text-cream text-[10px] md:text-xs font-bold py-2 z-50 tracking-widest uppercase shadow-sm overflow-hidden">
            {announcement.isMarquee ? (
              <div className="whitespace-nowrap animate-[marquee_30s_linear_infinite]">
                {announcement.text} <span className="mx-4">•</span> {announcement.text} <span className="mx-4">•</span> {announcement.text} <span className="mx-4">•</span> {announcement.text}
              </div>
            ) : (
              <div className="text-center">{announcement.text}</div>
            )}
          </div>
        )}
      </AnimatePresence>

      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed left-0 right-0 mx-auto w-[95%] md:w-[90%] max-w-7xl z-40 transition-all duration-500 rounded-2xl ${announcement.active ? 'top-10 md:top-12' : 'top-3 md:top-4'
          } ${scrolled
            ? 'glass-panel py-3 shadow-lg bg-white/80 backdrop-blur-xl border-white/60'
            : 'bg-transparent py-4 md:py-6'
          }`}
      >
        <div className="flex justify-between items-center px-4 md:px-6">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 group">
            <div className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0 overflow-hidden">
              <img
                src={logoImage}
                alt="Mousse & Melts Logo"
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-sm"
              />
            </div>
            <span className="font-serif italic text-lg md:text-xl font-bold text-chocolate tracking-tight hidden sm:inline">
              Mousse & Melts
            </span>
          </button>

          <div className="flex items-center gap-3 md:gap-6">
            <button onClick={() => navigate('/login')} className="p-2 rounded-full hover:bg-chocolate/5 text-chocolate/80 hover:text-velvet-red transition-colors">
              <User size={20} />
            </button>
            <button
              onClick={() => toggleCart(true)}
              className="relative p-2 rounded-full hover:bg-chocolate/5 transition-colors active:scale-95 transition-transform"
            >
              <ShoppingBag size={24} className="text-chocolate" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 bg-velvet-red text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-cream shadow-sm"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.nav>
      <style>{`
        @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
        }
      `}</style>
    </>
  );
};

export default Navbar;