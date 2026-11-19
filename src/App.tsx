// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Reports from "./pages/Reports";
import PrescriptionPage from "./components/PrescriptionPage";
import AdminTestBuilder from "./pages/AdminTestBuilder";
import AdminCanvasDesigner from "./pages/AdminCanvasDesigner";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Main Clinical Diagnostic Hub */}
          <Route path="/" element={<Index />} />
          <Route path="/report/:id" element={<Reports />} />
          <Route path="/prescription" element={<PrescriptionPage />} />

          {/* Administrator Dynamic Hub & Canvas Editor */}
          <Route path="/admin/tests" element={<AdminTestBuilder />} />
          <Route path="/admin/templates" element={<AdminCanvasDesigner />} />

          {/* Fallback Catch-all Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
