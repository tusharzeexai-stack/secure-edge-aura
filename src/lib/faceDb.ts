/**
 * faceDb.ts  –  Browser SQLite via sql.js (WASM), persisted to localStorage.
 *
 * Schema:
 *   sessions  – one row per liveness verification attempt
 *   face_vectors – one row per challenge, stores:
 *       • embedding BLOB  – flat Float32Array (478 landmarks × 3 = 1434 dims)
 *       • blendshapes TEXT – JSON blendshape scores
 */
import initSqlJs, { Database } from "sql.js";

const LS_KEY = "sentinel_ai_facedb_v1";
let db: Database | null = null;

/* ── Init & persist helpers ─────────────────────────────── */
async function getDb(): Promise<Database> {
  if (db) return db;

  const SQL = await initSqlJs({
    locateFile: () => "/sql-wasm.wasm",
  });

  // Restore from localStorage if available
  const saved = localStorage.getItem(LS_KEY);
  if (saved) {
    try {
      const buf = base64ToUint8Array(saved);
      db = new SQL.Database(buf);
    } catch {
      db = new SQL.Database(); // corrupt → fresh
    }
  } else {
    db = new SQL.Database();
  }

  db.run(`PRAGMA journal_mode=OFF;`);
  db.run(`
    CREATE TABLE IF NOT EXISTS sessions (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT    NOT NULL,
      passed     INTEGER NOT NULL DEFAULT 0,
      challenges TEXT    NOT NULL,
      label      TEXT
    );
  `);
  
  // Dynamically add label column if existing table doesn't have it
  try {
    db.run("ALTER TABLE sessions ADD COLUMN label TEXT;");
  } catch (e) {
    // Column already exists, safe to ignore
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS face_vectors (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id  INTEGER NOT NULL REFERENCES sessions(id),
      challenge   TEXT    NOT NULL,
      captured_at TEXT    NOT NULL,
      embedding   BLOB    NOT NULL,   -- Float32Array: 478 landmarks × 3 = 1434 dims
      blendshapes TEXT    NOT NULL    -- JSON {name: score}
    );
  `);

  persist(db);
  return db;
}

/** Convert Uint8Array to Base64 string in chunks to prevent stack overflow */
function uint8ArrayToBase64(arr: Uint8Array): string {
  let binary = "";
  const len = arr.byteLength;
  const chunk = 16384; // 16KB chunks
  for (let i = 0; i < len; i += chunk) {
    const slice = arr.subarray(i, i + chunk);
    binary += String.fromCharCode.apply(null, slice as any);
  }
  return btoa(binary);
}

/** Convert Base64 string to Uint8Array */
function base64ToUint8Array(b64: string): Uint8Array {
  const binary = atob(b64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/** Serialize DB → base64 → localStorage */
function persist(database: Database) {
  try {
    const bytes = database.export();
    const b64   = uint8ArrayToBase64(bytes);
    localStorage.setItem(LS_KEY, b64);
  } catch (e) {
    console.error("faceDb: could not persist to localStorage", e);
  }
}

/* ── Public API ─────────────────────────────────────────── */

export interface FaceVectorEntry {
  sessionId:   number;
  challenge:   string;
  /** 478 {x,y,z} landmarks from MediaPipe */
  landmarks:   Array<{ x: number; y: number; z: number }>;
  blendshapes: Record<string, number>;
}

/** Create a new liveness session, returns its id */
export async function createSession(challenges: string[]): Promise<number> {
  const database = await getDb();
  database.run(
    `INSERT INTO sessions (created_at, passed, challenges) VALUES (?,0,?)`,
    [new Date().toISOString(), JSON.stringify(challenges)]
  );
  const res = database.exec("SELECT last_insert_rowid()");
  const id  = res[0].values[0][0] as number;
  persist(database);
  return id;
}

/** Save one face-vector snapshot (called once per passed challenge) */
export async function saveFaceVector(entry: FaceVectorEntry): Promise<void> {
  const database = await getDb();

  // Build flat Float32 embedding: [x0,y0,z0, x1,y1,z1, …]
  const embedding = new Float32Array(entry.landmarks.length * 3);
  entry.landmarks.forEach(({ x, y, z }, i) => {
    embedding[i * 3]     = x;
    embedding[i * 3 + 1] = y;
    embedding[i * 3 + 2] = z;
  });

  database.run(
    `INSERT INTO face_vectors
       (session_id, challenge, captured_at, embedding, blendshapes)
     VALUES (?,?,?,?,?)`,
    [
      entry.sessionId,
      entry.challenge,
      new Date().toISOString(),
      new Uint8Array(embedding.buffer),
      JSON.stringify(entry.blendshapes),
    ]
  );
  persist(database);
}

/** Mark session fully passed */
export async function completeSession(sessionId: number): Promise<void> {
  const database = await getDb();
  database.run(`UPDATE sessions SET passed=1 WHERE id=?`, [sessionId]);
  persist(database);
}

/** Update the custom label of a session */
export async function updateSessionLabel(sessionId: number, label: string): Promise<void> {
  const database = await getDb();
  database.run(`UPDATE sessions SET label=? WHERE id=?`, [label, sessionId]);
  persist(database);
}

/** Get all sessions ordered newest first */
export async function getAllSessions(): Promise<Array<{
  id: number; created_at: string; passed: number; challenges: string; label: string | null;
}>> {
  const database = await getDb();
  const res = database.exec(
    "SELECT id, created_at, passed, challenges, label FROM sessions ORDER BY id DESC"
  );
  if (!res[0]) return [];
  return res[0].values.map(([id, created_at, passed, challenges, label]) => ({
    id:         id as number,
    created_at: created_at as string,
    passed:     passed as number,
    challenges: challenges as string,
    label:      label as string | null,
  }));
}

/** Get all vectors for a session */
export async function getSessionVectors(sessionId: number): Promise<Array<{
  id: number; challenge: string; captured_at: string;
  embeddingDims: number; blendshapes: Record<string, number>;
}>> {
  const database = await getDb();
  const res = database.exec(
    `SELECT id, challenge, captured_at, length(embedding) as bytes, blendshapes
     FROM face_vectors WHERE session_id=? ORDER BY id ASC`,
    [sessionId]
  );
  if (!res[0]) return [];
  return res[0].values.map(([id, challenge, captured_at, bytes, blendshapes]) => ({
    id:           id as number,
    challenge:    challenge as string,
    captured_at:  captured_at as string,
    embeddingDims: Math.round((bytes as number) / 4),
    blendshapes:  JSON.parse(blendshapes as string),
  }));
}

/** Get all saved face vectors for comparison/recognition */
export async function getAllSavedVectors(): Promise<Array<{
  sessionId: number;
  label: string | null;
  challenge: string;
  embedding: Float32Array;
  blendshapes: Record<string, number>;
}>> {
  const database = await getDb();
  const res = database.exec(
    `SELECT f.session_id, s.label, f.challenge, f.embedding, f.blendshapes
     FROM face_vectors f
     JOIN sessions s ON f.session_id = s.id
     WHERE s.passed = 1`
  );
  if (!res[0]) return [];
  return res[0].values.map(([sessionId, label, challenge, embedding, blendshapes]) => {
    const u8 = embedding as Uint8Array;
    // Copy the raw bytes to isolate from volatile WebAssembly heap allocations
    const f32 = new Float32Array(u8.buffer.slice(u8.byteOffset, u8.byteOffset + u8.byteLength));
    return {
      sessionId: sessionId as number,
      label: label as string | null,
      challenge: challenge as string,
      embedding: f32,
      blendshapes: JSON.parse(blendshapes as string),
    };
  });
}

/** Stats for dashboard display */
export async function getDbStats(): Promise<{
  totalSessions: number; passedSessions: number;
  totalVectors: number; dbSizeKb: number;
}> {
  const database = await getDb();
  const s  = database.exec("SELECT COUNT(*), SUM(passed) FROM sessions")[0]?.values[0] ?? [0,0];
  const v  = database.exec("SELECT COUNT(*) FROM face_vectors")[0]?.values[0] ?? [0];
  const saved = localStorage.getItem(LS_KEY) ?? "";
  return {
    totalSessions:  s[0] as number,
    passedSessions: (s[1] as number) ?? 0,
    totalVectors:   v[0] as number,
    dbSizeKb:       Math.round(saved.length * 0.75 / 1024),
  };
}

/** Clear all data (factory reset) */
export async function clearAllData(): Promise<void> {
  const database = await getDb();
  database.run("DELETE FROM face_vectors");
  database.run("DELETE FROM sessions");
  persist(database);
}
