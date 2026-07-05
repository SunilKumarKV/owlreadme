"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Button,
  Card,
  Input,
  Badge,
  Container,
  Section
} from '@/components/ui';
import { GitHubIcon } from '@/components/Icons';
import { BRANDING } from '@/config/branding';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Layout,
  LineChart,
  Menu,
  X,
  CheckCircle,
  Terminal,
  Cpu,
  MousePointerClick,
  Sliders,
  Users
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  const router = useRouter();

  const handleStartBuilding = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      router.push(`/dashboard?username=${encodeURIComponent(username.trim())}`);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleMotionChange = () => setReduceMotion(mediaQuery.matches);
    mediaQuery.addEventListener?.('change', handleMotionChange);

    return () => {
      mediaQuery.removeEventListener?.('change', handleMotionChange);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || reduceMotion) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.16,
        rootMargin: '0px 0px -10% 0px'
      }
    );

    const elements = document.querySelectorAll<HTMLElement>('[data-reveal="true"]');
    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [reduceMotion]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const productHighlights = [
    {
      icon: <Layout className="h-6 w-6 text-blue-500" />,
      title: "README Builder",
      description: "Generate structured markdown profiles configured dynamically with your biography, work experience, and custom sections."
    },
    {
      icon: <LineChart className="h-6 w-6 text-emerald-500" />,
      title: "GitHub Stats integration",
      description: "Incorporate live-updating statistics cards, language distribution logs, and contribution streaks with zero setup."
    },
    {
      icon: <BookOpen className="h-6 w-6 text-purple-500" />,
      title: "Portfolio Builder",
      description: "Extend your profile into a structured career roadmap timeline mapping key milestones, certifications, and learning goals."
    },
    {
      icon: <Sliders className="h-6 w-6 text-amber-500" />,
      title: "Theme Customization",
      description: "Swap themes dynamically including Minimal, Dark, Gradient, and retro Terminal options for both editor and previews."
    },
    {
      icon: <Cpu className="h-6 w-6 text-rose-500" />,
      title: "AI Assistance",
      description: "Refine bios, draft technology lists, and obtain skill recommendations using client-secured AI helper prompt tools."
    },
    {
      icon: <Users className="h-6 w-6 text-indigo-500" />,
      title: "Community Templates",
      description: "Explore layouts crafted by other developers or save your custom configuration as a reusable local preset."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Enter Username",
      description: "Provide your GitHub username. We fetch public profile data, avatar URLs, and repository details safely via the public API."
    },
    {
      number: "02",
      title: "Customize Content",
      description: "Enable, reorder, or edit sections (About Me, Tech Stack, Projects, Socials) via drag-and-drop builder panels."
    },
    {
      number: "03",
      title: "Select Styling",
      description: "Apply style templates and color themes. Tweak alignment parameters and card configurations to fit your personal brand."
    },
    {
      number: "04",
      title: "Export Instantly",
      description: "Copy generated markdown directly or download a complete export package containing README files and configuration data."
    }
  ];

  const whyUs = [
    {
      title: "100% Client-Side",
      description: "No remote databases. Workspaces, configs, and history are cached locally in your browser storage. Safe, fast, and private."
    },
    {
      title: "No Account Required",
      description: "Skip authentication or database logins. Open the dashboard and start building instantly with full control."
    },
    {
      title: "Developer First",
      description: "Clean layout, focus states, keyboard-friendly modals, and standard markdown exports that drop right into GitHub."
    },
    {
      title: "Highly Extensible",
      description: "Easily load existing markdown profiles back into the editor to sync changes or edit sections incrementally."
    }
  ];

  const faqItems = [
    {
      question: "Is OwlREADME free to use?",
      answer: "Yes, OwlREADME is completely free and open source under the MIT License. All core builder and timeline features are accessible with no payment required."
    },
    {
      question: "Where is my configuration data stored?",
      answer: "All configuration profiles, active workspaces, and undo/redo histories are stored directly in your browser's local storage. We do not transfer or save your draft data to any database servers."
    },
    {
      question: "Can I use it without entering a GitHub username?",
      answer: "Yes! You can choose to skip onboarding and navigate straight to the dashboard to build a blank profile workspace from scratch."
    },
    {
      question: "Can I import an existing README.md file?",
      answer: "Absolutely. The import wizard lets you paste raw markdown, upload a file, or fetch a profile directly from a public GitHub repository to parse and populate the builder sections."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0c0c0e] text-black dark:text-white transition-colors duration-300 animate-fade-in-smooth">
      
      {/* Premium Header */}
      <header className={`sticky top-0 z-40 bg-white/80 dark:bg-[#0c0c0e]/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 transition-colors duration-300 ${scrolled ? 'shadow-xl shadow-slate-900/10' : ''}`}>

        <Container size="lg" className="py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="p-1 bg-gradient-to-tr from-indigo-500 to-blue-500 rounded-lg shadow-md group-hover:scale-102 transition-transform duration-200">
              <img src="/branding/owlreadme-icon.svg" className="h-6 w-6" alt="OwlREADME Icon" />
            </div>
            <span className="font-extrabold text-md tracking-tight bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              {BRANDING.name}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8 text-xs font-bold text-gray-500 dark:text-gray-400">
            <a href="#features" className="hover:text-blue-500 dark:hover:text-blue-400 transition">Features</a>
            <a href="#how-it-works" className="hover:text-blue-500 dark:hover:text-blue-400 transition">How It Works</a>
            <a href="#preview-showcase" className="hover:text-blue-500 dark:hover:text-blue-400 transition">Preview</a>
            <a href="#faq" className="hover:text-blue-500 dark:hover:text-blue-400 transition">FAQ</a>
            <Link href="/gallery" className="hover:text-blue-500 dark:hover:text-blue-400 transition">Templates</Link>
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center space-x-3">
            <Button href="/dashboard" variant="ghost" className="text-xs py-1.5 px-3">
              Dashboard
            </Button>
            <Button href="#hero-form" variant="primary" className="text-xs py-1.5 px-4 font-bold shadow-sm">
              Start Building
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded-md transition-transform duration-200 hover:scale-[1.02]"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </Container>

        {/* Mobile Navigation Drawer */}
        <div
          className={`md:hidden px-4 bg-white dark:bg-[#0c0c0e] border-b border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-300 ease-out ${mobileMenuOpen ? 'max-h-[420px] opacity-100 py-6' : 'max-h-0 opacity-0 pointer-events-none'}`}
          aria-hidden={!mobileMenuOpen}
        >
          <div className="flex flex-col space-y-4">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-xs font-bold text-gray-600 dark:text-gray-300 transition hover:text-blue-500 dark:hover:text-blue-400">Features</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-xs font-bold text-gray-600 dark:text-gray-300 transition hover:text-blue-500 dark:hover:text-blue-400">How It Works</a>
            <a href="#preview-showcase" onClick={() => setMobileMenuOpen(false)} className="text-xs font-bold text-gray-600 dark:text-gray-300 transition hover:text-blue-500 dark:hover:text-blue-400">Preview</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-xs font-bold text-gray-600 dark:text-gray-300 transition hover:text-blue-500 dark:hover:text-blue-400">FAQ</a>
            <Link href="/gallery" onClick={() => setMobileMenuOpen(false)} className="text-xs font-bold text-gray-600 dark:text-gray-300 transition hover:text-blue-500 dark:hover:text-blue-400">Templates</Link>
          </div>
          <hr className="border-gray-200 dark:border-gray-800 my-4" />
          <div className="flex flex-col gap-2">
            <Button href="/dashboard" onClick={() => setMobileMenuOpen(false)} variant="outline" className="w-full text-xs py-2">
              Open Dashboard
            </Button>
            <Button href="#hero-form" onClick={() => setMobileMenuOpen(false)} variant="primary" className="w-full text-xs py-2">
              Start Building
            </Button>
          </div>
        </div>
      </header>

      {/* Main Layout Content */}
      <main className="flex-1">

        {/* Hero Section */}
        <Section spacing="lg" data-reveal="true" className="relative overflow-hidden reveal-item opacity-0 translate-y-6">
          {/* Subtle gradient glow blobs */}
          <div className="absolute top-1/4 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl pointer-events-none animate-glow-bubble-1" style={{ left: '10%' }} />
          <div className="absolute top-1/3 w-96 h-96 rounded-full bg-purple-500/5 blur-3xl pointer-events-none animate-glow-bubble-2" style={{ right: '10%' }} />

          <Container size="lg" className="flex flex-col lg:flex-row items-center gap-12 relative z-10">

            {/* Intro details */}
            <div className="flex-1 space-y-6 text-center lg:text-left" data-reveal="true">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-full text-2xs font-bold border border-blue-200/50 dark:border-blue-900/30 transition-transform duration-300">
                <Sparkles className="h-3 w-3" />
                <span>Introducing {BRANDING.name} {BRANDING.version}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none bg-gradient-to-r from-gray-900 via-blue-950 to-purple-950 dark:from-white dark:via-blue-100 dark:to-purple-200 bg-clip-text text-transparent">
                Your GitHub Profile <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">Automated in Seconds.</span>
              </h1>

              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {BRANDING.description} Build custom layout structures, sync your repository metrics, and present your developer portfolio cleanly.
              </p>

              {/* Start Building Onboarding Form */}
              <form
                id="hero-form"
                onSubmit={handleStartBuilding}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start max-w-md mx-auto lg:mx-0 gap-3 pt-2"
                data-reveal="true"
              >
                <div className="w-full relative">
                  <label htmlFor="hero-github-username" className="sr-only">GitHub Username</label>
                  <Input
                    id="hero-github-username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter GitHub username"
                    className="h-10 text-center sm:text-left pr-4 transition duration-200"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={!username.trim()}
                  variant="primary"
                  className="w-full sm:w-auto h-10 shrink-0 px-6 font-bold transition duration-200 hover:-translate-y-0.5"
                  icon={<ArrowRight className="h-4 w-4 transition-transform duration-300" />}
                >
                  Get Started
                </Button>
              </form>

              {/* Quick checklist indicators */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-3xs font-bold text-gray-400 dark:text-gray-500 pt-2">
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5 text-green-500" /> Free & Open Source
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5 text-green-500" /> Local Browser Storage
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5 text-green-500" /> 1-Click Export Pack
                </span>
              </div>
            </div>

            {/* Premium Hero Mock Illustration */}
            <div className="flex-1 w-full max-w-lg lg:max-w-none" data-reveal="true">
              <div className="bg-[#121212] border border-gray-800 rounded-xl shadow-2xl overflow-hidden p-6 font-mono text-[10px] text-gray-400 leading-normal w-full relative reveal-item opacity-0 translate-y-6 transition-all duration-500">
                <div className="flex items-center gap-1.5 border-b border-gray-800 pb-3 mb-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  <span className="text-[9px] text-gray-600 ml-2">owlreadme-output.md</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-blue-500 font-bold"># Hi, I'm Sunil Kumar</span>
                    <span className="text-gray-600 block">&lt;!-- Full-Stack Engineer --&gt;</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-purple-500 font-semibold">## Tech Stack</span>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-gray-800 text-gray-300">⚡ React</span>
                      <span className="px-1.5 py-0.5 rounded bg-gray-800 text-gray-300">⚡ Next.js</span>
                      <span className="px-1.5 py-0.5 rounded bg-gray-800 text-gray-300">⚡ TypeScript</span>
                      <span className="px-1.5 py-0.5 rounded bg-gray-800 text-gray-300">⚡ Node.js</span>
                    </div>
                  </div>

                  <div className="border border-gray-800 rounded-lg p-3 bg-black/40 space-y-2">
                    <span className="text-green-500 font-bold flex items-center gap-1">📊 GitHub Activity Stats</span>
                    <div className="grid grid-cols-2 gap-2 text-[9px] text-gray-500">
                      <div>Total Stars: <span className="text-white font-bold">2.4k</span></div>
                      <div>Total Commits: <span className="text-white font-bold">12,504</span></div>
                      <div>Primary Lang: <span className="text-white font-bold">TypeScript</span></div>
                      <div>Rank: <span className="text-white font-bold">A++</span></div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-purple-500 font-semibold">## Featured Repositories</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 border border-gray-800 rounded bg-[#18181b]">
                        <span className="text-white font-bold block text-[9px]">owlreadme</span>
                        <span className="text-[8px] text-gray-500">Premium profile README builder tools</span>
                      </div>
                      <div className="p-2 border border-gray-800 rounded bg-[#18181b]">
                        <span className="text-white font-bold block text-[9px]">owlroadmap</span>
                        <span className="text-[8px] text-gray-500">Interactive roadmap timeline creators</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* Trusted Features Section (Stats Bar) */}
        <section className="bg-white dark:bg-[#121212] border-y border-gray-200/50 dark:border-gray-800/50 py-10 transition-colors select-none">
          <Container size="lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <span className="block text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-500">100%</span>
                <span className="text-3xs uppercase font-extrabold tracking-wider text-gray-400">Client-Side Logic</span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-500">0</span>
                <span className="text-3xs uppercase font-extrabold tracking-wider text-gray-400">Databases Needed</span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-500">1-Click</span>
                <span className="text-3xs uppercase font-extrabold tracking-wider text-gray-400">Package Export</span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-500">MIT</span>
                <span className="text-3xs uppercase font-extrabold tracking-wider text-gray-400">License Authority</span>
              </div>
            </div>
          </Container>
        </section>

        {/* Product Highlights Section */}
        <Section spacing="md" id="features">
          <Container size="lg">
            <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
              <Badge variant="info">Features</Badge>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Everything you need to build your brand</h2>
              <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">
                OwlREADME packages simple profile forms, dynamic statistics interfaces, and AI bios synthesis under a single workflow.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {productHighlights.map((item, idx) => (
                <Card key={idx} hoverable data-reveal="true" className="reveal-item opacity-0 translate-y-6 flex flex-col gap-4 text-left p-6">
                  <div className="p-2.5 bg-gray-50 dark:bg-gray-800/40 border border-gray-200/50 dark:border-gray-800 rounded-lg w-fit transition-transform duration-300">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-1.5">{item.title}</h3>
                    <p className="text-2xs text-gray-500 dark:text-gray-400 leading-relaxed">{item.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </Container>
        </Section>

        {/* How It Works Section */}
        <Section spacing="md" id="how-it-works" className="bg-gray-100/50 dark:bg-[#121212]/30 border-y border-gray-200/40 dark:border-gray-800/40">
          <Container size="lg">
            <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
              <Badge variant="warning">Process</Badge>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Build your profile page in minutes</h2>
              <p className="text-gray-500 dark:text-gray-400 text-xs">
                A simple workflow that fetches your metrics and lets you export clean markdown structures instantly.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, idx) => (
                <div key={idx} data-reveal="true" className="reveal-item opacity-0 translate-y-6 flex flex-col gap-3 relative p-4 bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-xl shadow-xs transition-all duration-500 hover:shadow-md hover:-translate-y-0.5">
                  <span className="text-xl font-black text-blue-600 dark:text-blue-500">{step.number}</span>
                  <h3 className="font-bold text-xs text-gray-900 dark:text-white pt-1">{step.title}</h3>
                  <p className="text-3xs text-gray-500 dark:text-gray-400 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        {/* Real Builder Preview Section */}
        <Section spacing="md" id="preview-showcase">
          <Container size="lg">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="flex-1 space-y-6 text-left">
                <Badge variant="success">Visual Editor</Badge>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Direct feedback with a live preview builder</h2>
                <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm leading-relaxed">
                  OwlREADME provides a complete side-by-side workspace split. Write descriptions on the left, review formatted HTML output live in the center, and edit raw markdown codes directly on the right.
                </p>
                <div className="flex items-center gap-4 text-3xs font-bold text-gray-400 pt-2">
                  <span className="flex items-center gap-1">
                    <MousePointerClick className="h-4 w-4 text-blue-500" /> Interactive controls
                  </span>
                  <span className="flex items-center gap-1">
                    <Terminal className="h-4 w-4 text-purple-500" /> Syntax-highlighted output
                  </span>
                </div>
              </div>

              {/* Realistic CSS Preview Grid of the actual split view */}
              <div className="flex-1 w-full" data-reveal="true">
                <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-lg bg-white dark:bg-[#121212] flex flex-col h-[320px] reveal-item opacity-0 translate-y-6 transition-all duration-500">
                  {/* Top Editor Bar */}
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200/80 dark:border-gray-800 bg-gray-50 dark:bg-black/10 text-3xs font-semibold text-gray-500">
                    <span className="flex items-center gap-1">✏️ OwlREADME Builder Workspace</span>
                    <span className="text-blue-500">Live Syncing Active</span>
                  </div>

                  {/* Splits */}
                  <div className="flex flex-1 overflow-hidden">
                    {/* Left: configuration panel mock */}
                    <div className="w-1/3 border-r border-gray-200 dark:border-gray-850 p-4 space-y-3 bg-gray-50/20 dark:bg-black/5 overflow-hidden">
                      <span className="text-[8px] font-bold uppercase tracking-wider text-gray-400 block">Section Manager</span>
                      <div className="h-6 bg-blue-500/10 border border-blue-500/20 rounded flex items-center px-2 text-[8px] font-semibold text-blue-600 dark:text-blue-400 select-none">
                        ✓ Header Profile
                      </div>
                      <div className="h-6 bg-blue-500/10 border border-blue-500/20 rounded flex items-center px-2 text-[8px] font-semibold text-blue-600 dark:text-blue-400 select-none">
                        ✓ Tech Stack
                      </div>
                      <div className="h-6 bg-gray-100 dark:bg-gray-800/60 rounded flex items-center px-2 text-[8px] select-none">
                        ⚙ GitHub Stats
                      </div>
                    </div>

                    {/* Right: preview panel mock */}
                    <div className="flex-1 p-4 bg-white dark:bg-[#0c0c0e] flex flex-col justify-between overflow-hidden">
                      <div className="space-y-3">
                        <span className="text-[8px] font-bold uppercase tracking-wider text-gray-400 block">Live Preview Output</span>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] text-white font-bold shadow-sm select-none">
                            SK
                          </div>
                          <div className="space-y-1">
                            <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded w-24" />
                            <div className="h-1.5 bg-gray-150 dark:bg-gray-850 rounded w-16" />
                          </div>
                        </div>
                        <div className="h-1.5 bg-gray-200 dark:bg-gray-800 rounded w-full" />
                        <div className="h-1.5 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
                      </div>

                      <div className="flex items-center justify-between text-[8px] border-t border-gray-100 dark:border-gray-850 pt-2 mt-2 text-gray-400">
                        <span>Workspace theme: minimal</span>
                        <Link href="/dashboard" className="text-blue-500 font-semibold hover:underline">Launch Editor &rarr;</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* Why OwlREADME Section */}
        <Section spacing="md" className="bg-gray-100/50 dark:bg-[#121212]/30 border-y border-gray-200/40 dark:border-gray-800/40">
          <Container size="lg">
            <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
              <Badge variant="default">Benefits</Badge>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Why developers choose OwlREADME</h2>
              <p className="text-gray-500 dark:text-gray-400 text-xs">
                Built specifically to solve profile maintenance pains cleanly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyUs.map((item, idx) => (
                <div key={idx} data-reveal="true" className="reveal-item opacity-0 translate-y-6 p-5 bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-xl space-y-2 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-lg">
                  <h3 className="font-bold text-xs text-gray-900 dark:text-white">{item.title}</h3>
                  <p className="text-3xs text-gray-500 dark:text-gray-400 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        {/* Frequently Asked Questions Section */}
        <Section spacing="md" id="faq">
          <Container size="md">
            <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
              <Badge variant="outline">FAQ</Badge>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-center">Frequently Asked Questions</h2>
              <p className="text-gray-500 dark:text-gray-400 text-xs text-center">
                Answers to common questions regarding local storage, imports, and licenses.
              </p>
            </div>

            <div className="space-y-3">
              {faqItems.map((item, idx) => {
                const isActive = activeFaq === idx;
                return (
                  <div
                    key={idx}
                    data-reveal="true"
                    className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden transition-all duration-300"
                  >
                    <button
                      onClick={() => setActiveFaq(isActive ? null : idx)}
                      className="w-full px-5 py-4 text-left font-bold text-xs flex justify-between items-center text-gray-900 dark:text-white select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-[#0c0c0e] focus:bg-gray-50/50 dark:focus:bg-gray-800/10"
                      aria-expanded={isActive}
                      aria-controls={`faq-answer-${idx}`}
                    >
                      <span>{item.question}</span>
                      <span className={`text-blue-500 font-extrabold transition-transform duration-300 ${isActive ? 'rotate-45' : ''}`}>
                        +
                      </span>
                    </button>
                    <div
                      id={`faq-answer-${idx}`}
                      className="overflow-hidden transition-[max-height,opacity,transform] duration-300 ease-out"
                      style={{
                        maxHeight: isActive ? '360px' : '0',
                        opacity: isActive ? 1 : 0,
                        transform: isActive ? 'translateY(0)' : 'translateY(-6px)'
                      }}
                    >
                      <div className="px-5 pb-5 pt-1 text-3xs text-gray-500 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-850">
                        {item.answer}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Container>
        </Section>

        {/* Final Call-to-Action Section */}
        <Section spacing="lg" className="relative overflow-hidden">
          <Container size="md" className="text-center" data-reveal="true">
            <Card className="p-8 sm:p-12 bg-gradient-to-tr from-indigo-950/20 via-purple-950/20 to-blue-950/20 border-indigo-500/20 flex flex-col items-center gap-6 relative overflow-hidden reveal-item opacity-0 translate-y-6 transition-all duration-500">
              {/* background bubbles */}
              <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-blue-500/5 blur-2xl pointer-events-none animate-glow-bubble-3" />
              <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-purple-500/5 blur-2xl pointer-events-none" />

              <Badge variant="info">Get Started</Badge>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Build your profile portfolio today
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                Connect your username or open a blank workspace. Download your clean markdown structures instantly.
              </p>

              {/* Action trigger */}
              <form onSubmit={handleStartBuilding} className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-sm pt-2">
                <label htmlFor="cta-github-username" className="sr-only">GitHub Username</label>
                <Input
                  id="cta-github-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter GitHub username"
                  className="h-10 text-center sm:text-left bg-black/30 border-gray-800 text-white"
                />
                <Button type="submit" disabled={!username.trim()} variant="primary" className="h-10 w-full sm:w-auto px-6 font-bold shadow-md shadow-blue-500/10">
                  Build Now
                </Button>
              </form>
            </Card>
          </Container>
        </Section>

      </main>

      {/* Footer Section */}
      <footer className="bg-white dark:bg-[#0c0c0e] border-t border-gray-200/50 dark:border-gray-800/50 py-12 px-4 transition-colors">
        <Container size="lg" className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2.5 text-gray-500 dark:text-gray-400 select-none">
            <div className="p-1.5 bg-gradient-to-tr from-indigo-500 to-blue-500 rounded-lg shadow-sm">
              <img src="/branding/owlreadme-icon.svg" className="h-5 w-5" alt="OwlREADME Icon" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-black dark:text-white block">{BRANDING.name}</span>
              <span className="text-[10px] block mt-0.5">© 2026. Licensed under MIT. Version {BRANDING.version}</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-3xs font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            <a
              href={BRANDING.socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 dark:hover:text-blue-400 transition flex items-center gap-1.5"
            >
              <GitHubIcon className="h-4.5 w-4.5" /> Repository
            </a>
            <a
              href={BRANDING.documentationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 dark:hover:text-blue-400 transition"
            >
              Documentation
            </a>
            <a
              href={`mailto:${BRANDING.supportEmail}`}
              className="hover:text-blue-500 dark:hover:text-blue-400 transition"
            >
              Contact Support
            </a>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default LandingPage;
