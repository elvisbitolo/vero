/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Skill, Certification, TimelineEvent, LedgerEntry } from './types';

export const PERSONAL_INFO = {
  name: 'Veronica Ongachi',
  title: 'Professional Financial Accountant & Tax Specialist',
  email: 'Veronicaongachi254@gmail.com',
  phone: '+254 714 014659',
  whatsappUrl: 'https://wa.me/254714014659?text=Hello%20Veronica,%20I%20viewed%20your%20professional%20accounting%20portfolio%20and%20would%20like%20to%20consult%20with%20you.',
  location: 'Nairobi, Kenya',
  bio: 'A highly meticulous and results-driven Financial Accountant specializing in corporate bookkeeping, tax compliance (KRA iTax), computerized accounting configurations, and rigorous reconciliation of journals and statutory filings.',
  portraitUrl: '/src/assets/images/vero.jpg',
  aboutLong: 'With extensive hands-on experience in financial bookkeeping, double-entry systems, and spreadsheet engineering, I help businesses establish tight internal financial controls, maintain perfect ledger compliance, and streamline statutory deductions. I combine strong proficiency in modern accounting software (QuickBooks Online, Sage, Tally PM) with a deep understanding of standard IFRS rules, ensuring that every balance sheet, profit & loss statement, and cash flow forecast stands up to rigorous audit guidelines.'
};

export const SKILLS: Skill[] = [
  // Accounting
  {
    id: 's1',
    name: 'Financial Ledger & Bookkeeping',
    category: 'accounting',
    rating: 5,
    description: 'Expertise in double-entry bookkeeping, trial balance preparation, and compiling comprehensive bank and cash reconciliations.'
  },
  {
    id: 's2',
    name: 'Statutory Reporting & IFRS',
    category: 'accounting',
    rating: 5,
    description: 'Preparing standard P&L sheets, balance sheets, and cash flow forecasts adhering to International Financial Reporting Standards.'
  },
  {
    id: 's3',
    name: 'Cost & Budgetary Controls',
    category: 'accounting',
    rating: 4.5,
    description: 'Formulating operating budgets, analyzing expense variances, and providing actionable management accounting insight.'
  },
  // Taxation / Compliance
  {
    id: 's4',
    name: 'KRA iTax Compliance & Filing',
    category: 'taxation',
    rating: 5,
    description: 'Filing corporate income tax returns, monthly VAT (Value Added Tax), witholding tax returns, and statutory declarations.'
  },
  {
    id: 's5',
    name: 'Payroll Management & Deductions',
    category: 'taxation',
    rating: 5,
    description: 'Processing corporate payroll worksheets, calculating PAYE deductions, and processing NSSF, NHIF/SHIF and Housing Levy.'
  },
  {
    id: 's6',
    name: 'Audit Preparation & Reconciliation',
    category: 'taxation',
    rating: 4.5,
    description: 'Constructing robust audit trail documentation, mapping receipt schedules, and resolving multi-journal discrepancies.'
  },
  // Software / Tools
  {
    id: 's7',
    name: 'QuickBooks Online & Desktop',
    category: 'software',
    rating: 5,
    description: 'Setting up client COAs (Chart of Accounts), matching electronic bank feeds, inventory control, and ledger integrations.'
  },
  {
    id: 's8',
    name: 'Sage Pastel & ERP Platforms',
    category: 'software',
    rating: 4.5,
    description: 'Using enterprise systems to manage high-volume ledgers, supplier credit cycles, and payroll exports.'
  },
  {
    id: 's9',
    name: 'Advanced Excel & Sheets Modeling',
    category: 'software',
    rating: 5,
    description: 'Building dynamic financial summary sheets, VLOOKUP/XLOOKUP indexing, and automated journal formatting models.'
  }
];

