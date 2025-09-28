import { ReactNode } from "react";
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
import {
  Microscope,
  Moon,
  Sun,
  User,
  LogOut,
  Search,
} from "lucide-react";

interface LayoutProps {
  children: ReactNode;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  user: any;
  role: string | null;
  handleLogin: () => Promise<void>;
  handleLogout: () => Promise<void>;
  searchCode: string;
  setSearchCode: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: () => void;
}

const Layout = ({
  children,
  isDarkMode,
  toggleDarkMode,
  user,
  role,
  handleLogin,
  handleLogout,
  searchCode,
  setSearchCode,
  handleSearch,
}: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background transition-medical flex flex-col">
      {/* Header */}
      <header className="border-b bg-card card-shadow sticky top-0 z-50">
        <div className="container mx-auto px-2 sm:px-4 py-3 flex justify-between items-center">
          {/* Left Logo */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="medical-gradient p-2 rounded-lg shrink-0">
              <Microscope className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            {/* Force no-wrap on title */}
            <h1 className="text-sm sm:text-lg md:text-xl font-bold whitespace-nowrap">
              Lab Reports
            </h1>
          </div>

          {/* Right Side Nav */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search (≥923px: show full search bar) */}
            <div className="hidden [@media(min-width:923px)]:flex items-center gap-2">
              <Input
                type="text"
                placeholder="Enter Report Code..."
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-32 md:w-60"
              />
              <Button size="sm" onClick={handleSearch}>
                Search
              </Button>
            </div>

            {/* Search (<923px: only button → top drawer) */}
            <div className="[@media(min-width:923px)]:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="top" className="p-4">
                  <SheetHeader>
                    <SheetTitle>Search Report</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-2 mt-4">
                    <Input
                      type="text"
                      placeholder="Enter Report Code..."
                      value={searchCode}
                      onChange={(e) => setSearchCode(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <Button onClick={handleSearch} className="w-full">
                      Search
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Dark Mode Toggle */}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleDarkMode}
              className="sm:w-auto sm:px-2"
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              <span className="hidden sm:inline ml-1">
                {isDarkMode ? "Light" : "Dark"}
              </span>
            </Button>

            {/* User Drawer */}
            <Sheet>
              <SheetTrigger asChild>
                {user ? (
                  <div className="flex items-center gap-2 cursor-pointer min-w-0">
                    <Avatar className="h-7 w-7 shrink-0">
                      <AvatarImage src={user.photoURL || ""} />
                      <AvatarFallback>
                        {user.displayName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline text-sm font-medium truncate max-w-[120px]">
                      {user.displayName}
                    </span>
                  </div>
                ) : (
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                )}
              </SheetTrigger>
              <SheetContent side="right" className="w-64 sm:w-80">
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
                        <Avatar className="h-12 w-12 shrink-0">
                          <AvatarImage src={user.photoURL || ""} />
                          <AvatarFallback>
                            {user.displayName?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium truncate">
                            {user.displayName}
                          </p>
                          <p className="text-xs italic text-muted-foreground truncate">
                            Role: {role || "loading..."}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground break-all ml-1">
                        {user.email}
                      </p>

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

      {/* Main */}
      <main className="flex-1 container mx-auto px-2 sm:px-4 py-6 space-y-8 w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50 mt-auto">
        <div className="container mx-auto px-2 sm:px-4 py-4 text-center text-xs md:text-sm text-muted-foreground">
          © 2025 Laboratory Report Generator
        </div>
      </footer>
    </div>
  );
};

export default Layout;
