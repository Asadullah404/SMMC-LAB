// src/types/dynamic-test.ts

export type FieldType =
  | 'text'
  | 'number'
  | 'select'
  | 'multiselect'
  | 'boolean'
  | 'textarea';

export interface FieldOption {
  label: string;
  value: string;
  isAbnormal?: boolean; // Highlight flag (e.g. 'Positive' or 'Reactive')
}

export interface FieldDefinition {
  id: string;
  key: string;              // Machine key (e.g. 'pFalciparum', 'volume')
  label: string;            // Display label (e.g. 'P. falciparum', 'Volume')
  type: FieldType;
  options?: FieldOption[];   // For 'select' or 'multiselect'
  unit?: string;            // Custom unit (e.g. '/HPF', 'mg/dL', 'ml')
  referenceRange?: string;  // Normal range (e.g. '0 - 4 /HPF', 'Negative')
  defaultValue?: string | number | boolean;
  required?: boolean;
  placeholder?: string;
  section?: string;         // e.g. 'Physical Examination', 'Microscopic'
  order: number;
}

export interface TestSection {
  id: string;
  name: string;             // e.g. 'Physical Examination', 'Chemical Examination'
  order: number;
}

export interface TestTemplate {
  id: string;               // e.g. 'malaria', 'dengue', 'urine'
  code: string;             // e.g. 'TEST-MAL-001'
  name: string;             // e.g. 'Malarial Parasites'
  category: string;         // e.g. 'Parasitology', 'Serology', 'Biochemistry'
  method?: string;          // e.g. 'ICT', 'Microscopy', 'Strip'
  description?: string;
  price?: number;
  sections: TestSection[];
  fields: FieldDefinition[];
  defaultNotes?: string;
  isBuiltIn?: boolean;      // Marks auto-seeded default tests
  createdAt: string;
  updatedAt: string;
}

export type CanvasBlockType =
  | 'header'
  | 'patient-info'
  | 'results-table'
  | 'doctor-notes'
  | 'footer-signature'
  | 'watermark';

export interface CanvasBlockConfig {
  title?: string;
  showOnlyPatientName?: boolean;  // Strict user requirement: display only patient name
  showDoctorName?: boolean;
  showSampleId?: boolean;
  showCollectionDate?: boolean;
  showAgeGender?: boolean;
  fontSize?: number;
  textColor?: string;
  borderColor?: string;
  backgroundColor?: string;
  showBorders?: boolean;
  customText?: string;
  logoUrl?: string;
  headerImageUrl?: string;
  columns?: string[];            // e.g. ['Test Parameter', 'Result', 'Unit', 'Normal Range']
}

export interface CanvasBlock {
  id: string;
  type: CanvasBlockType;
  x: number;                     // X position in mm
  y: number;                     // Y position in mm
  width: number;                 // Width in mm
  height?: number;               // Optional fixed height in mm
  visible: boolean;
  config: CanvasBlockConfig;
}

export interface CanvasTemplate {
  id: string;
  testId: string;                // References TestTemplate ID or 'all'
  name: string;
  pageSize: 'A4' | 'Letter';
  orientation: 'portrait' | 'landscape';
  margins: { top: number; right: number; bottom: number; left: number };
  blocks: CanvasBlock[];
  updatedAt: string;
}

export interface DynamicReportRecord {
  id?: string;
  reportId: string;
  patient: {
    name: string;
    relation?: string;
    age?: number;
    sex?: 'Male' | 'Female' | 'Other';
    referringDoctor: string;
    sampleId: string;
    collectionDateTime: string;
    phone?: string;
  };
  selectedTestIds: string[];
  results: Record<string, Record<string, string | number | boolean | null | undefined>>; // testId -> { fieldKey: value }
  notes?: string;
  technicianName: string;
  verifiedBy: string;
  verificationDate: string;
  createdBy?: string;
  createdAt: string;
}
