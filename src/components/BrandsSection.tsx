import React from 'react';
import { motion, Variants } from 'motion/react';
import { Brand } from '../types';
import { cn } from '../lib/utils';
import { ExternalLink } from 'lucide-react';

// Animation Variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

interface BrandsSectionProps {
  brands: Brand[];
  theme?: {
      mode: 'dark' | 'light' | 'midnight';
      border: string;
      muted: string;
      invert: boolean;
  };
}

export function BrandsSection({ brands, theme = { mode: 'dark', border: 'border-white/10', muted: 'text-zinc-400', invert: true } }: BrandsSectionProps) {
  // Split brands
  const featuredBrands = brands.filter(b => b.isFeatured);
  const standardBrands = brands.filter(b => !b.isFeatured);
  
  // Marquee logic: if we have enough standard brands, we marquee them. Otherwise grid.
  const useMarquee = standardBrands.length > 5;
  
  // If marquee, we need to double the list for the seamless loop
  const marqueeList = useMarquee ? [...standardBrands, ...standardBrands, ...standardBrands] : standardBrands;

  return (
    <section id="section-brands" className={cn("w-full py-24 border-b relative overflow-hidden", theme.border)}>
        {/* Ambient Background Glow for Dark Mode */}
        {theme.mode !== 'light' && (
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px]" />
            </div>
        )}

        <div className="w-full max-w-7xl mx-auto px-6 relative z-10">
            <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="space-y-16"
            >
                 <motion.div variants={fadeInUp} className="text-center">
                    <h2 className={cn("text-sm font-bold uppercase tracking-[0.2em] mb-3 opacity-60", theme.muted)}>
                        Trusted By Market Leaders
                    </h2>
                 </motion.div>

                 {/* Featured Brands - Center Highlight */}
                 {featuredBrands.length > 0 && (
                     <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 px-4">
                        {featuredBrands.map((brand) => (
                            <BrandItem 
                                key={brand.id} 
                                brand={brand} 
                                theme={theme} 
                                className="w-40 md:w-56 h-16 md:h-20"
                                priority
                            />
                        ))}
                     </div>
                 )}

                 {/* Standard Brands */}
                 {standardBrands.length > 0 && (
                    <div className="relative pt-8">
                        {useMarquee ? (
                            <div className="flex overflow-hidden w-full [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
                                <motion.div 
                                    className="flex gap-16 md:gap-24 items-center pr-16"
                                    animate={{ x: ["0%", "-33.33%"] }}
                                    transition={{ 
                                        repeat: Infinity, 
                                        ease: "linear", 
                                        duration: standardBrands.length * 4 // Adjust speed based on count
                                    }}
                                >
                                    {marqueeList.map((brand, idx) => (
                                        <BrandItem 
                                            key={`${brand.id}-${idx}`} 
                                            brand={brand} 
                                            theme={theme} 
                                            className="w-28 md:w-32 h-10 opacity-60 hover:opacity-100 transition-opacity"
                                        />
                                    ))}
                                </motion.div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 md:gap-16 items-center justify-items-center opacity-70">
                                {standardBrands.map((brand) => (
                                    <BrandItem 
                                        key={brand.id} 
                                        brand={brand} 
                                        theme={theme}
                                        className="w-32 h-12"
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                 )}
            </motion.div>
        </div>
      </section>
  );
}

function BrandItem({ brand, theme, className, priority = false }: { brand: Brand, theme: any, className?: string, priority?: boolean }) {
    const Content = (
        <div className={cn("relative group flex items-center justify-center", className)}>
             <img 
                src={brand.logo} 
                alt={brand.name}
                title={brand.name}
                className={cn(
                    "w-full h-full object-contain transition-all duration-500", 
                    theme.invert 
                        ? "brightness-0 invert opacity-70 group-hover:opacity-100 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" 
                        : "grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100",
                    priority && "opacity-90"
                )} 
            />
            {brand.website && (
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <span className={cn("text-[10px] whitespace-nowrap flex items-center gap-1", theme.muted)}>
                        Visit <ExternalLink className="w-2 h-2" />
                    </span>
                </div>
            )}
        </div>
    );

    if (brand.website) {
        return (
            <a 
                href={brand.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-lg"
            >
                {Content}
            </a>
        );
    }

    return Content;
}
