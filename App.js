import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { 
  Brain, Zap, Target, Lightbulb, ArrowRight, Star, 
  CheckCircle2, BookOpen, Users, TrendingUp, Mail, 
  ExternalLink, Menu, X, ChevronDown, Sparkles, Layers,
  Cpu, Code2
} from "lucide-react";
import MindMapViewer from "../components/MindMapViewer";

// --- Configuration ---
const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const GUMROAD_LINK = "#"; // Replace with your link

// --- Reusable Components ---

const Badge = ({ children }) => (
  <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-400 backdrop-blur-md">
    <Sparkles className="mr-2 h-3 w-3" />
    {children}
  </div>
);

const ShinyButton = ({ children, onClick, primary = false, icon: Icon }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`group relative flex items-center justify-center gap-2 overflow-hidden rounded-full px-8 py-4 font-bold transition-all duration-300 ${
      primary 
        ? "bg-blue-600 text-white shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] hover:shadow-[0_0_60px_-15px_rgba(37,99,235,0.6)]" 
        : "bg-white/5 text-white ring-1 ring-white/10 hover:bg-white/10 backdrop-blur-md"
    }`}
  >
    <span className="relative z-10 flex items-center gap-2">
      {children}
      {Icon && <Icon className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
    </span>
    {primary && (
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-shimmer" />
    )}
  </motion.button>
);

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 hover:border-blue-500/50 transition-colors"
  >
    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-600/20 blur-3xl group-hover:bg-blue-600/40 transition-all duration-500" />
    <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform duration-300">
      <Icon className="h-6 w-6" />
    </div>
    <h3 className="mb-3 text-xl font-bold text-white">{title}</h3>
    <p className="text-zinc-400 leading-relaxed">{description}</p>
  </motion.div>
);

