import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db, loginWithGoogle, logout } from "@/firebase";
import type { LabReport } from "@/types/lab-report";
import { ReportPreview } from "@/components/ReportPreview";
import Layout from "@/components/Layout";
import { format } from "date-fns";

export default function Reports() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [report, setReport] = useState<LabReport | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ navbar states
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [searchCode, setSearchCode] = useState("");

  // ✅ dark mode toggle
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

  // ✅ login/logout
  const handleLogin = async () => {
    const userData = await loginWithGoogle();
    setUser(userData);
    // you can also fetch role here if needed
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setRole(null);
  };

  // ✅ report search
  const handleSearch = () => {
    if (searchCode.trim() !== "") {
      navigate(`/report/${searchCode.trim()}`);
      setSearchCode("");
    }
  };

  useEffect(() => {
    async function fetchReport() {
      if (!id) return;
      try {
        const docRef = doc(db, "reports", id);
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
          setReport(snapshot.data() as LabReport);
        } else {
          console.error("No such report:", id);
        }
      } catch (err) {
        console.error("Error fetching report:", err);
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
      handleSearch={handleSearch}
    >
      {loading && <p className="text-center">Loading report...</p>}
      {!loading && !report && <p className="text-center">Report not found</p>}
      {!loading && report && <ReportPreview report={report} />}
    </Layout>
  );
}
