const HEALTH_OPTIONS = {
    KAN_GRUBU: [
        'A Rh(+)', 'A Rh(-)',
        'B Rh(+)', 'B Rh(-)',
        'AB Rh(+)', 'AB Rh(-)',
        '0 Rh(+)', '0 Rh(-)'
    ],
    SOLUNUM: {
        kategori: "Solunum ve Oksijenle İlgili Hastalıklar",
        oncelikSeviyesi: 1, // En yüksek öncelik
        agirlik: 5,
        hastaliklar: [
            "Astım",
            "Kronik Obstrüktif Akciğer Hastalığı (KOAH)",
            "Amfizem",
            "Kistik Fibrozis",
            "Kronik veya Doğumsal Üst Hava Yolu Hastalığı",
            "Trakeostomi",
            "Ventilatöre Bağımlı",
            "Sürekli Oksijen Tüpü Kullanımı"
        ]
    },

    KALP_DOLASIM: {
        kategori: "Kalp ve Dolaşım Sistemi Hastalıkları",
        oncelikSeviyesi: 1,
        agirlik: 4,
        hastaliklar: [
            "Konjestif Kalp Yetmezliği",
            "Kalp Ritim Bozukluğu (Aritmi)",
            "Kalp Krizi Geçmişi (Miyokard Enfarktüsü)",
            "Pulmoner Hipertansiyon",
            "Doğumsal Kalp Hastalığı",
            "Kalp Pili",
            "İmplante Edilebilir Defibrilatör (ICD)",
            "Sol Ventrikül Destek Cihazı (LVAD)"
        ]
    },

    KANAMA_METABOLIK: {
        kategori: "Kanama ve Metabolik Riskler",
        oncelikSeviyesi: 1,
        agirlik: 4,
        hastaliklar: [
            "Hemofili",
            "Kan Pıhtılaşma Bozukluğu",
            "İnsüline Bağımlı Diyabet",
            "Böbrek Yetmezliği / Diyaliz",
            "Orak Hücre Anemisi",
            "Kan Sulandırıcı İlaç Kullanımı"
        ]
    },

    ALERJILER: {
        kategori: "Şiddetli Alerjiler ve Anafilaksi Riski",
        oncelikSeviyesi: 1,
        agirlik: 5,
        hastaliklar: [
            "Daha Önce Anafilaktik Reaksiyon Geçirmiş",
            "Penisilin Alerjisi",
            "Opioid Alerjisi (Morfin, Kodein vb.)",
            "Aspirin Alerjisi",
            "Lateks Alerjisi",
            "Arı / Böcek Sokması Alerjisi",
            "Röntgen Kontrast Maddesi Alerjisi",
            "Şiddetli Gıda Alerjisi"
        ]
    },

    NOROLOJIK_YUKSEK_RISK: {
        kategori: "Nörolojik Yüksek Riskli Hastalıklar",
        oncelikSeviyesi: 2,
        agirlik: 3,
        hastaliklar: [
            "Epilepsi / Sara",
            "Miyastenia Gravis",
            "Müsküler Distrofi",
            "İnme (Felç) Geçmişi"
        ]
    },

    BAGISIKLIK_KANSER: {
        kategori: "Kanser ve Bağışıklık Baskılanması",
        oncelikSeviyesi: 2,
        agirlik: 3,
        hastaliklar: [
            "Aktif Kanser Tedavisi Görüyor",
            "Lösemi",
            "Lenfoma",
            "Organ Nakli Alıcısı",
            "Bağışıklık Baskılayıcı Tedavi Kullanımı"
        ]
    },

    TIBBI_BAGIMLILIK: {
        kategori: "Tıbbi Cihaz veya Tedavi Bağımlılığı",
        oncelikSeviyesi: 2,
        agirlik: 4,
        hastaliklar: [
            "Diyalize Bağımlı",
            "Hayati İlaç Kullanımı",
            "Havayolu Aspirasyonu Gereksinimi",
            "Damar İçi (IV) Tedavi Bağımlılığı"
        ]
    },

    HAREKET_KISITI: {
        kategori: "Hareket Kısıtlılığı ve Fiziksel Engeller",
        oncelikSeviyesi: 3,
        agirlik: 2,
        hastaliklar: [
            "Ampütasyon",
            "Parapleji",
            "Kuadripleji",
            "Yatağa Bağımlı",
            "Tekerlekli Sandalye Kullanımı",
            "Yürüteç / Baston / Koltuk Değneği Kullanımı",
            "Aşırı Kilo (135 kg üzeri)"
        ]
    }
};

module.exports = { HEALTH_OPTIONS };
