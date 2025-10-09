"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db, loginWithGoogle, logout } from "@/firebase";
import { inventoryDB } from "@/inventoryFirebase";
import type { LabReport } from "@/types/lab-report";
import { ReportPreview } from "@/components/ReportPreview";
import Layout from "@/components/Layout";

export default function Reports() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState<LabReport | null>(null);
  const [loading, setLoading] = useState(true);

  // Navbar + user states
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);

  // Single search for navbar
  const [searchCode, setSearchCode] = useState("");

  // 🔹 Dark mode toggle
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // 🔹 Login / Logout
  const handleLogin = async () => {
    const userData = await loginWithGoogle();
    setUser(userData);
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setRole(null);
  };

  // 🔹 Smart Search Handler for Navbar
  const handleSmartSearch = async () => {
    const trimmedCode = searchCode.trim().toUpperCase();
    
    if (trimmedCode === "") return;

    try {
      console.log("🔍 Smart search for:", trimmedCode);

      // Check if it starts with PREC (Prescription)
      if (trimmedCode.startsWith("PREC-")) {
        console.log("📋 Detected prescription code");
        await searchPrescription(trimmedCode);
      } 
      // Otherwise treat it as a report
      else {
        console.log("📄 Detected report code");
        navigate(`/report/${trimmedCode}`);
        setSearchCode("");
      }
    } catch (err) {
      console.error("❌ Search error:", err);
      alert("Search failed. Please try again.");
    }
  };

  // 🔹 Search for prescription
  const searchPrescription = async (code: string) => {
    try {
      console.log("🔍 Searching for prescription:", code);
      
      const prescriptionsRef = collection(inventoryDB, "prescriptions");
      const querySnapshot = await getDocs(prescriptionsRef);

      console.log("📋 Total prescriptions found:", querySnapshot.size);

      let foundPrescription = null;
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        console.log("Checking:", data.precNumber);
        
        // Case-insensitive comparison and trim whitespace
        if (data.precNumber?.trim().toUpperCase() === code) {
          foundPrescription = { id: docSnap.id, ...data };
        }
      });

      if (foundPrescription) {
        console.log("✅ Prescription found:", foundPrescription);
        navigate(`/prescription`, {
          state: { 
            prescriptionData: foundPrescription, 
            disableSend: true 
          },
        });
        setSearchCode("");
      } else {
        console.error("❌ No such prescription:", code);
        alert(`No such prescription: ${code}`);
      }
    } catch (err) {
      console.error("❌ Error searching prescription:", err);
      alert("Error searching prescription. Please try again.");
    }
  };

  // 🔹 Fetch Report Data (when URL has report ID)
  useEffect(() => {
    async function fetchReport() {
      if (!id) {
        setLoading(false);
        return;
      }
      
      try {
        console.log("📄 Fetching report:", id);
        const docRef = doc(db, "reports", id);
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
          console.log("✅ Report found:", id);
          setReport(snapshot.data() as LabReport);
        } else {
          console.error("❌ No such report:", id);
          setReport(null);
        }
      } catch (err) {
        console.error("❌ Error fetching report:", err);
        setReport(null);
      } finally {
        setLoading(false);
      }
    }
    fetchReport();
  }, [id]);

  return (
    <Layout
      isDarkMode={isDarkMode}
      toggleDarkMode={toggleDarkMode}
      user={user}
      role={role}
      handleLogin={handleLogin}
      handleLogout={handleLogout}
      searchCode={searchCode}
      setSearchCode={setSearchCode}
      handleSearch={handleSmartSearch}
    >
      {/* 🧾 Report Display */}
      {loading && <p className="text-center mt-6">Loading...</p>}
      {!loading && id && !report && (
        <p className="text-center mt-6 text-red-600 dark:text-red-400">
          Report not found: {id}
        </p>
      )}
      {!loading && report && <ReportPreview report={report} />}
    </Layout>
  );
}