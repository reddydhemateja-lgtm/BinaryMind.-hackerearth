import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import {
  GitCompare, Upload, FileText, Sparkles, BarChart2,
  Plus, Minus, Equal, Brain
} from 'lucide-react';
import { compareAPI } from '../utils/api';

function DropZone({ label, file, onFile }) {
  const onDrop = useCallback(accepted => { if (accepted[0]) onFile(accepted[0]); }, [onFile]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/*': ['.txt', '.csv', '.sql', '.md', '.json', '.xml', '.yaml', '.yml', '.log'] },
    maxFiles: 1,
  });

  return (
    <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
      <input {...getInputProps()} />
      <div className="dropzone-icon"><Upload size={28} /></div>
      <div className="dropzone-label">{label}</div>
      <div className="dropzone-sub">Drop file or click • CSV, JSON, SQL, TXT, XML, YAML</div>
      {file && (
        <div className="dropzone-file" style={{ justifyContent: 'center', marginTop: 12 }}>
          <FileText size={14} style={{ color: 'var(--amber)' }} />
          <span>{file.name}</span>
          <span style={{ marginLeft: 'auto', color: 'var(--text-3)', fontSize: 11 }}>{(file.size / 1024).toFixed(1)} KB</span>
        </div>
      )}
    </div>
  );
}

function StatBadge({ icon: Icon, label, value, color }) {
  return (
    <div style={{ background: 'var(--bg-3)', border: '1px solid var(--border-soft)', borderRadius: 10, padding: '12px 16px', textAlign: 'center' }}>
      <Icon size={16} style={{ color }} />
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color, marginTop: 4 }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
    </div>
  );
}

export default function FileCompare() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [mode, setMode] = useState('line');
  const [result, setResult] = useState(null);
  const [aiSummary, setAiSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [view, setView] = useState('unified'); // unified | side-by-side

  const handleCompare = async () => {
    if (!file1 || !file2) return toast.error('Upload both files first');
    setLoading(true);
    setResult(null);
    setAiSummary(null);
    try {
      const formData = new FormData();
      formData.append('file1', file1);
      formData.append('file2', file2);
      formData.append('mode', mode);
      const data = await compareAPI.compareFiles(formData);
      setResult(data);
      toast.success('Comparison ready!');
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAISummary = async () => {
    if (!result) return;
    setAiLoading(true);
    try {
      const data = await compareAPI.getAISummary(result.stats, result.name1, result.name2);
      setAiSummary(data);
      toast.success('AI summary ready!');
    } catch (e) {
      toast.error(e.message);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div>
      <div className="section-header">
        <div className="section-title">File Comparator</div>
        <div className="section-sub">Compare any two files side-by-side with AI-powered diff analysis</div>
      </div>

      {/* Upload area */}
      <div className="card" style={{ marginBottom: 18 }}>
        <div className="grid-2" style={{ gap: 16, marginBottom: 16 }}>
          <DropZone label="Drop File 1" file={file1} onFile={setFile1} />
          <DropZone label="Drop File 2" file={file2} onFile={setFile2} />
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label>Compare Mode</label>
            <select value={mode} onChange={e => setMode(e.target.value)}>
              <option value="line">Line by Line</option>
              <option value="word">Word by Word</option>
              <option value="char">Character</option>
              <option value="json">JSON Diff</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={handleCompare} disabled={loading} style={{ marginTop: 18 }}>
            {loading ? <span className="spinner" /> : <GitCompare size={14} />}
            {loading ? 'Comparing...' : 'Compare Files'}
          </button>
        </div>
      </div>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* Stats */}
            <div className="grid-4" style={{ marginBottom: 18, gap: 12 }}>
              <StatBadge icon={Plus}    label="Added"       value={result.stats.added}              color="var(--green)" />
              <StatBadge icon={Minus}   label="Removed"     value={result.stats.removed}            color="var(--red)" />
              <StatBadge icon={Equal}   label="Unchanged"   value={result.stats.unchanged}          color="var(--text-3)" />
              <StatBadge icon={BarChart2} label="Similarity" value={`${result.stats.similarityPercent}%`} color="var(--amber)" />
            </div>

            {/* AI Summary */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
              <button className="btn btn-ghost" onClick={handleAISummary} disabled={aiLoading}>
                {aiLoading ? <span className="spinner" /> : <Brain size={14} />}
                {aiLoading ? 'Generating...' : 'AI Summary'}
              </button>
              <div style={{ display: 'flex', gap: 6, marginLeft: 'auto' }}>
                <button className={`btn ${view === 'unified' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setView('unified')} style={{ fontSize: 12, padding: '6px 12px' }}>Unified</button>
                <button className={`btn ${view === 'side-by-side' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setView('side-by-side')} style={{ fontSize: 12, padding: '6px 12px' }}>Side by Side</button>
              </div>
            </div>

            {aiSummary && (
              <div className="ai-box" style={{ marginBottom: 16 }}>
                <div className="ai-box-title"><Sparkles size={11} /> AI Diff Summary</div>
                <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 10, lineHeight: 1.6 }}>{aiSummary.summary}</div>
                {aiSummary.keyChanges?.length > 0 && (
                  <ul style={{ paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {aiSummary.keyChanges.map((c, i) => <li key={i} style={{ fontSize: 12, color: 'var(--text-3)' }}>{c}</li>)}
                  </ul>
                )}
                {aiSummary.recommendation && (
                  <div style={{ marginTop: 10, fontSize: 12, color: 'var(--amber)', borderTop: '1px solid var(--border-soft)', paddingTop: 8 }}>
                    💡 {aiSummary.recommendation}
                  </div>
                )}
              </div>
            )}

            {/* Diff View */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', gap: 10, fontSize: 12 }}>
                  <span style={{ color: 'var(--text-3)' }}>{result.name1}</span>
                  <span style={{ color: 'var(--text-3)' }}>vs</span>
                  <span style={{ color: 'var(--text-3)' }}>{result.name2}</span>
                </div>
                <div style={{ display: 'flex', gap: 12, fontSize: 11 }}>
                  <span style={{ color: 'var(--green)' }}>+ {result.stats.added} added</span>
                  <span style={{ color: 'var(--red)' }}>- {result.stats.removed} removed</span>
                </div>
              </div>
              <div style={{ maxHeight: 500, overflow: 'auto', background: 'var(--bg)', borderRadius: 8, padding: '8px 0' }}>
                {view === 'unified' ? (
                  result.hunks?.map((hunk, i) => (
                    hunk.type !== 'unchanged' && (
                      <div key={i} className={`diff-line ${hunk.type === 'added' ? 'diff-added' : 'diff-removed'}`} style={{ padding: '1px 12px' }}>
                        <span className="diff-prefix" style={{ color: hunk.type === 'added' ? 'var(--green)' : 'var(--red)', userSelect: 'none' }}>
                          {hunk.type === 'added' ? '+' : '-'}
                        </span>
                        <span className="diff-content">{hunk.value}</span>
                      </div>
                    )
                  ))
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
                    <thead>
                      <tr>
                        <th style={{ padding: '6px 12px', color: 'var(--text-3)', textAlign: 'left', borderBottom: '1px solid var(--border-soft)', width: '50%' }}>{result.name1}</th>
                        <th style={{ padding: '6px 12px', color: 'var(--text-3)', textAlign: 'left', borderBottom: '1px solid var(--border-soft)', width: '50%' }}>{result.name2}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.sideBySide?.slice(0, 200).map((row, i) => (
                        <tr key={i} style={{ background: row.status === 'added' ? 'rgba(34,197,94,0.06)' : row.status === 'removed' ? 'rgba(239,68,68,0.06)' : row.status === 'modified' ? 'rgba(245,158,11,0.04)' : '' }}>
                          <td style={{ padding: '2px 12px', color: row.status === 'removed' || row.status === 'modified' ? 'var(--red)' : 'var(--text-2)', borderRight: '1px solid var(--border-soft)', whiteSpace: 'pre' }}>{row.left ?? ''}</td>
                          <td style={{ padding: '2px 12px', color: row.status === 'added' || row.status === 'modified' ? 'var(--green)' : 'var(--text-2)', whiteSpace: 'pre' }}>{row.right ?? ''}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!result && !loading && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 220, opacity: 0.4, gap: 10 }}>
          <GitCompare size={40} style={{ color: 'var(--amber)' }} />
          <div style={{ fontFamily: 'var(--font-display)', color: 'var(--text-2)' }}>Upload two files to compare</div>
        </div>
      )}
    </div>
  );
}
