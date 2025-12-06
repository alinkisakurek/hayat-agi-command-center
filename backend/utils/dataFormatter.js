// Reusable helper functions (date formatting, etc.)

function formatISO(date) {
  try {
    return new Date(date).toISOString();
  } catch (_) {
    return null;
  }
}

module.exports = { formatISO };
