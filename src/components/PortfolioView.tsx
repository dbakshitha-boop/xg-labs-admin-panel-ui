import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, Variants, useSpring, useInView, useMotionValue } from 'motion/react';
import { Portfolio, FontFamily, ThemeMode, Brand } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { ArrowRight, Instagram, Linkedin, Twitter, Dribbble } from 'lucide-react';
import { cn } from '../lib/utils';

interface PortfolioViewProps {
  portfolio: Portfolio;
  activeTab?: string;
}

const getFontClass = (font: FontFamily) => {
    switch(font) {
        case 'serif': return 'font-serif';
        case 'mono': return 'font-mono tracking-tight';
        default: return 'font-sans';
    }
}

const getThemeClasses = (mode: ThemeMode) => {
    switch(mode) {
        case 'light': return {
            bg: 'bg-white',
            text: 'text-zinc-900',
            muted: 'text-zinc-500',
            border: 'border-zinc-200',
            card: 'bg-zinc-100',
            cardHover: 'hover:bg-zinc-200',
            footer: 'bg-zinc-50',
            footerText: 'text-zinc-900',
            invert: false
        };
        case 'midnight': return {
            bg: 'bg-slate-900',
            text: 'text-slate-50',
            muted: 'text-slate-400',
            border: 'border-slate-800',
            card: 'bg-slate-800/50',
            cardHover: 'hover:bg-slate-800',
            footer: 'bg-slate-950',
            footerText: 'text-slate-50',
            invert: true
        };
        default: return { // Dark
            bg: 'bg-black',
            text: 'text-white',
            muted: 'text-zinc-400',
            border: 'border-zinc-800',
            card: 'bg-zinc-900',
            cardHover: 'hover:bg-zinc-800',
            footer: 'bg-black',
            footerText: 'text-white',
            invert: true
        };
    }
}

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

const scaleOnHover = {
  scale: 1.05,
  transition: { duration: 0.3 }
};

function AnimatedNumber({ value, className }: { value: string, className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { damping: 30, stiffness: 100 });
  
  useEffect(() => {
    if (inView) {
      // Extract numeric part (handles integers and floats)
      const numericPart = value.match(/[\d.]+/);
      if (numericPart) {
        const numericValue = parseFloat(numericPart[0]);
        if (!isNaN(numericValue)) {
          motionValue.set(numericValue);
        }
      }
    }
  }, [inView, value, motionValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
         const numericPart = value.match(/[\d.]+/);
         if (numericPart) {
            const isFloat = numericPart[0].includes('.');
            const formatted = isFloat ? latest.toFixed(1) : Math.round(latest).toString();
            ref.current.textContent = value.replace(numericPart[0], formatted);
         } else {
            ref.current.textContent = value;
         }
      }
    });
  }, [springValue, value]);

  return <span ref={ref} className={className}>{value}</span>;
}

