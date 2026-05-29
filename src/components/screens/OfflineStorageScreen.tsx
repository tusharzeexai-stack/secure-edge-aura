import { useEffect, useState } from "react";
import {
  Database, Lock, HardDrive, ChevronRight,
  CheckCircle2, Clock, RefreshCw, Trash2, ShieldCheck,
  Edit2, Check, X as CancelIcon,
} from "lucide-react";
import {
  getAllSessions, getSessionVectors, getDbStats, clearAllData, updateSessionLabel,
} from "@/lib/faceDb";

interface Session {
  id: number;
  created_at: string;
  passed: number;
  challenges: string;
  label: string | null;
}
interface Vector {
  id: number;
  challenge: string;
  captured_at: string;
  embeddingDims: number;
  blendshapes: Record<string, number>;
}
interface Stats {
  totalSessions: number;
  passedSessions: number;
  totalVectors: number;
  dbSizeKb: number;
}

const CHALLENGE_LABELS: Record<string, string> = {
  blink: "Blink Eyes", smile: "Smile",
  left:  "Look Left",  right: "Look Right",
};

export function OfflineStorageScreen() {
  const [stats,    setStats]    = useState<Stats | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [vectors,  setVectors]  = useState<Vector[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [clearing, setClearing] = useState(false);
  const [showAll,  setShowAll]  = useState(false);

  // Editing Session label state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newLabel, setNewLabel] = useState("");

  const load = async () => {
    setLoading(true);
    const [s, sess] = await Promise.all([getDbStats(), getAllSessions()]);
    setStats(s);
    setSessions(sess as Session[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSaveLabel = async (id: number) => {
    await updateSessionLabel(id, newLabel.trim());
    setEditingId(null);
    setNewLabel("");
    load();
  };

  const expand = async (id: number) => {
    if (expanded === id) { setExpanded(null); setVectors([]); return; }
    setExpanded(id);
    const vecs = await getSessionVectors(id);
    setVectors(vecs);
  };

  const handleClear = async () => {
    if (!confirm("Delete ALL face vector data? This cannot be undone.")) return;
    setClearing(true);
    await clearAllData();
    await load();
    setExpanded(null);
    setVectors([]);
    setClearing(false);
  };

  return (
    <div className="min-h-full w-full bg-[#f8fafc] p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-[#94a3b8] font-medium">
            Browser SQLite · localStorage
          </div>
          <h2 className="text-xl font-bold text-[#0A192F] mt-0.5">Offline Vault</h2>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#e2e8f0] text-[#64748b] text-xs font-medium hover:bg-[#f1f5f9] transition-colors">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          <button onClick={handleClear} disabled={clearing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-medium hover:bg-red-100 transition-colors disabled:opacity-50">
            <Trash2 className="w-3.5 h-3.5" />
            {clearing ? "Clearing…" : "Clear All"}
          </button>
        </div>
      </div>

      {/* Stats row */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Database,    label: "Total Sessions", value: stats.totalSessions },
            { icon: CheckCircle2,label: "Passed Sessions",value: stats.passedSessions },
            { icon: ShieldCheck, label: "Face Vectors",   value: stats.totalVectors },
            { icon: HardDrive,   label: "DB Size",        value: `${stats.dbSizeKb} KB` },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-[#e2e8f0] p-4 shadow-sm">
              <s.icon className="w-4 h-4 text-[#2563EB] mb-2" />
              <div className="text-2xl font-bold text-[#0A192F]">{s.value}</div>
              <div className="text-[11px] text-[#94a3b8] uppercase tracking-wider mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Sessions list */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#f1f5f9]">
          <div>
            <div className="text-sm font-semibold text-[#0A192F]">Liveness Sessions</div>
            <div className="text-[11px] text-[#94a3b8] mt-0.5">
              Face vector embeddings from verified liveness checks
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAll((v) => !v)}
              className={`text-[11px] px-2.5 py-1 rounded-full border font-medium transition-colors ${
                showAll
                  ? "bg-amber-50 border-amber-200 text-amber-700"
                  : "bg-[#f1f5f9] border-[#e2e8f0] text-[#64748b]"
              }`}
            >
              {showAll ? "Showing All" : "Verified Only"}
            </button>
            <div className="text-[11px] text-[#2563EB] font-medium">
              {(showAll ? sessions : sessions.filter((s) => s.passed)).length} session
              {(showAll ? sessions : sessions.filter((s) => s.passed)).length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-[#94a3b8] text-sm gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" /> Loading from SQLite…
          </div>
        ) : (showAll ? sessions : sessions.filter((s) => s.passed)).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <div className="w-14 h-14 rounded-full bg-[#f1f5f9] flex items-center justify-center mb-3">
              <Database className="w-7 h-7 text-[#94a3b8]" />
            </div>
            <div className="text-sm font-semibold text-[#0A192F]">No verified sessions yet</div>
            <div className="text-[12px] text-[#94a3b8] mt-1">
              Complete a liveness check to store face vectors here.
            </div>
          </div>
        ) : (
          <div className="divide-y divide-[#f1f5f9]">
            {(showAll ? sessions : sessions.filter((s) => s.passed)).map((sess) => (
              <div key={sess.id}>
                {/* Session row */}
                <div
                  className="w-full flex items-center justify-between gap-4 px-5 py-3.5 hover:bg-[#f8fafc] transition-colors cursor-pointer"
                  onClick={() => expand(sess.id)}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      sess.passed ? "bg-emerald-500" : "bg-[#f1f5f9]"
                    }`}>
                      {sess.passed
                        ? <CheckCircle2 className="w-5 h-5 text-white" />
                        : <Lock className="w-5 h-5 text-[#94a3b8]" />
                      }
                    </div>

                    <div className="flex-1 min-w-0">
                      {editingId === sess.id ? (
                        <div 
                          className="flex items-center gap-2 max-w-sm"
                          onClick={(e) => e.stopPropagation()} // Prevent expand/collapse
                        >
                          <input
                            type="text"
                            value={newLabel}
                            onChange={(e) => setNewLabel(e.target.value)}
                            placeholder="Enter name (e.g. Tushar)"
                            className="bg-white border border-[#cbd5e1] rounded-lg px-2 py-1 text-xs text-[#0A192F] focus:outline-none focus:ring-1 focus:ring-[#2563EB] w-full"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveLabel(sess.id);
                              if (e.key === "Escape") setEditingId(null);
                            }}
                          />
                          <button
                            onClick={() => handleSaveLabel(sess.id)}
                            className="p-1 rounded bg-[#2563EB] text-white hover:bg-blue-600 transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1 rounded bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0] transition-colors"
                          >
                            <CancelIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-[#0A192F] truncate">
                            {sess.label ? sess.label : `Session #${sess.id}`}
                          </span>
                          {sess.passed ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent expand/collapse
                                setEditingId(sess.id);
                                setNewLabel(sess.label || `Session #${sess.id}`);
                              }}
                              className="p-1 text-[#64748b] hover:text-[#2563EB] hover:bg-[#f1f5f9] rounded transition-all"
                              title="Assign Name / Label"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                          ) : null}
                        </div>
                      )}
                      
                      <div className="text-[11px] text-[#94a3b8] flex items-center gap-1.5 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {new Date(sess.created_at).toLocaleString()}
                        {sess.label && <span className="text-white/40 font-mono">· Session #{sess.id}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${
                      sess.passed
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}>
                      {sess.passed ? "PASSED" : "INCOMPLETE"}
                    </span>
                    <ChevronRight className={`w-4 h-4 text-[#94a3b8] transition-transform ${expanded === sess.id ? "rotate-90" : ""}`} />
                  </div>
                </div>

                {/* Expanded vectors */}
                {expanded === sess.id && (
                  <div className="bg-[#f8fafc] border-t border-[#f1f5f9] px-5 py-4 space-y-3">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-[#94a3b8]">
                      Face Vector Embeddings
                    </div>
                    {vectors.length === 0 ? (
                      <div className="text-[12px] text-[#94a3b8]">No vectors for this session.</div>
                    ) : (
                      vectors.map((v) => (
                        <div key={v.id} className="bg-white rounded-xl border border-[#e2e8f0] p-4 shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-[#2563EB] flex items-center justify-center">
                                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                              </div>
                              <span className="text-sm font-semibold text-[#0A192F]">
                                {CHALLENGE_LABELS[v.challenge] ?? v.challenge}
                              </span>
                            </div>
                            <div className="text-[10px] text-[#94a3b8]">
                              {new Date(v.captured_at).toLocaleTimeString()}
                            </div>
                          </div>
                          {/* Embedding preview */}
                          <div className="bg-[#0A192F] rounded-lg p-3 font-mono text-[10px] text-emerald-400 leading-relaxed">
                            <div className="text-white/40 mb-1">
                              Float32 embedding · {v.embeddingDims} dims (478 landmarks × 3)
                            </div>
                            <div className="truncate text-emerald-400">
                              [{Object.values(v.blendshapes).slice(0, 8).map((n) => n.toFixed(3)).join(", ")}, …]
                            </div>
                          </div>
                          {/* Top blendshapes */}
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {Object.entries(v.blendshapes)
                              .filter(([, s]) => s > 0.1)
                              .sort(([, a], [, b]) => b - a)
                              .slice(0, 6)
                              .map(([name, score]) => (
                                <span key={name}
                                  className="text-[10px] px-2 py-0.5 rounded-full bg-[#eff6ff] text-[#2563EB] font-mono">
                                  {name.replace(/([A-Z])/g, " $1").trim()}: {score.toFixed(2)}
                                </span>
                              ))
                            }
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Schema info */}
      <div className="bg-[#0A192F] rounded-xl p-5 text-white">
        <div className="flex items-center gap-2 mb-3">
          <Database className="w-4 h-4 text-[#60A5FA]" />
          <span className="text-sm font-semibold">SQLite Schema</span>
          <span className="ml-auto text-[10px] text-white/30">sql.js · WASM · localStorage</span>
        </div>
        <div className="font-mono text-[11px] text-emerald-400 space-y-1 leading-relaxed">
          <div><span className="text-[#60A5FA]">TABLE</span> sessions <span className="text-white/40">(id, created_at, passed, challenges)</span></div>
          <div><span className="text-[#60A5FA]">TABLE</span> face_vectors <span className="text-white/40">(id, session_id, challenge, captured_at,</span></div>
          <div className="pl-4 text-white/40">embedding BLOB Float32[1434], blendshapes JSON)</div>
        </div>
      </div>
    </div>
  );
}
