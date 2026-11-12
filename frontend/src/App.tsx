import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { ClimberLayout } from './layouts/ClimberLayout';

// Public Module Pages (Area Publik)
import { LandingPage } from './modules/public/LandingPage';
import { ExplorePage } from './modules/public/ExplorePage';
import { MountainDetailPage } from './modules/public/MountainDetailPage';
import { LoginPage } from './modules/public/auth/LoginPage';
import { RegisterPage } from './modules/public/auth/RegisterPage';

// Climber Module Pages (Area Pendaki)
import { DashboardOverview } from './modules/climber/DashboardOverview';
import { ProfilePage } from './modules/climber/ProfilePage';
import { BookingsPage } from './modules/climber/BookingsPage';
import { TicketsPage } from './modules/climber/TicketsPage';
import { HikingJourneyPage } from './modules/climber/HikingJourneyPage';
import { HikersDataPage } from './modules/climber/HikersDataPage';
import { SettingsPage } from './modules/climber/SettingsPage';
import { BookingFlowPage } from './modules/climber/booking/BookingFlowPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ========================================================
            AREA PUBLIK (Public Website: Landing, Catalog, Detail)
            Explore First, Book Later. Tidak perlu login.
           ======================================================== */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/gunung" element={<ExplorePage />} />
          <Route path="/gunung/:slug" element={<MountainDetailPage />} />
        </Route>

        {/* Authentication Pages (Clean full page experience) */}
        <Route path="/masuk" element={<LoginPage />} />
        <Route path="/daftar" element={<RegisterPage />} />

        {/* ========================================================
            AREA PENDAKI (Hiker Dashboard & Personal Area)
            Dedicated layout with Sidebar, Topbar & Mobile drawer
           ======================================================== */}
        <Route path="/pendaki" element={<ClimberLayout />}>
          <Route index element={<Navigate to="/pendaki/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardOverview />} />
          <Route path="profil" element={<ProfilePage />} />
          <Route path="pemesanan" element={<BookingsPage />} />
          <Route path="tiket" element={<TicketsPage />} />
          <Route path="riwayat" element={<HikingJourneyPage />} />
          <Route path="data-rombongan" element={<HikersDataPage />} />
          <Route path="pengaturan" element={<SettingsPage />} />
        </Route>

        {/* ========================================================
            BOOKING FLOW (8-Step E-SIMAKSI online booking)
           ======================================================== */}
        <Route path="/pendaki/booking/:mountainSlug/:trailId" element={<BookingFlowPage />} />

        {/* ========================================================
            BACKWARDS COMPATIBILITY & ALIASES
           ======================================================== */}
        <Route path="/booking/:mountainSlug/:trailId" element={<Navigate to="/pendaki/booking/:mountainSlug/:trailId" replace />} />
        <Route path="/booking" element={<Navigate to="/gunung" replace />} />
        <Route path="/dashboard" element={<Navigate to="/pendaki/dashboard" replace />} />
        <Route path="/dashboard/profil" element={<Navigate to="/pendaki/profil" replace />} />
        <Route path="/dashboard/pemesanan" element={<Navigate to="/pendaki/pemesanan" replace />} />
        <Route path="/dashboard/tiket" element={<Navigate to="/pendaki/tiket" replace />} />
        <Route path="/dashboard/riwayat" element={<Navigate to="/pendaki/riwayat" replace />} />
        <Route path="/dashboard/data-pendaki" element={<Navigate to="/pendaki/data-rombongan" replace />} />
        <Route path="/dashboard/pengaturan" element={<Navigate to="/pendaki/pengaturan" replace />} />

        {/* Catch-all Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
