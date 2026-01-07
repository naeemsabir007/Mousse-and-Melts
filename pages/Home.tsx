import React, { useState } from 'react';
import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { useStore } from '../context/StateContext';
import { Category } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

const Home: React.FC = () => {
  const { products, isLoading } = useStore();
  const [activeCategory, setActiveCategory] = useState<Category>('All');

  const categories: Category[] = ['All', 'Cupcakes', 'Sundaes', 'Cakes & Pastries', 'Breads', 'Coffee & Shakes'];

  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter(p => p.category === activeCategory);

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-transparent flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 border-4 border-chocolate/20 border-t-chocolate rounded-full animate-spin" />
        <p className="font-serif italic text-xl text-chocolate animate-pulse">Baking fresh data...</p>
      </div>
    );
  }

  return (
    // Changed bg-cream to transparent to let body gradient show
    <div className="min-h-screen overflow-hidden">
      <SEO
        title="Mousse & Melts | Premium Bakery & Cakes"
        description="Order the best cakes, sundaes, and pastries online in Lahore. Freshly baked Banana Bread, Molten Lava Cake, cupcakes, and more. Fast delivery near UMT, Johar Town."
        keywords="Mousse and Melts, Mousse N Melts, bakery near me, cakes near me, online cake delivery Lahore, best bakery Lahore, banana bread, molten lava cake, sundaes, cupcakes, pastries, Johar Town bakery, UMT bakery"
      />
      <Hero />
      <Marquee />

      <section id="menu" className="container mx-auto px-4 py-20 scroll-mt-32">
        <div className="text-center mb-16 space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif italic text-5xl md:text-6xl text-chocolate"
          >
            The Menu
          </motion.h2>
          <p className="text-chocolate/70 max-w-2xl mx-auto">
            Explore our handcrafted selection of sweets and treats.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 md:px-6 md:py-2.5 rounded-full border transition-all duration-300 font-medium text-sm md:text-base ${activeCategory === cat
                ? 'bg-chocolate text-cream border-chocolate shadow-lg'
                : 'bg-white/30 backdrop-blur-sm text-chocolate border-chocolate/10 hover:border-chocolate/40 hover:bg-white/50'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry-style Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 text-chocolate/50 glass-panel rounded-3xl mx-auto max-w-md">
            No products found in this category.
          </div>
        )}
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;