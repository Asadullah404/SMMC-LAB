// src/components/AppLayout.tsx
import { ReactNode, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Microscope,
  Moon,
  Sun,
  User,
  LogOut,
  Search,
  FilePlus,
  Pill,
  Settings2,
  LayoutTemplate,
  Menu,
  ShieldCheck,
  ChevronRight,
  MapPin,
  Phone,
  SlidersHorizontal,
} from "lucide-react";
import FooterSettingsModal from "@/components/FooterSettingsModal";
import { useFooterSettings } from "@/lib/footerSettings";
import { auth, loginWithGoogle, logout, db } from "@/firebase";
import type { User as FirebaseUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";
import { inventoryDB } from "@/inventoryFirebase";
import { useToast } from "@/hooks/use-toast";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [searchCode, setSearchCode] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [footerModalOpen, setFooterModalOpen] = useState(false);
  const { settings: footerSettings } = useFooterSettings();

  // Sync theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return next;
    });
  };

  // Auth listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            setRole(snap.data().role || "user");
          } else {
            setRole(currentUser.email === "admin@example.com" ? "admin" : "user");
          }
        } catch {
          setRole("admin");
        }
      } else {
        setRole(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const userData = await loginWithGoogle();
      setUser(userData);
      toast({
        title: "Welcome Back",
        description: `Signed in as ${userData.displayName || userData.email}`,
      });
    } catch (err: unknown) {
      toast({
        title: "Sign-in Failed",
        description: err instanceof Error ? err.message : "Error signing in",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setRole(null);
      toast({ title: "Logged out successfully" });
    } catch (err: unknown) {
      toast({
        title: "Error logging out",
        description: err instanceof Error ? err.message : "Error logging out",
        variant: "destructive",
      });
    }
  };

  // Universal Smart Search
  const handleSmartSearch = async () => {
    const code = searchCode.trim().toUpperCase();
    if (!code) return;

    if (code.startsWith("PREC-")) {
      try {
        const snap = await getDocs(collection(inventoryDB, "prescriptions"));
        let match: { id: string; [k: string]: unknown } | null = null;
        snap.forEach((d) => {
          const data = d.data() as { precNumber?: string; [k: string]: unknown };
          if (data.precNumber?.trim().toUpperCase() === code) {
            match = { id: d.id, ...data };
          }
        });

        if (match) {
          navigate("/prescription", {
            state: { prescriptionData: match, disableSend: true },
          });
          setSearchCode("");
          setMobileSearchOpen(false);
        } else {
          toast({
            title: "Prescription Not Found",
            description: `No prescription record found for ${code}`,
            variant: "destructive",
          });
        }
      } catch {
        toast({
          title: "Search Error",
          description: "Could not retrieve prescription",
          variant: "destructive",
        });
      }
    } else {
      navigate(`/report/${code}`);
      setSearchCode("");
      setMobileSearchOpen(false);
    }
  };

  const navLinks = [
    { label: "Diagnostic Hub", path: "/", icon: FilePlus },
    { label: "Prescriptions", path: "/prescription", icon: Pill },
    { label: "Test Builder", path: "/admin/tests", icon: Settings2, adminOnly: true },
    { label: "Canvas Designer", path: "/admin/templates", icon: LayoutTemplate, adminOnly: true },
  ];

  const isAdmin = role === "admin" || !user;

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-[#0b1120] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 antialiased">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-md shadow-xs">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3 group focus:outline-none">
              <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 group-hover:scale-105 group-hover:shadow-blue-500/35 transition-all">
                <Microscope className="h-5 w-5" />
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-900 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">
                    SMMC LAB
                  </span>
                  <Badge className="text-[10px] px-1.5 py-0 h-4 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-bold bg-blue-50 dark:bg-blue-950/80">
                    PRO
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Diagnostic & Pathology</p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1.5">
              {navLinks.map((item) => {
                if (item.adminOnly && !isAdmin) return null;
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 shadow-xs ring-1 ring-blue-500/20"
                        : "text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-400"}`} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Search Bar */}
            <div className="hidden md:flex items-center relative">
              <Input
                type="text"
                placeholder="Search Report ID or PREC-..."
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSmartSearch()}
                className="w-48 lg:w-64 h-9 pl-8 pr-14 text-xs rounded-lg border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 transition-all"
              />
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
              <Button
                size="sm"
                variant="ghost"
                onClick={handleSmartSearch}
                className="absolute right-1 top-1 h-7 px-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60"
              >
                Go
              </Button>
            </div>

            {/* Mobile Search Toggle */}
            <Button
              variant="outline"
              size="icon"
              className="md:hidden h-9 w-9 border-slate-200 dark:border-slate-800"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            >
              <Search className="h-4 w-4 text-slate-600 dark:text-slate-300" />
            </Button>

            {/* Dark Mode Toggle */}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleDarkMode}
              className="h-9 w-9 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
              title="Toggle color theme"
            >
              {isDarkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-blue-600" />}
            </Button>

            {/* User Account Drawer */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 gap-2 border-slate-200 dark:border-slate-800 rounded-lg px-2 sm:px-3 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/50 dark:hover:bg-slate-900 transition-all"
                >
                  {user ? (
                    <>
                      <Avatar className="h-6 w-6 border border-blue-300 dark:border-blue-700">
                        <AvatarImage src={user.photoURL || ""} />
                        <AvatarFallback className="bg-blue-600 text-white text-xs font-bold">
                          {user.displayName?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:inline font-semibold text-xs max-w-[100px] truncate text-slate-800 dark:text-slate-200">
                        {user.displayName || "Admin"}
                      </span>
                    </>
                  ) : (
                    <>
                      <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="hidden sm:inline text-xs font-semibold text-slate-800 dark:text-slate-200">Login</span>
                    </>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-6 flex flex-col justify-between">
                <div>
                  <SheetHeader className="text-left pb-4 border-b border-slate-100 dark:border-slate-800">
                    <SheetTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-blue-600" />
                      Account & Permissions
                    </SheetTitle>
                  </SheetHeader>

                  <div className="mt-6 space-y-5">
                    {!user ? (
                      <div className="space-y-4">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Sign in with Google to synchronize diagnostic tests and activate administrator controls.
                        </p>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-500/20" onClick={handleLogin}>
                          Sign in with Google
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900">
                          <Avatar className="h-12 w-12 border-2 border-blue-400 dark:border-blue-600">
                            <AvatarImage src={user.photoURL || ""} />
                            <AvatarFallback className="bg-blue-600 text-white font-bold">
                              {user.displayName?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="overflow-hidden">
                            <p className="font-bold text-sm truncate text-slate-900 dark:text-white">{user.displayName || "Medical Officer"}</p>
                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                            <Badge className="mt-1 text-[10px] px-2 py-0 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 border-none font-bold">
                              Role: {role || "Administrator"}
                            </Badge>
                          </div>
                        </div>

                        {/* Admin Navigation Quicklinks */}
                        <div className="pt-2 space-y-2">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            Administrator Controls
                          </p>
                          <Link
                            to="/admin/tests"
                            className="flex items-center justify-between p-2.5 rounded-lg text-sm hover:bg-slate-100 dark:hover:bg-slate-800/80 transition font-medium"
                          >
                            <div className="flex items-center gap-2.5">
                              <Settings2 className="h-4 w-4 text-blue-600" />
                              <span>Test & Field Builder</span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-400" />
                          </Link>
                          <Link
                            to="/admin/templates"
                            className="flex items-center justify-between p-2.5 rounded-lg text-sm hover:bg-slate-100 dark:hover:bg-slate-800/80 transition font-medium"
                          >
                            <div className="flex items-center gap-2.5">
                              <LayoutTemplate className="h-4 w-4 text-blue-600" />
                              <span>Visual Canvas Designer</span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-400" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setFooterModalOpen(true)}
                            className="w-full flex items-center justify-between p-2.5 rounded-lg text-sm hover:bg-slate-100 dark:hover:bg-slate-800/80 transition font-medium text-left"
                          >
                            <div className="flex items-center gap-2.5">
                              <MapPin className="h-4 w-4 text-blue-600" />
                              <span>Add / Edit Address & Footer</span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-400" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {user && (
                  <Button
                    onClick={handleLogout}
                    variant="destructive"
                    className="w-full flex items-center justify-center gap-2 font-semibold"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                )}
              </SheetContent>
            </Sheet>

            {/* Mobile Nav Drawer Toggle */}
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden h-9 w-9 border-slate-200 dark:border-slate-800"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-4 w-4 text-slate-700 dark:text-slate-300" />
            </Button>
          </div>
        </div>

        {/* Mobile Dropdown Search */}
        {mobileSearchOpen && (
          <div className="md:hidden border-t border-slate-100 dark:border-slate-800 p-3 bg-white dark:bg-[#0f172a] animate-in slide-in-from-top-2 duration-150">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Search Report ID or PREC-..."
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSmartSearch()}
                className="flex-1 text-sm h-9 border-slate-200"
                autoFocus
              />
              <Button size="sm" onClick={handleSmartSearch} className="h-9 bg-blue-600 hover:bg-blue-700 text-white">
                Search
              </Button>
            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="w-72 p-6">
            <SheetHeader className="text-left pb-4 border-b border-slate-100 dark:border-slate-800">
              <SheetTitle className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                <Microscope className="h-5 w-5 text-blue-600" />
                SMMC Clinical Hub
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6 flex flex-col gap-2">
              {navLinks.map((item) => {
                if (item.adminOnly && !isAdmin) return null;
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="h-4 w-4 text-blue-600" />
                    {item.label}
                  </Link>
                );
              })}

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setFooterModalOpen(true);
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition text-left w-full"
              >
                <MapPin className="h-4 w-4 text-blue-600" />
                Add / Edit Address & Contact
              </button>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Modern Footer */}
      {footerSettings.showFooter ? (
        <footer className="border-t border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-[#0f172a]/80 py-5 text-xs text-slate-500 dark:text-slate-400">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright & Organization */}
            <div className="text-center md:text-left">
              <p className="font-medium text-slate-700 dark:text-slate-300">
                © {new Date().getFullYear()} {footerSettings.customText || "SMMC Laboratory Diagnostic Information Systems"}
              </p>
            </div>

            {/* Address & Phone Number (If enabled & configured) */}
            {footerSettings.showContactInfo && (footerSettings.address || footerSettings.phone) && (
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-slate-600 dark:text-slate-400 text-xs">
                {footerSettings.address && (
                  <span className="inline-flex items-center gap-1.5 font-normal">
                    <MapPin className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span>{footerSettings.address}</span>
                  </span>
                )}
                {footerSettings.phone && (
                  <a
                    href={`tel:${footerSettings.phone.replace(/[^0-9+]/g, "")}`}
                    className="inline-flex items-center gap-1.5 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span>{footerSettings.phone}</span>
                  </a>
                )}
              </div>
            )}

            {/* Navigation Quicklinks */}
            <div className="flex items-center gap-3 text-xs font-medium">
              <Link to="/admin/tests" className="text-blue-600 dark:text-blue-400 hover:underline">
                Admin Hub
              </Link>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <Link to="/admin/templates" className="text-blue-600 dark:text-blue-400 hover:underline">
                Canvas Designer
              </Link>
            </div>
          </div>
        </footer>
      ) : (
        /* Floating unhide / configure button when user hides footer */
        <div className="fixed bottom-3 right-3 z-30">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setFooterModalOpen(true)}
            className="shadow-md bg-white/95 dark:bg-slate-900/95 border-slate-200 dark:border-slate-800 text-[11px] h-8 gap-1.5 text-slate-600 dark:text-slate-300 hover:text-blue-600"
            title="Website footer is hidden. Click to configure or unhide."
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-blue-600" />
            <span>Footer Hidden</span>
          </Button>
        </div>
      )}

      {/* Footer & Contact Configuration Dialog */}
      <FooterSettingsModal
        open={footerModalOpen}
        onOpenChange={setFooterModalOpen}
      />
    </div>
  );
}
