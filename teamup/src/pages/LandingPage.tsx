import React, { useState } from 'react';
import {
  Sparkles,
  Users,
  Search,
  MapPin,
  Tag,
  ArrowRight,
  Shield,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  Cpu,
  Trophy,
  Zap,
  Star,
  ExternalLink,
  Code2,
  Flame,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { KeyFeaturesSection } from '../components/landing/KeyFeaturesSection';

interface LandingPageProps {
  onNavigate: (tab: string) => void;
  onOpenCreateTeam: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onOpenCreateTeam }) => {
  const { students, teams, events, setSelectedEventFilter } = useApp();

  const [searchRole, setSearchRole] = useState('');
  const [searchEvent, setSearchEvent] = useState('');
  const [searchSkill, setSearchSkill] = useState('');
  const [searchSize, setSearchSize] = useState('');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchEvent) {
      setSelectedEventFilter(searchEvent);
    }
    onNavigate('find-teams');
  };

  return (
    <div className="min-h-screen text-slate-900 space-y-20 pb-24">
      {/* Hero Section — White and Dark Blue Theme */}
      <section className="relative pt-10 sm:pt-14 px-4 max-w-6xl mx-auto text-center">
        {/* Rating Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass-pill text-xs font-semibold text-slate-700 mb-6 shadow-sm border border-slate-200/90">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span className="font-bold text-[#0B192C]">4.9 / 5.0</span>
          <span className="text-slate-500 font-normal">Average squad compatibility index</span>
        </div>

        {/* Massive Headline */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-[#0B192C] tracking-tight leading-[1.06] max-w-4xl mx-auto">
          Find Your Team.<br />
          <span className="bg-gradient-to-r from-[#0B192C] via-[#1E40AF] to-[#2563eb] bg-clip-text text-transparent">
            Build The Future.
          </span>
        </h1>

        {/* Subheading */}
        <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
          The premier college-exclusive collaboration platform. Pair with verified peers by complementary skills, project roles, and hackathon ambitions through mathematical two-way matching.
        </p>

        {/* Floating Multi-Segment Liquid Glass Search Bar */}
        <div className="mt-10 max-w-4xl mx-auto">
          <form
            onSubmit={handleHeroSearch}
            className="liquid-search-bar rounded-3xl p-3 sm:p-3.5 flex flex-col md:flex-row items-center gap-3 text-left transition-all border border-slate-200/90 shadow-xl"
          >
            {/* 1. Looking for */}
            <div className="flex-1 w-full px-3 py-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Looking for
              </label>
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-blue-600 shrink-0" />
                <input
                  type="text"
                  value={searchRole}
                  onChange={(e) => setSearchRole(e.target.value)}
                  placeholder="Enter Role or Skill (e.g. React, ML)"
                  className="w-full text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
                />
              </div>
            </div>

            <div className="hidden md:block w-px h-10 bg-slate-200" />

            {/* 2. Locations / Hackathon */}
            <div className="flex-1 w-full px-3 py-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Hackathon / Event
              </label>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                <select
                  value={searchEvent}
                  onChange={(e) => setSearchEvent(e.target.value)}
                  className="w-full text-xs sm:text-sm font-semibold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="">All Competitions</option>
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="hidden md:block w-px h-10 bg-slate-200" />

            {/* 3. Pricing / Skill */}
            <div className="flex-1 w-full px-3 py-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Primary Skill
              </label>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-blue-600 shrink-0" />
                <select
                  value={searchSkill}
                  onChange={(e) => setSearchSkill(e.target.value)}
                  className="w-full text-xs sm:text-sm font-semibold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="">Any Skill</option>
                  <option value="Python">Python</option>
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="React">React</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Firebase">Firebase</option>
                  <option value="Solidity">Solidity</option>
                </select>
              </div>
            </div>

            <div className="hidden md:block w-px h-10 bg-slate-200" />

            {/* 4. Number of Rooms / Team Size */}
            <div className="flex-1 w-full px-3 py-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Team Size
              </label>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600 shrink-0" />
                <select
                  value={searchSize}
                  onChange={(e) => setSearchSize(e.target.value)}
                  className="w-full text-xs sm:text-sm font-semibold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="">Any Size</option>
                  <option value="2">Duo (2 Members)</option>
                  <option value="3">3 Members</option>
                  <option value="4">4 Members</option>
                  <option value="5">5 Members</option>
                </select>
              </div>
            </div>

            {/* 5. Dark Blue & Royal Blue Search Button */}
            <button
              type="submit"
              className="w-full md:w-auto px-7 py-3.5 rounded-2xl font-bold text-sm btn-primary-blue shrink-0"
            >
              Search Squads
            </button>
          </form>
        </div>

        {/* Hero Collaboration Showcase Image in White & Dark Blue Ambient Atmosphere */}
        <div className="mt-8 relative max-w-5xl mx-auto group">
          {/* Ambient Glows in Deep Navy & Royal Blue */}
          <div className="absolute -inset-3 bg-gradient-to-r from-blue-700/20 via-sky-400/20 to-[#0B192C]/30 rounded-[2.5rem] blur-2xl -z-10 opacity-70 group-hover:opacity-95 transition duration-700" />

          {/* Main Showcase Container */}
          <div className="relative w-full h-[400px] sm:h-[480px] md:h-[540px] rounded-3xl sm:rounded-[2rem] overflow-hidden border border-slate-200/90 shadow-2xl shadow-blue-950/20 bg-[#0B192C]">
            {/* The Hero Image */}
            <img
              src="/hero-hackathon.jpg"
              alt="College Hackathon Team Collaboration"
              className="w-full h-full object-cover object-center filter contrast-[1.08] saturate-[1.1] brightness-[1.02] transform transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />

            {/* Aesthetic Dark Blue Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C]/90 via-transparent to-[#0B192C]/40 pointer-events-none" />
            <div className="absolute inset-0 bg-radial from-transparent via-transparent to-[#0B192C]/50 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-950/30 via-transparent to-sky-600/10 mix-blend-screen pointer-events-none" />

            {/* Progressive Lens Vignette Blur */}
            <div
              className="absolute inset-0 pointer-events-none rounded-3xl sm:rounded-[2rem] backdrop-blur-[10px]"
              style={{
                WebkitMaskImage: 'radial-gradient(ellipse 65% 65% at 50% 50%, transparent 40%, black 100%)',
                maskImage: 'radial-gradient(ellipse 65% 65% at 50% 50%, transparent 40%, black 100%)',
              }}
            />

            {/* Corner Frosted Glass Vignettes */}
            <div className="absolute top-0 left-0 w-36 h-36 bg-gradient-to-br from-white/20 via-white/5 to-transparent rounded-br-[3.5rem] pointer-events-none backdrop-blur-sm" />
            <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-white/20 via-white/5 to-transparent rounded-bl-[3.5rem] pointer-events-none backdrop-blur-sm" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-gradient-to-tr from-white/20 via-white/5 to-transparent rounded-tr-[3.5rem] pointer-events-none backdrop-blur-sm" />
            <div className="absolute bottom-0 right-0 w-36 h-36 bg-gradient-to-tl from-white/20 via-white/5 to-transparent rounded-tl-[3.5rem] pointer-events-none backdrop-blur-sm" />

            {/* Floating Liquid-Glass Interactive Badges */}
            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 liquid-glass-pill px-3.5 py-2 rounded-full flex items-center gap-2 shadow-lg backdrop-blur-xl border border-white/90">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-[#0B192C]">
                Live Squad Formation
              </span>
              <span className="text-[10px] text-blue-700 font-extrabold bg-blue-100/90 px-2 py-0.5 rounded-full">
                98% Skill Match
              </span>
            </div>

            <div className="absolute top-4 sm:top-6 right-4 sm:right-6 liquid-glass-pill px-3.5 py-2 rounded-full hidden sm:flex items-center gap-2 shadow-lg backdrop-blur-xl border border-white/90">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-xs font-bold text-[#0B192C]">
                4 Teammates Synced
              </span>
            </div>

            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 liquid-glass p-3 sm:p-3.5 rounded-2xl hidden md:flex items-center gap-3 shadow-xl backdrop-blur-xl border border-white/90 max-w-xs">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0B192C] to-[#1E40AF] text-white flex items-center justify-center font-bold shadow-md shadow-blue-950/30 shrink-0">
                <Sparkles className="w-5 h-5 text-[#38bdf8]" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#0B192C] block">
                  Hackathon Ready Synergy
                </span>
                <span className="text-[11px] text-slate-500 font-medium block">
                  AI Innovators • 36h Code Sprint
                </span>
              </div>
            </div>

            <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 liquid-glass-pill px-4 py-2 rounded-full flex items-center gap-2 shadow-xl backdrop-blur-xl border border-white/90">
              <Shield className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-xs font-bold text-[#0B192C]">
                Verified College Ecosystem
              </span>
            </div>
          </div>
        </div>

        {/* Bottom 4-Column Stats Bar */}
        <div className="mt-6 max-w-5xl mx-auto liquid-glass rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/90">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80">
            {/* Stat 1 */}
            <div className="p-4 text-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#0B192C] block">
                10,000+
              </span>
              <span className="text-xs sm:text-sm text-slate-500 font-medium mt-1 block">
                Students Listed
              </span>
            </div>

            {/* Stat 2 */}
            <div className="p-4 text-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#0B192C] block">
                5,000+
              </span>
              <span className="text-xs sm:text-sm text-slate-500 font-medium mt-1 block">
                Happy Teammates
              </span>
            </div>

            {/* Stat 3 */}
            <div className="p-4 text-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#0B192C] block">
                2,000+
              </span>
              <span className="text-xs sm:text-sm text-slate-500 font-medium mt-1 block">
                Squads Formed
              </span>
            </div>

            {/* Stat 4 */}
            <div className="p-4 text-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#0B192C] block">
                120+
              </span>
              <span className="text-xs sm:text-sm text-slate-500 font-medium mt-1 block">
                Hackathons Covered
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Team Collaboration Tools: 4 Key Features Section */}
      <KeyFeaturesSection />

      {/* Campus Innovation & Live Collaboration Image Showcase Section */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1E40AF] inline-flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-blue-600" />
            Campus Life & Collaboration
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B192C] mt-2">
            Where Modern Collegiate Teams Build Together
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium">
            Step inside our partner university innovation incubators, maker pods, and peer design sprint rooms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Campus Innovation Hub */}
          <div className="liquid-glass-card rounded-3xl overflow-hidden p-3 border border-slate-200/90 group">
            <div className="h-64 sm:h-72 rounded-2xl overflow-hidden relative">
              <img
                src="/campus-hub.jpg"
                alt="Modern Campus Innovation Hub"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C]/90 via-[#0B192C]/30 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#0B192C]/80 text-white backdrop-blur border border-white/20 uppercase tracking-wider">
                  Campus Maker Pods
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-xl font-bold text-white leading-snug">
                  High-Tech University Innovation Atrium
                </h3>
                <p className="text-xs text-slate-200 mt-1 line-clamp-2">
                  Glass-enclosed sprint pods equipped with smart whiteboards, AI testbeds, and high-speed hardware test equipment.
                </p>
              </div>
            </div>
            <div className="p-4 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Available across 45+ partner colleges</span>
              <button
                onClick={() => onNavigate('events')}
                className="text-xs font-bold text-[#1E40AF] hover:text-[#0B192C] flex items-center gap-1"
              >
                Explore Hackathons &rarr;
              </button>
            </div>
          </div>

          {/* Card 2: Student Squad Meeting */}
          <div className="liquid-glass-card rounded-3xl overflow-hidden p-3 border border-slate-200/90 group">
            <div className="h-64 sm:h-72 rounded-2xl overflow-hidden relative">
              <img
                src="/student-squad.jpg"
                alt="Student Squad Wireframing Sprint"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C]/90 via-[#0B192C]/30 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-blue-900/80 text-white backdrop-blur border border-white/20 uppercase tracking-wider">
                  Collaborative Design Sprints
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-xl font-bold text-white leading-snug">
                  UI Flow &amp; Technical Architecture Sprints
                </h3>
                <p className="text-xs text-slate-200 mt-1 line-clamp-2">
                  Engineers and product designers reviewing Figma wireframes and backend data schemas before building hackathon prototypes.
                </p>
              </div>
            </div>
            <div className="p-4 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">100% Verified Peer Collaboration</span>
              <button
                onClick={() => onNavigate('find-teammates')}
                className="text-xs font-bold text-[#1E40AF] hover:text-[#0B192C] flex items-center gap-1"
              >
                Find Teammates &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Two-Way Smart Skill Matching Live Engine Preview */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="p-8 sm:p-10 rounded-3xl liquid-glass border border-slate-200/90 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1E40AF] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                Two-Way Matching Architecture
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B192C] mt-1">
                How Our Algorithm Pairs You
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 self-start md:self-auto">
              Live Mathematical Scoring
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {/* Student Candidate Node */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Student Profile
                </span>
                <div className="flex items-center gap-3 mt-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                      className="w-full h-full object-cover"
                      alt="Rahul"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0B192C] text-sm">Rahul Sharma</h4>
                    <span className="text-xs text-blue-600 font-semibold">AI/ML Developer</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-4">
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 font-semibold border border-blue-100">
                    Python (Adv)
                  </span>
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 font-semibold border border-blue-100">
                    Machine Learning
                  </span>
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold">
                    React
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                Verified NIT Student • Year 3
              </div>
            </div>

            {/* Smart Matching Engine Central Hub */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50/90 via-white to-sky-50/60 border border-blue-200 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0B192C] to-[#1E40AF] text-white flex items-center justify-center mb-2 shadow-md shadow-blue-950/20">
                <Cpu className="w-7 h-7 text-[#38bdf8]" />
              </div>
              <div className="text-4xl font-extrabold text-[#0B192C]">95% Match</div>
              <p className="text-xs text-slate-600 mt-1 max-w-[200px] leading-relaxed font-medium">
                Skill 48/50 • Role 18/20 • Full Weekend Alignment
              </p>
              <div className="mt-4 text-[10px] uppercase font-bold text-blue-800 bg-blue-100/80 px-3.5 py-1 rounded-full border border-blue-300">
                Optimal Squad Fit
              </div>
            </div>

            {/* Team Requirements Node */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Team Requirements
                </span>
                <div className="flex items-center gap-3 mt-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#0B192C] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                    AI
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0B192C] text-sm">AI Innovators</h4>
                    <span className="text-xs text-blue-600 font-semibold">AI Hackathon 2026</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-4">
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                    Python (Req)
                  </span>
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                    ML (Req)
                  </span>
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200">
                    UI/UX (Gap)
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                3 / 5 Members • Actively Recruiting
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem vs Solution (White & Dark Blue Cards) */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl liquid-glass border border-slate-200/90 shadow-md">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-[#0B192C] mb-2">The Solo Student's Dilemma</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-5 font-medium">
              Students want to build ambitious projects or compete in hackathons, but struggle to find peers with complementary skills on unstructured chat groups.
            </p>
            <div className="space-y-2.5 text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-2">
                <span className="text-rose-500 font-bold">✕</span> Mismatched skills lead to project burnout and dropped submissions
              </div>
              <div className="flex items-center gap-2">
                <span className="text-rose-500 font-bold">✕</span> Missing critical skills (like ML or UX) discovered mid-hackathon
              </div>
              <div className="flex items-center gap-2">
                <span className="text-rose-500 font-bold">✕</span> Popularity bias hides high-capability junior developers
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl liquid-glass border border-blue-200 shadow-md bg-gradient-to-br from-white via-blue-50/50 to-white">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#1E40AF] flex items-center justify-center mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-[#0B192C] mb-2">The TeamUp Two-Way Solution</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-5 font-medium">
              A college-exclusive matching platform that pairs students to teams using transparent mathematical weighting, skill gap coverage meters, and verified student IDs.
            </p>
            <div className="space-y-2.5 text-xs text-slate-700 font-medium">
              <div className="flex items-center gap-2">
                <span className="text-blue-700 font-bold">✓</span> 50% Skill + 20% Role + 15% Interest + 10% Exp + 5% Availability
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-700 font-bold">✓</span> Automated Team Skill Gap Coverage Bar (0-100%)
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-700 font-bold">✓</span> Transparent "Why this match?" score breakdowns for every recommendation
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Upcoming Hackathons with Local High-Resolution Banners */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#1E40AF]">
              Competitions
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B192C] mt-1">
              Upcoming College Hackathons
            </h2>
          </div>
          <button
            onClick={() => onNavigate('events')}
            className="text-xs font-bold text-[#1E40AF] hover:text-[#0B192C] flex items-center gap-1"
          >
            View All ({events.length}) &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.slice(0, 3).map((event) => (
            <div
              key={event.id}
              className="liquid-glass-card rounded-3xl overflow-hidden flex flex-col justify-between border border-slate-200/90 hover:border-blue-400 group"
            >
              <div className="h-48 relative overflow-hidden bg-[#0B192C]">
                <img
                  src={event.bannerUrl}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C]/90 via-transparent to-transparent" />
                <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold bg-white/95 text-[#0B192C] backdrop-blur shadow-sm uppercase tracking-wider">
                  {event.mode}
                </span>
                <span className="absolute bottom-3 left-4 text-xs font-bold text-white bg-[#0B192C]/90 px-3 py-1 rounded-xl backdrop-blur border border-white/20">
                  {event.prizePool}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg text-[#0B192C]">{event.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 font-medium">{event.tagline}</p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {event.requiredSkills.map((sk, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 font-semibold border border-blue-100/60"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">
                    Deadline: <strong className="text-slate-800">{event.registrationDeadline}</strong>
                  </span>
                  <button
                    onClick={() => {
                      setSelectedEventFilter(event.id);
                      onNavigate('find-teams');
                    }}
                    className="px-4 py-2 rounded-full text-xs font-bold btn-primary-blue"
                  >
                    Find Squad &rarr;
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

