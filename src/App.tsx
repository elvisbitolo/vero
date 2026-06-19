/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calculator,
  Mail,
  Phone,
  MapPin,
  Award,
  Plus,
  Trash2,
  ExternalLink,
  DollarSign,
  TrendingUp,
  Activity,
  Calendar,
  FileText,
  CheckCircle,
  AlertCircle,
  Smartphone,
  User,
  Menu,
  X,
  ShieldCheck,
  Percent,
  Briefcase,
  GraduationCap,
  Sparkles,
  RefreshCw,
  Clock,
  Check,
  ArrowRight
} from 'lucide-react';
import { PERSONAL_INFO, SKILLS, CERTIFICATIONS, TIMELINE, MOCK_LEDGER } from './data';
import { LedgerEntry } from './types';

export default function App() {
  // Mobile Nav Toggle State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Skill category filter (for accounting taxonomy)
  const [activeSkillCat, setActiveSkillCat] = useState<'all' | 'accounting' | 'taxation' | 'software'>('all');

  // Interactive Live General Ledger Sandbox State
  const [ledger, setLedger] = useState<LedgerEntry[]>(MOCK_LEDGER);
  const [newDesc, setNewDesc] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newType, setNewType] = useState<'debit' | 'credit'>('credit');
  const [newCategory, setNewCategory] = useState('Professional Services');

  // Accountancy Auditor's reconciliation logs
  const [auditLogs, setAuditLogs] = useState<string[]>([
    '[08:30:00] Ledger initial check complete. Database state healthy.',
    '[08:31:15] Trial Balance matched against subsidiary journals.'
  ]);
  const [isReconciliationRunning, setIsReconciliationRunning] = useState(false);
  const [auditResult, setAuditResult] = useState<'idle' | 'balanced' | 'issue'>('idle');

  // Interactive KRA iTax Payroll Deductions Calculator variables (Monthly in KES)
  const [inputSalary, setInputSalary] = useState('85000');

  // Contact parameters
  const [visitorName, setVisitorName] = useState('');
  const [visitorMsg, setVisitorMsg] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  // Experience timeline type filter
  const [activeTimelineType, setActiveTimelineType] = useState<'all' | 'experience' | 'education'>('all');

  // Calculate ledger financial parameters on safety thread
  const totals = useMemo(() => {
    let debits = 0;
    let credits = 0;
    ledger.forEach((item) => {
      if (item.type === 'debit') debits += item.amount;
      else credits += item.amount;
    });
    return {
      debits,
      credits,
      balance: credits - debits,
    };
  }, [ledger]);

  // Formatter for Currency
  const formatKES = (val: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Push audit events helper
  const triggerAuditLog = (msg: string) => {
    setAuditLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 10)]);
  };

  // Log new ledger transaction
  const handleAddLedgerItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc.trim() || !newAmount || parseFloat(newAmount) <= 0) return;

    const entry: LedgerEntry = {
      id: `l-entry-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      description: newDesc,
      category: newCategory,
      type: newType,
      amount: parseFloat(newAmount)
    };

    setLedger([entry, ...ledger]);
    setNewDesc('');
    setNewAmount('');

    triggerAuditLog(`Posted journal entry: ${entry.type === 'credit' ? 'CREDIT' : 'DEBIT'} of ${formatKES(entry.amount)} describing "${entry.description}" under [${entry.category}]`);
  };

  // Remove a transaction from general ledger simulation
  const handleDeleteLedgerItem = (id: string, amount: number, type: string) => {
    setLedger(ledger.filter((item) => item.id !== id));
    triggerAuditLog(`Reversed and deleted transaction entry for ${formatKES(amount)} (${type.toUpperCase()})`);
  };

  // Perform virtual ledger reconciliation and auditing math
  const handleRunReconciliationAudit = () => {
    if (isReconciliationRunning) return;
    setIsReconciliationRunning(true);
    setAuditResult('idle');
    setAuditLogs([]);

    const steps = [
      'Retrieving all active account ledgers from local state caches...',
      'Computing standard debit sums against credit allocations...',
      'Reconciliation Equation: Sum of Credits (Inflows) must balance against Sum of Debits (Outflows) + Net Holding reserves...',
      `Validating ledger entries integrity... [Examined Row Count: ${ledger.length}]`,
      `Comparing statement outcomes... Total Inbound: ${formatKES(totals.credits)} | Total Outbound: ${formatKES(totals.debits)} | Derived Statement Equity: ${formatKES(totals.balance)}`,
      'Comparing with monthly bank statement logs (simulated clearing pass)...',
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        triggerAuditLog(step);
        if (idx === steps.length - 1) {
          setIsReconciliationRunning(false);
          if (ledger.length === 0) {
            setAuditResult('issue');
            triggerAuditLog('[AUDIT SYSTEM] VERDICT: Ledger represents neutral entries. Post bookkeeping items to execute true reconciliation test.');
          } else if (totals.balance < 0) {
            setAuditResult('issue');
            triggerAuditLog('[AUDIT SYSTEM] WARNING: Current ledgers reflect negative operational cash flow. Restructure outgoings to maintain cash liquidity.');
          } else {
            setAuditResult('balanced');
            triggerAuditLog('[AUDIT SYSTEM] SUCCESS: Trial Balance Verified. Reconciliation clears standard accounting validation benchmarks. No abnormal variances detected.');
          }
        }
      }, (idx + 1) * 500);
    });
  };

  // Live Kenya KRA Pay As You Earn (CPA-compliant statutory calculations)
  const taxCalculations = useMemo(() => {
    const gross = parseFloat(inputSalary) || 0;
    if (gross <= 0) {
      return { gross: 0, nssf: 0, housingLevy: 0, taxableIncome: 0, payeBeforeRelief: 0, relief: 0, netPaye: 0, shif: 0, netSalary: 0 };
    }

    // 1. Kenya NSSF deduction (2024 revised standard guidelines)
    // Tier I bracket: 360 KES (on salaries above 6k)
    // Tier II bracket: 1,800 KES (on salaries above 18k). Standard cap maximum is 2,160 KES.
    let nssf = 0;
    if (gross > 18000) {
      nssf = 2160;
    } else if (gross > 6000) {
      nssf = 360 + (gross - 6000) * 0.06;
    } else {
      nssf = gross * 0.06;
    }

    // 2. Affordable Housing Levy deduction (1.5% of gross)
    const housingLevy = gross * 0.015;

    // 3. Taxable Income is Gross minus NSSF deduction
    const taxableIncome = Math.max(0, gross - nssf);

    // 4. PAYE calculation monthly scale bands (Standard 10% -> 25% -> 30% -> 32.5% -> 35% bands)
    // Band 1: First 24,000 @ 10%
    // Band 2: Next 8,333 @ 25%
    // Band 3: Next 467,667 @ 30%
    // Band 4: Next 300,000 @ 32.5%
    // Band 5: Over 800,000 @ 35%
    let payeBeforeRelief = 0;
    let remaining = taxableIncome;

    if (remaining > 0) {
      const b1 = Math.min(24000, remaining);
      payeBeforeRelief += b1 * 0.10;
      remaining -= b1;
    }
    if (remaining > 0) {
      const b2 = Math.min(8333, remaining);
      payeBeforeRelief += b2 * 0.25;
      remaining -= b2;
    }
    if (remaining > 0) {
      const b3 = Math.min(467667, remaining);
      payeBeforeRelief += b3 * 0.30;
      remaining -= b3;
    }
    if (remaining > 0) {
      const b4 = Math.min(300000, remaining);
      payeBeforeRelief += b4 * 0.325;
      remaining -= b4;
    }
    if (remaining > 0) {
      payeBeforeRelief += remaining * 0.35;
    }

    // 5. Personal Tax Relief (Standard Kenya monthly relief is 2,400 KES)
    const relief = gross >= 24000 ? 2400 : 0;
    const netPaye = Math.max(0, payeBeforeRelief - relief);

    // 6. SHIF (Social Health Insurance Fund, replacing old NHIF monthly scales at 2.75% of Gross)
    const shif = gross * 0.0275;

    // 7. Net Take-Home Salary
    const netSalary = Math.max(0, gross - nssf - housingLevy - netPaye - shif);

    return {
      gross,
      nssf,
      housingLevy,
      taxableIncome,
      payeBeforeRelief,
      relief,
      netPaye,
      shif,
      netSalary
    };
  }, [inputSalary]);

  // WhatsApp click handler
  const getWhatsAppMessageUrl = () => {
    const textObj = `*Client Inquiry - Accounting Consultancy* %0A%0A*Name:* ${visitorName || 'Interested Business Client'} %0A*Inquiry Point:* Hi, Veronica. I viewed your professional accounting portfolio and would love to consult with you on standard corporate ledgers, KRA iTax statutory planning, and bookkeeping services.`;
    return `https://wa.me/254714014659?text=${textObj}`;
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNotification('Redirecting to WhatsApp to process securely...');
    setTimeout(() => {
      window.open(getWhatsAppMessageUrl(), '_blank');
      setNotification(null);
      setVisitorName('');
      setVisitorMsg('');
    }, 1500);
  };

  // Filter skills taxonomy
  const filteredSkills = useMemo(() => {
    if (activeSkillCat === 'all') return SKILLS;
    return SKILLS.filter((s) => s.category === activeSkillCat);
  }, [activeSkillCat]);

  // Filter timeline components
  const filteredTimeline = useMemo(() => {
    if (activeTimelineType === 'all') return TIMELINE;
    return TIMELINE.filter((term) => term.type === activeTimelineType);
  }, [activeTimelineType]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1D2432] font-sans antialiased selection:bg-[#E5C158]/30 selection:text-[#0E1525]">
      
      {/* PROFESSIONAL DARK STYLED NAVIGATION HEADER */}
      <header id="nav_header" className="sticky top-0 z-50 bg-[#0E1525]/95 backdrop-blur-md border-b border-[#1E2E4A] text-white py-4 px-6 md:px-12 transition-all">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-[#E5C158] to-[#C99E26] text-[#0E1525] p-2 rounded-lg font-mono font-bold tracking-tight text-sm shadow-md shadow-amber-500/10">
              VO
            </div>
            <div>
              <span className="font-bold tracking-tight text-lg text-white block leading-none">
                {PERSONAL_INFO.name}
              </span>
              <span className="font-mono text-[9px] tracking-wider text-[#A0B0CD] uppercase">
                Qualified Ledger & Tax Accountant
              </span>
            </div>
          </div>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold text-[#CFD9E8] uppercase tracking-wider">
            <a href="#about" className="hover:text-[#E5C158] transition-colors">About</a>
            <a href="#skills" className="hover:text-[#E5C158] transition-colors">Proficiencies</a>
            <a href="#credentials" className="hover:text-[#E5C158] transition-colors">Certs & CPA</a>
            <a href="#lab" className="hover:text-[#E5C158] transition-colors">Ledger Lab & Tax Calculator</a>
            <a href="#experience" className="hover:text-[#E5C158] transition-colors">Experience Milestones</a>
            <a href="#contact" className="hover:text-[#E5C158] transition-colors">Connect</a>
          </nav>

          {/* Quick Connect CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href={`mailto:${PERSONAL_INFO.email}`}
              className="px-4 py-2 bg-[#1A253D] hover:bg-[#23355A] border border-[#2F446D] text-white text-xs font-semibold rounded-lg tracking-wide inline-flex items-center gap-1.5 transition-all animate-pulse"
            >
              <Mail className="w-3.5 h-3.5" />
              Email Direct
            </a>
          </div>

          {/* Hamburger Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#CFD9E8] hover:text-white focus:outline-none"
            title="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav Menu Drawer */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 w-full bg-[#0E1525] border-b border-[#1E2E4A] px-6 py-8 flex flex-col space-y-4 md:hidden text-white shadow-2xl"
          >
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium hover:text-[#E5C158] py-1 border-b border-gray-800"
            >
              About Veronica
            </a>
            <a
              href="#skills"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium hover:text-[#E5C158] py-1 border-b border-gray-800"
            >
              Proficiencies & Skills
            </a>
            <a
              href="#credentials"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium hover:text-[#E5C158] py-1 border-b border-gray-800"
            >
              Certs & Credentials
            </a>
            <a
              href="#lab"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium hover:text-[#E5C158] py-1 border-b border-gray-800"
            >
              Ledger Lab & PAYE Tracker
            </a>
            <a
              href="#experience"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium hover:text-[#E5C158] py-1 border-b border-gray-800"
            >
              Experience Milestones
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium hover:text-[#E5C158] py-1 border-b border-gray-800"
            >
              Connect Now
            </a>
            <div className="pt-4 flex flex-col gap-2.5">
              <a
                href={PERSONAL_INFO.whatsappUrl}
                target="_blank"
                referrerPolicy="no-referrer"
                className="w-full text-center py-2.5 bg-emerald-600 font-bold text-white text-xs rounded-lg inline-flex justify-center items-center gap-2"
              >
                <Smartphone className="w-4 h-4" />
                WhatsApp: +254 714 014659
              </a>
              <a
                href={`mailto:${PERSONAL_INFO.email}`}
                className="w-full text-center py-2.5 bg-slate-800 border border-[#2F446D] font-bold text-white text-xs rounded-lg inline-flex justify-center items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Email: {PERSONAL_INFO.email}
              </a>
            </div>
          </motion.div>
        )}
      </header>

      {/* HERO SECTION - REFINED STATELY BRAND FOR AN ACCOUNTANT */}
      <section id="hero" className="relative bg-[#0E1525] text-white pt-20 pb-32 px-6 md:px-12 md:py-36 overflow-hidden">
        {/* Abstract Architectural grid vector */}
        <div className="absolute inset-0 bg-[radial-gradient(#1E2D4E_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>
        <div className="absolute top-1/4 left-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 relative z-10 items-center">
          
          {/* Left Block */}
          <div className="md:col-span-7 flex flex-col space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-[#142035] border border-[#202E4E] rounded-full text-xs font-mono font-medium tracking-wide text-[#E5C158] w-fit shadow-inner">
              <CheckCircle className="w-3.5 h-3.5 text-[#E5C158]" />
              <span>Certified Books Accuracy • Tax Optimization</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-5.5xl font-black tracking-tight leading-tight">
              Rigorous Ledger Audits. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E5C158] via-[#F5D77F] to-[#FFF]">
                Flawless KRA iTax Filing.
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-[#BCD1E8] max-w-2xl font-light leading-relaxed">
              {PERSONAL_INFO.bio}
            </p>

            {/* Instant Contact details array */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
              <a href={`mailto:${PERSONAL_INFO.email}`} className="flex items-center space-x-3 bg-[#111A2E] border border-[#1E2E4A] p-3 rounded-xl hover:border-[#E5C158]/50 transition-colors group">
                <div className="p-2 bg-amber-500/10 rounded-lg group-hover:bg-[#E5C158]/20 transition-colors">
                  <Mail className="w-4 h-4 text-[#E5C158]" />
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] uppercase font-mono tracking-wider text-gray-400 block font-bold leading-none">Email Address</span>
                  <span className="text-xs font-semibold text-white truncate block">{PERSONAL_INFO.email}</span>
                </div>
              </a>

              <a href={PERSONAL_INFO.whatsappUrl} target="_blank" referrerPolicy="no-referrer" className="flex items-center space-x-3 bg-[#111A2E] border border-[#1E2E4A] p-3 rounded-xl hover:border-emerald-500/50 transition-colors group">
                <div className="p-2 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-mono tracking-wider text-gray-400 block font-bold leading-none">WhatsApp</span>
                  <span className="text-xs font-semibold text-white block">{PERSONAL_INFO.phone}</span>
                </div>
              </a>

              <div className="flex items-center space-x-3 bg-[#111A2E] border border-[#1E2E4A] p-3 rounded-xl">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <MapPin className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-mono tracking-wider text-gray-400 block font-bold leading-none">Location</span>
                  <span className="text-xs font-semibold text-white block">{PERSONAL_INFO.location}</span>
                </div>
              </div>
            </div>

            {/* Core Action triggers */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <a
                href="#lab"
                className="px-6 py-3.5 bg-gradient-to-r from-[#E5C158] to-[#CDA12C] hover:brightness-115 text-[#0A0E18] text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/10 transition-all text-center inline-flex items-center justify-center gap-2"
              >
                <Calculator className="w-4 h-4" />
                Run Ledger Sandbox
              </a>
              <a
                href="#skills"
                className="px-6 py-3.5 bg-transparent hover:bg-white/5 text-white text-xs font-bold uppercase tracking-wider rounded-xl border border-[#2E3C5A] hover:border-white/30 transition-all text-center"
              >
                Check Skill Categories
              </a>
            </div>
          </div>

          {/* Right Block - Genuine Portrait Photo Framed Stately */}
          <div className="md:col-span-5 flex flex-col items-center justify-center relative">
            <div className="relative group p-1.5 bg-gradient-to-tr from-[#E5C158]/60 to-transparent rounded-2xl shadow-3xl">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#E5C158]/20 to-emerald-500/10 rounded-2xl blur opacity-30 group-hover:opacity-40 transition duration-1000"></div>
              
              <div className="relative overflow-hidden rounded-xl bg-[#141C2C] border-2 border-[#1E2E4E] w-[290px] h-[290px] sm:w-[330px] sm:h-[330px] md:w-[300px] md:h-[300px] lg:w-[350px] lg:h-[350px]">
                {/* Underneath fallback */}
                <div className="absolute inset-0 bg-[#0E1525] flex items-center justify-center -z-10">
                  <User className="w-16 h-16 text-slate-700" />
                </div>
                
                <img
                  src={PERSONAL_INFO.portraitUrl}
                  alt={PERSONAL_INFO.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale-[10%] contrast-[105%] transition-all duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=700&auto=format&fit=crop";
                  }}
                />

                {/* Overlaid Stately Label */}
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#090D1A] via-[#090D1A]/80 to-transparent p-5 text-white">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-[9px] uppercase font-mono text-[#E5C158] tracking-widest block font-extrabold">Professional Accountant</span>
                      <h4 className="text-sm font-bold text-white tracking-wide">{PERSONAL_INFO.name}</h4>
                    </div>
                    <div className="bg-[#E5C158]/10 text-[#E5C158] px-2.5 py-1 rounded text-[10px] font-mono font-bold border border-[#E5C158]/25">
                      KASNEB CPA Standard
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* floating metrics badges */}
            <div className="absolute -bottom-6 left-6 bg-gradient-to-br from-[#1C253B] to-[#121929] border border-[#2B3F63] rounded-xl p-3 shadow-xl inline-flex items-center gap-3 w-52">
              <div className="p-2 bg-[#E5C158]/10 text-[#E5C158] rounded-xl">
                <Award className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <p className="text-[10px] font-mono text-gray-400 uppercase leading-none font-bold">Accountancy Standard</p>
                <p className="text-xs font-black text-white pt-1">CPA KASNEB Track</p>
              </div>
            </div>

            <div className="absolute -top-4 -right-2 bg-gradient-to-br from-[#1C253B] to-[#121929] border border-[#2B3F63] rounded-xl p-3 shadow-xl inline-flex items-center gap-3 w-48">
              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-mono text-gray-400 uppercase leading-none font-bold">iTax Competence</p>
                <p className="text-xs font-black text-white pt-1">VAT/PAYE Specialist</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CORE STATELY VALUE STATEMENT FOR CLIENTS */}
      <section id="about" className="py-24 bg-white border-b border-[#EBEBEF]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            
            {/* Title Column */}
            <div className="md:col-span-5 flex flex-col space-y-4">
              <span className="font-mono text-xs font-bold tracking-widest text-[#A17F19] uppercase">The Professional Philosophy</span>
              <h2 className="text-3xl font-black text-[#111A24] tracking-tight leading-tight">
                Perfect Ledger Books Drive Perfect Business Decisions.
              </h2>
              <div className="h-1.5 w-16 bg-[#E5C158] rounded-full"></div>

              {/* Stat Card Pile */}
              <div className="pt-6 grid grid-cols-2 gap-4">
                <div className="bg-[#F8F9FA] p-4 rounded-xl border border-gray-100">
                  <span className="text-3xl font-black text-[#A17F19] block leading-none">100%</span>
                  <p className="text-[10px] uppercase font-mono tracking-wider text-slate-500 pt-1 font-bold">iTax Filing Compliance</p>
                </div>
                <div className="bg-[#F8F9FA] p-4 rounded-xl border border-gray-100">
                  <span className="text-3xl font-black text-[#A17F19] block leading-none">80%</span>
                  <p className="text-[10px] uppercase font-mono tracking-wider text-slate-500 pt-1 font-bold">Reduction in Ledger Errors</p>
                </div>
              </div>
            </div>

            {/* Narrative Column */}
            <div className="md:col-span-7 text-gray-700 leading-relaxed space-y-6">
              <p className="text-lg font-light text-slate-800 leading-relaxed">
                {PERSONAL_INFO.aboutLong}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                
                <div className="bg-[#F8F9FA] p-5 rounded-xl border border-gray-200/60 shadow-sm">
                  <div className="flex items-center space-x-2 text-[#A17F19] mb-2">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-mono text-[10px] font-extrabold uppercase tracking-widest">Internal Control Checkpoints</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Establishing systemized, verifiable double-entry audit trails that prevent cash leaks, locate invoice errors, and secure balance records.
                  </p>
                </div>

                <div className="bg-[#F8F9FA] p-5 rounded-xl border border-gray-200/60 shadow-sm">
                  <div className="flex items-center space-x-2 text-emerald-600 mb-2">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-mono text-[10px] font-extrabold uppercase tracking-widest">Kenya iTax Statutory Rigor</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Precision calculation and timely filing of monthly VAT schedules, PAYE employee sheets, and ensuring compliance on KRA iTax.
                  </p>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* PROFICIENCIES & SKILL TAXONOMY GRID */}
      <section id="skills" className="py-24 bg-[#ECEEF2] border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 gap-4">
            <div>
              <span className="font-mono text-xs font-bold tracking-widest text-[#A17F19] uppercase mb-1 block">Accountant Skillsets Matrix</span>
              <h2 className="text-3xl font-black text-[#1F2937] tracking-tight">Verified Professional Proficiencies</h2>
            </div>

            {/* Switchers */}
            <div className="flex bg-white/80 backdrop-blur border border-gray-300 p-1 rounded-xl space-x-1 w-fit shadow-sm">
              <button
                onClick={() => setActiveSkillCat('all')}
                className={`px-4.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeSkillCat === 'all' ? 'bg-[#0E1525] text-white' : 'text-slate-600 hover:text-slate-900'}`}
              >
                All Skills
              </button>
              <button
                onClick={() => setActiveSkillCat('accounting')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeSkillCat === 'accounting' ? 'bg-[#A17F19] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Bookkeeping
              </button>
              <button
                onClick={() => setActiveSkillCat('taxation')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeSkillCat === 'taxation' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Tax/Compliance
              </button>
              <button
                onClick={() => setActiveSkillCat('software')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeSkillCat === 'software' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Accounting Software
              </button>
            </div>
          </div>

          {/* Grid display */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredSkills.map((skill) => (
                <motion.div
                  key={skill.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className={`px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase rounded ${skill.category === 'accounting' ? 'bg-amber-100 text-amber-800' : skill.category === 'taxation' ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'}`}>
                        {skill.category === 'accounting' ? 'Financial accounting' : skill.category === 'taxation' ? 'Statutory Code' : 'Computerized Ledger'}
                      </span>
                      
                      <div className="flex items-center space-x-0.5">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <div
                            key={idx}
                            className={`w-1.5 h-1.5 rounded-full ${idx < Math.floor(skill.rating) ? 'bg-[#E5C158]' : 'bg-gray-200'}`}
                          />
                        ))}
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-slate-800 mb-2">{skill.name}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">{skill.description}</p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-[10px] font-mono text-slate-400 font-bold uppercase">
                    <span>Validation standard</span>
                    <span className="text-emerald-600">Perfect Execution</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* OFFICIAL REGULATORY ACCREDITATIONS & CPA */}
      <section id="credentials" className="py-24 bg-white border-b border-[#EBEBEF]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-mono text-xs font-bold tracking-widest text-[#A17F19] uppercase block mb-1">CPA Standards Certification</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">KASNEB Accreditations & Software Badges</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CERTIFICATIONS.map((cert) => (
              <div
                key={cert.id}
                className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm hover:border-[#E5C158] transition-colors flex flex-col justify-between leading-relaxed"
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-mono text-xs font-semibold text-gray-400">{cert.year}</span>
                    <span className={`text-[10px] px-2 py-0.5 font-bold uppercase rounded font-mono ${cert.type === 'professional' ? 'bg-amber-100 text-amber-800' : cert.type === 'academic' ? 'bg-blue-100 text-[#1F4172]' : 'bg-indigo-100 text-indigo-800'}`}>
                      {cert.type === 'professional' ? 'KASNEB Board' : cert.type === 'academic' ? 'Diploma Option' : 'Software Core'}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-800 mb-1 group-hover:text-[#A17F19] transition-colors leading-snug">
                    {cert.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mb-3">{cert.issuer}</p>

                  {cert.credentialId && (
                    <div className="mb-4 bg-gray-50 border border-gray-100 p-2 rounded text-[10px] font-mono text-gray-500 select-all">
                      <span className="text-gray-400 block pb-0.5 uppercase tracking-wide">License Registry ID</span>
                      <span className="font-bold text-slate-700 font-mono text-[10px]">{cert.credentialId}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-1">
                  {cert.skillsLinked.map((val, key) => (
                    <span key={key} className="bg-slate-100 text-[#0E1525] text-[9px] px-2 py-0.5 rounded-full font-medium">
                      {val}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* DUAL INTERACTIVE ACCOUNTING BENCHMARK LAB */}
      <section id="lab" className="py-24 bg-[#0E1525] text-white relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(14,21,37,0)_0%,rgba(14,21,37,1)_100%)] opacity-80 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          
          <div className="max-w-3xl mb-16">
            <span className="px-3.5 py-1.5 bg-[#E5C158]/10 border border-[#E5C158]/25 rounded-full text-xs font-mono font-bold tracking-widest text-[#E5C158] uppercase">
              Interactive Accounting Sandbox
            </span>
            <h2 className="text-3xl sm:text-4.5xl font-black mt-4 tracking-tight leading-tight">
              The Live Reconciliation Audit Lab & KRAPAYE Planner
            </h2>
            <p className="text-[#A2B6D4] mt-3 font-light text-sm sm:text-base leading-relaxed">
              Interact with this real-time simulator verifying ledger adjustments, executing dynamic payroll logs, and calculating official Kenyan taxes based on SHIF and standard housing levy regulations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* COLUMN 1: INTERACTIVE GENERAL LEDGER BOOK (7 cols) */}
            <div className="lg:col-span-7 flex flex-col">
              
              <div className="bg-[#141E33] border border-[#233555] rounded-2xl p-6 shadow-2xl flex flex-col justify-between h-full">
                
                <div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-5 border-b border-[#233555] mb-6 gap-3">
                    <div>
                      <h3 className="font-bold text-base text-white tracking-wide inline-flex items-center gap-2">
                        <FolderTextIcon />
                        Interactive Journal entries simulation
                      </h3>
                      <p className="text-xs text-gray-400">Post debits & credits in the ledger books</p>
                    </div>

                    <div className="bg-[#E5C158]/10 text-[#E5C158] px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold border border-[#E5C158]/20 leading-none">
                      Active Ledger rows: {ledger.length}
                    </div>
                  </div>

                  {/* Calculations breakdown meters */}
                  <div className="grid grid-cols-3 gap-3.5 mb-6">
                    <div className="bg-[#18233C] border border-[#283A5D] p-3.5 rounded-xl">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 block font-bold leading-none">Credit Total (+)</span>
                      <span className="text-sm sm:text-base font-extrabold text-white font-mono block pt-2 leading-none">{formatKES(totals.credits)}</span>
                    </div>

                    <div className="bg-[#18233C] border border-[#283A5D] p-3.5 rounded-xl">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-red-400 block font-bold leading-none">Debit Total (-)</span>
                      <span className="text-sm sm:text-base font-extrabold text-white font-mono block pt-2 leading-none">{formatKES(totals.debits)}</span>
                    </div>

                    <div className="bg-[#1B2742] border border-[#E5C158]/20 p-3.5 rounded-xl">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-[#E5C158] block font-bold leading-none">Derived Balance</span>
                      <span className={`text-sm sm:text-base font-black font-mono block pt-2 leading-none ${totals.balance >= 0 ? 'text-[#E5C158]' : 'text-red-400'}`}>
                        {formatKES(totals.balance)}
                      </span>
                    </div>
                  </div>

                  {/* FORM TO ADD ROWS */}
                  <form onSubmit={handleAddLedgerItem} className="bg-[#111929] border border-[#202E4E] p-4.5 rounded-xl mb-6 space-y-3.5 shadow-inner">
                    <div className="flex justify-between items-center pb-2 border-b border-[#1C2C47]">
                      <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block font-bold">Standard Double-Entry Journalize Inflow/Outflow</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pb-1">
                      <div className="md:col-span-5">
                        <label className="text-[9px] uppercase font-mono text-slate-400 block pb-1">Particulars Detail:</label>
                        <input
                          type="text"
                          required
                          value={newDesc}
                          onChange={(e) => setNewDesc(e.target.value)}
                          placeholder="Particulars (e.g. Audit Consulting)"
                          className="w-full bg-[#18233D] border border-[#283C61] px-3.5 py-2.5 text-xs rounded-lg text-white focus:outline-none focus:border-[#E5C158]"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-[9px] uppercase font-mono text-slate-400 block pb-1">Account Side:</label>
                        <select
                          value={newType}
                          onChange={(e) => setNewType(e.target.value as 'debit' | 'credit')}
                          className="w-full bg-[#18233D] border border-[#283C61] px-2.5 py-2.5 text-xs rounded-lg text-white focus:outline-none focus:border-[#E5C158]"
                        >
                          <option value="credit">Credit (+)</option>
                          <option value="debit">Debit (-)</option>
                        </select>
                      </div>

                      <div className="md:col-span-3">
                        <label className="text-[9px] uppercase font-mono text-slate-400 block pb-1">Particular Amount:</label>
                        <input
                          type="number"
                          required
                          min="100"
                          value={newAmount}
                          onChange={(e) => setNewAmount(e.target.value)}
                          placeholder="KES Amount"
                          className="w-full bg-[#18233D] border border-[#283C61] px-3.5 py-2.5 text-xs font-mono rounded-lg text-white focus:outline-none focus:border-[#E5C158]"
                        />
                      </div>

                      <div className="md:col-span-2 flex items-end">
                        <button
                          type="submit"
                          className="w-full bg-gradient-to-r from-[#E5C158] to-[#CAA02C] hover:brightness-110 text-[#0A0E18] text-xs font-bold py-3.5 cursor-pointer rounded-lg transition-all inline-flex items-center justify-center gap-1 shadow-sm uppercase tracking-wider"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Post
                        </button>
                      </div>
                    </div>

                    <div className="pt-2">
                      <span className="text-[9px] uppercase font-mono text-slate-400 block pb-1.5 font-bold">Particular Classification:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {['Professional Services', 'Operating Expenses', 'Direct Taxes', 'Audit Reserve', 'Office Capital Outflow'].map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => setNewCategory(item)}
                            className={`px-3 py-1 rounded-md text-[9px] font-mono uppercase tracking-wider transition-colors ${newCategory === item ? 'bg-[#E5C158] text-[#0A0E18] font-bold' : 'bg-slate-800 text-gray-400 hover:text-white'}`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  </form>

                  {/* Live Transaction Ledger Table List */}
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block pb-2.5 font-bold">Ledger Trial Records Rows</span>
                  <div className="overflow-y-auto max-h-[200px] divide-y divide-[#1D2B44] bg-[#111929] border border-[#1C2C47] rounded-xl shadow-inner scrollbar-thin">
                    {ledger.length === 0 ? (
                      <div className="p-10 text-center text-slate-500 text-xs font-light">
                        Ledger spreadsheet rows blank. Add custom entries using the financial board.
                      </div>
                    ) : (
                      ledger.map((item) => (
                        <div key={item.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-[#152037] transition-all">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-mono text-[10px] text-gray-500">{item.date}</span>
                              <span className="font-semibold text-gray-200">{item.description}</span>
                            </div>
                            <span className="font-mono text-[9px] text-[#A2B6D4] uppercase block pt-0.5 tracking-wider">{item.category}</span>
                          </div>

                          <div className="flex items-center space-x-4">
                            <span className={`font-mono font-bold ${item.type === 'credit' ? 'text-emerald-400' : 'text-red-400'}`}>
                              {item.type === 'credit' ? '+' : '-'}{formatKES(item.amount)}
                            </span>
                            <button
                              onClick={() => handleDeleteLedgerItem(item.id, item.amount, item.type)}
                              className="text-gray-500 hover:text-red-400 p-1 rounded-md hover:bg-red-500/10 transition-all cursor-pointer"
                              title="Delete Row Particular"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                </div>

                {/* Audit trigger section */}
                <div className="pt-6 border-t border-[#233555] mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-3 bg-[#111929] border border-[#1C2D4E] p-3 rounded-xl w-full sm:w-auto">
                    <ShieldCheck className="w-5 h-5 text-[#E5C158]" />
                    <div>
                      <span className="text-[9px] uppercase font-mono tracking-wider text-gray-400 block font-bold leading-none">Internal Controls Checklist</span>
                      <span className="text-[11px] font-bold text-slate-300">Statement Audits: KASNEB Standard compliant</span>
                    </div>
                  </div>

                  <button
                    onClick={handleRunReconciliationAudit}
                    disabled={isReconciliationRunning}
                    className={`w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wide inline-flex items-center justify-center gap-2 transition-all cursor-pointer ${isReconciliationRunning ? 'bg-[#1F2E4C] text-slate-400' : 'bg-transparent text-[#E5C158] border border-[#E5C158] hover:bg-[#E5C158]/5'}`}
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isReconciliationRunning ? 'animate-spin' : ''}`} />
                    {isReconciliationRunning ? 'Processing Trial balances...' : 'Perform Reconciliation Audit'}
                  </button>
                </div>

              </div>

            </div>

            {/* COLUMN 2: STATUTORY DEDUCTION TAX WORKBENCH & iTAX PLATFORM (5 cols) */}
            <div className="lg:col-span-5 flex flex-col space-y-6">
              
              {/* Box 1: Kenya statutory KRA Tax Planner (perfectly modeled on Kenya scale guidelines) */}
              <div className="bg-[#141E33] border border-[#233555] rounded-2xl p-6 shadow-2xl flex flex-col justify-between">
                <div>
                  
                  <div className="flex items-center space-x-2 text-[#E5C158] pb-4 mb-4 border-b border-[#233555]">
                    <Percent className="w-5 h-4 text-[#E5C158]" />
                    <h3 className="font-bold text-base text-white tracking-wide">Kenya Statutory Salary Deduction slip</h3>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4 font-light">
                    Simulate standard Kenyan tax deductions (updated standard PAYE, NSSF funds, SHIF healthcare fee at 2.75%, and Affordable Housing Levy at 1.5%).
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block font-bold mb-1.5">Gross Base Monthly Salary (KES):</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-3 text-slate-400 text-xs font-bold">KES</span>
                        <input
                          type="number"
                          value={inputSalary}
                          onChange={(e) => setInputSalary(e.target.value)}
                          placeholder="e.g. 100000"
                          className="w-full bg-[#111929] border border-[#202E4E] pl-12 pr-4 py-2.5 text-sm font-mono rounded-xl text-white focus:outline-none focus:border-[#E5C158]"
                        />
                      </div>

                      {/* Presets */}
                      <div className="flex gap-1.5 mt-2.5">
                        {['50000', '100000', '180000', '350000'].map((val) => (
                          <button
                            key={val}
                            onClick={() => setInputSalary(val)}
                            className={`text-[10px] font-mono px-2 py-1 rounded transition-colors cursor-pointer ${inputSalary === val ? 'bg-[#E5C158] text-[#0E1525] font-bold' : 'bg-slate-800 text-gray-400 hover:text-white'}`}
                          >
                            {formatKES(parseFloat(val))}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tax slip calculation summary table */}
                    <div className="bg-[#111929] border border-[#1E2E4A] rounded-xl p-4 font-mono leading-tight space-y-3.5">
                      <div className="flex justify-between text-[11px] text-gray-400 pb-2 border-b border-[#1E2E4A]">
                        <span>DEDUCTION SPLIT</span>
                        <span>MONTHLY STATEMENT</span>
                      </div>

                      <div className="flex justify-between text-xs text-white">
                        <span>Original Gross Salary:</span>
                        <span className="font-bold font-mono">{formatKES(taxCalculations.gross)}</span>
                      </div>

                      <div className="flex justify-between text-xs text-red-300">
                        <span className="flex items-center gap-1.5 text-gray-400">
                          <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                          NSSF Fund (Tier 1+2 cap):
                        </span>
                        <span className="font-mono">-{formatKES(taxCalculations.nssf)}</span>
                      </div>

                      <div className="flex justify-between text-xs text-red-300">
                        <span className="flex items-center gap-1.5 text-gray-400">
                          <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                          Affordable Housing Levy (1.5%):
                        </span>
                        <span className="font-mono">-{formatKES(taxCalculations.housingLevy)}</span>
                      </div>

                      <div className="flex justify-between text-xs text-red-300">
                        <span className="flex items-center gap-1.5 text-gray-400">
                          <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                          SHIF Levy (2.75%):
                        </span>
                        <span className="font-mono">-{formatKES(taxCalculations.shif)}</span>
                      </div>

                      <div className="flex justify-between text-xs text-red-300">
                        <span className="flex items-center gap-1.5 text-gray-400">
                          <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
                          Net PAYE (After Relief):
                        </span>
                        <span className="font-mono">-{formatKES(taxCalculations.netPaye)}</span>
                      </div>

                      <div className="pt-3 border-t border-[#1C2C47] flex justify-between text-sm text-[#E5C158] font-bold">
                        <span>Net Take-home Salary:</span>
                        <span className="font-mono">{formatKES(taxCalculations.netSalary)}</span>
                      </div>
                    </div>

                    {/* Tax notes info pop */}
                    <div className="flex items-start space-x-2.5 p-3.5 bg-slate-800/45 border border-slate-700 rounded-xl">
                      <AlertCircle className="w-4.5 h-4.5 text-[#E5C158] shrink-0 mt-0.5" />
                      <p className="text-[10.5px] text-gray-300 leading-normal font-light">
                        Kenya Tax Code Audit Note: Personal relief is factored in at 2,400 KES. Universal SHIF is processed at 2.75% as per recent Ministry revisions.
                      </p>
                    </div>

                  </div>

                </div>
              </div>

              {/* Auditor's Console Feed */}
              <div className="bg-[#111929] border border-[#202E4E] rounded-2xl p-5 shadow-2xl">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block pb-3 font-bold">System Auditor Console Feed</span>
                <div className="bg-black/40 border border-[#1C2C47] rounded-xl p-4 font-mono text-[10.5px] text-emerald-400 space-y-2 h-[130px] overflow-y-auto scrollbar-thin">
                  {auditLogs.map((log, key) => (
                    <div key={key} className="leading-normal">
                      {log}
                    </div>
                  ))}
                  {isReconciliationRunning && (
                    <div className="animate-pulse text-[#E5C158] font-bold">
                      [AUDITOR PROCESS] Matching trial balances... Please wait.
                    </div>
                  )}
                </div>

                {auditResult !== 'idle' && (
                  <div className="mt-3.5">
                    {auditResult === 'balanced' ? (
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        <span>Ledgers reconcile perfectly. Zero unexplained drift indexes!</span>
                      </div>
                    ) : (
                      <div className="p-3 bg-red-500/10 border border-red-500/25 rounded-xl text-red-400 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4.5 h-4.5" />
                        <span>Bookkeeping ledger alert detected. Check balances!</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* RECONCILING THE REAL STORIES - SUCCESS CASE STUDIES CASE MODULE */}
      <section id="casestudies" className="py-24 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="max-w-2xl mb-16">
            <span className="font-mono text-xs font-bold tracking-widest text-[#A17F19] uppercase block mb-1">Impact Case Studies</span>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Solving Complex Ledger Challenges</h2>
            <p className="text-slate-600 font-light text-sm mt-2 leading-relaxed">
              Below are typical examples of accounting solutions engineered for business clients, demonstrating the enormous impact of meticulous ledger control.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Case Study 1 */}
            <div className="bg-[#F8F9FA] rounded-2xl p-6.5 border border-gray-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-amber-600 block pb-2">01. Balance Discrepancy Rescue</span>
                <h3 className="font-bold text-base text-slate-800 mb-3 leading-snug">Recovering KES 1.2M in Unmatched Supplier Credits</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-light mb-4">
                  A local logistics company had accumulated millions in unmatched supplier journals over 18 months, leading to overpayments. Veronica audited the purchase sub-ledgers against bank clearing logs, constructed perfect reconciliations, and trapped overpayments.
                </p>
              </div>
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-mono">Client Type: Logistics</span>
                <span className="font-bold text-slate-700">Solved Status</span>
              </div>
            </div>

            {/* Case Study 2 */}
            <div className="bg-[#F8F9FA] rounded-2xl p-6.5 border border-gray-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-emerald-600 block pb-2">02. iTax Penalty Prevention</span>
                <h3 className="font-bold text-base text-slate-800 mb-3 leading-snug">Filing Backlogged Statutory VAT & PAYE</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-light mb-4">
                  A retail business faced huge punitive compliance penalties due to inconsistent statutory returns filings on the KRA iTax portal. Veronica restructured physical payroll sheets, computed taxes with exact legal provisions, filed pending reports, and saved penalties.
                </p>
              </div>
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-mono">Client Type: Retail Enterprise</span>
                <span className="font-bold text-slate-700">Fully Complied</span>
              </div>
            </div>

            {/* Case Study 3 */}
            <div className="bg-[#F8F9FA] rounded-2xl p-6.5 border border-gray-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-indigo-600 block pb-2">03. Digital Ledger Migration</span>
                <h3 className="font-bold text-base text-slate-800 mb-3 leading-snug">Migrating Paper Books to QuickBooks Cloud</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-light mb-4">
                  A professional services business with high ledger volume was bogged down by paper vouchers and offline spreadsheets. Veronica established a structured QuickBooks Cloud integration, streamlined client charting, and automated statement exports with zero data loss.
                </p>
              </div>
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-mono">Client Type: Consultancy Retainer</span>
                <span className="font-bold text-slate-700">Deployed Cloud</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* MILESTONE TIMELINE & WORK HISTORY */}
      <section id="experience" className="py-24 bg-[#ECEEF2] border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-16 gap-6">
            <div>
              <span className="font-mono text-xs font-bold tracking-widest text-[#A17F19] uppercase block mb-1">Corporate History Logs</span>
              <h2 className="text-3xl font-black text-slate-850 tracking-tight">Professional Experience & Academic Milestones</h2>
            </div>

            {/* Timeline switch filters */}
            <div className="flex bg-white/70 backdrop-blur p-1 rounded-xl border border-gray-300 w-fit shrink-0">
              <button
                onClick={() => setActiveTimelineType('all')}
                className={`px-4.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${activeTimelineType === 'all' ? 'bg-[#0E1525] text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}
              >
                All Terms
              </button>
              <button
                onClick={() => setActiveTimelineType('experience')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 ${activeTimelineType === 'experience' ? 'bg-[#A17F19] text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                Employment
              </button>
              <button
                onClick={() => setActiveTimelineType('education')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 ${activeTimelineType === 'education' ? 'bg-[#2A4365] text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                Education
              </button>
            </div>
          </div>

          {/* Timeline Nodes */}
          <div className="max-w-4xl mx-auto relative pl-6 sm:pl-8 border-l-2 border-slate-300 space-y-12">
            <AnimatePresence mode="popLayout">
              {filteredTimeline.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                  className="relative group"
                >
                  {/* Bullet checkpoint on line */}
                  <span className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-[11.5px] h-[11.5px] rounded-full ring-4 bg-white transition-transform group-hover:scale-120 ${item.type === 'experience' ? 'ring-amber-500 border border-amber-600' : 'ring-blue-800 border border-blue-950'}`} />

                  {/* Period badge */}
                  <span className="font-mono text-xs font-bold text-slate-500 tracking-wide pb-1 block">
                    {item.period}
                  </span>

                  <h3 className="text-lg font-bold text-[#1F2937] leading-tight">
                    {item.role}
                  </h3>
                  <p className="text-xs font-semibold text-slate-600 pb-4">
                    {item.organization}
                  </p>

                  <ul className="space-y-2 max-w-2xl">
                    {item.description.map((point, index) => (
                      <li key={index} className="flex items-start text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
                        <span className="text-emerald-500 font-bold pr-2.5">✔</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* SECURE DIRECT CONFLICT FREE CONTACT & ENVELOPE SHEET */}
      <section id="contact" className="py-24 bg-[#0E1525] text-white overflow-hidden relative">
        <div className="absolute top-1/2 left-2/3 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            
            {/* Contact left info */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs font-bold tracking-widest text-[#E5C158] uppercase block mb-1">Corporate Retainer Desk</span>
                <h2 className="text-3xl sm:text-4.5xl font-black tracking-tight leading-tight mb-4">Let's Solidify Your Books</h2>
                <p className="text-slate-300 font-light text-sm sm:text-base leading-relaxed mb-6">
                  Are you ready to establish bulletproof internal controls, fix pending bank discrepancies, calculate statutory payroll slips complying with the new laws, and reconcile accounts on time? Send a secure inquiry instantly on WhatsApp.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3.5">
                    <div className="p-3 bg-slate-800/80 border border-slate-700/60 rounded-xl text-[#E5C158]">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-gray-400 uppercase leading-none block">Corporate Dial Core</span>
                      <span className="text-sm font-semibold tracking-wide text-white block pt-1">{PERSONAL_INFO.phone}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3.5">
                    <div className="p-3 bg-slate-800/80 border border-slate-700/60 rounded-xl text-[#E5C158]">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-gray-400 uppercase leading-none block">Compliance Mail</span>
                      <span className="text-sm font-semibold tracking-wide text-white block pt-1">{PERSONAL_INFO.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Callout Button */}
              <div className="pt-8 bg-gradient-to-tr from-[#141C2C] to-transparent border border-[#202E4E]/40 p-5 rounded-2xl mt-8">
                <p className="text-xs text-slate-300 leading-normal mb-3 font-normal">
                  Want to exchange financial schedules directly or consult immediately? Tap below to establish direct WhatsApp chat.
                </p>
                <a
                  href={PERSONAL_INFO.whatsappUrl}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#25D366] to-[#128C7E] px-4.5 py-2.5 font-bold uppercase tracking-wider text-white text-xs rounded-xl shadow-md cursor-pointer hover:brightness-105"
                >
                  <Smartphone className="w-4 h-4" />
                  WhatsApp Direct Consult
                </a>
              </div>
            </div>

            {/* Direct Form Block */}
            <div className="lg:col-span-7">
              <div className="bg-[#141E33] border border-[#233555] rounded-3xl p-6.5 sm:p-8 shadow-2xl">
                
                <div className="pb-5 mb-6 border-b border-[#233555]">
                  <h3 className="font-bold text-base text-white tracking-wide flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#E5C158]" />
                    Compose Secured Bookkeeping Request
                  </h3>
                  <p className="text-xs text-gray-400">Instantly routed via WhatsApp API for quick attention</p>
                </div>

                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block pb-1.5 font-bold">Your Name / Company:</label>
                      <input
                        type="text"
                        required
                        value={visitorName}
                        onChange={(e) => setVisitorName(e.target.value)}
                        placeholder="e.g. Acme Logistics Ltd"
                        className="w-full bg-[#111929] border border-[#202E4E] px-3.5 py-3 text-xs rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#E5C158] transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block pb-1.5 font-bold">Inquiry Context Target:</label>
                      <select className="w-full bg-[#111929] border border-[#202E4E] px-2.5 py-3 text-xs rounded-xl text-white focus:outline-none focus:border-[#E5C158]">
                        <option value="bookkeeping">Trial Balance & Full Bookkeeping</option>
                        <option value="kra">Statutory Tax Filing (VAT, PAYE on iTax)</option>
                        <option value="audits">Audit prep Reconciliation Audit</option>
                        <option value="consulting">General Accounting Consultation</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block pb-1.5 font-bold">Descriptive Reconciliation Issue / Requirement:</label>
                    <textarea
                      rows={4}
                      required
                      value={visitorMsg}
                      onChange={(e) => setVisitorMsg(e.target.value)}
                      placeholder="e.g. We require recurring payroll processing, SHIF deductions calculation, monthly bank reconciliation of three active ledger cards..."
                      className="w-full bg-[#111929] border border-[#202E4E] px-3.5 py-3 text-xs rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#E5C158] transition-all font-light leading-relaxed"
                    />
                  </div>

                  {notification && (
                    <div className="p-3 bg-emerald-500/15 border border-emerald-500/25 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                      <Clock className="w-4 h-4 animate-spin" />
                      <span>{notification}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-[#E5C158] hover:bg-[#CDA12C] text-[#0A0E18] text-xs font-bold uppercase tracking-wider py-3.5 rounded-xl transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Dispatch Instant WhatsApp Alert</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

              </div>
            </div>

          </div>

          {/* Sincere Signature Badge */}
          <div className="pt-20 border-t border-[#1C2D4E]/50 mt-16 text-center text-xs text-slate-500 font-mono tracking-wide leading-relaxed">
            <p className="font-bold text-slate-400">© {new Date().getFullYear()} {PERSONAL_INFO.name}. All Rights Reserved.</p>
            <p className="pt-1.5 text-[10px] text-zinc-650">Accounting Standards, KRA Regulations Compliant. Professional Stately Presentation.</p>
          </div>

        </div>
      </section>

    </div>
  );
}

// Minimal placeholder icons to keep bundle clean and compiled properly
function FolderTextIcon() {
  return (
    <svg className="w-4 h-4 text-[#E5C158]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}
