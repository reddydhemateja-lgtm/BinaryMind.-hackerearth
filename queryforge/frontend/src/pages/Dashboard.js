import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Database, GitCompare, BarChart3, Wand2, Brain,
  TrendingUp, Zap, ChevronRight, Activity
} from 'lucide-react';
import { healthCheck } from '../utils/api';

const FEATURES = [
  {
    to: '/sql',
    icon: Database,
    title: 'SQL Analyzer',
    desc: 'Parse, lint, score, and get AI-powered optimization for any SQL query.',
    tag: 'Most Used',
    color: '#f59e0b',
  },
  {
    to: '/compare',
    icon: GitCompare,
    title: 'File Comparator',
    desc: 'Side-by-side diff for CSV, JSON, SQL, TXT files with AI summary.',
    tag: 'New',
    color: '#60a5fa',
  },
  {
    to: '/insights',
    icon: BarChart3,
    title: 'Data Insights',
    desc: 'Upload a dataset and let AI surface patterns, schema, and cleaning steps.',
    tag: 'AI Powered',
    color: '#22c55e',
  },
  {
    to: '/nl-to-sql',
    icon: Wand2,
    title: 'NL → SQL Builder',
    desc: 'Describe what you need in plain English — get production-ready SQL.',
    tag: 'Magic',
    color: '#a78bfa',
  },
];

const STEPS = [
  { n: '01', title: 'Upload or paste data', desc: 'Drop in your SQL queries, CSV files, or JSON datasets.' },
  { n: '02', title: 'AI processes the noise', desc: 'Claude analyzes structure, quality, and patterns in seconds.' },
  { n: '03', title: 'Surface the signal', desc: 'Get actionable insights, optimization tips, and clean queries.' },
];

export default function Dashboard() {
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    healthCheck()
      .then(() => setApiStatus('online'))
      .catch(() => setApiStatus('offline'));
  }, []);

  return (
    <div>
      {/* Hero */}
      <motion.div
        className="hero-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background: 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, transparent 60%)',
          border: '1px solid rgba(245,158,11,0.15)',
          borderRadius: 20,
          padding: '36px 32px',
          marginBottom: 28,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', top: -40, right: -40, opacity: 0.04 }}>
          <Brain size={220} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div className="badge badge-amber"><Zap size={10} /> AI Meets Data</div>
          <div className={`badge ${apiStatus === 'online' ? 'badge-green' : apiStatus === 'offline' ? 'badge-red' : 'badge-gray'}`}>
            <Activity size={10} />
            API {apiStatus}
          </div>
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, letterSpacing: -1, marginBottom: 10, lineHeight: 1.2 }}>
          From Noise to <span style={{ color: 'var(--amber)' }}>Insight</span>
        </h1>
        <p style={{ color: 'var(--text-2)', fontSize: 15, maxWidth: 540, lineHeight: 1.6, marginBottom: 20 }}>
          QueryForge turns raw, messy data into something your team can act on — intelligent SQL analysis, file comparison, and pattern discovery powered by Claude AI.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link to="/sql" className="btn btn-primary"><Database size={15} /> Start Analyzing</Link>
          <Link to="/nl-to-sql" className="btn btn-ghost"><Wand2 size={15} /> Build a Query</Link>
        </div>
      </motion.div>

      {/* Feature Cards */}
      <div style={{ marginBottom: 28 }}>
        <div className="section-header" style={{ marginBottom: 16 }}>
          <div className="section-title" style={{ fontSize: 16, fontFamily: 'var(--font-display)' }}>Tools</div>
        </div>
        <div className="grid-2" style={{ gap: 14 }}>
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.to}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <Link to={f.to} style={{ textDecoration: 'none' }}>
                <div className="card" style={{
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  borderColor: 'rgba(255,255,255,0.06)',
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = f.color + '44';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 8px 32px ${f.color}18`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.transform = '';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: f.color + '18',
                      border: `1px solid ${f.color}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: f.color, flexShrink: 0,
                    }}>
                      <f.icon size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>{f.title}</span>
                        <span className="badge badge-amber" style={{ fontSize: 10 }}>{f.tag}</span>
                      </div>
                      <p style={{ fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.5 }}>{f.desc}</p>
                    </div>
                    <ChevronRight size={14} style={{ color: 'var(--text-3)', marginTop: 4, flexShrink: 0 }} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="card" style={{ marginBottom: 28 }}>
        <div className="card-title"><TrendingUp size={16} className="icon-amber" /> How it works</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ position: 'relative' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'rgba(245,158,11,0.2)', marginBottom: 6 }}>{s.n}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600, color: 'var(--text-1)', marginBottom: 5 }}>{s.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.5 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Supported formats */}
      <div className="card">
        <div className="card-title"><Database size={16} className="icon-amber" /> Supported Formats</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {['SQL', 'CSV', 'JSON', 'TXT', 'XML', 'YAML', 'LOG', 'MD', 'MySQL', 'PostgreSQL', 'SQLite', 'MSSQL'].map(f => (
            <span key={f} className="badge badge-gray">{f}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
