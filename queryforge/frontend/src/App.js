import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database, GitCompare, BarChart3, Wand2, Brain, Menu, X,
  Zap, ChevronRight, Activity
} from 'lucide-react';
import SQLAnalyzer from './pages/SQLAnalyzer';
import FileCompare from './pages/FileCompare';
import DataInsights from './pages/DataInsights';
import NLtoSQL from './pages/NLtoSQL';
import Dashboard from './pages/Dashboard';
import './styles/global.css';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: Activity, exact: true },
  { to: '/sql', label: 'SQL Analyzer', icon: Database },
  { to: '/compare', label: 'File Compare', icon: GitCompare },
  { to: '/insights', label: 'Data Insights', icon: BarChart3 },
  { to: '/nl-to-sql', label: 'NL → SQL', icon: Wand2 },
];

function Sidebar({ open, onClose }) {
  const location = useLocation();
  return (
    <>
      {open && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon"><Brain size={22} /></div>
            <div>
              <div className="logo-name">QueryForge</div>
              <div className="logo-sub">AI Data Intelligence</div>
            </div>
          </div>
          <button className="close-btn mobile-only" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="sidebar-tag">
          <Zap size={12} />
          <span>Noise → Insight</span>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ to, label, icon: Icon, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <Icon size={18} />
              <span>{label}</span>
              <ChevronRight size={14} className="nav-arrow" />
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="powered-by">
            <span>Powered by</span>
            <span className="claude-badge">Claude AI</span>
          </div>
        </div>
      </aside>
    </>
  );
}

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="app-layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <header className="topbar">
          <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="topbar-title">
            {NAV_ITEMS.find(n => n.to === location.pathname)?.label || 'QueryForge'}
          </div>
          <div className="topbar-badge">
            <span className="pulse-dot" />
            AI Ready
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="page-wrapper"
          >
            <Routes location={location}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/sql" element={<SQLAnalyzer />} />
              <Route path="/compare" element={<FileCompare />} />
              <Route path="/insights" element={<DataInsights />} />
              <Route path="/nl-to-sql" element={<NLtoSQL />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#f5f5f0',
            border: '1px solid #f59e0b',
            fontFamily: 'Instrument Sans, sans-serif',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#f59e0b', secondary: '#1a1a1a' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#1a1a1a' } },
        }}
      />
    </BrowserRouter>
  );
}