export function PortfolioView({ portfolio, activeTab = 'design' }: PortfolioViewProps) {
  const mode = portfolio.theme?.mode || 'dark';
  const headingFont = portfolio.theme?.fontHeading || 'sans';
  const bodyFont = portfolio.theme?.fontBody || 'sans';
  const accentColor = portfolio.theme?.accentColor || '#FFFFFF';

  const theme = getThemeClasses(mode);
  const fontHeading = getFontClass(headingFont);
  const fontBody = getFontClass(bodyFont);

  const containerStyles = {
    '--accent': accentColor,
  } as React.CSSProperties;

  // Visibility Logic
  const showAll = activeTab === 'design';
  const showHero = showAll || activeTab === 'hero';
  const showContext = showAll || activeTab === 'context';
  const showImages = showAll || activeTab === 'images';
  const showInfo = showAll || activeTab === 'info';
  const showProcess = showAll || activeTab === 'process';
  const showClients = showAll || activeTab === 'clients';
  const showCustom = showAll || activeTab === 'custom';
  const showImpact = showAll || activeTab === 'impact';
  const showContact = showAll || activeTab === 'contact';
  
  // Parallax Hooks
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const middleY = useTransform(scrollYProgress, [0.2, 0.5], [-30, 30]);

  return (
    <div style={containerStyles} className={cn(
        "min-h-screen transition-colors duration-300 overflow-x-hidden @container",
        theme.bg, 
        theme.text,
        fontBody
    )}>
      
      <style>{`
        .font-serif { font-family: 'Playfair Display', Georgia, serif; }
        .font-mono { font-family: 'JetBrains Mono', 'Fira Code', monospace; }
        .font-sans { font-family: 'Inter', system-ui, sans-serif; }
      `}</style>

      {/* Hero Section */}
      {showHero && (
      <section id="section-hero" className="w-full">
        <div className="w-full max-w-7xl mx-auto px-6 py-12 @lg:py-32">
          <div className="grid @lg:grid-cols-2 gap-12 items-start">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className={cn("flex items-center space-x-2 text-sm mb-6 uppercase tracking-wider font-medium", theme.muted)}>
                <span style={{ color: accentColor }}>●</span>
                <span>{portfolio.hero.subtitle}</span>
              </motion.div>
              <motion.h1 variants={fadeInUp} className={cn("text-4xl @lg:text-6xl font-medium leading-tight mb-8", fontHeading)}>
                {portfolio.hero.title}
              </motion.h1>
              <motion.p variants={fadeInUp} className={cn("mb-12 uppercase tracking-wide text-xs font-bold", theme.muted)}>
                {portfolio.hero.tags}
              </motion.p>

              <motion.div variants={staggerContainer} className="grid grid-cols-2 gap-y-8 gap-x-12">
                {portfolio.hero.stats.map((stat) => (
                  <motion.div key={stat.id} variants={fadeInUp}>
                    <div className={cn("text-3xl @lg:text-4xl font-light mb-1", fontHeading)}>
                        <AnimatedNumber value={stat.value} />
                    </div>
                    <div className={cn("text-xs uppercase tracking-wide", theme.muted)}>{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ y: heroY }}
              className="relative"
            >
              <div className={cn("aspect-[4/5] overflow-hidden", theme.card)}>
                 <motion.img 
                   whileHover={{ scale: 1.05 }}
                   transition={{ duration: 0.5 }}
                   src={portfolio.hero.image} 
                   alt="Hero" 
                   className="w-full h-full object-cover" 
                 />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      )}

      {/* Context Section */}
      {showContext && (
      <section id="section-context" className="w-full max-w-7xl mx-auto px-6 py-20">
        <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-5xl mx-auto space-y-16"
        >
          {portfolio.context.map((item) => (
             <motion.div variants={fadeInUp} key={item.id} className={cn("grid @md:grid-cols-4 gap-8 border-t pt-8", theme.border)}>
                <h3 className={cn("text-xs font-bold uppercase tracking-widest @md:col-span-1", theme.muted)}>{item.label}</h3>
                <p className={cn("@md:col-span-3 text-lg font-light leading-relaxed opacity-90")}>
                  {item.description}
                </p>
             </motion.div>
          ))}
        </motion.div>
      </section>
      )}

      {/* Middle Image Showcase - Parallax */}
      {showImages && (
      <section id="section-images" className={cn("w-full py-12 overflow-hidden", theme.card)}>
        <div className="w-full max-w-7xl mx-auto px-6 space-y-8">
          {portfolio.showcaseImages?.map((imgUrl, index) => (
            <motion.div 
                key={index}
                style={{ y: middleY }}
                initial={{ scale: 1.1 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 1.2 }}
                className="aspect-video w-full overflow-hidden shadow-2xl"
            >
                <img src={imgUrl} alt={`Showcase ${index + 1}`} className="w-full h-full object-cover" />
            </motion.div>
          ))}
        </div>
      </section>
      )}

      {/* Info Bar */}
      {showInfo && (
      <motion.section 
        id="section-info"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className={cn("w-full max-w-7xl mx-auto px-6 py-12 border-b", theme.border)}
      >
        <div className="grid grid-cols-2 @md:grid-cols-4 gap-8">
           <div>
             <h4 className={cn("text-xs font-bold uppercase tracking-widest mb-2", theme.muted)}>Role & Deliverables</h4>
             <p className="text-sm opacity-90">{portfolio.infoBar.role}</p>
           </div>
           <div>
             <h4 className={cn("text-xs font-bold uppercase tracking-widest mb-2", theme.muted)}>Timeline</h4>
             <p className="text-sm opacity-90">{portfolio.infoBar.timeline}</p>
           </div>
        </div>
      </motion.section>
      )}

      {/* Brand Direction */}
      {showImages && (
      <section id="section-brand" className="w-full max-w-7xl mx-auto px-6 py-24">
        <div className="grid @lg:grid-cols-12 gap-12">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="@lg:col-span-4"
          >
            <h3 className={cn("text-xs font-bold uppercase tracking-widest mb-6", theme.muted)}>Brand Direction</h3>
            <p className="leading-relaxed text-lg font-light opacity-90">
              {portfolio.brandDirection.description}
            </p>
          </motion.div>
          <div className="@lg:col-span-8">
            <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="grid grid-cols-1 @md:grid-cols-2 gap-4"
            >
              {portfolio.brandDirection.images.map((img, idx) => (
                <motion.div 
                    key={img.id} 
                    variants={fadeInUp}
                    whileHover={{ y: -5 }}
                    className={`bg-gray-800 overflow-hidden ${idx === 0 ? '@md:col-span-2 aspect-[2/1]' : 'aspect-square'}`}
                >
                  <motion.img 
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                    src={img.url} 
                    alt={img.alt} 
                    className="w-full h-full object-cover" 
                  />
                </motion.div>
              ))}
            </motion.div>
            <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="grid grid-cols-4 gap-4 mt-4"
            >
                 <motion.div variants={fadeInUp} className="h-24" style={{ backgroundColor: accentColor }}></motion.div>
                 <motion.div variants={fadeInUp} className="h-24 bg-[#1A1A1A]"></motion.div>
                 <motion.div variants={fadeInUp} className="h-24 bg-[#F2F2F2]"></motion.div>
                 <motion.div variants={fadeInUp} className="h-24 bg-[#0055FF]"></motion.div>
                 <div className={cn("col-span-1 text-xs mt-2", theme.muted)}>Core Colors</div>
            </motion.div>
          </div>
        </div>
      </section>
      )}

      {/* Quote */}
      {showInfo && (
      <section id="section-quote" className="w-full max-w-7xl mx-auto px-6 py-32">
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
        >
          <blockquote className={cn("text-3xl @md:text-5xl font-light leading-tight", fontHeading)}>
            "{portfolio.quote.text}"
          </blockquote>
        </motion.div>
      </section>
      )}

      {/* Process */}
      {showProcess && (
      <section id="section-process" className={cn("py-24 transition-colors", theme.card, theme.text)}>
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-16">
            <h3 className={cn("text-xs font-bold uppercase tracking-widest", theme.muted)}>Process Overview</h3>
            <p className={cn("text-sm max-w-md text-right hidden @md:block", theme.muted)}>
              We followed a structured four-step approach that aligned brand, product, and strategy.
            </p>
          </div>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid @md:grid-cols-2 @lg:grid-cols-4 gap-6"
          >
            {portfolio.process.map((step) => (
              <motion.div 
                key={step.id} 
                variants={fadeInUp}
                whileHover={{ y: -8 }}
                className={cn("p-8 transition-colors duration-300 border border-transparent", theme.cardHover)}
              >
                <div className={cn("text-xs font-bold mb-4", theme.muted)} style={{ color: accentColor }}>{step.step} {step.title}</div>
                <p className="text-sm leading-relaxed opacity-80">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      )}

      {/* Clients Section */}
      {showClients && portfolio.brands && portfolio.brands.length > 0 && (
      <section id="section-clients" className={cn("py-20 border-t", theme.border)}>
        <div className="w-full max-w-7xl mx-auto px-6">
           <motion.div 
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true }}
             variants={staggerContainer}
             className="text-center"
           >
              <h3 className={cn("text-xs font-bold uppercase tracking-widest mb-12", theme.muted)}>Featured Clients</h3>
              <div className="flex flex-wrap justify-center items-center gap-12 @md:gap-20 opacity-80">
                 {portfolio.brands.map((brand) => (
                    <motion.div 
                        key={brand.id} 
                        variants={fadeInUp}
                        whileHover={scaleOnHover}
                        className={cn("relative flex items-center justify-center", brand.isFeatured ? "h-16 w-32 @md:h-20 @md:w-40" : "h-10 w-24 @md:h-12 @md:w-32")}
                    >
                       <img src={brand.logo} alt={brand.name} className="max-w-full max-h-full object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                    </motion.div>
                 ))}
              </div>
           </motion.div>
        </div>
      </section>
      )}
      
      {/* Custom Sections */}
      {showCustom && portfolio.customSections?.map((section) => (
        <section id="section-custom" key={section.id} className={cn("w-full max-w-7xl mx-auto px-6 py-20 border-t", theme.border)}>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid @md:grid-cols-12 gap-8"
          >
             <motion.div variants={fadeInUp} className="@md:col-span-4">
               <h3 className={cn("text-xs font-bold uppercase tracking-widest mb-6", theme.muted)}>{section.title}</h3>
             </motion.div>
             <div className="@md:col-span-8">
               <div className="grid @sm:grid-cols-2 gap-8">
                 {section.items.map((item) => (
                   <motion.div variants={fadeInUp} key={item.id}>
                     <h4 className={cn("text-xs font-bold uppercase tracking-wide mb-2", theme.muted)}>{item.label}</h4>
                     <p className="text-lg font-light leading-relaxed opacity-90">
                       {/^\d/.test(item.value) ? <AnimatedNumber value={item.value} /> : item.value}
                     </p>
                   </motion.div>
                 ))}
               </div>
             </div>
          </motion.div>
        </section>
      ))}

      {/* Impact */}
      {showImpact && (
      <section id="section-impact" className={cn("w-full max-w-7xl mx-auto px-6 py-32 border-t", theme.border)}>
         <motion.div 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-16"
         >
            <h3 className={cn("text-xs font-bold uppercase tracking-widest", theme.muted)}>Overall Impact</h3>
         </motion.div>
         <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 @lg:grid-cols-4 gap-12 text-center"
         >
            {portfolio.impact.stats.map((stat) => (
              <motion.div key={stat.id} variants={fadeInUp}>
                <div className={cn("text-4xl @lg:text-6xl font-light mb-4", fontHeading)}>
                    <AnimatedNumber value={stat.value} />
                </div>
                <div className={cn("text-xs uppercase tracking-wide", theme.muted)}>{stat.label}</div>
              </motion.div>
            ))}
         </motion.div>
      </section>
      )}

      {/* Case Studies */}
      {showImpact && (
      <section id="section-case-studies" className={cn("w-full max-w-7xl mx-auto px-6 py-20 border-t", theme.border)}>
        <h3 className={cn("text-xs font-bold uppercase tracking-widest mb-12", theme.muted)}>Case Studies</h3>
        <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid @md:grid-cols-3 gap-8"
        >
          {portfolio.caseStudies.map((study) => (
            <motion.div 
                key={study.id} 
                variants={fadeInUp}
                className="group cursor-pointer"
            >
              <div className={cn("aspect-[4/3] overflow-hidden mb-4 relative", theme.card)}>
                 <motion.img 
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    src={study.image} 
                    alt={study.title} 
                    className="w-full h-full object-cover" 
                 />
              </div>
              <h4 className="text-lg font-medium leading-snug mb-2 opacity-90 transition-colors group-hover:opacity-100">{study.title}</h4>
              <p className={cn("text-xs uppercase tracking-wide flex items-center gap-2", theme.muted)}>
                {study.description} <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>
      )}

      {/* Footer Contact */}
      {showContact && (
      <section id="section-contact" className={cn("py-24", theme.invert ? "bg-white text-black" : "bg-black text-white")}>
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="grid @lg:grid-cols-2 gap-16">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
            >
              <h2 className={cn("text-4xl @md:text-5xl font-bold mb-6 tracking-tight leading-tight", fontHeading)}>
                {portfolio.contact.heading}
              </h2>
              <p className="text-lg max-w-md opacity-70">
                {portfolio.contact.subheading}
              </p>
            </motion.div>
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className={cn("p-8 @md:p-10 shadow-sm border", theme.invert ? "bg-white border-gray-100" : "bg-zinc-900 border-zinc-800")}
            >
               <form className="space-y-6">
                 <div className="grid @md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <label className="text-xs font-bold uppercase tracking-wide opacity-50">Inquiry</label>
                     <Input 
                        placeholder="[ Your Name ]" 
                        className={cn("border-0 border-b rounded-none px-0 focus-visible:ring-0 text-lg py-2", theme.invert ? "border-gray-200 focus-visible:border-black placeholder:text-gray-300" : "border-zinc-700 bg-transparent focus-visible:border-white placeholder:text-zinc-600")} 
                    />
                   </div>
                   <div className="space-y-2">
                     <label className="text-xs font-bold uppercase tracking-wide opacity-50">Company</label>
                     <Input 
                        placeholder="[ Company Name ]" 
                        className={cn("border-0 border-b rounded-none px-0 focus-visible:ring-0 text-lg py-2", theme.invert ? "border-gray-200 focus-visible:border-black placeholder:text-gray-300" : "border-zinc-700 bg-transparent focus-visible:border-white placeholder:text-zinc-600")} 
                    />
                   </div>
                 </div>
                 <div className="grid @md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <label className="text-xs font-bold uppercase tracking-wide opacity-50">Your Email</label>
                     <Input 
                        placeholder="[ Your Email ]" 
                        className={cn("border-0 border-b rounded-none px-0 focus-visible:ring-0 text-lg py-2", theme.invert ? "border-gray-200 focus-visible:border-black placeholder:text-gray-300" : "border-zinc-700 bg-transparent focus-visible:border-white placeholder:text-zinc-600")} 
                    />
                   </div>
                   <div className="space-y-2">
                     <label className="text-xs font-bold uppercase tracking-wide opacity-50">Phone</label>
                     <Input 
                        placeholder="[ Your Phone Number ]" 
                        className={cn("border-0 border-b rounded-none px-0 focus-visible:ring-0 text-lg py-2", theme.invert ? "border-gray-200 focus-visible:border-black placeholder:text-gray-300" : "border-zinc-700 bg-transparent focus-visible:border-white placeholder:text-zinc-600")} 
                    />
                   </div>
                 </div>
                 <div className="pt-4 flex justify-end">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button 
                            style={{ backgroundColor: accentColor }}
                            className={cn("rounded-none px-8 py-6 uppercase tracking-widest text-xs font-bold text-white hover:opacity-90")}
                        >
                        Submit Inquiry
                        </Button>
                    </motion.div>
                 </div>
               </form>
            </motion.div>
          </div>
        </div>
      </section>

      )}

      {/* Main Footer */}
      {showContact && (
      <footer className={cn("py-20 border-t", theme.footer, theme.footerText, theme.border)}>
         <div className="w-full max-w-7xl mx-auto px-6">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
             className="text-4xl @md:text-6xl font-black uppercase tracking-tighter mb-16 text-center leading-none opacity-90"
            >
             We're ready for our next challenge
           </motion.div>
           <div className="grid grid-cols-1 @md:grid-cols-4 gap-12 text-sm">
             <div>
               <h5 className={cn("font-bold uppercase tracking-widest text-xs mb-6", theme.muted)}>Connect With</h5>
               <p className="mb-2 text-lg">{portfolio.contact.email}</p>
               <p className="mb-2 text-lg">{portfolio.contact.phone}</p>
               <p className={theme.muted}>Chennai, India</p>
             </div>
             <div>
                <h5 className={cn("font-bold uppercase tracking-widest text-xs mb-6", theme.muted)}>Menu</h5>
                <ul className={cn("space-y-3", theme.muted)}>
                  <li>Home</li>
                  <li>Work</li>
                  <li>About</li>
                  <li>Services</li>
                  <li>Blog</li>
                </ul>
             </div>
             <div>
                <h5 className={cn("font-bold uppercase tracking-widest text-xs mb-6", theme.muted)}>Services</h5>
                <ul className={cn("space-y-3", theme.muted)}>
                  <li>Digital Native Marketing</li>
                  <li>SEO</li>
                  <li>Content & Video</li>
                  <li>Influencer Marketing</li>
                </ul>
             </div>
             <div className="flex flex-col justify-between">
                <div className="flex gap-4">
                  <Instagram className={cn("w-5 h-5 transition-colors cursor-pointer hover:text-current", theme.muted)} />
                  <Linkedin className={cn("w-5 h-5 transition-colors cursor-pointer hover:text-current", theme.muted)} />
                  <Twitter className={cn("w-5 h-5 transition-colors cursor-pointer hover:text-current", theme.muted)} />
                  <Dribbble className={cn("w-5 h-5 transition-colors cursor-pointer hover:text-current", theme.muted)} />
                </div>
                <div className={cn("text-xs mt-8 @md:mt-0 opacity-60", theme.text)}>
                  © 2025 XG Labs. All Rights Reserved.
                </div>
             </div>
           </div>
         </div>
      </footer>
      )}
    </div>
  );
}