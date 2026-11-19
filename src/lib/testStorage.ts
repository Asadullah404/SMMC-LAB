// src/lib/testStorage.ts
import { collection, doc, getDoc, getDocs, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { TestTemplate, CanvasTemplate } from "@/types/dynamic-test";
import { DEFAULT_TESTS, DEFAULT_CANVAS_TEMPLATES, createDefaultCanvasTemplate } from "./defaultTests";

const LOCAL_STORAGE_TESTS_KEY = "smmc_dynamic_tests_v2";
const LOCAL_STORAGE_TEMPLATES_KEY = "smmc_canvas_templates_v2";

/**
 * Loads all test templates. Tries Firestore first; merges with local storage and defaults.
 */
export async function getTestTemplates(): Promise<TestTemplate[]> {
  const localRaw = localStorage.getItem(LOCAL_STORAGE_TESTS_KEY);
  let localTests: TestTemplate[] = [];

  if (localRaw) {
    try {
      localTests = JSON.parse(localRaw);
    } catch (e) {
      console.warn("Failed to parse local tests cache:", e);
    }
  }

  // If local is completely empty, initialize with defaults
  if (localTests.length === 0) {
    localTests = [...DEFAULT_TESTS];
    localStorage.setItem(LOCAL_STORAGE_TESTS_KEY, JSON.stringify(localTests));
  }

  // Attempt Firestore sync
  try {
    const colRef = collection(db, "test_templates");
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      const firestoreTests: TestTemplate[] = [];
      snapshot.forEach((d) => {
        firestoreTests.push({ id: d.id, ...d.data() } as TestTemplate);
      });

      // Merge firestore with local
      const mergedMap = new Map<string, TestTemplate>();
      // defaults first
      DEFAULT_TESTS.forEach((t) => mergedMap.set(t.id, t));
      // local second
      localTests.forEach((t) => mergedMap.set(t.id, t));
      // firestore priority
      firestoreTests.forEach((t) => mergedMap.set(t.id, t));

      const merged = Array.from(mergedMap.values());
      localStorage.setItem(LOCAL_STORAGE_TESTS_KEY, JSON.stringify(merged));
      return merged;
    }
  } catch (err) {
    console.log("Firestore test_templates fetch skipped or offline, using local storage cache.");
  }

  return localTests;
}

/**
 * Save or update a test template (both in local storage and Firestore)
 */
export async function saveTestTemplate(test: TestTemplate): Promise<void> {
  const local = await getTestTemplates();
  const existingIdx = local.findIndex((t) => t.id === test.id);
  let updated: TestTemplate[];

  if (existingIdx >= 0) {
    updated = [...local];
    updated[existingIdx] = { ...test, updatedAt: new Date().toISOString() };
  } else {
    updated = [...local, { ...test, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }];
  }

  localStorage.setItem(LOCAL_STORAGE_TESTS_KEY, JSON.stringify(updated));

  // Sync to Firestore if online
  try {
    const docRef = doc(db, "test_templates", test.id);
    await setDoc(docRef, { ...test, updatedAt: new Date().toISOString() });
  } catch (err) {
    console.warn("Could not sync test template to Firestore:", err);
  }

  // Also ensure a canvas template exists for this test
  const existingTemplate = await getCanvasTemplate(test.id);
  if (!existingTemplate) {
    const defaultTemplate = createDefaultCanvasTemplate(test.id, test.name);
    await saveCanvasTemplate(defaultTemplate);
  }
}

/**
 * Delete a test template
 */
export async function deleteTestTemplate(testId: string): Promise<void> {
  const local = await getTestTemplates();
  const filtered = local.filter((t) => t.id !== testId);
  localStorage.setItem(LOCAL_STORAGE_TESTS_KEY, JSON.stringify(filtered));

  try {
    const docRef = doc(db, "test_templates", testId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn("Could not delete test template from Firestore:", err);
  }
}

/**
 * Get canvas template for a specific test
 */
export async function getCanvasTemplate(testId: string): Promise<CanvasTemplate> {
  const localRaw = localStorage.getItem(LOCAL_STORAGE_TEMPLATES_KEY);
  let templates: Record<string, CanvasTemplate> = {};

  if (localRaw) {
    try {
      templates = JSON.parse(localRaw);
    } catch (e) {
      console.warn("Failed to parse canvas templates cache:", e);
    }
  }

  if (templates[testId]) {
    return templates[testId];
  }

  // Check Firestore
  try {
    const docRef = doc(db, "canvas_templates", testId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = { id: snap.id, ...snap.data() } as CanvasTemplate;
      templates[testId] = data;
      localStorage.setItem(LOCAL_STORAGE_TEMPLATES_KEY, JSON.stringify(templates));
      return data;
    }
  } catch (err) {
    console.log("Firestore canvas_templates fetch skipped, using default.");
  }

  // Return default or auto-create
  if (DEFAULT_CANVAS_TEMPLATES[testId]) {
    return DEFAULT_CANVAS_TEMPLATES[testId];
  }

  const generated = createDefaultCanvasTemplate(testId, "Laboratory Test");
  templates[testId] = generated;
  localStorage.setItem(LOCAL_STORAGE_TEMPLATES_KEY, JSON.stringify(templates));
  return generated;
}

/**
 * Save canvas template
 */
export async function saveCanvasTemplate(template: CanvasTemplate): Promise<void> {
  const localRaw = localStorage.getItem(LOCAL_STORAGE_TEMPLATES_KEY);
  let templates: Record<string, CanvasTemplate> = {};

  if (localRaw) {
    try {
      templates = JSON.parse(localRaw);
    } catch (_err) {
      // ignore
    }
  }

  templates[template.testId] = {
    ...template,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(LOCAL_STORAGE_TEMPLATES_KEY, JSON.stringify(templates));

  // Sync to Firestore
  try {
    const docRef = doc(db, "canvas_templates", template.testId);
    await setDoc(docRef, { ...template, updatedAt: new Date().toISOString() });
  } catch (err) {
    console.warn("Could not sync canvas template to Firestore:", err);
  }
}
