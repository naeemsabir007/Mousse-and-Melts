import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, ChevronDown } from 'lucide-react';
import { useStore } from '../context/StateContext';

const Hero: React.FC = () => {
  const { settings, addToCart, products } = useStore();

  // Safe access to hero with default fallback
  const hero = settings?.hero || {
    title: "Sweetness, Elevated.",
    subtitle: "Experience the art of baking.",
    price: 0,
    image: "",
    linkedProductId: ""
  };

  const scrollToMenu = () => {
    const menuElement = document.getElementById('menu');
    if (menuElement) {
      menuElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHeroAction = () => {
    // If a linked product exists, add it to cart
    if (hero.linkedProductId) {
      const product = products.find(p => p.id === hero.linkedProductId);
      if (product) {
        addToCart(product);
        return;
      }
    }
    // Fallback: Just scroll to menu
    scrollToMenu();
  };

  // Safe split for title
  const titleString = hero.title || "Sweetness, Elevated.";
  const titleParts = titleString.includes(',') ? titleString.split(',') : [titleString, ""];

  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center pt-32 pb-12 md:pt-40 lg:pt-48 overflow-hidden">

      {/* Dynamic Background Mesh */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-soft-pink/40 rounded-full blur-[60px] md:blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-gold-accent/20 rounded-full blur-[60px] md:blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 md:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">

          {/* Left: Typography Content */}
          <div className="flex-1 text-center lg:text-left space-y-6 md:space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white/40 backdrop-blur-md rounded-full border border-white/50 text-chocolate text-[10px] md:text-xs font-bold tracking-widest uppercase shadow-sm mx-auto lg:mx-0">
                <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-velvet-red animate-pulse" />
                Premium Artisan Bakery
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-[7rem] leading-[0.95] md:leading-[0.9] font-serif text-chocolate tracking-tight">
                {titleParts[0]} <br />
                <span className="italic text-velvet-red">{titleParts[1]?.trim() || "Elevated."}</span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-base md:text-xl text-chocolate/70 max-w-sm md:max-w-lg mx-auto lg:mx-0 font-light leading-relaxed px-2 md:px-0"
            >
              {hero.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start w-full md:w-auto"
            >
              <button
                onClick={handleHeroAction}
                className="group relative w-full sm:w-auto px-8 py-3.5 md:py-4 bg-chocolate text-cream rounded-full font-bold text-base md:text-lg overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-chocolate/20 transition-all duration-300 active:scale-95"
              >
                <div className="absolute inset-0 w-full h-full bg-velvet-red transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <div className="relative flex items-center justify-center gap-2">
                  Order Now <ArrowRight size={18} />
                </div>
              </button>

              <button
                onClick={scrollToMenu}
                className="w-full sm:w-auto px-8 py-3.5 md:py-4 bg-white/40 backdrop-blur-sm border border-chocolate/10 text-chocolate rounded-full font-bold text-base md:text-lg hover:bg-white/60 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
              >
                View Gallery <ChevronDown size={18} className="opacity-60" />
              </button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="pt-4 md:pt-6 flex flex-wrap justify-center lg:justify-start gap-4 md:gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500"
            >
              <span className="font-serif italic font-bold text-base md:text-lg">Vogue</span>
              <span className="hidden md:inline text-chocolate/30">•</span>
              <span className="font-serif italic font-bold text-base md:text-lg">Tatler</span>
              <span className="hidden md:inline text-chocolate/30">•</span>
              <span className="font-serif italic font-bold text-base md:text-lg">Bon Appétit</span>
            </motion.div>
          </div>

          {/* Right: The Arch Portal Visual */}
          <div className="flex-1 w-full relative flex justify-center lg:justify-end mt-8 lg:mt-0">

            {/* Rotating Badge */}
            <div className="absolute -top-6 md:-top-12 right-0 md:-right-12 z-20 scale-75 md:scale-100 hidden sm:block">
              <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
                <div className="absolute inset-0 animate-spin-slow">
                  <svg viewBox="0 0 100 100" width="100%" height="100%">
                    <defs>
                      <path id="circle" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
                    </defs>
                    <text fontSize="11.5" fontWeight="bold" fill="#3E2723" letterSpacing="1.2">
                      <textPath href="#circle">
                        • MOUSSE & MELTS • SINCE 2024
                      </textPath>
                    </text>
                  </svg>
                </div>
                <div className="text-2xl">🍰</div>
              </div>
            </div>

            {/* The Arch Image Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative w-[85%] sm:w-full max-w-sm md:max-w-md aspect-[3/4]"
            >
              {/* Main Image Mask */}
              <div className="absolute inset-0 rounded-t-[8rem] md:rounded-t-[12rem] rounded-b-[2rem] overflow-hidden border-[4px] md:border-[6px] border-white/30 shadow-2xl z-10 bg-gray-200">
                <img
                  src={hero.image}
                  alt="Mousse & Melts Signature Baked Goods - Premium Cakes, Cupcakes and Pastries in Lahore"
                  className="w-full h-full object-cover"
                />
                {/* Gradient Overlay for Depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-chocolate/40 to-transparent pointer-events-none" />
              </div>

              {/* Decorative Frame Behind */}
              <div className="absolute top-3 md:top-4 -right-3 md:-right-4 w-full h-full rounded-t-[8rem] md:rounded-t-[12rem] rounded-b-[2rem] border-2 border-chocolate/10 z-0" />
              <div className="absolute -top-3 md:-top-4 left-3 md:left-4 w-full h-full rounded-t-[8rem] md:rounded-t-[12rem] rounded-b-[2rem] bg-gold-accent/5 z-0" />

              {/* Glass Detail Card Floating in Front */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="absolute -bottom-6 -left-2 md:-bottom-8 md:-left-12 z-30 glass-panel p-4 md:p-5 rounded-2xl shadow-xl w-[180px] md:max-w-[200px]"
              >
                <div className="flex items-center gap-1 text-gold-accent mb-1">
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                </div>
                <p className="font-serif font-bold text-chocolate text-base md:text-lg leading-tight mb-1">{titleParts[0]}</p>
                <p className="text-[10px] md:text-xs text-chocolate/60 font-medium">Chef's Special</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-bold text-velvet-red text-sm md:text-base">Rs. {hero.price}</span>
                  <button
                    onClick={handleHeroAction}
                    className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-chocolate text-cream flex items-center justify-center hover:bg-velvet-red transition-colors"
                  >
                    <ArrowRight size={12} />
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;