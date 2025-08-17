
const pendingRegistrations = new Map();
const EXPIRY_MINUTES = parseInt(process.env.PENDING_REG_EXPIRY_MINUTES) || 10;

function setPendingRegistration(email, data) {
  pendingRegistrations.set(email, { ...data, createdAt: Date.now() });
}

function getPendingRegistration(email) {
  const entry = pendingRegistrations.get(email);
  if (!entry) return null;
  const now = Date.now();
  if (now - entry.createdAt > EXPIRY_MINUTES * 60 * 1000) {
    // Expired, clean up
    pendingRegistrations.delete(email);
    return null;
  }
  return entry;
}

function deletePendingRegistration(email) {
  pendingRegistrations.delete(email);
}

// Optional: periodic cleanup (in case of memory leaks)
setInterval(() => {
  const now = Date.now();
  for (const [email, entry] of pendingRegistrations.entries()) {
    if (now - entry.createdAt > EXPIRY_MINUTES * 60 * 1000) {
      pendingRegistrations.delete(email);
    }
  }
}, 5 * 60 * 1000); // every 5 minutes

module.exports = {
  setPendingRegistration,
  getPendingRegistration,
  deletePendingRegistration,
};