export const CERTIFICATIONS: Certification[] = [
  {
    id: 'c1',
    title: 'Certified Public Accountant (CPA) - Ongoing Progress',
    issuer: 'KASNEB (Kenya Board of Accountants)',
    year: '2024',
    credentialId: 'KASNEB-CPA-90412',
    type: 'professional',
    skillsLinked: ['Statutory Reporting & IFRS', 'KRA iTax Compliance & Filing', 'Payroll Management & Deductions']
  },
  {
    id: 'c2',
    title: 'Professional Diploma in Business & Financial Accounting',
    issuer: 'Technical University / KNEC Standards',
    year: '2022',
    credentialId: 'KNEC-ACC-41223',
    type: 'academic',
    skillsLinked: ['Financial Ledger & Bookkeeping', 'Cost & Budgetary Controls']
  },
  {
    id: 'c3',
    title: 'Advanced QuickBooks Advisor Certification',
    issuer: 'Intuit Training Academy',
    year: '2023',
    credentialId: 'QB-ADV-87102',
    type: 'software',
    skillsLinked: ['QuickBooks Online & Desktop']
  },
  {
    id: 'c4',
    title: 'Enterprise ERP Accountant (Sage Systems)',
    issuer: 'Sage Certified Institute',
    year: '2023',
    credentialId: 'SAGE-ERP-55410',
    type: 'software',
    skillsLinked: ['Sage Pastel & ERP Platforms', 'Audit Preparation & Reconciliation']
  }
];

export const TIMELINE: TimelineEvent[] = [
  {
    id: 't1',
    period: '2024 - Present',
    role: 'Financial Systems Accountant',
    organization: 'Apex Professional Trading & Logistics Ltd',
    description: [
      'Manage complete accounting ledger books, reconcile supplier balances, and supervise weekly/monthly payroll workflows.',
      'Prepare and file all statutory tax requirements (VAT, PAYE, withholding tax) utilizing the KRA iTax portal directly, ensuring zero non-compliance penalties.',
      'Supervised the migration of corporate accounting logs from physical journal notebooks to QuickBooks Cloud, increasing efficiency in financial statements retrieval by 80%.',
      'Conduct comprehensive month-end bank ledger card reconciliations and reconcile general ledgers against accounts receivable sub-ledgers.'
    ],
    type: 'experience'
  },
  {
    id: 't2',
    period: '2022 - 2024',
    role: 'Associate Accountant & Bookkeeper',
    organization: 'Benchmark Professional & Audit Services',
    description: [
      'Drafted monthly trial balances, prepared raw schedules for senior auditors, and structured general Ledger registers.',
      'Calculated monthly pay slips and statutory deductions (NHIF/SHIF, NSSF, Housing Levy) for several retainer business clients.',
      'Implemented advanced, automated Excel finance models with custom controls to decrease monthly client invoice drafting time by half.'
    ],
    type: 'experience'
  },
  {
    id: 't3',
    period: '2020 - 2022',
    role: 'Diploma in Business & Financial Management (Accounting Option)',
    organization: 'Technical University Studies',
    description: [
      'Gained structured training in financial accounting, statistics, management accounting, tax computation methodologies, and commercial law.',
      'Received distinction grade in Computerized Accounting and Spreadsheet Systems design coursework.'
    ],
    type: 'education'
  },
  {
    id: 't4',
    period: '2019 - Present',
    role: 'Certified Public Accountant Examination Track',
    organization: 'KASNEB Professional Exams',
    description: [
      'Consistently passing professional examination modules targeting auditing, Kenyan taxation models, public finance management, and financial reporting standards.'
    ],
    type: 'education'
  }
];

export const MOCK_LEDGER: LedgerEntry[] = [
  { id: 'l1', date: '2026-06-15', description: 'Monthly Office Internet & Broadband Relay', category: 'Operating Expenses', type: 'debit', amount: 12500 },
  { id: 'l2', date: '2026-06-16', description: 'Consulting Retainer Revenue Recieved', category: 'Professional Services', type: 'credit', amount: 280000 },
  { id: 'l3', date: '2026-06-17', description: 'Government Statutory KRA Tax Payment', category: 'Direct Taxes', type: 'debit', amount: 48000 },
  { id: 'l4', date: '2026-06-18', description: 'Accounts Audit Reconciliation Bonus Fee', category: 'Professional Services', type: 'credit', amount: 120000 },
  { id: 'l5', date: '2026-06-19', description: 'Reserve Allocation for Staff Payroll Funding', category: 'Audit Reserve', type: 'debit', amount: 35000 }
];