// --- CSS-Only 3D Book Component ---
const Book3D = () => {
  return (
    <div className="relative group cursor-pointer perspective-1000">
      <motion.div 
        animate={{ y: [0, -20, 0], rotateY: [-30, -25, -30] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative h-[500px] w-[350px] preserve-3d"
        style={{ transformStyle: 'preserve-3d', transform: 'rotateY(-30deg) rotateX(5deg)' }}
      >
        {/* Front Cover */}
        <div className="absolute inset-0 z-20 rounded-r-lg border-l border-white/20 bg-gradient-to-br from-zinc-900 to-black p-8 shadow-2xl backface-hidden"
             style={{ transform: 'translateZ(25px)' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent opacity-50" />
          <div className="relative flex h-full flex-col justify-between border border-white/10 p-6 rounded-md backdrop-blur-sm">
            <div className="space-y-4">
              <Brain className="h-16 w-16 text-blue-500" />
              <h1 className="text-5xl font-black text-white leading-none tracking-tighter">
                AI<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">POWERED</span><br/>MIND
              </h1>
            </div>
            <div className="space-y-2">
              <div className="h-1 w-full bg-blue-500/30" />
              <p className="text-sm font-mono text-zinc-400">THE ULTIMATE GUIDE TO<br/>MENTAL MODELS IN THE AI AGE</p>
            </div>
          </div>
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent rounded-r-lg pointer-events-none" />
        </div>

        {/* Spine */}
        <div className="absolute left-0 top-0 bottom-0 z-10 w-[50px] bg-zinc-900 border-x border-white/10"
             style={{ transform: 'rotateY(-90deg) translateZ(25px)' }}>
          <div className="flex h-full items-center justify-center">
            <span className="rotate-90 whitespace-nowrap text-xl font-bold text-blue-500 tracking-widest">AI POWERED MIND</span>
          </div>
        </div>

        {/* Back Cover */}
        <div className="absolute inset-0 z-0 rounded-l-lg bg-zinc-900"
             style={{ transform: 'translateZ(-25px) rotateY(180deg)' }}>
        </div>

        {/* Pages */}
        <div className="absolute right-0 top-2 bottom-2 w-[48px] bg-white transform-style-3d"
             style={{ transform: 'rotateY(90deg) translateZ(-346px)' }}>
           <div className="h-full w-full bg-[linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:4px_100%]" />
        </div>
      </motion.div>
      
      {/* Drop Shadow */}
      <div className="absolute -bottom-12 left-10 w-[80%] h-10 bg-black/60 blur-xl rounded-[100%]" />
    </div>
  );
};

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");
    setIsSubmitting(true);
    // Simulate API call for demo
    setTimeout(() => {
        toast.success("Welcome to the future of thinking!");
        setEmail("");
        setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 overflow-x-hidden">
      {/* Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-blue-600 origin-left z-[100]" style={{ scaleX }} />

      {/* Grid Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 opacity-20 blur-[100px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-white/5 bg-black/50 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 group">
            <div className="relative">
              <Brain className="w-8 h-8 text-blue-500 relative z-10" />
              <div className="absolute inset-0 bg-blue-500 blur-lg opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="font-bold text-xl tracking-tight">AI-Powered Mind</span>
          </a>
          
          <div className="hidden md:flex items-center gap-8">
            {['Chapters', 'Methodology', 'Reviews'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                {item}
              </a>
            ))}
            <button 
                onClick={() => window.open(GUMROAD_LINK, '_blank')}
                className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-zinc-200 transition-colors"
            >
              Get the Book
            </button>
          </div>

          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6 text-2xl font-bold">
              <a href="#chapters" onClick={() => setMobileMenuOpen(false)}>Chapters</a>
              <a href="#testimonials" onClick={() => setMobileMenuOpen(false)}>Testimonials</a>
              <a href={GUMROAD_LINK} className="text-blue-500">Buy Now</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Badge>v2.0 Updated for 2026</Badge>
            <h1 className="mt-6 text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-white mb-6">
              REWIRE<br />
              YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-300">MIND</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 leading-relaxed mb-8 max-w-lg">
              Don't let AI outthink you. Master <span className="text-white font-semibold">120+ mental models</span> enhanced by artificial intelligence to make better decisions, faster.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-10">
              <ShinyButton primary icon={ExternalLink} onClick={() => window.open(GUMROAD_LINK)}>
                Start Reading — $9.99
              </ShinyButton>
              <ShinyButton icon={ChevronDown} onClick={() => document.getElementById('preview').scrollIntoView({ behavior: 'smooth' })}>
                Explore Map
              </ShinyButton>
            </div>

            <div className="flex items-center gap-8 border-t border-white/10 pt-8">
              <div>
                <div className="flex -space-x-2 mb-2">
                  {[1,2,3,4].map(i => (
                    <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-8 h-8 rounded-full border-2 border-black" alt="User" />
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex text-yellow-500"><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/></div>
                  <span className="text-xs font-bold ml-2">4.9/5 Rating</span>
                </div>
              </div>
              <div className="h-10 w-px bg-white/10" />
              <div>
                <p className="text-2xl font-bold text-white">10k+</p>
                <p className="text-xs text-zinc-500 uppercase tracking-wider">Readers</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex justify-center lg:justify-end relative"
          >
             {/* Background glow behind book */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
            <Book3D />
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section id="methodology" className="py-24 bg-zinc-900/30 border-y border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 md:text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Upgrade Your <span className="text-blue-500">Operating System</span></h2>
            <p className="text-zinc-400 text-lg">Most people think in straight lines. This book teaches you to think in systems, loops, and exponential curves.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard 
              delay={0.1}
              icon={BookOpen} 
              title="120+ Mental Models" 
              description="From First Principles to Game Theory. A comprehensive encyclopedia of thinking tools." 
            />
            <div className="md:col-span-2">
              <FeatureCard 
                delay={0.2}
                icon={Cpu} 
                title="AI Integration" 
                description="Don't just learn the models. Learn prompts and workflows to apply them using ChatGPT, Claude, and Gemini. This is the bridge between cognitive science and artificial intelligence." 
              />
            </div>
            <div className="md:col-span-2">
              <FeatureCard 
                delay={0.3}
                icon={TrendingUp} 
                title="Practical Frameworks" 
                description="Stop procrastinating. Use 'The OODA Loop' and 'Eisenhower Matrix' enhanced by AI automation to get 10x more done in half the time." 
              />
            </div>
            <FeatureCard 
              delay={0.4}
              icon={Users} 
              title="30-Day Protocol" 
              description="A structured daily challenge to permanently rewire your neural pathways." 
            />
          </div>
        </div>
      </section>

      {/* Interactive Mind Map Preview */}
      <section id="preview" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
               <p className="text-blue-500 font-mono text-sm tracking-wider mb-2">INTERACTIVE PREVIEW</p>
               <h2 className="text-4xl md:text-5xl font-bold">Explore the Map</h2>
            </div>
            <p className="text-zinc-400 max-w-md text-sm md:text-right">
              This isn't just text. It's a visual database of knowledge. <br className="hidden md:block" />Interact with the connections between ideas.
            </p>
          </div>
          
          <div className="rounded-xl border border-white/10 bg-black shadow-2xl overflow-hidden relative group">
            {/* Browser Header UI */}
            <div className="h-12 border-b border-white/10 bg-zinc-900/50 flex items-center px-4 gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
              </div>
              <div className="ml-4 px-3 py-1 rounded bg-black/50 border border-white/5 text-xs text-zinc-500 font-mono flex-1 text-center">
                mindmap_viewer.exe
              </div>
            </div>
            {/* Map Container */}
            <div className="h-[600px] bg-zinc-950 relative">
               <MindMapViewer />
               {/* Overlay Gradient for depth */}
               <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
            </div>
          </div>
        </div>
      </section>

      {/* Chapters / Content */}
      <section id="chapters" className="py-24 bg-zinc-900/20">
        <div className="max-w-7xl mx-auto px-6">
           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Brain, title: "Thinking", count: "32 Models", color: "text-purple-400", bg: "bg-purple-500/10" },
                { icon: Zap, title: "Productivity", count: "39 Models", color: "text-yellow-400", bg: "bg-yellow-500/10" },
                { icon: Lightbulb, title: "Creativity", count: "34 Models", color: "text-pink-400", bg: "bg-pink-500/10" },
                { icon: Target, title: "Strategy", count: "16 Models", color: "text-emerald-400", bg: "bg-emerald-500/10" }
              ].map((cat, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -10 }}
                  className="bg-zinc-900/50 border border-white/5 p-8 rounded-2xl hover:bg-zinc-800/50 transition-all cursor-default"
                >
                   <div className={`w-14 h-14 rounded-2xl ${cat.bg} ${cat.color} flex items-center justify-center mb-6`}>
                     <cat.icon size={28} />
                   </div>
                   <h3 className="text-2xl font-bold mb-2">{cat.title}</h3>
                   <p className="text-zinc-500 text-sm font-mono">{cat.count}</p>
                </motion.div>
              ))}
           </div>
        </div>
      </section>

      {/* Testimonials Marquee */}
      <section id="reviews" className="py-32 overflow-hidden bg-black">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Join the <span className="text-blue-500">New Intellects</span></h2>
          <p className="text-zinc-400">Entrepreneurs, Developers, and Thinkers love AI-Powered Mind.</p>
        </div>
        
        <div className="relative flex w-full overflow-hidden mask-linear-gradient">
           {/* Gradient Masks */}
           <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10" />
           <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10" />
           
           <motion.div 
             className="flex gap-6 whitespace-nowrap"
             animate={{ x: [0, -1000] }}
             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
           >
              {[...Array(2)].map((_, setIndex) => (
                 <div key={setIndex} className="flex gap-6">
                    {[
                      { name: "Alex Hormozi", role: "Entrepreneur", text: "The clearest breakdown of mental models I've seen." },
                      { name: "Sarah Jenkins", role: "Product Designer", text: "The AI prompts included are worth 10x the price." },
                      { name: "David Chen", role: "Software Engineer", text: "Finally, a way to structure my chaotic thoughts." },
                      { name: "Marcus R.", role: "Founder", text: "I use the 'Second Order Thinking' prompt daily now." },
                      { name: "Elena G.", role: "Researcher", text: "Beautifully designed and incredibly practical." },
                    ].map((t, i) => (
                      <div key={i} className="w-[350px] bg-zinc-900/50 border border-white/10 p-6 rounded-xl flex-shrink-0">
                         <div className="flex gap-1 mb-3 text-blue-500">
                           {[1,2,3,4,5].map(star => <Star key={star} size={14} fill="currentColor" />)}
                         </div>
                         <p className="text-zinc-300 mb-4 whitespace-normal">"{t.text}"</p>
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center font-bold text-xs">
                              {t.name[0]}
                            </div>
                            <div>
                               <p className="font-bold text-sm">{t.name}</p>
                               <p className="text-xs text-zinc-500">{t.role}</p>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
              ))}
           </motion.div>
        </div>
      </section>

      {/* CTA Section */}
<section className="py-32 relative">
  <div className="absolute inset-0 bg-blue-900/10 radial-gradient-center" />
  <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">
        Start Thinking <br /><span className="text-blue-500">Exponentially</span>
      </h2>
      <div className="bg-zinc-900/80 backdrop-blur-md border border-white/10 p-8 rounded-3xl max-w-lg mx-auto mb-10">
         <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-left">
               <CheckCircle2 className="text-green-500" /> 
               <span>Instant PDF & ePUB Download</span>
            </div>
            <div className="flex items-center gap-3 text-left">
               <CheckCircle2 className="text-green-500" /> 
               <span>Access to Private Discord</span>
            </div>
            <div className="flex items-center gap-3 text-left">
               <CheckCircle2 className="text-green-500" /> 
               <span>Lifetime Updates (v2.0 included)</span>
            </div>
         </div>
      </div>
      
      {/* ΕΔΩ ΕΙΝΑΙ Η ΑΛΛΑΓΗ ΓΙΑ ΤΟ ΚΕΝΤΡΑΡΙΣΜΑ */}
      <div className="flex justify-center w-full">
        <ShinyButton primary icon={ArrowRight} onClick={() => window.open(GUMROAD_LINK)}>
           Get Instant Access — $9.99
        </ShinyButton>
      </div>
      
      <p className="mt-6 text-zinc-500 text-sm">30-day money-back guarantee. No questions asked.</p>
    </motion.div>
  </div>
</section>

      {/* Newsletter */}
      <section className="py-24 border-t border-white/5 bg-black">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Mail className="w-10 h-10 text-white mx-auto mb-6" />
          <h3 className="text-2xl font-bold mb-4">Weekly Brain Food</h3>
          <p className="text-zinc-400 mb-8">Join 15,000+ subscribers receiving one mental model every Sunday.</p>
          
          <form onSubmit={handleSubscribe} className="relative max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 text-white rounded-full h-14 pl-6 pr-36 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" 
            />
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="absolute right-1 top-1 h-12 rounded-full px-6 bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
            >
              {isSubmitting ? <span className="animate-pulse">...</span> : "Subscribe"}
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-black text-zinc-500 text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center text-white">
               <Brain size={14} />
            </div>
            <span className="font-bold text-white">AI-Powered Mind</span>
          </div>
          <div className="flex gap-8">
             <a href="#" className="hover:text-white transition-colors">Twitter</a>
             <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
             <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <p>© 2026. All rights reserved.</p>
        </div>
      </footer>
      
      {/* Global CSS for Animations */}
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}
