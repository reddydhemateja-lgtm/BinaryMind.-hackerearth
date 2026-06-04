import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import {
  BarChart3, Upload, FileText, Sparkles, Brain,
  Database, AlertTriangle, CheckCircle, Table, Wand2
} from 'lucide-react';
import { analysisAPI } from '../utils/api';

function FileDropper({ file, onFile }) {
  const onDrop = useCallback(accepted => { if (accepted[0]) onFile(accepted[0]); }, [onFile]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/*': ['.csv', '.json', '.txt', '.tsv'] },
    maxFiles: 1,
  });

  return (
    <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
      <input {...getInputProps()} />
      <div className="dropzone-icon"><Upload size={32} /></div>
      <div className="dropzone-label" style={{ fontSize: 14 }}>Drop your data file here</div>
      <div className="dropzone-sub">CSV, JSON, TXT, TSV — max 5MB</div>
      {file && (
        <div className="dropzone-file" style={{ justifyContent: 'center', marginTop: 14 }}>
          <FileText size={15} style={{ color: 'var(--amber)' }} />
          <span>{file.name}</span>
          <span style={{ marginLeft: 'auto', color: 'var(--text-3)', fontSize: 11 }}>{(file.size / 1024).toFixed(1)} KB</span>
        </div>
      )}
    </div>
  );
}

const qualityColor = (q) => {
  if (q === 'excellent') return 'var(--green)';
  if (q === 'good') return 'var(--green)';
  if (q === 'fair') return 'var(--amber)';
  return 'var(--red)';
};

export default function DataInsights() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [cleaning, setCleaning] = useState(null);
  const [schema, setSchema] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cleanLoading, setCleanLoading] = useState(false);
  const [schemaLoading, setSchemaLoading] = useState(false);
  const [tab, setTab] = useState('insights');

  const handleAnalyze = async () => {
    if (!file) return toast.error('Upload a file first');
    setLoading(true);
    setResult(null);
    setCleaning(null);
    setSchema(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const data = await analysisAPI.analyzeFile(fd);
      setResult(data);
      setTab('insights');
      toast.success('Insights ready!');
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCleaning = async () => {
    if (!file) return;
    setCleanLoading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const data = await analysisAPI.getCleaningSuggestions(fd);
      setCleaning(data);
      setTab('cleaning');
      toast.success('Cleaning analysis done!');
    } catch (e) {
      toast.error(e.message);
    } finally {
      setCleanLoading(false);
    }
  };

  const handleSchema = async () => {
    if (!file) return;
    setSchemaLoading(true);
    try {
      const content = await file.text();
      const ext = file.name.split('.').pop().toLowerCase();
      const data = await analysisAPI.detectSchema(content.slice(0, 3000), ext === 'csv' ? 'csv' : 'json');
      setSchema(data);
      setTab('schema');
      toast.success('Schema detected!');
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSchemaLoading(false);
    }
  };

  return (
    <div>
      <div className="section-header">
        <div className="section-title">Data Insights</div>
        <div className="section-sub">Upload any dataset — AI surfaces patterns, quality issues, and schema</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20 }}>
        {/* Left: Upload */}
        <div>
          <div className="card" style={{ marginBottom: 14 }}>
            <FileDropper file={file} onFile={setFile} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 }}>
              <button className="btn btn-primary" onClick={handleAnalyze} disabled={loading || !file}>
                {loading ? <span className="spinner" /> : <Sparkles size={14} />}
                {loading ? 'Analyzing...' : 'Analyze Data'}
              </button>
              <button className="btn btn-ghost" onClick={handleCleaning} disabled={cleanLoading || !file}>
                {cleanLoading ? <span className="spinner" /> : <AlertTriangle size={14} />}
                {cleanLoading ? 'Checking...' : 'Data Cleaning Check'}
              </button>
              <button className="btn btn-ghost" onClick={handleSchema} disabled={schemaLoading || !file}>
                {schemaLoading ? <span className="spinner" /> : <Table size={14} />}
                {schemaLoading ? 'Detecting...' : 'Detect Schema'}
              </button>
            </div>
          </div>

          {result && (
            <div className="card">
              <div className="card-title" style={{ fontSize: 12 }}><Database size={13} className="icon-amber" /> File Stats</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  ['Rows', result.rowCount],
                  ['Columns', result.columnCount],
                  ['Format', result.format?.toUpperCase()],
                  ['Size', `${(result.size / 1024).toFixed(1)} KB`],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: 'var(--text-3)' }}>{k}</span>
                    <span style={{ color: 'var(--text-1)', fontFamily: 'var(--font-mono)' }}>{v}</span>
                  </div>
                ))}
              </div>
              {result.columns?.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Columns</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {result.columns.map(c => <span key={c} className="badge badge-gray" style={{ fontSize: 10 }}>{c}</span>)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Results */}
        <div>
          {!result && !cleaning && !schema && !loading && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 350, opacity: 0.4, gap: 12 }}>
              <BarChart3 size={48} style={{ color: 'var(--amber)' }} />
              <div style={{ fontFamily: 'var(--font-display)', color: 'var(--text-2)', fontSize: 15 }}>Upload data to surface insights</div>
            </div>
          )}

          {(result || cleaning || schema) && (
            <AnimatePresence mode="wait">
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                {/* Tabs */}
                <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                  {result   && <button className={`btn ${tab === 'insights' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab('insights')}   style={{ fontSize: 12, padding: '6px 12px' }}><Brain size={12} /> Insights</button>}
                  {cleaning && <button className={`btn ${tab === 'cleaning' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab('cleaning')}   style={{ fontSize: 12, padding: '6px 12px' }}><AlertTriangle size={12} /> Cleaning</button>}
                  {schema   && <button className={`btn ${tab === 'schema'   ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab('schema')}     style={{ fontSize: 12, padding: '6px 12px' }}><Table size={12} /> Schema</button>}
                </div>

                {tab === 'insights' && result?.ai && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div className="ai-box">
                      <div className="ai-box-title"><Sparkles size={11} /> Overview</div>
                      <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>{result.ai.overview}</div>
                      {result.ai.dataQuality && (
                        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>Data Quality:</span>
                          <div style={{ flex: 1, background: 'var(--bg-4)', borderRadius: 20, height: 6, overflow: 'hidden' }}>
                            <div style={{ width: `${result.ai.dataQuality.score}%`, height: '100%', background: 'var(--amber)', borderRadius: 20, transition: 'width 1s ease' }} />
                          </div>
                          <span style={{ fontFamily: 'var(--font-display)', color: 'var(--amber)', fontWeight: 700, fontSize: 14 }}>{result.ai.dataQuality.score}</span>
                        </div>
                      )}
                    </div>

                    {result.ai.columnInsights?.length > 0 && (
                      <div className="card">
                        <div className="card-title" style={{ fontSize: 12 }}>Column Insights</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {result.ai.columnInsights.map((c, i) => (
                            <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 10px', background: 'var(--bg-3)', borderRadius: 8 }}>
                              <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--amber)', minWidth: 100 }}>{c.column}</code>
                              <span className="badge badge-blue" style={{ fontSize: 10, alignSelf: 'center' }}>{c.type}</span>
                              <span style={{ fontSize: 12, color: 'var(--text-2)', flex: 1 }}>{c.notes}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {result.ai.patterns?.length > 0 && (
                      <div className="card">
                        <div className="card-title" style={{ fontSize: 12 }}><Brain size={13} className="icon-amber" /> Discovered Patterns</div>
                        {result.ai.patterns.map((p, i) => (
                          <div key={i} style={{ padding: '6px 0', borderBottom: '1px solid var(--border-soft)', fontSize: 13, color: 'var(--text-2)' }}>
                            <span style={{ color: 'var(--amber)', marginRight: 8 }}>◆</span>{p}
                          </div>
                        ))}
                      </div>
                    )}

                    {result.ai.suggestedQueries?.length > 0 && (
                      <div className="card">
                        <div className="card-title" style={{ fontSize: 12 }}><Database size={13} className="icon-amber" /> Suggested SQL Queries</div>
                        {result.ai.suggestedQueries.map((q, i) => (
                          <pre key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--blue)', background: 'var(--bg-3)', padding: '10px 14px', borderRadius: 7, marginBottom: 8, overflow: 'auto', whiteSpace: 'pre-wrap' }}>{q}</pre>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {tab === 'cleaning' && cleaning && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div className="card">
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: qualityColor(cleaning.overallQuality) }}>{cleaning.overallQuality?.toUpperCase()}</div>
                        <div>
                          <div style={{ fontSize: 12, color: 'var(--text-3)' }}>Overall Data Quality</div>
                          {cleaning.missingDataPercent !== undefined && (
                            <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>~{cleaning.missingDataPercent}% missing data</div>
                          )}
                        </div>
                        {cleaning.duplicateRisk && (
                          <span className={`badge ${cleaning.duplicateRisk === 'none' || cleaning.duplicateRisk === 'low' ? 'badge-green' : 'badge-amber'}`} style={{ marginLeft: 'auto' }}>
                            Duplicate risk: {cleaning.duplicateRisk}
                          </span>
                        )}
                      </div>
                    </div>

                    {cleaning.issues?.length > 0 && (
                      <div className="card">
                        <div className="card-title" style={{ fontSize: 12 }}><AlertTriangle size={13} className="icon-amber" /> Issues Found</div>
                        {cleaning.issues.map((issue, i) => (
                          <div key={i} style={{ padding: '10px 12px', background: 'var(--bg-3)', borderRadius: 8, marginBottom: 8 }}>
                            <div style={{ display: 'flex', gap: 8, marginBottom: 5 }}>
                              <span className={`badge ${issue.severity === 'critical' ? 'badge-red' : issue.severity === 'major' ? 'badge-amber' : 'badge-gray'}`} style={{ fontSize: 10 }}>{issue.severity}</span>
                              <span className="badge badge-blue" style={{ fontSize: 10 }}>{issue.type}</span>
                            </div>
                            <div style={{ fontSize: 12.5, color: 'var(--text-1)', marginBottom: 4 }}>{issue.description}</div>
                            <div style={{ fontSize: 11.5, color: 'var(--green)' }}>→ {issue.fix}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {cleaning.sqlCleaningQueries?.length > 0 && (
                      <div className="card">
                        <div className="card-title" style={{ fontSize: 12 }}><Wand2 size={13} className="icon-amber" /> SQL Cleaning Queries</div>
                        {cleaning.sqlCleaningQueries.map((q, i) => (
                          <pre key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--blue)', background: 'var(--bg)', padding: '10px 14px', borderRadius: 7, marginBottom: 8, overflow: 'auto', whiteSpace: 'pre-wrap' }}>{q}</pre>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {tab === 'schema' && schema && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {schema.createStatement && (
                      <div className="card">
                        <div className="card-title" style={{ fontSize: 12 }}><Table size={13} className="icon-amber" /> Detected Schema — {schema.tableName}</div>
                        <pre style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--blue)', background: 'var(--bg)', padding: 16, borderRadius: 8, overflow: 'auto', lineHeight: 1.7 }}>
                          {schema.createStatement}
                        </pre>
                      </div>
                    )}

                    {schema.columns?.length > 0 && (
                      <div className="card">
                        <div className="card-title" style={{ fontSize: 12 }}>Column Types</div>
                        <div style={{ overflowX: 'auto' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                            <thead>
                              <tr>
                                {['Column', 'Type', 'Nullable', 'Notes'].map(h => (
                                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text-3)', borderBottom: '1px solid var(--border-soft)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {schema.columns.map((col, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid var(--border-soft)' }}>
                                  <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)', color: 'var(--amber)' }}>{col.name}</td>
                                  <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)', color: 'var(--blue)' }}>{col.type}</td>
                                  <td style={{ padding: '8px 12px' }}><span className={`badge ${col.nullable ? 'badge-gray' : 'badge-amber'}`} style={{ fontSize: 10 }}>{col.nullable ? 'YES' : 'NO'}</span></td>
                                  <td style={{ padding: '8px 12px', color: 'var(--text-3)' }}>{col.notes}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
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
