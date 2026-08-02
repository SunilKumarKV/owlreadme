import React from 'react';
import {
  Layout,
  LineChart,
  BookOpen,
  Sliders,
  Cpu,
  Users,
  ShieldCheck,
  Zap,
  Code2
} from 'lucide-react';
import type {
  ProductHighlightItem,
  ProcessStepItem,
  WhyUsItem,
  FaqItem
} from '../types/landing.types';

export const PRODUCT_HIGHLIGHTS: ProductHighlightItem[] = [
  {
    icon: React.createElement(Layout, { className: "h-6 w-6 text-blue-500" }),
    title: "README Builder",
    description: "Generate structured markdown profiles configured dynamically with your biography, work experience, and custom sections."
  },
  {
    icon: React.createElement(LineChart, { className: "h-6 w-6 text-emerald-500" }),
    title: "GitHub Stats Integration",
    description: "Incorporate live-updating statistics cards, language distribution logs, and contribution streaks with zero setup."
  },
  {
    icon: React.createElement(BookOpen, { className: "h-6 w-6 text-purple-500" }),
    title: "Portfolio Builder",
    description: "Extend your profile into a structured career roadmap timeline mapping key milestones, certifications, and learning goals."
  },
  {
    icon: React.createElement(Sliders, { className: "h-6 w-6 text-amber-500" }),
    title: "Theme Customization",
    description: "Swap themes dynamically including Minimal, Dark, Gradient, and retro Terminal options for both editor and previews."
  },
  {
    icon: React.createElement(Cpu, { className: "h-6 w-6 text-rose-500" }),
    title: "AI Assistance",
    description: "Refine bios, draft technology lists, and obtain skill recommendations using client-secured AI helper prompt tools."
  },
  {
    icon: React.createElement(Users, { className: "h-6 w-6 text-indigo-500" }),
    title: "Community Templates",
    description: "Explore layouts crafted by other developers or save your custom configuration as a reusable local preset."
  }
];

export const PROCESS_STEPS: ProcessStepItem[] = [
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

export const WHY_US_ITEMS: WhyUsItem[] = [
  {
    icon: React.createElement(ShieldCheck, { className: "h-5 w-5 text-blue-500" }),
    title: "100% Client-Side",
    description: "No remote databases. Workspaces, configs, and history are cached locally in your browser storage. Safe, fast, and private."
  },
  {
    icon: React.createElement(Zap, { className: "h-5 w-5 text-indigo-500" }),
    title: "No Account Required",
    description: "Skip authentication or database logins. Open the dashboard and start building instantly with full control."
  },
  {
    icon: React.createElement(Code2, { className: "h-5 w-5 text-purple-500" }),
    title: "Developer First",
    description: "Clean layout, focus states, keyboard-friendly modals, and standard markdown exports that drop right into GitHub."
  },
  {
    icon: React.createElement(Sliders, { className: "h-5 w-5 text-emerald-500" }),
    title: "Highly Extensible",
    description: "Easily load existing markdown profiles back into the editor to sync changes or edit sections incrementally."
  }
];

export const FAQ_ITEMS: FaqItem[] = [
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
