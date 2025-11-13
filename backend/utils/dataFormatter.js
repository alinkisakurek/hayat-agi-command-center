// Tekrar kullanılan yardımcı fonksiyonlar (tarih formatlama, vb.)

function formatISO(date) {
  try {
    return new Date(date).toISOString();
  } catch (_) {
    return null;
  }
}

module.exports = { formatISO };
