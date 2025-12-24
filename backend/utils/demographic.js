const GENDER_LABELS = {
    male: 'Erkek',
    female: 'Kadın',
    prefer_not_to_say: 'Belirtmek İstemiyorum'
};

const DEMOGRAPHIC_RISK = {
    COCUK: {
        etiket: "Çocuk (0–12 yaş)",
        agirlik: 5,
        aciklama: "Fizyolojik rezerv düşük, hızlı kötüleşir"
    },

    HAMILE: {
        etiket: "Hamile",
        agirlik: 5,
        aciklama: "İki hayat söz konusu"
    },

    YASLI: {
        etiket: "65 yaş üstü",
        agirlik: 4,
        aciklama: "Travmaya tolerans düşük"
    },

    CIHAZA_BAGIMLI: {
        etiket: "Hayati cihaza bağımlı",
        agirlik: 4,
        aciklama: "Elektrik / oksijen kesilirse ölüm riski"
    }
};

module.exports = { GENDER_LABELS, DEMOGRAPHIC_RISK };