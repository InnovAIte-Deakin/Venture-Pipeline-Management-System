// IRIS+ GEDSI Metrics Configuration for MIV Platform
// Based on IRIS+ (Impact Reporting and Investment Standards) GEDSI indicators

export interface IRISMetric {
  code: string;
  name: string;
  category: 'Gender' | 'Disability' | 'Social Inclusion' | 'Cross-cutting';
  description: string;
  unit: string;
  targetType: 'number' | 'percentage' | 'currency' | 'boolean';
  verificationRequired: boolean;
  applicableSectors: string[];
  tags: string[];
}

export const IRIS_GEDSI_METRICS: IRISMetric[] = [
  // Gender Equality Metrics
  {
    code: 'OI.1',
    name: 'Number of women-led ventures supported',
    category: 'Gender',
    description: 'Number of ventures where women hold majority ownership or leadership positions',
    unit: 'ventures',
    targetType: 'number',
    verificationRequired: true,
    applicableSectors: ['all'],
    tags: ['leadership', 'ownership', 'women-entrepreneurs']
  },
  {
    code: 'OI.2',
    name: 'Percentage of women in leadership positions',
    category: 'Gender',
    description: 'Percentage of women in senior management or board positions',
    unit: '%',
    targetType: 'percentage',
    verificationRequired: true,
    applicableSectors: ['all'],
    tags: ['leadership', 'board', 'management']
  },
  {
    code: 'OI.3',
    name: 'Number of women employees',
    category: 'Gender',
    description: 'Total number of women employed by supported ventures',
    unit: 'people',
    targetType: 'number',
    verificationRequired: true,
    applicableSectors: ['all'],
    tags: ['employment', 'workforce']
  },
  {
    code: 'OI.4',
    name: 'Gender pay gap',
    category: 'Gender',
    description: 'Difference in average compensation between men and women',
    unit: '%',
    targetType: 'percentage',
    verificationRequired: true,
    applicableSectors: ['all'],
    tags: ['compensation', 'pay-equity']
  },
  {
    code: 'OI.5',
    name: 'Number of women accessing financial services',
    category: 'Gender',
    description: 'Number of women who gained access to financial services through venture support',
    unit: 'people',
    targetType: 'number',
    verificationRequired: true,
    applicableSectors: ['financial-services', 'microfinance'],
    tags: ['financial-inclusion', 'access']
  },

  // Disability Inclusion Metrics
  {
    code: 'OI.6',
    name: 'Number of ventures led by persons with disabilities',
    category: 'Disability',
    description: 'Number of ventures where persons with disabilities hold majority ownership or leadership',
    unit: 'ventures',
    targetType: 'number',
    verificationRequired: true,
    applicableSectors: ['all'],
    tags: ['disability-leadership', 'inclusive-entrepreneurship']
  },
  {
    code: 'OI.7',
    name: 'Number of employees with disabilities',
    category: 'Disability',
    description: 'Total number of employees with disabilities across supported ventures',
    unit: 'people',
    targetType: 'number',
    verificationRequired: true,
    applicableSectors: ['all'],
    tags: ['employment', 'disability-inclusion']
  },
  {
    code: 'OI.8',
    name: 'Accessibility compliance score',
    category: 'Disability',
    description: 'Percentage of ventures meeting accessibility standards',
    unit: '%',
    targetType: 'percentage',
    verificationRequired: true,
    applicableSectors: ['all'],
    tags: ['accessibility', 'compliance']
  },
  {
    code: 'OI.9',
    name: 'Number of accessible products/services',
    category: 'Disability',
    description: 'Number of products or services designed with accessibility in mind',
    unit: 'products',
    targetType: 'number',
    verificationRequired: true,
    applicableSectors: ['technology', 'healthcare', 'education'],
    tags: ['accessible-design', 'inclusive-products']
  },

  // Social Inclusion Metrics
  {
    code: 'OI.10',
    name: 'Number of ventures in underserved communities',
    category: 'Social Inclusion',
    description: 'Number of ventures operating in rural, remote, or underserved areas',
    unit: 'ventures',
    targetType: 'number',
    verificationRequired: true,
    applicableSectors: ['all'],
    tags: ['geographic-inclusion', 'rural-development']
  },
  {
    code: 'OI.11',
    name: 'Number of ethnic minority-led ventures',
    category: 'Social Inclusion',
    description: 'Number of ventures led by ethnic minorities or indigenous peoples',
    unit: 'ventures',
    targetType: 'number',
    verificationRequired: true,
    applicableSectors: ['all'],
    tags: ['ethnic-inclusion', 'indigenous-entrepreneurship']
  },
  {
    code: 'OI.12',
    name: 'Number of youth-led ventures',
    category: 'Social Inclusion',
    description: 'Number of ventures led by entrepreneurs under 35 years old',
    unit: 'ventures',
    targetType: 'number',
    verificationRequired: true,
    applicableSectors: ['all'],
    tags: ['youth-entrepreneurship', 'generational-inclusion']
  },
  {
    code: 'OI.13',
    name: 'Number of ventures serving low-income populations',
    category: 'Social Inclusion',
    description: 'Number of ventures primarily serving low-income or economically disadvantaged populations',
    unit: 'ventures',
    targetType: 'number',
    verificationRequired: true,
    applicableSectors: ['all'],
    tags: ['economic-inclusion', 'base-of-pyramid']
  },
  {
    code: 'OI.14',
    name: 'Number of LGBTQ+ led ventures',
    category: 'Social Inclusion',
    description: 'Number of ventures led by LGBTQ+ entrepreneurs',
    unit: 'ventures',
    targetType: 'number',
    verificationRequired: true,
    applicableSectors: ['all'],
    tags: ['lgbtq-inclusion', 'diversity']
  },

  // Cross-cutting GEDSI Metrics
  {
    code: 'OI.15',
    name: 'GEDSI training participation',
    category: 'Cross-cutting',
    description: 'Number of venture team members who participated in GEDSI training',
    unit: 'people',
    targetType: 'number',
    verificationRequired: true,
    applicableSectors: ['all'],
    tags: ['capacity-building', 'training']
  },
  {
    code: 'OI.16',
    name: 'GEDSI policy adoption',
    category: 'Cross-cutting',
    description: 'Number of ventures that have adopted GEDSI policies',
    unit: 'ventures',
    targetType: 'number',
    verificationRequired: true,
    applicableSectors: ['all'],
    tags: ['policy', 'governance']
  },
  {
    code: 'OI.17',
    name: 'Inclusive hiring practices',
    category: 'Cross-cutting',
    description: 'Number of ventures implementing inclusive hiring practices',
    unit: 'ventures',
    targetType: 'number',
    verificationRequired: true,
    applicableSectors: ['all'],
    tags: ['hiring', 'inclusive-practices']
  },
  {
    code: 'OI.18',
    name: 'Supplier diversity',
    category: 'Cross-cutting',
    description: 'Percentage of suppliers from underrepresented groups',
    unit: '%',
    targetType: 'percentage',
    verificationRequired: true,
    applicableSectors: ['all'],
    tags: ['supply-chain', 'diversity']
  }
];

