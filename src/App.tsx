import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, 
  Briefcase, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Lightbulb, 
  ChevronLeft,
  Copy,
  Target,
  BarChart3,
  Search,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface AnalysisResult {
  matchScore: number;
  scoreTitle: string;
  scoreDescription: string;
  resumeRating: number;
  resumeRatingLabel: string;
  resumeRatingJustification: string;
  matchedSkills: string[];
  missingSkills: string[];
  sectionScores: Record<string, number>;
  roleImprovements: {
    priority: 'high' | 'medium' | 'low';
    category: string;
    title: string;
    detail: string;
    impact: string;
  }[];
  suggestions: {
    type: 'critical' | 'warn' | 'tip' | 'action';
    title: string;
    body: string;
  }[];
  atsScore: number;
  atsChecks: {
    label: string;
    passed: boolean;
    note: string;
  }[];
  resumeKeywords: { word: string; weight: number }[];
  jdKeywords: { word: string; weight: number }[];
}

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SAMPLE_JD = `Software Engineer – Full Stack (Mid-Level)

We are looking for a skilled Full Stack Software Engineer to join our growing team.

Key Responsibilities:
• Design and develop scalable web applications using React.js and Node.js
• Build and maintain RESTful APIs and microservices
• Work with PostgreSQL and MongoDB databases
• Implement CI/CD pipelines using GitHub Actions or Jenkins
• Collaborate with cross-functional teams using Agile/Scrum methodology
• Write unit tests and integration tests (Jest, Pytest)
• Participate in code reviews and technical discussions

Required Skills:
• 3+ years of experience in full-stack development
• Strong proficiency in JavaScript/TypeScript, Python
• Experience with React, Next.js, Node.js, Express
• Database experience: PostgreSQL, MongoDB, Redis
• Cloud platforms: AWS, GCP, or Azure
• Docker and Kubernetes experience
• Version control with Git
• Understanding of data structures and algorithms

Nice to Have:
• Experience with GraphQL
• Machine learning or AI/ML integration
• DevOps experience
• Open source contributions
• Bachelor's degree in Computer Science or equivalent`;

