const HEALTH_OPTIONS = {
    bloodGroups: [
        'A Rh(+)', 'A Rh(-)',
        'B Rh(+)', 'B Rh(-)',
        'AB Rh(+)', 'AB Rh(-)',
        '0 Rh(+)', '0 Rh(-)'
    ],
    // Kurtarma tekniğini (nasıl çekileceğini) ve iletişimi etkileyen cihazlar
    prostheses: [
        'Kalp Pili (Pacemaker)',            // Elektrikli aletlerle müdahalede dikkat gerekir.
        'İşitme Cihazı / Koklear İmplant',  // "Sesimi duyan var mı" çağrısını duyamayabilir.
        'İnsülin Pompası',                  // Vücuda bağlı hassas cihaz.
        'Protez Bacak / Kol',               // Sıkışma durumunda uzvun gerçek olup olmadığını anlamak için.
        'Omurga Platinleri / Vidaları',     // Hatalı taşıma felç bırakabilir.
        'Yapay Kalp Kapakçığı',             // Kan sulandırıcı kullanımıyla ilişkilidir.
        'Şant (Beyin/Böbrek)',              // Darbe almaması gereken hassas bölgeler.
        'Tekerlekli Sandalye Kullanımı'     // Hareket kabiliyeti olmadığını belirtir.
    ],
    chronicConditions: [
        'Diyabet (Şeker Hastalığı)',        // İnsülin şoku riski, uzun süre açlıkta koma riski.
        'Hipertansiyon (Yüksek Tansiyon)',  // Crush sendromu ile birleşince kalp krizi riski.
        'KOAH / Astım',                     // Enkaz tozundan boğulma riski çok yüksektir.
        'Kalp Yetmezliği / Aritmi',         // Kurtarma stresine dayanamama riski.
        'Epilepsi (Sara)',                  // Işık/ses ile nöbet geçirme riski.
        'Böbrek Yetmezliği (Diyaliz)',      // Crush sendromu (ezilme) durumunda en riskli grup.
        'Kan Pıhtılaşma Bozukluğu',         // Yaralanmalarda durdurulamayan kanama riski.
        'Tiroid Hastalıkları',              // Metabolizma hızı ve vücut ısısı kontrolü için önemli.
        'Bağışıklık Yetmezliği'             // Enfeksiyonlara karşı aşırı duyarlılık.
    ],
    // Hayati önem taşıyan ve kesilmesi durumunda risk oluşturan ilaç sınıfları
    medications: [
        'İnsülin',                          // Kesilirse hayati risk.
        'Kan Sulandırıcılar (Aspirin vb.)', // Kanama kontrolü için bilinmesi ŞART.
        'Kalp / Tansiyon İlaçları',         // Ritim bozukluğu riski.
        'Astım İnhalerleri / Fısfıs',       // Solunum desteği için öncelikli.
        'Epilepsi İlaçları',                // Nöbet riski.
        'Kortizon / Steroidler',            // Aniden kesilmesi şok etkisi yaratabilir.
        'Psikiyatrik İlaçlar (Antidepresan vb.)', // Yoksunluk belirtileri ve panik yönetimi için.
        'Tiroit İlaçları'
    ],
};

const GENDER_LABELS = {
    male: 'Erkek',
    female: 'Kadın',
    prefer_not_to_say: 'Belirtmek İstemiyorum'
};

module.exports = { HEALTH_OPTIONS, GENDER_LABELS };
