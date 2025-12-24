const BILISSEL_ILETISIM_DUYUSAL_RISK = {
    kategori: "Bilişsel, İletişim ve Duyusal Riskler",
    oncelikSeviyesi: 2,
    agirlik: 3,
    hastaliklar: [
        // Bilişsel
        "Zihinsel Yetersizlik (Hafif / Orta / Ağır)",
        "Otizm Spektrum Bozukluğu (OSB)",
        "Down Sendromu",
        "Demans (Alzheimer dahil)",
        "Gelişimsel Bilişsel Bozukluk",

        // Psikiyatrik
        "Şiddetli Anksiyete Bozukluğu",
        "Akut Travma Sonrası Stres Tepkisi",
        "Psikotik Bozukluklar (Şizofreni vb.)",
        "Duygudurum Bozuklukları (Bipolar vb.)",

        // İletişim
        "İletişim Kurmada Belirgin Güçlük",
        "Sözel İletişim Kuramama (Non-verbal)",
        "Talimatları Algılamada Güçlük",

        // Duyusal
        "Görme Engeli (Kısmi / Tam)",
        "İşitme Engeli (Kısmi / Tam)",
        "Hem Görme Hem İşitme Engeli"
    ],
    operasyonelNotlar: [
        "Sesli komutlara yanıt vermeyebilir",
        "Görsel yönlendirme gerekebilir",
        "Panik halinde kontrolsüz hareket edebilir",
        "Fiziksel temasla yönlendirme gerekebilir",
        "Refakatçi bilgisi kritik"
    ]
};

module.exports = { BILISSEL_ILETISIM_DUYUSAL_RISK };