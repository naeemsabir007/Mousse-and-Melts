import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Briefcase, TrendingDown, Coffee, Lightbulb, Rocket, Sparkles, Users, Star } from 'lucide-react';
import { useStore } from '../context/StateContext';
import SEO from '../components/SEO';

const OurStory: React.FC = () => {
    const { navigate } = useStore();

    // Scroll to top when page loads
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const sections = [
        {
            id: 'beginning',
            icon: Users,
            iconBg: 'bg-soft-pink/20',
            iconColor: 'text-velvet-red',
            title: 'The Beginning',
            subtitle: 'Two Friends, One Vision',
            content: "MoussenMelts Bake Shop isn't just a business — it's a story of two friends, their dreams, and their determination. Both came from business-oriented families, but their true passion lay in education and learning.",
            decoration: '🤝'
        },
        {
            id: 'journey',
            icon: Briefcase,
            iconBg: 'bg-chocolate/10',
            iconColor: 'text-chocolate',
            title: 'The Education',
            subtitle: 'Following the Traditional Path',
            content: "After completing their bachelor's degrees, they stepped into the job market, hopeful and eager to make their mark in the world. They believed that hard work and education would open all doors.",
            decoration: '🎓'
        },
        {
            id: 'challenge',
            icon: TrendingDown,
            iconBg: 'bg-velvet-red/10',
            iconColor: 'text-velvet-red',
            title: 'The Challenge',
            subtitle: 'Reality Hits Hard',
            content: "But reality hit hard. Jobs were scarce, and even when opportunities arose, the salaries were so low they couldn't even cover basic expenses like fuel. The traditional path wasn't leading anywhere.",
            decoration: '💫'
        },
        {
            id: 'spark',
            icon: Coffee,
            iconBg: 'bg-gold-accent/20',
            iconColor: 'text-gold-accent',
            title: 'The Spark',
            subtitle: 'A Moment of Clarity',
            content: "One day, while sitting at a tea stall, they found themselves deep in thought. The aroma of chai, the buzz of conversations around them, and suddenly — a question that would change everything.",
            decoration: '☕'
        },
        {
            id: 'idea',
            icon: Lightbulb,
            iconBg: 'bg-gold-accent/30',
            iconColor: 'text-gold-accent',
            title: 'The Idea',
            subtitle: 'Why Not Us?',
            content: "Why not start something of their own? Why not build a business where they could be their own bosses, shaping their own future? That day, the seed of MoussenMelts was planted in their hearts.",
            decoration: '💡'
        },
        {
            id: 'birth',
            icon: Rocket,
            iconBg: 'bg-velvet-red/20',
            iconColor: 'text-velvet-red',
            title: 'The Birth',
            subtitle: 'MoussenMelts Is Born',
            content: "With passion in their hearts and determination in their souls, they began crafting desserts that would bring smiles to faces. Every mousse, every melt, every creation became a piece of their dream.",
            decoration: '🚀'
        },
        {
            id: 'future',
            icon: Sparkles,
            iconBg: 'bg-soft-pink/30',
            iconColor: 'text-velvet-red',
            title: 'The Future',
            subtitle: 'Just The Beginning',
            content: "This journey has become unstoppable. MoussenMelts is not just a brand — it's a testament to the power of dreams, faith, and relentless effort. And this is just the beginning.",
            decoration: '✨'
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cream via-soft-pink/10 to-cream">
            <SEO
                title="Our Story"
                description="Discover the inspiring story behind Mousse & Melts - a tale of two friends, their dreams, and a passion for baking the finest cakes and desserts in Lahore."
                keywords="Mousse and Melts story, bakery Lahore, about us, artisan bakery, Johar Town bakery"
            />
            {/* Hero Section */}
            <section className="relative pt-32 md:pt-40 pb-16 md:pb-24 overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-20 right-0 w-96 h-96 bg-soft-pink/20 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold-accent/10 rounded-full blur-[80px]" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    {/* Back Button */}
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => navigate('/')}
                        className="mb-8 inline-flex items-center gap-2 text-chocolate/60 hover:text-chocolate text-sm font-medium transition-colors group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </motion.button>

                    {/* Title */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border border-white/50 text-chocolate text-xs font-bold tracking-widest uppercase mb-6">
                            <Heart size={14} className="text-velvet-red" />
                            Our Journey
                        </div>

                        <h1 className="font-serif italic text-5xl md:text-7xl lg:text-8xl text-chocolate mb-6 leading-tight">
                            Our <span className="text-velvet-red">Story</span>
                        </h1>

                        <p className="text-chocolate/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                            A tale of friendship, dreams, and the sweetest journey of creating something truly special.
                        </p>
                    </motion.div>

                    {/* Decorative Divider */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="mt-12 md:mt-16 flex items-center justify-center gap-4"
                    >
                        <div className="h-px w-16 bg-gradient-to-r from-transparent to-chocolate/20" />
                        <Star size={16} className="text-gold-accent fill-gold-accent" />
                        <div className="h-px w-16 bg-gradient-to-l from-transparent to-chocolate/20" />
                    </motion.div>
                </div>
            </section>

            {/* Story Sections */}
            <motion.section
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="pb-20 md:pb-32"
            >
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {sections.map((section, index) => (
                            <motion.div
                                key={section.id}
                                variants={itemVariants}
                                className="relative"
                            >
                                {/* Connector Line */}
                                {index < sections.length - 1 && (
                                    <div className="absolute left-6 md:left-8 top-20 bottom-0 w-px bg-gradient-to-b from-chocolate/20 to-chocolate/5" />
                                )}

                                <div className="flex gap-4 md:gap-8 mb-12 md:mb-16">
                                    {/* Icon */}
                                    <div className="flex-shrink-0">
                                        <motion.div
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl ${section.iconBg} flex items-center justify-center shadow-lg border border-white/50 backdrop-blur-sm`}
                                        >
                                            <section.icon size={24} className={section.iconColor} />
                                        </motion.div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 pt-1">
                                        <div className="flex items-start justify-between gap-4 mb-3">
                                            <div>
                                                <p className="text-xs font-bold text-velvet-red tracking-wider uppercase mb-1">
                                                    {section.subtitle}
                                                </p>
                                                <h2 className="font-serif text-2xl md:text-3xl text-chocolate">
                                                    {section.title}
                                                </h2>
                                            </div>
                                            <span className="text-3xl md:text-4xl hidden sm:block">{section.decoration}</span>
                                        </div>

                                        <motion.div
                                            whileHover={{ x: 4 }}
                                            className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/50 shadow-lg hover:shadow-xl transition-shadow"
                                        >
                                            <p className="text-chocolate/70 leading-relaxed text-base md:text-lg">
                                                {section.content}
                                            </p>
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Closing CTA */}
            <section className="pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="container mx-auto px-4"
                >
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="bg-gradient-to-br from-chocolate to-velvet-red rounded-3xl p-8 md:p-12 text-cream relative overflow-hidden">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-4 right-4 text-6xl">🍰</div>
                                <div className="absolute bottom-4 left-4 text-6xl">🧁</div>
                            </div>

                            <div className="relative z-10">
                                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6">
                                    <Heart size={28} className="text-soft-pink fill-soft-pink" />
                                </div>

                                <h3 className="font-serif italic text-3xl md:text-4xl mb-4">
                                    Thank You for Being Part of Our Journey
                                </h3>

                                <p className="text-cream/70 mb-8 max-w-md mx-auto">
                                    Every order you place, every smile you share — you're part of our story now.
                                </p>

                                <button
                                    onClick={() => navigate('/')}
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-cream text-chocolate rounded-full font-bold hover:bg-white transition-colors shadow-lg"
                                >
                                    Explore Our Menu
                                    <span>→</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};

export default OurStory;
