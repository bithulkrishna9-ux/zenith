import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  ShieldCheck,
  Award,
  Sparkles,
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Clock,
  Target,
  Presentation,
  Sliders,
  Play,
  Share2,
  FileText,
  Layers,
  Download,
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneCall,
  ScreenShare,
  Radio,
  Volume2,
  Maximize2,
  ArrowRight,
  Check,
  CheckCheck,
  Flame,
  Layout,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const KeyFeaturesSection: React.FC = () => {
  const { showToast } = useApp();

  // -------------------------------------------------------------
  // Feature 1: Teammate Profiles State
  // -------------------------------------------------------------
  const teammatesData = [
    {
      id: 'priya',
      name: 'Priya Nair',
      role: 'Team Lead & Backend Architect',
      college: 'National Institute of Technology',
      year: 'Year 4 • CSE',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      matchScore: 98,
      status: 'Active Lead',
      skills: [
        { name: 'Python', level: 'Advanced' },
        { name: 'PostgreSQL', level: 'Advanced' },
        { name: 'System Design', level: 'Expert' },
      ],
      bio: 'Leading backend architecture for AI Hackathon 2026. Specializing in distributed microservices and LLM pipeline integrations.',
    },
    {
      id: 'rahul',
      name: 'Rahul Sharma',
      role: 'AI/ML & Vision Engineer',
      college: 'National Institute of Technology',
      year: 'Year 3 • CSE',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      matchScore: 95,
      status: 'Recruiting',
      skills: [
        { name: 'PyTorch', level: 'Expert' },
        { name: 'Machine Learning', level: 'Advanced' },
        { name: 'Python', level: 'Advanced' },
      ],
      bio: 'Published research on lightweight vision models. Passionate about multi-modal agents and zero-shot video classification.',
    },
    {
      id: 'anjali',
      name: 'Anjali Mehta',
      role: 'Lead UI/UX Product Designer',
      college: 'National Institute of Design',
      year: 'Year 3 • Interaction Design',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      matchScore: 92,
      status: 'Available',
      skills: [
        { name: 'Figma', level: 'Expert' },
        { name: 'Design Systems', level: 'Expert' },
        { name: 'React UI', level: 'Intermediate' },
      ],
      bio: 'Designing accessible, high-conversion mobile and web experiences for collegiate hackathons and venture-backed accelerators.',
    },
  ];

  const [selectedTeammateId, setSelectedTeammateId] = useState('priya');
  const currentTeammate = teammatesData.find((t) => t.id === selectedTeammateId) || teammatesData[0];

  // -------------------------------------------------------------
  // Feature 2: Project Analytics & Tracking State
  // -------------------------------------------------------------
  const [selectedProjectTeam, setSelectedProjectTeam] = useState<'ai' | 'web3' | 'iot'>('ai');
  const [milestones, setMilestones] = useState({
    m1: true,
    m2: true,
    m3: true,
    m4: false,
    m5: false,
  });

  const toggleMilestone = (key: keyof typeof milestones) => {
    setMilestones((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      const completedCount = Object.values(updated).filter(Boolean).length;
      showToast(
        'Sprint Telemetry Updated',
        `Milestone state updated. Project readiness: ${Math.round((completedCount / 5) * 100)}%`,
        'info'
      );
      return updated;
    });
  };

  const completedMilestoneCount = Object.values(milestones).filter(Boolean).length;
  const projectReadinessPercent = Math.round((completedMilestoneCount / 5) * 100);

  // -------------------------------------------------------------
  // Feature 3: Presentation Builder State
  // -------------------------------------------------------------
  const slides = [
    {
      id: 1,
      tag: 'Slide 1: Problem Definition',
      title: 'The Challenge in Collegiate Hackathons',
      bullets: [
        'Over 68% of student teams report missing critical technical or design skills.',
        'Solo participants struggle with unstructured communication on messaging groups.',
        'Jury demo decks lack standardized problem validation and architectural rigor.',
      ],
      theme: 'Navy Deep Accent',
      badge: 'Jury Pitch Deck',
    },
    {
      id: 2,
      tag: 'Slide 2: System Architecture',
      title: 'End-to-End Mathematical Synergy Matching',
      bullets: [
        '50% Skill Complementarity + 20% Role Balance + 15% Goal Alignment.',
        'Real-time Firestore synchronization with Firebase WebRTC low-latency audio/video.',
        'Automated skill gap coverage meters evaluating 100% of competition requirements.',
      ],
      theme: 'Royal Blue Gradient',
      badge: 'Technical Architecture',
    },
    {
      id: 3,
      tag: 'Slide 3: Live Prototype & Impact',
      title: 'Verified Results Across 45+ Campuses',
      bullets: [
        '10,000+ verified collegiate members active across top hackathons.',
        'Average team formation velocity decreased from 4.5 days to under 4 hours.',
        '98.4% team project completion and jury demo submission rate.',
      ],
      theme: 'Electric Cyan Glow',
      badge: 'Impact Metrics',
    },
  ];

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAIPolished, setIsAIPolished] = useState(false);

  const handleAIPolish = () => {
    setIsAIPolished(true);
    showToast(
      'AI Presentation Polish Applied',
      'Refined slide bullet points, punchy value propositions, and jury talking points!',
      'success'
    );
  };

  // -------------------------------------------------------------
  // Feature 4: Live Audio & Video Calls State
  // -------------------------------------------------------------
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isInCall, setIsInCall] = useState(true);

  return (
    <section className="max-w-6xl mx-auto px-4 py-8 font-uber">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass-pill text-xs font-bold text-[#1E40AF] mb-3 shadow-xs border border-blue-200">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Core Team Collaboration Suite</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-[#0B192C] tracking-tight">
          Everything Your Squad Needs <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-[#0B192C] via-[#1E40AF] to-[#2563eb] bg-clip-text text-transparent">
            To Build, Track &amp; Pitch
          </span>
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
          Integrated tools built specifically for collegiate engineering teams. From deep teammate skill dossiers to sprint milestone tracking, automated pitch decks, and live collaboration stages.
        </p>
      </div>

      {/* 4-Card Grid (2x2 on Desktop, 1x1 on Mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ======================================================== */}
        {/* FEATURE 1: Teammate Profiles */}
        {/* ======================================================== */}
        <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-slate-200/90 shadow-xl shadow-blue-950/5 relative overflow-hidden group hover:border-blue-400 transition-all duration-300">
          <div>
            {/* Header & Badges */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0B192C] to-[#1E40AF] text-white flex items-center justify-center shadow-md shadow-blue-950/20 shrink-0">
                  <UserCheck className="w-6 h-6 text-[#38bdf8]" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
                    Feature 01 • Teammate Profiles
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#0B192C]">
                    Verified Teammate Profiles
                  </h3>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                Live Dossier
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium mb-6">
              A dedicated space to showcase verified collegiate backgrounds, granular skill proficiency ratings, past hackathon awards, and availability commitments.
            </p>

            {/* Interactive Selector Tabs */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100/80 border border-slate-200/70 mb-5 overflow-x-auto">
              {teammatesData.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTeammateId(t.id)}
                  className={`flex-1 min-w-[110px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    selectedTeammateId === t.id
                      ? 'bg-[#0B192C] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-5 h-5 rounded-full object-cover shrink-0 border border-white/40"
                  />
                  <span className="truncate">{t.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            {/* Interactive Profile Card Preview */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm relative">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={currentTeammate.avatar}
                      alt={currentTeammate.name}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-white shadow-sm"
                    />
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="font-extrabold text-base text-[#0B192C]">
                        {currentTeammate.name}
                      </h4>
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-blue-700 block mt-0.5">
                      {currentTeammate.role}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      {currentTeammate.college} • {currentTeammate.year}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider text-[10px]">
                    Synergy
                  </span>
                  <span className="text-lg font-black text-blue-700">
                    {currentTeammate.matchScore}%
                  </span>
                </div>
              </div>

              {/* Bio Quote */}
              <p className="mt-3.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed italic">
                "{currentTeammate.bio}"
              </p>

              {/* Verified Skill Pills */}
              <div className="mt-3.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Verified Skills &amp; Proficiencies
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentTeammate.skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200"
                    >
                      <Award className="w-3 h-3 text-blue-600" />
                      <span>{s.name}</span>
                      <span className="text-[9px] uppercase px-1.5 py-0.2 bg-blue-200/60 rounded text-blue-900 font-bold ml-1">
                        {s.level}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Action Footer */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              Over 10,000+ verified collegiate profiles
            </span>
            <button
              onClick={() =>
                showToast(
                  'Profile Dossier Opened',
                  `Viewing full portfolio, GitHub contributions, and schedule for ${currentTeammate.name}!`,
                  'success'
                )
              }
              className="px-4 py-2 rounded-full text-xs font-bold btn-primary-blue flex items-center gap-1.5 cursor-pointer"
            >
              <span>Explore Dossier</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* FEATURE 2: Project Analytics & Tracking */}
        {/* ======================================================== */}
        <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-slate-200/90 shadow-xl shadow-blue-950/5 relative overflow-hidden group hover:border-blue-400 transition-all duration-300">
          <div>
            {/* Header & Badges */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0B192C] to-[#1E40AF] text-white flex items-center justify-center shadow-md shadow-blue-950/20 shrink-0">
                  <BarChart3 className="w-6 h-6 text-[#38bdf8]" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
                    Feature 02 • Project Analytics &amp; Tracking
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#0B192C]">
                    Project Velocity &amp; Analytics
                  </h3>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                Live Burndown
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium mb-6">
              A clear dashboard metric view showing the total number of active vs. completed deliverables, sprint velocity, and deadline readiness per team.
            </p>

            {/* Team Filter Pills */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold text-slate-500">Squad:</span>
              <button
                onClick={() => setSelectedProjectTeam('ai')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                  selectedProjectTeam === 'ai'
                    ? 'bg-[#0B192C] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                AI Innovators (AI Hackathon)
              </button>
              <button
                onClick={() => setSelectedProjectTeam('web3')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                  selectedProjectTeam === 'web3'
                    ? 'bg-[#0B192C] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                CodeStorm (Web3)
              </button>
            </div>

            {/* Metric KPI Counter Blocks */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Active Sprints
                </span>
                <span className="text-2xl font-black text-[#0B192C] mt-0.5 block">
                  {selectedProjectTeam === 'ai' ? '4 Active' : '3 Active'}
                </span>
                <span className="text-[10px] text-emerald-600 font-bold">● On Track</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Completed
                </span>
                <span className="text-2xl font-black text-blue-700 mt-0.5 block">
                  {completedMilestoneCount} / 5
                </span>
                <span className="text-[10px] text-slate-500 font-medium">Deliverables</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Jury Readiness
                </span>
                <span className="text-2xl font-black text-emerald-600 mt-0.5 block">
                  {projectReadinessPercent}%
                </span>
                <span className="text-[10px] text-emerald-600 font-bold">Ready to Demo</span>
              </div>
            </div>

            {/* Interactive Sprint Milestones Checklist */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                  Interactive Sprint Progress
                </span>
                <span className="font-extrabold text-blue-700">{projectReadinessPercent}% Done</span>
              </div>

              {/* Progress Track */}
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#0B192C] via-[#1E40AF] to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${projectReadinessPercent}%` }}
                />
              </div>

              <div className="space-y-1.5 pt-2 text-xs">
                <div
                  onClick={() => toggleMilestone('m1')}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition border border-transparent hover:border-slate-200"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={milestones.m1}
                      onChange={() => {}}
                      className="w-4 h-4 rounded text-blue-600"
                    />
                    <span className={milestones.m1 ? 'line-through text-slate-400' : 'font-semibold text-slate-800'}>
                      1. Problem Validation &amp; Architecture Spec
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Done
                  </span>
                </div>

                <div
                  onClick={() => toggleMilestone('m2')}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition border border-transparent hover:border-slate-200"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={milestones.m2}
                      onChange={() => {}}
                      className="w-4 h-4 rounded text-blue-600"
                    />
                    <span className={milestones.m2 ? 'line-through text-slate-400' : 'font-semibold text-slate-800'}>
                      2. Backend REST API &amp; Firestore Schemas
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Done
                  </span>
                </div>

                <div
                  onClick={() => toggleMilestone('m3')}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition border border-transparent hover:border-slate-200"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={milestones.m3}
                      onChange={() => {}}
                      className="w-4 h-4 rounded text-blue-600"
                    />
                    <span className={milestones.m3 ? 'line-through text-slate-400' : 'font-semibold text-slate-800'}>
                      3. Two-Way Compatibility Matching Engine
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Done
                  </span>
                </div>

                <div
                  onClick={() => toggleMilestone('m4')}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition border border-transparent hover:border-slate-200"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={milestones.m4}
                      onChange={() => {}}
                      className="w-4 h-4 rounded text-blue-600"
                    />
                    <span className={milestones.m4 ? 'line-through text-slate-400' : 'font-semibold text-slate-800'}>
                      4. Presentation Slide Deck &amp; Jury Pitch
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {milestones.m4 ? 'Done' : 'Click to Complete'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Action Footer */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              Click checkboxes above to update live team telemetry
            </span>
            <button
              onClick={() =>
                showToast(
                  'Analytics Dashboard',
                  'Exported sprint burndown telemetry to CSV and shared with team captain!',
                  'success'
                )
              }
              className="px-4 py-2 rounded-full text-xs font-bold btn-primary-blue flex items-center gap-1.5 cursor-pointer"
            >
              <span>View Full Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* FEATURE 3: Presentation Builder */}
        {/* ======================================================== */}
        <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-slate-200/90 shadow-xl shadow-blue-950/5 relative overflow-hidden group hover:border-blue-400 transition-all duration-300">
          <div>
            {/* Header & Badges */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0B192C] to-[#1E40AF] text-white flex items-center justify-center shadow-md shadow-blue-950/20 shrink-0">
                  <Presentation className="w-6 h-6 text-[#38bdf8]" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
                    Feature 03 • Presentation Builder
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#0B192C]">
                    Built-in Presentation Builder
                  </h3>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                16:9 Deck Creator
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium mb-6">
              Built-in collegiate slide deck studio designed to prepare, collaborate on, and export high-impact pitch decks directly to hackathon evaluation juries.
            </p>

            {/* Slide Index Tabs */}
            <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
              {slides.map((s, index) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlideIndex(index)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    currentSlideIndex === index
                      ? 'bg-[#0B192C] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Slide {index + 1}</span>
                </button>
              ))}
              <button
                onClick={handleAIPolish}
                className="ml-auto px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-blue-600" />
                <span>AI Polish Pitch</span>
              </button>
            </div>

            {/* Simulated 16:9 Slide Canvas Canvas Preview */}
            <div className="rounded-2xl border-2 border-slate-200/90 bg-gradient-to-br from-[#0B192C] via-[#112240] to-[#1E3E62] text-white p-5 sm:p-6 shadow-md relative overflow-hidden min-h-[220px] flex flex-col justify-between">
              {/* Background ambient flare */}
              <div className="absolute -top-12 -right-12 w-36 h-36 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

              <div>
                <div className="flex items-center justify-between text-[11px] mb-2">
                  <span className="font-bold text-[#38bdf8] uppercase tracking-wider">
                    {slides[currentSlideIndex].badge}
                  </span>
                  <span className="text-white/60 font-medium">
                    Slide {currentSlideIndex + 1} / {slides.length}
                  </span>
                </div>

                <h4 className="text-lg sm:text-xl font-black text-white leading-snug tracking-tight">
                  {slides[currentSlideIndex].title}
                </h4>

                <ul className="mt-3.5 space-y-2 text-xs text-slate-200">
                  {slides[currentSlideIndex].bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] mt-1.5 shrink-0" />
                      <span className="leading-relaxed">{bullet}</span>
                    </li>
                  ))}
                  {isAIPolished && (
                    <li className="flex items-start gap-2 text-emerald-300 font-semibold bg-emerald-950/40 p-2 rounded-xl border border-emerald-500/30 animate-in fade-in duration-300">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                      <span>✨ AI Insight: Emphasize 98.4% retention and low-latency Firebase sync for maximum jury scoring!</span>
                    </li>
                  )}
                </ul>
              </div>

              {/* Slide controls footer */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/70">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px]">Synced with 4 squad members</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentSlideIndex === 0}
                    onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 cursor-pointer text-white text-xs font-bold"
                  >
                    &larr; Prev
                  </button>
                  <button
                    disabled={currentSlideIndex === slides.length - 1}
                    onClick={() => setCurrentSlideIndex((prev) => Math.min(slides.length - 1, prev + 1))}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 cursor-pointer text-white text-xs font-bold"
                  >
                    Next &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Action Footer */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              Export format: PDF, PowerPoint (PPTX), or Web Stage
            </span>
            <button
              onClick={() =>
                showToast(
                  'Presentation Deck Exported',
                  'Generated clean PPTX and PDF slide deck package for jury evaluation!',
                  'success'
                )
              }
              className="px-4 py-2 rounded-full text-xs font-bold btn-primary-blue flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Slide Deck</span>
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* FEATURE 4: Live Audio & Video Calls */}
        {/* ======================================================== */}
        <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-slate-200/90 shadow-xl shadow-blue-950/5 relative overflow-hidden group hover:border-blue-400 transition-all duration-300">
          <div>
            {/* Header & Badges */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0B192C] to-[#1E40AF] text-white flex items-center justify-center shadow-md shadow-blue-950/20 shrink-0">
                  <Video className="w-6 h-6 text-[#38bdf8]" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
                    Feature 04 • Live Audio &amp; Video Calls
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#0B192C]">
                    Live Video &amp; Presentation Stage
                  </h3>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Stage
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium mb-6">
              Seamless integrated voice and video calling functionality for live presentation delivery, peer code reviews, and remote hackathon team standups.
            </p>

            {/* Video Conference Stage Preview Grid */}
            <div className="rounded-2xl border-2 border-slate-200/90 bg-[#0B192C] p-3 shadow-md relative overflow-hidden">
              <div className="grid grid-cols-2 gap-2.5">
                {/* Tile 1: Active Speaker (Priya) */}
                <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-800 border border-blue-500/50 shadow-inner group/tile">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80"
                    alt="Priya Speaking"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur text-white text-[10px] font-bold flex items-center gap-1">
                      <Volume2 className="w-2.5 h-2.5 text-emerald-400" />
                      <span>Priya (Team Lead)</span>
                    </span>
                  </div>
                  {/* Live audio waves indicator */}
                  <div className="absolute top-2 right-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-500/80 text-white text-[9px] font-bold">
                    <span className="w-1 h-2 bg-white animate-pulse" />
                    <span className="w-1 h-3 bg-white animate-pulse delay-75" />
                    <span className="w-1 h-1.5 bg-white animate-pulse delay-150" />
                  </div>
                </div>

                {/* Tile 2: Screen Sharing (Arjun) */}
                <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-900 border border-slate-700 shadow-inner flex flex-col justify-between p-2.5">
                  <div className="flex items-center justify-between text-[10px] text-slate-300">
                    <span className="font-mono text-emerald-400 font-bold flex items-center gap-1">
                      <ScreenShare className="w-3 h-3" /> Arjun's Screen
                    </span>
                    <span className="bg-blue-600/80 px-1.5 py-0.5 rounded text-[9px] font-bold text-white">
                      1080p 60fps
                    </span>
                  </div>
                  <div className="bg-slate-950/80 rounded-lg p-2 font-mono text-[9px] text-cyan-300 leading-snug border border-slate-800">
                    <code>
                      const match = calculateScore(user, team);
                      <br />
                      return &lt;SynergyMeter score=&#123;98&#125; /&gt;;
                    </code>
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <span>Sharing VS Code</span>
                  </div>
                </div>

                {/* Tile 3: Anjali */}
                <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-800 border border-slate-700 shadow-inner">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80"
                    alt="Anjali Mehta"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-2 left-2">
                    <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur text-white text-[10px] font-bold">
                      Anjali (UI/UX)
                    </span>
                  </div>
                </div>

                {/* Tile 4: You (Local User Camera) */}
                <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-900 border border-slate-700 shadow-inner flex items-center justify-center">
                  {isVideoOff ? (
                    <div className="text-center text-slate-400">
                      <VideoOff className="w-6 h-6 mx-auto mb-1 text-slate-500" />
                      <span className="text-[10px]">Camera Paused</span>
                    </div>
                  ) : (
                    <>
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80"
                        alt="You"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                    </>
                  )}
                  <div className="absolute bottom-2 left-2">
                    <span className="px-2 py-0.5 rounded-md bg-blue-700/80 backdrop-blur text-white text-[10px] font-bold">
                      You {isMuted && '(Muted)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Interactive Video Control Bar */}
              <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-semibold text-white">Meeting Live (00:24:18)</span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Mic Toggle */}
                  <button
                    onClick={() => {
                      setIsMuted(!isMuted);
                      showToast(
                        isMuted ? 'Microphone Unmuted' : 'Microphone Muted',
                        isMuted ? 'You are now audible to the squad.' : 'Microphone muted successfully.',
                        'info'
                      );
                    }}
                    className={`p-2 rounded-full text-xs font-bold transition cursor-pointer ${
                      isMuted ? 'bg-rose-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'
                    }`}
                    title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
                  >
                    {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  </button>

                  {/* Video Toggle */}
                  <button
                    onClick={() => {
                      setIsVideoOff(!isVideoOff);
                      showToast(
                        isVideoOff ? 'Camera Enabled' : 'Camera Disabled',
                        isVideoOff ? 'Camera feed re-enabled.' : 'Camera feed paused.',
                        'info'
                      );
                    }}
                    className={`p-2 rounded-full text-xs font-bold transition cursor-pointer ${
                      isVideoOff ? 'bg-rose-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'
                    }`}
                    title={isVideoOff ? 'Start Video' : 'Stop Video'}
                  >
                    {isVideoOff ? <VideoOff className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5" />}
                  </button>

                  {/* Screen Share Toggle */}
                  <button
                    onClick={() => {
                      setIsScreenSharing(!isScreenSharing);
                      showToast(
                        isScreenSharing ? 'Screen Share Stopped' : 'Screen Share Started',
                        isScreenSharing ? 'Stopped broadcasting window.' : 'Broadcasting your screen to room!',
                        'success'
                      );
                    }}
                    className={`p-2 rounded-full text-xs font-bold transition cursor-pointer ${
                      isScreenSharing ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'
                    }`}
                    title="Share Screen"
                  >
                    <ScreenShare className="w-3.5 h-3.5" />
                  </button>

                  {/* Call State Button */}
                  <button
                    onClick={() => {
                      setIsInCall(!isInCall);
                      showToast(
                        isInCall ? 'Left Meeting Room' : 'Rejoined Meeting Stage',
                        isInCall ? 'Disconnected from audio/video call.' : 'Connected to squad video room.',
                        'info'
                      );
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                      isInCall ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {isInCall ? 'Leave Call' : 'Rejoin'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Action Footer */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              WebRTC encrypted • 24ms ultra-low latency audio
            </span>
            <button
              onClick={() =>
                showToast(
                  'Live Room Ready',
                  'Your private team room URL has been copied to your clipboard!',
                  'success'
                )
              }
              className="px-4 py-2 rounded-full text-xs font-bold btn-primary-blue flex items-center gap-1.5 cursor-pointer"
            >
              <Radio className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>Launch Live Stage</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
