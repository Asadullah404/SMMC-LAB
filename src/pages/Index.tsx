import { useState, useEffect } from "react";
import { PatientForm } from "@/components/PatientForm";
import { TestsForm } from "@/components/TestsForm";
import { ReportPreview } from "@/components/ReportPreview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // ✅ Added Input
import { useToast } from "@/hooks/use-toast";
import { LabReport } from "@/types/lab-report";
import { Microscope, Moon, Sun, User, LogOut } from "lucide-react";
import { format } from "date-fns";
import { auth, loginWithGoogle, logout, db } from "@/firebase"; // ✅ Firebase helpers
import { doc, setDoc, getDoc } from "firebase/firestore";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    "patient" | "tests" | "preview"
  >("patient");
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();

  const [searchCode, setSearchCode] = useState(""); // ✅ search state

  const [report, setReport] = useState<LabReport>({
    reportId: `REP-${format(new Date(), "yyyyMMdd")}-${String(
      Math.floor(Math.random() * 9999) + 1
    ).padStart(4, "0")}`,
    patient: {
      name: "",
      relation: "",
      age: undefined,
      sex: undefined,
      referringDoctor: "",
      sampleId: `S-${Date.now().toString().slice(-6)}`,
      collectionDateTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    },
    tests: {
      malarialParasites: {
        selected: false,
        result: undefined,
        pFalciparumResult: undefined,
        pVivaxResult: undefined,
        parasiteDensity: undefined,
      },
      dengueNS1: { selected: false, result: undefined },
    },
    technicianName: "",
    verifiedBy: "",
    verificationDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  });

  // ✅ Theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // ✅ Login with Google and fetch role
  const handleLogin = async () => {
    try {
      const userData = await loginWithGoogle();
      setUser(userData);

      const userRef = doc(db, "users", userData.uid);
      const snapshot = await getDoc(userRef);
      if (snapshot.exists()) {
        setRole(snapshot.data().role);
      }

      toast({
        title: "Login successful",
        description: `Welcome ${userData.displayName}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setRole(null);
      toast({ title: "Logged out" });
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ Save report to Firestore
  const sanitizeReport = (report: any) => {
    const clean = JSON.parse(
      JSON.stringify(report, (key, value) =>
        value === undefined ? null : value
      )
    );
    return clean;
  };

  const saveReportToFirebase = async () => {
    if (!user) {
      toast({ title: "Error", description: "You must log in first." });
      return;
    }
    if (role !== "admin") {
      toast({
        title: "Permission Denied",
        description: "Only admins can save reports.",
      });
      return;
    }

    try {
      const cleanReport = sanitizeReport(report);
      const reportRef = doc(db, "reports", report.reportId);
      await setDoc(reportRef, {
        ...cleanReport,
        createdBy: user.uid,
        createdAt: new Date().toISOString(),
      });
      toast({
        title: "Report Saved",
        description: "The report was saved successfully.",
      });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to save report." });
    }
  };

  // ✅ Reset form
  const resetForm = () => {
    setCurrentStep("patient");
    setReport({
      reportId: `REP-${format(new Date(), "yyyyMMdd")}-${String(
        Math.floor(Math.random() * 9999) + 1
      ).padStart(4, "0")}`,
      patient: {
        name: "",
        relation: "",
        age: undefined,
        sex: undefined,
        referringDoctor: "",
        sampleId: `S-${Date.now().toString().slice(-6)}`,
        collectionDateTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      },
      tests: {
        malarialParasites: {
          selected: false,
          result: undefined,
          pFalciparumResult: undefined,
          pVivaxResult: undefined,
          parasiteDensity: undefined,
        },
        dengueNS1: { selected: false, result: undefined },
      },
      technicianName: "",
      verifiedBy: "",
      verificationDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    });
  };

  // ✅ Handle report search
  const handleSearch = () => {
    if (searchCode.trim() !== "") {
      navigate(`/report/${searchCode.trim()}`);
      setSearchCode("");
    }
  };

  return (
    <div className="min-h-screen bg-background transition-medical flex flex-col">
      {/* Navbar */}
      <header className="border-b bg-card card-shadow sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* Left Logo */}
          <div className="flex items-center gap-3">
            <div className="medical-gradient p-2 rounded-lg">
              <Microscope className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-lg md:text-xl font-bold">Lab Reports</h1>
          </div>

          {/* Right Side Nav */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* ✅ Search Report */}
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Enter Report Code..."
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-40 md:w-60"
              />
              <Button variant="default" size="sm" onClick={handleSearch}>
                Search
              </Button>
            </div>

            {/* Dark Mode Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleDarkMode}
              className="gap-1 md:gap-2"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="hidden sm:inline">
                {isDarkMode ? "Light" : "Dark"}
              </span>
            </Button>

            {/* Login / Profile Drawer */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1 md:gap-2">
                  {user ? <User className="h-4 w-4" /> : "Login"}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 sm:w-80">
                <SheetHeader>
                  <SheetTitle>User Panel</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {!user ? (
                    <Button className="w-full" onClick={handleLogin}>
                      Sign in with Google
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.photoURL || ""} />
                          <AvatarFallback>
                            {user.displayName?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.displayName}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                          <p className="text-xs italic text-muted-foreground">
                            Role: {role || "loading..."}
                          </p>
                        </div>
                      </div>

                      {role === "admin" && (
                        <Button className="w-full" variant="secondary">
                          + Add Lab Test
                        </Button>
                      )}

                      <Button
                        onClick={handleLogout}
                        className="w-full"
                        variant="destructive"
                      >
                        <LogOut className="h-4 w-4" /> Logout
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 space-y-8">
        {currentStep === "patient" && (
          <div className="max-w-4xl mx-auto">
            <PatientForm
              initialData={report.patient}
              onSubmit={(data) => {
                setReport((prev) => ({ ...prev, patient: data }));
                setCurrentStep("tests");
              }}
            />
          </div>
        )}

        {currentStep === "tests" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <TestsForm
              data={report.tests}
              onChange={(tests) => setReport((prev) => ({ ...prev, tests }))}
            />
            <div className="flex gap-4 justify-center flex-wrap">
              <Button variant="outline" onClick={() => setCurrentStep("patient")}>
                Back
              </Button>
              <Button onClick={() => setCurrentStep("preview")}>
                Generate Report
              </Button>
            </div>
          </div>
        )}

        {currentStep === "preview" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <ReportPreview report={report} />
            <div className="flex gap-4 justify-center flex-wrap">
              <Button variant="outline" onClick={() => setCurrentStep("tests")}>
                Back
              </Button>
              <Button variant="outline" onClick={resetForm}>
                New Report
              </Button>
              <Button onClick={saveReportToFirebase} disabled={role !== "admin"}>
                Save to Firebase
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50 mt-8">
        <div className="container mx-auto px-4 py-4 text-center text-xs md:text-sm text-muted-foreground">
          © 2025 Laboratory Report Generator
        </div>
      </footer>
    </div>
  );
};

export default Index;
