// export interface PatientInfo {
//   name: string;
//   relation: string;
//   age: number;
//   sex: 'Male' | 'Female' | 'Other';
//   referringDoctor: string;
//   sampleId: string;
//   collectionDateTime: string;
// }

// export interface TestResult {
//   testName: string;
//   result: 'Positive' | 'Negative';
//   species?: string[];
//   parasiteDensity?: number;
// }

// export interface LabReport {
//   reportId: string;
//   patient: PatientInfo;
//   tests: {
//     malarialParasites: {
//       selected: boolean;
//       result?: 'Positive' | 'Negative';
//       species?: ('P. falciparum' | 'P. vivax')[];
//       parasiteDensity?: number;
//     };
//     dengueNS1: {
//       selected: boolean;
//       result?: 'Positive' | 'Negative';
//     };
//   };
//   technicianName: string;
//   verifiedBy: string;
//   verificationDate: string;
// }
export interface PatientInfo {
  name: string;
  relation: string;
  age?: number;
  sex?: "Male" | "Female" | "Other";
  referringDoctor: string;
  sampleId: string;
  collectionDateTime: string;
}

export interface Tests {
  malarialParasites: {
    selected: boolean;
    result?: "Positive" | "Negative";
    pFalciparumResult?: "Positive" | "Negative";
    pVivaxResult?: "Positive" | "Negative";
    parasiteDensity?: number;
  };
  dengueNS1: {
    selected: boolean;
    result?: "Positive" | "Negative";
  };
  urine: {
    selected: boolean;
    volume?: string;
    color?: string;
    appearance?: string;
    specificGravity?: string;
    pH?: string;
    protein?: string;
    rbcs?: string;
    wbcs?: string;
    ketones?: string;
    urobilinogen?: string;
  };
}

export interface LabReport {
  reportId: string; // ✅ Add this
  patient: PatientInfo;
  tests: Tests;
  technicianName: string;
  verifiedBy: string;
  verificationDate: string;
  notes?: string;   // ✅ Add this
}