// Sector-specific metrics
export const SECTOR_SPECIFIC_METRICS: Record<string, IRISMetric[]> = {
  'agriculture': [
    {
      code: 'AG.1',
      name: 'Number of women farmers supported',
      category: 'Gender',
      description: 'Number of women farmers receiving support through agricultural ventures',
      unit: 'people',
      targetType: 'number',
      verificationRequired: true,
      applicableSectors: ['agriculture'],
      tags: ['farming', 'rural-women']
    }
  ],
  'technology': [
    {
      code: 'TECH.1',
      name: 'Number of women in tech roles',
      category: 'Gender',
      description: 'Number of women employed in technical positions',
      unit: 'people',
      targetType: 'number',
      verificationRequired: true,
      applicableSectors: ['technology'],
      tags: ['tech-jobs', 'stem']
    }
  ],
  'healthcare': [
    {
      code: 'HC.1',
      name: 'Access to healthcare for marginalized populations',
      category: 'Social Inclusion',
      description: 'Number of marginalized individuals gaining access to healthcare services',
      unit: 'people',
      targetType: 'number',
      verificationRequired: true,
      applicableSectors: ['healthcare'],
      tags: ['health-access', 'marginalized-populations']
    }
  ],
  'education': [
    {
      code: 'EDU.1',
      name: 'Students from underrepresented backgrounds',
      category: 'Social Inclusion',
      description: 'Number of students from underrepresented backgrounds enrolled',
      unit: 'people',
      targetType: 'number',
      verificationRequired: true,
      applicableSectors: ['education'],
      tags: ['student-diversity', 'educational-access']
    }
  ]
};

// Helper functions
export function getMetricsByCategory(category: string): IRISMetric[] {
  return IRIS_GEDSI_METRICS.filter(metric => metric.category === category);
}

export function getMetricsBySector(sector: string): IRISMetric[] {
  const sectorMetrics = SECTOR_SPECIFIC_METRICS[sector] || [];
  const generalMetrics = IRIS_GEDSI_METRICS.filter(metric => 
    metric.applicableSectors.includes('all') || metric.applicableSectors.includes(sector)
  );
  return [...generalMetrics, ...sectorMetrics];
}

export function getMetricsByTag(tag: string): IRISMetric[] {
  return IRIS_GEDSI_METRICS.filter(metric => metric.tags.includes(tag));
}

export function getAllMetrics(): IRISMetric[] {
  const allMetrics = [...IRIS_GEDSI_METRICS];
  Object.values(SECTOR_SPECIFIC_METRICS).forEach(sectorMetrics => {
    allMetrics.push(...sectorMetrics);
  });
  return allMetrics;
}

// Metric status options
export const METRIC_STATUS_OPTIONS = [
  { value: 'not_started', label: 'Not Started', color: 'gray' },
  { value: 'in_progress', label: 'In Progress', color: 'yellow' },
  { value: 'verified', label: 'Verified', color: 'green' },
  { value: 'needs_review', label: 'Needs Review', color: 'red' }
] as const;

export type MetricStatus = typeof METRIC_STATUS_OPTIONS[number]['value'];

// Verification requirements
export interface VerificationRequirement {
  type: 'document' | 'interview' | 'survey' | 'observation' | 'third_party';
  description: string;
  required: boolean;
}

export const VERIFICATION_REQUIREMENTS: Record<string, VerificationRequirement[]> = {
  'OI.1': [
    { type: 'document', description: 'Business registration showing ownership structure', required: true },
    { type: 'interview', description: 'Founder interview confirming leadership role', required: true }
  ],
  'OI.2': [
    { type: 'document', description: 'Organizational chart and employment records', required: true },
    { type: 'survey', description: 'Employee survey on leadership composition', required: false }
  ],
  'OI.6': [
    { type: 'document', description: 'Business registration and founder identification', required: true },
    { type: 'interview', description: 'Founder interview and disability confirmation', required: true }
  ]
}; 