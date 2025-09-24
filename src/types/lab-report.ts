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
  age: number;
  sex: 'Male' | 'Female' | 'Other';
  referringDoctor: string;
  sampleId: string;
  collectionDateTime: string;
}

export interface TestResult {
  testName: string;
  result: 'Positive' | 'Negative';
  species?: string[];
  parasiteDensity?: number;
}

export interface LabReport {
  reportId: string;
  patient: PatientInfo;
  tests: {
    malarialParasites: {
      selected: boolean;
      result?: 'Positive' | 'Negative';
      // Individual species results - NEW FIELDS
      pFalciparumResult?: 'Positive' | 'Negative';
      pVivaxResult?: 'Positive' | 'Negative';
      parasiteDensity?: number;
      // Removed: species array is no longer needed
      // species?: ('P. falciparum' | 'P. vivax')[];
    };
    dengueNS1: {
      selected: boolean;
      result?: 'Positive' | 'Negative';
    };
  };
  technicianName: string;
  verifiedBy: string;
  verificationDate: string;
}