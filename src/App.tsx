// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom"; // 👈 switched to HashRouter
import Index from "./pages/Index";
import VendorOnboarding from "./pages/VendorOnboarding";
import VendorDashboard from "./pages/VendorDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* Global toasts/notifications */}
      <Toaster />
      <Sonner />

      {/* GitHubPages‑friendly routing */}
      <HashRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/vendor-onboarding" element={<VendorOnboarding />} />
          <Route path="/vendor-dashboard" element={<VendorDashboard />} />
          {/* Catch‑all route must be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
