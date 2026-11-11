import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { ExplorePage } from './pages/ExplorePage';
import { MountainDetailPage } from './pages/MountainDetailPage';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import { BookingFlowPage } from './pages/BookingFlowPage';

// Dashboard imports
import { DashboardLayout } from './pages/dashboard/DashboardLayout';
import { DashboardOverview } from './pages/dashboard/DashboardOverview';
import { ProfilePage } from './pages/dashboard/ProfilePage';
import { BookingsPage } from './pages/dashboard/BookingsPage';
import { TicketsPage } from './pages/dashboard/TicketsPage';
import { HikingJourneyPage } from './pages/dashboard/HikingJourneyPage';
import { HikersDataPage } from './pages/dashboard/HikersDataPage';
import { SettingsPage } from './pages/dashboard/SettingsPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      {/* Global Navbar appears on public pages */}
      <Navbar />

      <Routes>
        {/* Public Website */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/gunung" element={<ExplorePage />} />
        <Route path="/gunung/:slug" element={<MountainDetailPage />} />

        {/* Booking Flow (Multi-step, tiket.com inspired) */}
        <Route path="/booking/:mountainSlug/:trailId" element={<BookingFlowPage />} />
        <Route path="/booking" element={<Navigate to="/gunung" replace />} />

        {/* Authentication */}
        <Route path="/masuk" element={<LoginPage />} />
        <Route path="/daftar" element={<RegisterPage />} />

        {/* Hiker Dashboard (Modern SaaS layout) */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="profil" element={<ProfilePage />} />
          <Route path="pemesanan" element={<BookingsPage />} />
          <Route path="tiket" element={<TicketsPage />} />
          <Route path="riwayat" element={<HikingJourneyPage />} />
          <Route path="data-pendaki" element={<HikersDataPage />} />
          <Route path="pengaturan" element={<SettingsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
