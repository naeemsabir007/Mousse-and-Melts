import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StateContext';

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
  const { addToCart } = useStore();

  // Check if salePrice is a valid number greater than 0
  const hasSalePrice = typeof product.salePrice === 'number' && product.salePrice > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative glass-panel rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-chocolate/10 transition-all duration-500 flex flex-col h-[380px] md:h-[420px]"
    >
      <div className="h-[55%] md:h-[60%] overflow-hidden relative p-3 md:p-4">
        <motion.div
          className="w-full h-full rounded-2xl overflow-hidden relative"
          whileHover={{ scale: 0.98 }}
          transition={{ duration: 0.4 }}
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300" />
        </motion.div>
      </div>

      <div className="flex-1 px-5 pb-5 md:px-6 md:pb-6 flex flex-col justify-between relative z-10">
        <div>
          <div className="flex justify-between items-start mb-1 md:mb-2 gap-2">
            <h3 className="font-serif text-lg md:text-xl font-bold text-chocolate truncate">{product.name}</h3>
            <div className="flex flex-col items-end">
              <span className="font-sans font-bold text-velvet-red text-base md:text-lg whitespace-nowrap">
                Rs. {hasSalePrice ? product.salePrice : product.price}
              </span>
              {hasSalePrice && (
                <span className="text-xs text-chocolate/50 line-through decoration-velvet-red/50">
                  Rs. {product.price}
                </span>
              )}
            </div>
          </div>
          <p className="text-chocolate/70 text-xs md:text-sm line-clamp-2 leading-relaxed font-medium">{product.description}</p>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => addToCart(product)}
          className="self-end mt-3 md:mt-4 bg-chocolate text-cream px-5 py-2.5 md:px-6 md:py-3 rounded-xl font-bold text-xs md:text-sm shadow-md hover:bg-velvet-red transition-colors duration-300 flex items-center gap-2 active:bg-velvet-red"
        >
          <Plus size={16} /> Add
        </motion.button>
      </div>

      {/* Badges */}
      <div className="absolute top-5 left-5 md:top-6 md:left-6 flex flex-col gap-2 z-20">
        {product.isBestSeller && (
          <div className="bg-white/90 backdrop-blur-md text-chocolate text-[10px] md:text-xs font-bold px-2 py-1 md:px-3 md:py-1.5 rounded-lg uppercase tracking-wider shadow-sm border border-white/50">
            Best Seller
          </div>
        )}
        {hasSalePrice && (
          <div className="bg-velvet-red text-white text-[10px] md:text-xs font-bold px-2 py-1 md:px-3 md:py-1.5 rounded-lg uppercase tracking-wider shadow-sm">
            Sale
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;