export default function App() {
  const [resumeMode, setResumeMode] = useState<'upload' | 'paste'>('upload');
  const [resumeText, setResumeText] = useState('');
  const [jdText, setJdText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'improvements' | 'skills' | 'suggestions' | 'ats' | 'keywords'>('improvements');
  const [statusStep, setStatusStep] = useState(0);

  const statusSteps = [
    "Reading resume content",
    "Parsing job requirements",
    "Calculating match score",
    "Rating resume quality",
    "Generating role-specific improvements",
    "Compiling full report"
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setResumeText(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const startAnalysis = async () => {
    if (!resumeText || !jdText) return;
    setIsLoading(true);
    setStatusStep(0);
    
    // Simulate status steps
    const interval = setInterval(() => {
      setStatusStep(prev => (prev < statusSteps.length - 1 ? prev + 1 : prev));
    }, 800);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jdText })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Analysis failed");
      }
      
      setResult(data);
    } catch (error: any) {
      console.error(error);
      alert(`Analysis failed: ${error.message}`);
    } finally {
      clearInterval(interval);
      setIsLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setResumeText('');
    setJdText('');
    setFileName(null);
  };

  return (
    <div className="min-h-screen bg-bg relative overflow-hidden selection:bg-accent/30">
      <div className="bg-grid fixed inset-0 pointer-events-none" />
      
      {/* Background Orbs */}
      <div className="animate-orb absolute -top-20 -left-20 w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="animate-orb absolute bottom-40 -right-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none [animation-delay:-4s]" />
      <div className="animate-orb absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none [animation-delay:-8s]" />

      <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        <header className="flex items-center justify-between mb-16 border-b border-border/50 pb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-purple rounded-xl flex items-center justify-center text-xl shadow-lg shadow-accent/20">
              🧠
            </div>
            <h1 className="text-2xl font-display font-extrabold tracking-tighter">
              Resume<span className="text-accent-light">AI</span>
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border text-[10px] font-mono text-slate-400">
            <Sparkles className="w-3 h-3 text-accent" />
            Gemini 3 Flash
          </div>
        </header>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-6 mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-border text-[10px] font-mono uppercase tracking-widest text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  AI Career Optimizer
                </div>
                <h2 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight leading-[0.9] text-white">
                  Land Your Dream<br />Job Faster
                </h2>
                <p className="max-w-2xl mx-auto text-slate-400 text-lg font-light leading-relaxed">
                  Upload your resume, paste a job description — get a match score, resume rating out of 10, skill gap analysis, and role-specific improvement tips instantly.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Resume Card */}
                <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-3xl p-8 space-y-6">
                  <div className="space-y-1">
                    <h3 className="flex items-center gap-2 text-lg font-display font-bold">
                      <FileText className="w-5 h-5 text-slate-400" />
                      Your Resume
                    </h3>
                    <p className="text-sm text-slate-500">Upload a file or paste your resume text</p>
                  </div>

                  <div className="flex p-1 bg-bg/50 rounded-xl border border-border">
                    <button
                      onClick={() => setResumeMode('upload')}
                      className={cn(
                        "flex-1 py-2.5 text-xs font-medium rounded-lg transition-all",
                        resumeMode === 'upload' ? "bg-surface text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
                      )}
                    >
                      Upload File
                    </button>
                    <button
                      onClick={() => setResumeMode('paste')}
                      className={cn(
                        "flex-1 py-2.5 text-xs font-medium rounded-lg transition-all",
                        resumeMode === 'paste' ? "bg-surface text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
                      )}
                    >
                      Paste Text
                    </button>
                  </div>

                  {resumeMode === 'upload' ? (
                    <div className="space-y-4">
                      <label className="group relative flex flex-col items-center justify-center p-12 border-2 border-emerald/30 border-dashed rounded-2xl cursor-pointer hover:border-emerald/60 hover:bg-emerald/5 transition-all">
                        <input type="file" className="hidden" onChange={handleFileUpload} accept=".txt,.pdf,.doc,.docx" />
                        <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Upload className="w-6 h-6 text-slate-400 group-hover:text-emerald" />
                        </div>
                        <span className="text-sm text-slate-300 font-medium">Drop your resume here</span>
                        <span className="text-[10px] font-mono text-slate-500 mt-2">PDF, TXT, DOC, DOCX • Max 5 MB</span>
                      </label>
                      {fileName && (
                        <div className="flex items-center gap-3 p-4 bg-emerald/10 border border-emerald/20 rounded-xl text-emerald text-xs font-mono">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="truncate flex-1">{fileName}</span>
                          <span className="text-emerald/60">383.7 KB</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <textarea
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                        placeholder="Paste your full resume here..."
                        className="w-full h-[280px] bg-bg/50 border border-border rounded-2xl p-5 text-sm focus:outline-none focus:border-accent transition-colors resize-none font-light leading-relaxed"
                      />
                      <div className="text-[10px] font-mono text-slate-600 text-right">
                        {resumeText.length.toLocaleString()} characters
                      </div>
                    </div>
                  )}
                </div>

                {/* JD Card */}
                <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-3xl p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="flex items-center gap-2 text-lg font-display font-bold">
                        <Briefcase className="w-5 h-5 text-slate-400" />
                        Job Description
                      </h3>
                      <p className="text-sm text-slate-500">Paste the full job listing you're targeting</p>
                    </div>
                    <button 
                      onClick={() => setJdText(SAMPLE_JD)}
                      className="text-[10px] font-mono text-slate-500 hover:text-accent transition-colors border border-border px-3 py-1 rounded-lg"
                    >
                      Load Sample JD
                    </button>
                  </div>

                  <div className="space-y-2">
                    <textarea
                      value={jdText}
                      onChange={(e) => setJdText(e.target.value)}
                      placeholder="Paste the job requirements here..."
                      className="w-full h-[352px] bg-bg/50 border border-border rounded-2xl p-5 text-sm focus:outline-none focus:border-accent transition-colors resize-none font-light leading-relaxed scrollbar-thin scrollbar-thumb-border"
                    />
                    <div className="text-[10px] font-mono text-slate-600 text-right">
                      {jdText.length.toLocaleString()} characters
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={startAnalysis}
                  disabled={isLoading || !resumeText || !jdText}
                  className="w-full py-5 bg-gradient-to-r from-accent to-purple rounded-2xl font-display font-bold text-xl shadow-2xl shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
                >
                  {isLoading ? "Analyzing..." : "Analyze My Resume"}
                </button>

                {isLoading && (
                  <div className="mt-8 space-y-6">
                    <div className="h-1.5 bg-border rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-accent"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 5, ease: "linear" }}
                      />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {statusSteps.map((step, i) => (
                        <div 
                          key={i} 
                          className={cn(
                            "flex items-center gap-3 text-[11px] font-mono transition-colors",
                            i === statusStep ? "text-accent" : i < statusStep ? "text-emerald" : "text-slate-600"
                          )}
                        >
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            i === statusStep ? "bg-accent animate-pulse" : i < statusStep ? "bg-emerald" : "bg-border"
                          )} />
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <button
                onClick={reset}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-8"
              >
                <ChevronLeft className="w-4 h-4" />
                New Analysis
              </button>

              {/* Score Overview */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-surface border border-border rounded-3xl p-10 flex flex-col md:flex-row items-center gap-10">
                  <div className="relative w-40 h-40 flex-shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-border" />
                      <motion.circle
                        cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8"
                        strokeDasharray="283"
                        initial={{ strokeDashoffset: 283 }}
                        animate={{ strokeDashoffset: 283 - (283 * result.matchScore) / 100 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="text-accent"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-display font-black text-white">{result.matchScore}%</span>
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Match</span>
                    </div>
                  </div>
                  <div className="space-y-4 text-center md:text-left">
                    <h3 className="text-3xl font-display font-extrabold text-white tracking-tight">{result.scoreTitle}</h3>
                    <p className="text-slate-400 font-light leading-relaxed">{result.scoreDescription}</p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-3">
                      <span className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                        ✓ {result.matchedSkills.length} Matched
                      </span>
                      <span className="px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-mono">
                        ✗ {result.missingSkills.length} Missing
                      </span>
                      <span className="px-3 py-1 rounded-lg bg-accent/10 border border-accent/20 text-accent-light text-[10px] font-mono">
                        ◎ ATS {result.atsScore}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-surface border border-border rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="space-y-1">
                    <div className="text-6xl font-display font-black text-accent">{result.resumeRating}</div>
                    <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Quality Rating</div>
                  </div>
                  <div className="px-4 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs font-bold text-accent-light">
                    {result.resumeRatingLabel}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed italic">
                    "{result.resumeRatingJustification}"
                  </p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex p-1 bg-surface border border-border rounded-2xl overflow-x-auto no-scrollbar">
                {(['improvements', 'skills', 'suggestions', 'ats', 'keywords'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "flex-1 py-3 px-6 text-xs font-bold rounded-xl transition-all whitespace-nowrap",
                      activeTab === tab ? "bg-surface-hover text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
                    )}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="min-h-[400px]">
                {activeTab === 'improvements' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xl font-display font-bold flex items-center gap-2">
                        <Target className="w-5 h-5 text-accent" />
                        Role-Specific Improvements
                      </h4>
                      <button className="flex items-center gap-2 text-[10px] font-mono text-slate-500 hover:text-white transition-colors">
                        <Copy className="w-3 h-3" /> Copy All
                      </button>
                    </div>
                    <div className="grid gap-4">
                      {result.roleImprovements.map((imp, i) => (
                        <div key={i} className="bg-surface border border-border rounded-2xl p-6 flex gap-6 hover:border-accent/30 transition-colors">
                          <div className={cn(
                            "w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0",
                            imp.priority === 'high' ? "bg-red-500/10 text-red-400" : imp.priority === 'medium' ? "bg-amber-500/10 text-amber-400" : "bg-emerald-500/10 text-emerald-400"
                          )}>
                            <Zap className="w-5 h-5" />
                            <span className="text-[8px] font-mono uppercase mt-1">{imp.priority}</span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-bold text-white">{imp.title}</span>
                              <span className="text-[10px] font-mono text-accent-light bg-accent/10 px-2 py-0.5 rounded border border-accent/20">{imp.category}</span>
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed font-light">{imp.detail}</p>
                            <div className="text-xs text-emerald-400 font-mono">→ {imp.impact}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'skills' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-surface border border-border rounded-2xl p-8 space-y-6">
                        <h4 className="text-lg font-display font-bold flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          Matched Skills
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {result.matchedSkills.map((s, i) => (
                            <span key={i} className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="bg-surface border border-border rounded-2xl p-8 space-y-6">
                        <h4 className="text-lg font-display font-bold flex items-center gap-2">
                          <XCircle className="w-5 h-5 text-red-500" />
                          Missing Skills
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {result.missingSkills.map((s, i) => (
                            <span key={i} className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="bg-surface border border-border rounded-2xl p-8 space-y-6">
                      <h4 className="text-lg font-display font-bold flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-accent" />
                        Section Breakdown
                      </h4>
                      <div className="space-y-6">
                        {Object.entries(result.sectionScores).map(([name, score], i) => (
                          <div key={i} className="space-y-2">
                            <div className="flex justify-between text-xs font-mono text-slate-400">
                              <span>{name}</span>
                              <span>{score}%</span>
                            </div>
                            <div className="h-2 bg-border rounded-full overflow-hidden">
                              <motion.div 
                                className="h-full bg-accent"
                                initial={{ width: 0 }}
                                animate={{ width: `${score}%` }}
                                transition={{ duration: 1, delay: i * 0.1 }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'suggestions' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4">
                    {result.suggestions.map((s, i) => (
                      <div key={i} className="bg-surface border border-border rounded-2xl p-6 flex gap-6">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                          s.type === 'critical' ? "bg-red-500/10 text-red-400" : s.type === 'warn' ? "bg-amber-500/10 text-amber-400" : s.type === 'tip' ? "bg-accent/10 text-accent-light" : "bg-emerald-500/10 text-emerald-400"
                        )}>
                          {s.type === 'critical' ? <AlertCircle className="w-5 h-5" /> : <Lightbulb className="w-5 h-5" />}
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm font-bold text-white">{s.title}</div>
                          <p className="text-sm text-slate-400 leading-relaxed font-light">{s.body}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'ats' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-surface border border-border rounded-3xl p-10 space-y-10">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="text-2xl font-display font-bold">ATS Compatibility</h4>
                        <p className="text-sm text-slate-500">How well your resume parses in Applicant Tracking Systems</p>
                      </div>
                      <div className="text-5xl font-display font-black text-accent">{result.atsScore}%</div>
                    </div>
                    <div className="flex gap-1 h-6">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <div 
                          key={i} 
                          className={cn(
                            "flex-1 rounded-sm transition-colors",
                            i < (result.atsScore / 5) ? "bg-accent" : "bg-border"
                          )}
                          style={{ opacity: i < (result.atsScore / 5) ? 0.3 + (i / 20) * 0.7 : 1 }}
                        />
                      ))}
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      {result.atsChecks.map((check, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-surface-hover border border-border rounded-xl">
                          {check.passed ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
                          <div className="flex-1">
                            <div className="text-xs font-bold text-white">{check.label}</div>
                            <div className="text-[10px] text-slate-500 font-mono">{check.note}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'keywords' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    <div className="bg-surface border border-border rounded-2xl p-8 space-y-6">
                      <h4 className="text-lg font-display font-bold flex items-center gap-2">
                        <Search className="w-5 h-5 text-accent" />
                        Resume Keywords
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {result.resumeKeywords.map((k, i) => (
                          <span 
                            key={i} 
                            className="px-3 py-1.5 rounded-lg bg-surface-hover border border-border text-slate-300 font-mono"
                            style={{ fontSize: `${10 + k.weight * 2}px`, opacity: 0.5 + (k.weight / 10) }}
                          >
                            {k.word}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-surface border border-border rounded-2xl p-8 space-y-6">
                      <h4 className="text-lg font-display font-bold flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-500" />
                        JD Keywords to Target
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {result.jdKeywords.map((k, i) => (
                          <span 
                            key={i} 
                            className="px-3 py-1.5 rounded-lg bg-purple-500/5 border border-purple-500/20 text-purple-400 font-mono"
                            style={{ fontSize: `${10 + k.weight * 2}px`, opacity: 0.5 + (k.weight / 10) }}
                          >
                            {k.word}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="max-w-6xl mx-auto px-6 py-12 border-t border-border mt-20 text-center">
      </footer>
    </div>
  );
}
