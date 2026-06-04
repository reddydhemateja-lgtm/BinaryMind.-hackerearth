import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Database, Play, Sparkles, AlertTriangle, CheckCircle,
  XCircle, Info, Shield, Zap, Copy, ChevronDown, ChevronUp
} from 'lucide-react';
import { sqlAPI } from '../utils/api';

const DIALECTS = ['MySQL', 'PostgreSQL', 'SQLite', 'MSSQL', 'Oracle', 'BigQuery'];

const SAMPLE_QUERIES = [
  `SELECT * FROM users WHERE status = 'active' ORDER BY created_at DESC`,
  `SELECT u.name, COUNT(o.id) as order_count, SUM(o.total) as revenue\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nWHERE u.created_at >= '2024-01-01'\nGROUP BY u.id, u.name\nHAVING COUNT(o.id) > 5\nORDER BY revenue DESC\nLIMIT 20`,
  `DELETE FROM sessions WHERE expires_at < NOW()`,
  `UPDATE products SET price = price * 1.10 WHERE category_id IN (SELECT id FROM categories WHERE name = 'Electronics')`,
];

const severityIcon = (s) => {
  if (s === 'error') return <XCircle size={13} style={{ color: 'var(--red)' }} />;
  if (s === 'warning') return <AlertTriangle size={13} style={{ color: '#f59e0b' }} />;
  return <Info size={13} style={{ color: 'var(--blue)' }} />;
};

const severityClass = (s) => {
  if (s === 'error') return 'badge-red';
  if (s === 'warning') return 'badge-amber';
  return 'badge-blue';
};

