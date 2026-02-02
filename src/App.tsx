import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AboutPage from "./pages/AboutPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ExecutivesPage from "./pages/ExecutivesPage";
import AlumniPage from "./pages/AlumniPage";
import EventsPage from "./pages/EventsPage";
import NoticesPage from "./pages/NoticesPage";
import GalleryPage from "./pages/GalleryPage";
import WingsPage from "./pages/WingsPage";
import WingDetailPage from "./pages/WingDetailPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/executives" element={<ExecutivesPage />} />
          <Route path="/alumni" element={<AlumniPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/notices" element={<NoticesPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/wings" element={<WingsPage />} />
          <Route path="/wings/:wingId" element={<WingDetailPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
