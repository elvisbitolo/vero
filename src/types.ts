/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Skill {
  id: string;
  name: string;
  category: 'accounting' | 'taxation' | 'software';
  rating: number; // 1 to 5
  description: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  year: string;
  credentialId?: string;
  type: 'professional' | 'academic' | 'software';
  skillsLinked: string[];
}

export interface TimelineEvent {
  id: string;
  period: string;
  role: string;
  organization: string;
  description: string[];
  type: 'experience' | 'education';
}

export interface LedgerEntry {
  id: string;
  date: string;
  description: string;
  category: string;
  type: 'debit' | 'credit';
  amount: number;
}
