const locks = new Map();
// struktura: Map { submissionId => { professorId, professorName, lockedAt } }

const LOCK_TIMEOUT = 10 * 60 * 1000; // 10 minuta

const lock = (submissionId, professorId, professorName) => {
  locks.set(submissionId, {
    professorId,
    professorName,
    lockedAt: Date.now(),
  });
};

const unlock = (submissionId, professorId) => {
  const existing = locks.get(submissionId);
  // samo profesor koji je zaključao može otključati
  if (existing && existing.professorId === professorId) {
    locks.delete(submissionId);
    return true;
  }
  return false;
};

const isLocked = (submissionId, professorId) => {
  const existing = locks.get(submissionId);
  if (!existing) return null;

  if (Date.now() - existing.lockedAt > LOCK_TIMEOUT) {
    locks.delete(submissionId);
    return null;
  }

  // ako je isti profesor, nije locked za njega
  if (existing.professorId === professorId) return null;

  return existing;
};

const getAllLocks = () => {
  const now = Date.now();
  // očisti expired locks i vrati aktivne
  for (const [key, value] of locks.entries()) {
    if (now - value.lockedAt > LOCK_TIMEOUT) {
      locks.delete(key);
    }
  }
  return Object.fromEntries(locks);
};

const refreshLock = (submissionId, professorId) => {
  const existing = locks.get(submissionId);
  if (existing && existing.professorId === professorId) {
    existing.lockedAt = Date.now();
    return true;
  }
  return false;
};

module.exports = { lock, unlock, isLocked, getAllLocks, refreshLock };