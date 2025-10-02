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
  
    // ✅ Physical
    volume?: string;
    color?: string;
    appearance?: string;
    specificGravity?: string;
    pH?: string;
  
    // ✅ Chemical
    protein?: string;
    glucose?: string;
    ketoneBodies?: string;
    urobilinogen?: string;
    bilirubin?: string;
    haemoglobin?: string;
    nitrite?: string;
  
    // ✅ Microscopic
    rbcs?: string;
    wbcs?: string;
    leukocytes?: string;
    epithelialCells?: string;
    bacteria?: string;
    yeast?: string;
    casts?: string;
    crystals?: string;
    others?: string;
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
