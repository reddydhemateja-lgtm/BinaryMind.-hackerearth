import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Wand2, Send, Copy, Database, Sparkles, ChevronRight, Lightbulb } from 'lucide-react';
import { sqlAPI } from '../utils/api';

const EXAMPLES = [
  'Show me the top 10 customers by total purchase amount in the last 6 months',
  'Find all users who signed up but never placed an order',
  'Calculate monthly revenue growth compared to the previous month',
  'List products that are running low on stock (less than 10 units)',
  'Find duplicate email addresses in the users table',
  'Get the average order value broken down by country',
];

const DIALECTS = ['MySQL', 'PostgreSQL', 'SQLite', 'MSSQL', 'Oracle', 'BigQuery'];

export default function NLtoSQL() {
  const [prompt, setPrompt] = useState('');
  const [schema, setSchema] = useState('');
  const [dialect, setDialect] = useState('MySQL');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSchema, setShowSchema] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return toast.error('Describe what you need');
    setLoading(true);
    setResult(null);
    try {
      const data = await sqlAPI.nlToSql(prompt, schema, dialect);
      setResult(data);
      toast.success('Query generated!');
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const copyQuery = () => {
    if (!result?.query) return;
    navigator.clipboard.writeText(result.query);
    toast.success('Copied!');
  };

  return (
    <div>
      <div className="section-header">
        <div className="section-title">NL → SQL Builder</div>
        <div className="section-sub">Describe what you need in plain English — get production-ready SQL instantly</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Left: Input */}
        <div>
          <div className="card" style={{ marginBottom: 14 }}>
            <div className="card-title"><Wand2 size={15} className="icon-amber" /> What do you need?</div>

            <div style={{ marginBottom: 16 }}>
              <label>Your Request</label>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                rows={5}
                placeholder="e.g. Show me all users who haven't logged in for 30 days and have a premium subscription..."
                style={{ resize: 'vertical' }}
                onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) handleGenerate(); }}
              />
              <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 5 }}>Ctrl+Enter to generate</div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label>SQL Dialect</label>
              <select value={dialect} onChange={e => setDialect(e.target.value)} style={{ width: '100%' }}>
                {DIALECTS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <button
                className="btn btn-ghost"
                onClick={() => setShowSchema(s => !s)}
                style={{ fontSize: 12, padding: '6px 12px', marginBottom: 8 }}
              >
                <Database size={12} />
                {showSchema ? 'Hide' : 'Add'} Schema (optional)
                <ChevronRight size={12} style={{ transform: showSchema ? 'rotate(90deg)' : '', transition: '0.2s' }} />
              </button>
              {showSchema && (
                <textarea
                  value={schema}
                  onChange={e => setSchema(e.target.value)}
                  rows={6}
                  placeholder="Paste your CREATE TABLE statements or describe your schema here..."
                />
              )}
            </div>

            <button className="btn btn-primary" onClick={handleGenerate} disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? <span className="spinner" /> : <Send size={14} />}
              {loading ? 'Generating...' : 'Generate SQL'}
            </button>
          </div>

          {/* Examples */}
          <div className="card">
            <div className="card-title" style={{ fontSize: 12 }}><Lightbulb size={13} className="icon-amber" /> Try these examples</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {EXAMPLES.map((ex, i) => (
                <button
                  key={i}
                  className="btn btn-ghost"
                  onClick={() => setPrompt(ex)}
                  style={{ justifyContent: 'flex-start', textAlign: 'left', fontSize: 12, padding: '8px 12px', lineHeight: 1.4 }}
                >
                  <ChevronRight size={12} style={{ color: 'var(--amber)', flexShrink: 0 }} />
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Results */}
        <div>
          {!result && !loading && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 350, opacity: 0.4, gap: 12 }}>
              <Wand2 size={48} style={{ color: 'var(--amber)' }} />
              <div style={{ fontFamily: 'var(--font-display)', color: 'var(--text-2)', fontSize: 15, textAlign: 'center' }}>
                Describe your query in plain English
              </div>
            </div>
          )}

          {result && (
            <AnimatePresence>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Generated Query */}
                <div className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div className="card-title" style={{ marginBottom: 0 }}><Sparkles size={15} className="icon-amber" /> Generated SQL</div>
                    <button className="btn btn-ghost" onClick={copyQuery} style={{ fontSize: 11, padding: '4px 10px' }}>
                      <Copy size={12} /> Copy
                    </button>
                  </div>
                  <pre style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 13,
                    color: 'var(--text-1)',
                    background: 'var(--bg)',
                    padding: 16,
                    borderRadius: 8,
                    overflow: 'auto',
                    lineHeight: 1.7,
                    whiteSpace: 'pre-wrap',
                    border: '1px solid var(--border)',
                  }}>
                    {result.query}
                  </pre>
                </div>

                {/* Explanation */}
                {result.explanation && (
                  <div className="ai-box">
                    <div className="ai-box-title"><Brain size={11} style={{ color: 'var(--amber)' }} /> How it works</div>
                    <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>{result.explanation}</div>
                  </div>
                )}

                {/* Tables Used */}
                {result.tables?.length > 0 && (
                  <div className="card" style={{ padding: 14 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Tables Referenced</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {result.tables.map(t => <span key={t} className="badge badge-amber">{t}</span>)}
                    </div>
                  </div>
                )}

                {/* Assumptions */}
                {result.assumptions?.length > 0 && (
                  <div className="card" style={{ padding: 14 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Assumptions Made</div>
                    {result.assumptions.map((a, i) => (
                      <div key={i} style={{ fontSize: 12, color: 'var(--text-2)', padding: '4px 0', borderBottom: '1px solid var(--border-soft)' }}>
                        <span style={{ color: 'var(--amber)', marginRight: 6 }}>•</span>{a}
                      </div>
                    ))}
                  </div>
                )}

                {/* Alternatives */}
                {result.alternatives?.length > 0 && (
                  <div className="card" style={{ padding: 14 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Alternative Approaches</div>
                    {result.alternatives.map((a, i) => (
                      <div key={i} style={{ fontSize: 12, color: 'var(--text-2)', padding: '4px 0', borderBottom: '1px solid var(--border-soft)', lineHeight: 1.5 }}>
                        <span style={{ color: 'var(--blue)', marginRight: 6 }}>{i + 1}.</span>{a}
                      </div>
                    ))}
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

// Brain component (lucide doesn't export Brain in older versions)
function Brain({ size = 16, style }) {
  return <Sparkles size={size} style={style} />;
}
