import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Sparkles, Heart } from 'lucide-react';
import { useStore } from '../context/StateContext';
import logoImage from '../logo.png';

// Instagram SVG Icon (official brand icon)
const InstagramIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        className={className}
        fill="currentColor"
    >
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
);

const Footer: React.FC = () => {
    const { navigate } = useStore();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <footer className="relative bg-chocolate text-cream mt-20 rounded-t-[3rem] overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-velvet-red/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gold-accent/10 rounded-full blur-[80px]" />
            </div>

            {/* Main Content */}
            <div className="relative z-10">
                {/* Hero Tagline Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center pt-16 md:pt-20 pb-12 px-4"
                >
                    <motion.p
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="font-serif italic text-3xl md:text-5xl lg:text-6xl text-cream/90 max-w-4xl mx-auto leading-tight"
                    >
                        Slice of happiness,{' '}
                        <span className="text-soft-pink">bite by bite</span>
                    </motion.p>
                </motion.div>

                {/* Info Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="container mx-auto px-4 pb-12"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-12">

                        {/* Brand Column */}
                        <motion.div variants={itemVariants} className="text-center md:text-left space-y-6">
                            <div className="flex flex-col items-center md:items-start gap-3">
                                <img
                                    src={logoImage}
                                    alt="Mousse & Melts - Premium Bakery in Johar Town, Lahore"
                                    className="w-16 h-16 object-contain drop-shadow-lg"
                                />
                                <h3 className="font-serif italic text-2xl md:text-3xl">Mousse & Melts</h3>
                                <p className="text-cream/60 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
                                    Spreading happiness, one slice at a time. Crafted with love and premium ingredients.
                                </p>
                            </div>

                            {/* Instagram Link */}
                            <a
                                href="https://www.instagram.com/moussenmelts?igsh=M251aTh5ZTlrdnBz"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 px-5 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all duration-300 group border border-white/10 hover:border-white/30"
                            >
                                <InstagramIcon size={22} className="group-hover:scale-110 transition-transform" />
                                <span className="font-semibold text-sm tracking-wide">@moussenmelts</span>
                                <span className="text-cream/40 group-hover:text-cream/60 transition-colors">→</span>
                            </a>
                        </motion.div>

                        {/* Visit Us Column */}
                        <motion.div variants={itemVariants} className="text-center space-y-6">
                            <h4 className="font-serif text-lg text-gold-accent tracking-wider uppercase">Visit Us</h4>

                            {/* Location */}
                            <div className="space-y-4">
                                <div className="flex items-start gap-3 justify-center">
                                    <div className="w-10 h-10 rounded-full bg-velvet-red/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <MapPin size={18} className="text-soft-pink" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-cream/90 font-medium text-sm">Location</p>
                                        <p className="text-cream/60 text-sm leading-relaxed">
                                            Johar Town CII, Phase 1,<br />
                                            near UMT, Lahore 📍
                                        </p>
                                    </div>
                                </div>

                                {/* Timings */}
                                <div className="flex items-start gap-3 justify-center">
                                    <div className="w-10 h-10 rounded-full bg-velvet-red/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Clock size={18} className="text-soft-pink" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-cream/90 font-medium text-sm">Timings</p>
                                        <p className="text-cream/60 text-sm">
                                            10:00 AM - 12:00 AM
                                        </p>
                                        <p className="text-gold-accent/80 text-xs mt-1">Open late for your cravings! ✨</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Our Story Column */}
                        <motion.div variants={itemVariants} className="text-center md:text-right">
                            <div
                                onClick={() => navigate('/our-story')}
                                className="inline-block cursor-pointer"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.02, y: -3 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="bg-gradient-to-br from-velvet-red/30 to-velvet-red/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10 hover:border-white/20 transition-all duration-300 text-center max-w-xs mx-auto md:ml-auto md:mr-0 group"
                                >
                                    <div className="w-14 h-14 rounded-full bg-soft-pink/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-soft-pink/30 transition-colors">
                                        <Sparkles size={24} className="text-gold-accent" />
                                    </div>
                                    <h4 className="font-serif italic text-xl md:text-2xl text-cream mb-2">Our Story</h4>
                                    <p className="text-cream/60 text-sm leading-relaxed mb-4">
                                        Two friends, one dream, and a passion for baking excellence.
                                    </p>
                                    <span className="inline-flex items-center gap-2 text-soft-pink text-sm font-semibold group-hover:gap-3 transition-all">
                                        Read More <span>→</span>
                                    </span>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
                            <p className="text-cream/40 text-xs">
                                © {new Date().getFullYear()} Mousse & Melts. All rights reserved.
                            </p>
                            <div className="flex items-center gap-2 text-cream/40 text-xs">
                                <span>Made with</span>
                                <Heart size={12} className="text-velvet-red fill-velvet-red" />
                                <span>in Lahore</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