export default function SQLAnalyzer() {
  const [query, setQuery] = useState(SAMPLE_QUERIES[1]);
  const [dialect, setDialect] = useState('MySQL');
  const [result, setResult] = useState(null);
  const [optimized, setOptimized] = useState(null);
  const [loading, setLoading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [activeTab, setActiveTab] = useState('analysis');

  const handleAnalyze = async () => {
    if (!query.trim()) return toast.error('Enter a SQL query first');
    setLoading(true);
    setResult(null);
    setOptimized(null);
    try {
      const data = await sqlAPI.analyze(query, dialect);
      setResult(data);
      toast.success('Analysis complete!');
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOptimize = async () => {
    if (!query.trim()) return toast.error('Enter a SQL query first');
    setOptimizing(true);
    try {
      const data = await sqlAPI.optimize(query, dialect, '');
      setOptimized(data);
      setActiveTab('optimized');
      toast.success('Optimization ready!');
    } catch (e) {
      toast.error(e.message);
    } finally {
      setOptimizing(false);
    }
  };

  const copyQuery = (q) => {
    navigator.clipboard.writeText(q);
    toast.success('Copied!');
  };

  const score = result?.ai?.score ?? null;

  return (
    <div>
      <div className="section-header">
        <div className="section-title">SQL Analyzer</div>
        <div className="section-sub">Paste any SQL — get AI-powered analysis, scoring, and optimization</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Left: Editor */}
        <div>
          <div className="card" style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div className="card-title" style={{ marginBottom: 0 }}><Database size={15} className="icon-amber" /> Query Editor</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <select value={dialect} onChange={e => setDialect(e.target.value)} style={{ fontSize: 12, padding: '5px 8px' }}>
                  {DIALECTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <textarea
              value={query}
              onChange={e => setQuery(e.target.value)}
              rows={12}
              placeholder="Paste your SQL query here..."
              style={{ fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.6 }}
            />
            <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
              <button className="btn btn-primary" onClick={handleAnalyze} disabled={loading}>
                {loading ? <span className="spinner" /> : <Play size={14} />}
                {loading ? 'Analyzing...' : 'Analyze'}
              </button>
              <button className="btn btn-ghost" onClick={handleOptimize} disabled={optimizing}>
                {optimizing ? <span className="spinner" /> : <Sparkles size={14} />}
                {optimizing ? 'Optimizing...' : 'Optimize'}
              </button>
              <button className="btn btn-ghost" onClick={() => copyQuery(query)} style={{ marginLeft: 'auto' }}>
                <Copy size={13} />
              </button>
            </div>
          </div>

          {/* Sample Queries */}
          <div className="card">
            <div className="card-title" style={{ fontSize: 12, marginBottom: 10 }}><Zap size={13} className="icon-amber" /> Sample Queries</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {SAMPLE_QUERIES.map((q, i) => (
                <button key={i} className="btn btn-ghost"
                  style={{ justifyContent: 'flex-start', fontSize: 11, fontFamily: 'var(--font-mono)', textAlign: 'left', padding: '7px 10px' }}
                  onClick={() => setQuery(q)}
                >
                  {q.slice(0, 60)}...
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Results */}
        <div>
          {!result && !optimized && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 12, opacity: 0.5 }}>
              <Database size={40} style={{ color: 'var(--amber)' }} />
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--text-2)' }}>Run analysis to see results</div>
            </div>
          )}

          {(result || optimized) && (
            <AnimatePresence mode="wait">
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                {/* Tabs */}
                <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                  {result && <button className={`btn ${activeTab === 'analysis' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('analysis')} style={{ fontSize: 12, padding: '6px 14px' }}>Analysis</button>}
                  {optimized && <button className={`btn ${activeTab === 'optimized' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('optimized')} style={{ fontSize: 12, padding: '6px 14px' }}>Optimized</button>}
                </div>

                {/* Analysis Tab */}
                {activeTab === 'analysis' && result && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {/* Score + Meta */}
                    <div className="card">
                      <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 800, color: score >= 70 ? 'var(--green)' : score >= 40 ? 'var(--amber)' : 'var(--red)', lineHeight: 1 }}>{score ?? '—'}</div>
                          <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 1 }}>Score</div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, color: 'var(--text-1)', marginBottom: 8 }}>{result.ai?.summary}</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            <span className="badge badge-amber">{result.queryType}</span>
                            <span className="badge badge-gray">{result.complexity}</span>
                            <span className="badge badge-gray">{result.dialect}</span>
                            {result.parseResult?.valid
                              ? <span className="badge badge-green"><CheckCircle size={10} /> Valid SQL</span>
                              : <span className="badge badge-red"><XCircle size={10} /> Parse Error</span>}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Explanation */}
                    {result.ai?.explanation && (
                      <div className="ai-box">
                        <div className="ai-box-title"><Sparkles size={11} /> AI Explanation</div>
                        <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>{result.ai.explanation}</div>
                      </div>
                    )}

                    {/* Issues */}
                    {[...(result.staticIssues || []), ...(result.ai?.issues || [])].length > 0 && (
                      <div className="card">
                        <div className="card-title" style={{ fontSize: 12 }}><AlertTriangle size={14} className="icon-amber" /> Issues</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {[...(result.staticIssues || []), ...(result.ai?.issues || [])].map((issue, i) => (
                            <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 10px', background: 'var(--bg-3)', borderRadius: 8 }}>
                              {severityIcon(issue.severity)}
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 12.5, color: 'var(--text-1)' }}>{issue.message}</div>
                                {issue.suggestion && <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>→ {issue.suggestion}</div>}
                              </div>
                              <span className={`badge ${severityClass(issue.severity)}`} style={{ fontSize: 10, alignSelf: 'flex-start' }}>{issue.severity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Performance & Security */}
                    <div className="grid-2" style={{ gap: 12 }}>
                      {result.ai?.performance && (
                        <div className="card" style={{ padding: 14 }}>
                          <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>Performance</div>
                          <span className={`badge ${result.ai.performance.rating === 'excellent' || result.ai.performance.rating === 'good' ? 'badge-green' : 'badge-amber'}`}>
                            {result.ai.performance.rating}
                          </span>
                          <div style={{ fontSize: 11.5, color: 'var(--text-2)', marginTop: 8, lineHeight: 1.5 }}>{result.ai.performance.notes}</div>
                        </div>
                      )}
                      {result.ai?.security && (
                        <div className="card" style={{ padding: 14 }}>
                          <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}><Shield size={11} style={{ display: 'inline', marginRight: 4 }} />Security</div>
                          <span className={`badge ${result.ai.security.safe ? 'badge-green' : 'badge-red'}`}>
                            {result.ai.security.safe ? 'Safe' : 'Risks Found'}
                          </span>
                          {result.ai.security.risks?.map((r, i) => (
                            <div key={i} style={{ fontSize: 11, color: 'var(--red)', marginTop: 6 }}>⚠ {r}</div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Best Practices */}
                    {result.ai?.bestPractices?.length > 0 && (
                      <div className="card">
                        <div className="card-title" style={{ fontSize: 12 }}><CheckCircle size={13} className="icon-amber" /> Best Practices</div>
                        <ul style={{ paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 5 }}>
                          {result.ai.bestPractices.map((tip, i) => (
                            <li key={i} style={{ fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.5 }}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Optimized Tab */}
                {activeTab === 'optimized' && optimized && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div className="ai-box">
                      <div className="ai-box-title"><Sparkles size={11} /> Optimization Strategy</div>
                      <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>{optimized.explanation}</div>
                      {optimized.expectedImprovement && (
                        <div style={{ marginTop: 8, fontSize: 12, color: 'var(--green)' }}>⚡ {optimized.expectedImprovement}</div>
                      )}
                    </div>

                    {optimized.optimizedQuery && (
                      <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                          <div className="card-title" style={{ marginBottom: 0, fontSize: 13 }}>Optimized Query</div>
                          <button className="btn btn-ghost" onClick={() => copyQuery(optimized.optimizedQuery)} style={{ fontSize: 11, padding: '4px 10px' }}>
                            <Copy size={12} /> Copy
                          </button>
                        </div>
                        <pre style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-1)', background: 'var(--bg-3)', padding: 14, borderRadius: 8, overflow: 'auto', lineHeight: 1.6 }}>
                          {optimized.optimizedQuery}
                        </pre>
                      </div>
                    )}

                    {optimized.changes?.length > 0 && (
                      <div className="card">
                        <div className="card-title" style={{ fontSize: 12 }}>Changes Made</div>
                        {optimized.changes.map((c, i) => (
                          <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid var(--border-soft)' }}>
                            <div style={{ fontSize: 11, color: 'var(--amber)', marginBottom: 3, fontFamily: 'var(--font-mono)' }}>{c.type}</div>
                            <div style={{ fontSize: 12.5, color: 'var(--text-2)' }}>{c.description}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {optimized.indexSuggestions?.length > 0 && (
                      <div className="card">
                        <div className="card-title" style={{ fontSize: 12 }}>Index Suggestions</div>
                        {optimized.indexSuggestions.map((idx, i) => (
                          <pre key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--blue)', background: 'var(--bg-3)', padding: '8px 12px', borderRadius: 6, marginBottom: 6 }}>{idx}</pre>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
