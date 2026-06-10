export interface Lead {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  company_name: string;
  lead_source: string;
  status: string;
  notes: string;
  created_at: string;
}

export const leadSources = [
  'Website',
  'Facebook',
  'Instagram',
  'Google Ads',
  'Referral',
  'LinkedIn',
];

export const statusOptions = [
  'New',
  'Contacted',
  'Qualified',
  'Converted',
  'Lost',
];

export const sampleLeads: Lead[] = [
  {
    id: '1',
    full_name: 'John Smith',
    email: 'john.smith@techcorp.com',
    phone: '+1 555-123-4567',
    company_name: 'TechCorp Inc.',
    lead_source: 'Website',
    status: 'New',
    notes: 'Interested in enterprise plan',
    created_at: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    full_name: 'Sarah Johnson',
    email: 'sarah.j@innovate.io',
    phone: '+1 555-234-5678',
    company_name: 'Innovate Solutions',
    lead_source: 'LinkedIn',
    status: 'Contacted',
    notes: 'Requested demo call',
    created_at: '2024-01-14T14:20:00Z',
  },
  {
    id: '3',
    full_name: 'Michael Chen',
    email: 'm.chen@startup.co',
    phone: '+1 555-345-6789',
    company_name: 'StartupCo',
    lead_source: 'Referral',
    status: 'Qualified',
    notes: 'Ready to close deal',
    created_at: '2024-01-13T09:15:00Z',
  },
  {
    id: '4',
    full_name: 'Emily Davis',
    email: 'emily.d@enterprise.com',
    phone: '+1 555-456-7890',
    company_name: 'Enterprise Ltd.',
    lead_source: 'Google Ads',
    status: 'Converted',
    notes: 'Premium subscription signed',
    created_at: '2024-01-12T16:45:00Z',
  },
  {
    id: '5',
    full_name: 'Robert Wilson',
    email: 'r.wilson@company.net',
    phone: '+1 555-567-8901',
    company_name: 'CompanyNet',
    lead_source: 'Facebook',
    status: 'Lost',
    notes: 'Chose competitor',
    created_at: '2024-01-11T11:00:00Z',
  },
];

export const monthlyLeadsData = [
  { month: 'Jan', leads: 45, converted: 12 },
  { month: 'Feb', leads: 52, converted: 18 },
  { month: 'Mar', leads: 61, converted: 22 },
  { month: 'Apr', leads: 48, converted: 15 },
  { month: 'May', leads: 72, converted: 28 },
  { month: 'Jun', leads: 85, converted: 35 },
];

export const leadSourceData = [
  { name: 'Website', value: 35, color: '#3b82f6' },
  { name: 'LinkedIn', value: 25, color: '#8b5cf6' },
  { name: 'Google Ads', value: 20, color: '#22c55e' },
  { name: 'Referral', value: 12, color: '#f59e0b' },
  { name: 'Facebook', value: 5, color: '#ef4444' },
  { name: 'Instagram', value: 3, color: '#ec4899' },
];

export const conversionRateData = [
  { month: 'Jan', rate: 26.6 },
  { month: 'Feb', rate: 34.6 },
  { month: 'Mar', rate: 36.1 },
  { month: 'Apr', rate: 31.2 },
  { month: 'May', rate: 38.9 },
  { month: 'Jun', rate: 41.2 },
];
