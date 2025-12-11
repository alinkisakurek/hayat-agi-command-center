// E-Nabız benzeri uygulama için sağlık verileri
// Genişletilmiş ve kategorize edilmiş liste

export const diseases = [
  // Kronik Hastalıklar
  { id: 'ht', name: 'Hipertansiyon', category: 'Kronik' },
  { id: 't2dm', name: 'Tip 2 Diyabet', category: 'Kronik' },
  { id: 't1dm', name: 'Tip 1 Diyabet', category: 'Kronik' },
  { id: 'asthma', name: 'Astım', category: 'Kronik' },
  { id: 'copd', name: 'KOAH', category: 'Kronik' },
  { id: 'ckd', name: 'Kronik böbrek yetmezliği', category: 'Kronik' },
  { id: 'cirrhosis', name: 'Siroz', category: 'Kronik' },
  { id: 'celiac', name: 'Çölyak Hastalığı', category: 'Kronik' },
  
  // Kardiyovasküler
  { id: 'cad', name: 'Koroner arter hastalığı', category: 'Kardiyovasküler' },
  { id: 'heart_failure', name: 'Kalp yetmezliği', category: 'Kardiyovasküler' },
  { id: 'arrhythmia', name: 'Aritmi', category: 'Kardiyovasküler' },
  { id: 'stroke', name: 'Felç (İnme)', category: 'Kardiyovasküler' },
  
  // Nörolojik
  { id: 'epilepsy', name: 'Epilepsi (Sara)', category: 'Nörolojik' },
  { id: 'migraine', name: 'Migren', category: 'Nörolojik' },
  { id: 'parkinson', name: 'Parkinson hastalığı', category: 'Nörolojik' },
  { id: 'alzheimer', name: 'Alzheimer', category: 'Nörolojik' },
  { id: 'ms', name: 'Multipl Skleroz (MS)', category: 'Nörolojik' },
  
  // Psikiyatrik
  { id: 'depression', name: 'Depresyon', category: 'Psikiyatrik' },
  { id: 'anxiety', name: 'Anksiyete bozukluğu', category: 'Psikiyatrik' },
  { id: 'bipolar', name: 'Bipolar bozukluk', category: 'Psikiyatrik' },
  { id: 'schizophrenia', name: 'Şizofreni', category: 'Psikiyatrik' },
  
  // Gastrointestinal
  { id: 'gerd', name: 'Reflü (GERD)', category: 'Gastrointestinal' },
  { id: 'ibs', name: 'İrritabl bağırsak sendromu (IBS)', category: 'Gastrointestinal' },
  { id: 'ulcer', name: 'Ülser', category: 'Gastrointestinal' },
  { id: 'crohn', name: 'Crohn hastalığı', category: 'Gastrointestinal' },
  { id: 'colitis', name: 'Ülseratif kolit', category: 'Gastrointestinal' },
  
  // Alerjik
  { id: 'allergic_rhinitis', name: 'Alerjik rinit', category: 'Alerjik' },
  { id: 'urticaria', name: 'Ürtiker', category: 'Alerjik' },
  { id: 'eczema', name: 'Egzama', category: 'Alerjik' },
  { id: 'food_allergy', name: 'Gıda alerjisi', category: 'Alerjik' },
  
  // Ortopedik
  { id: 'osteo', name: 'Osteoartrit', category: 'Ortopedik' },
  { id: 'spine_herniation', name: 'Bel/Boyun fıtığı', category: 'Ortopedik' },
  { id: 'meniscus', name: 'Menisküs yırtığı', category: 'Ortopedik' },
  { id: 'tendinitis', name: 'Tendinit', category: 'Ortopedik' },
  { id: 'osteoporosis', name: 'Osteoporoz', category: 'Ortopedik' },
  { id: 'rheumatoid', name: 'Romatoid artrit', category: 'Ortopedik' },
  
  // Enfeksiyon
  { id: 'uri', name: 'Üst solunum yolu enfeksiyonu', category: 'Enfeksiyon' },
  { id: 'uti', name: 'İdrar yolu enfeksiyonu', category: 'Enfeksiyon' },
  { id: 'hepatitis', name: 'Hepatit B/C', category: 'Enfeksiyon' },
  { id: 'tuberculosis', name: 'Verem (Tüberküloz)', category: 'Enfeksiyon' },
  
  // Onkoloji
  { id: 'cancer', name: 'Kanser', category: 'Onkoloji' },
  { id: 'breast_cancer', name: 'Meme kanseri', category: 'Onkoloji' },
  { id: 'lung_cancer', name: 'Akciğer kanseri', category: 'Onkoloji' },
  { id: 'colon_cancer', name: 'Kolorektal kanser', category: 'Onkoloji' },
  
  // Endokrin
  { id: 'hypothyroidism', name: 'Hipotiroidi', category: 'Endokrin' },
  { id: 'hyperthyroidism', name: 'Hipertiroidi', category: 'Endokrin' },
  { id: 'addison', name: 'Addison hastalığı', category: 'Endokrin' },
  
  // Diğer
  { id: 'anemia', name: 'Anemi', category: 'Diğer' },
  { id: 'thyroid', name: 'Tiroid hastalığı', category: 'Diğer' },
  { id: 'glaucoma', name: 'Glokom', category: 'Diğer' },
  { id: 'cataract', name: 'Katarakt', category: 'Diğer' },
];

export const medications = [
  // Kardiyovasküler
  {
    id: 'cardio',
    category: 'Kardiyovasküler',
    items: [
      { id: 'acei', name: 'ACE inhibitörleri (Lisinopril, Enalapril)' },
      { id: 'arb', name: 'ARB (Losartan, Valsartan)' },
      { id: 'beta', name: 'Beta blokerler (Metoprolol, Atenolol)' },
      { id: 'statin', name: 'Statinler (Atorvastatin, Simvastatin)' },
      { id: 'aspirin', name: 'Aspirin (düşük doz)' },
      { id: 'clopidogrel', name: 'Klopidogrel' },
      { id: 'warfarin', name: 'Varfarin' },
      { id: 'digoxin', name: 'Digoksin' },
    ],
  },
  // Diyabet
  {
    id: 'diabetes',
    category: 'Diyabet',
    items: [
      { id: 'metformin', name: 'Metformin' },
      { id: 'sglt2', name: 'SGLT2 inhibitörleri (Empagliflozin)' },
      { id: 'dpp4', name: 'DPP-4 inhibitörleri (Sitagliptin)' },
      { id: 'glp1', name: 'GLP-1 analogları' },
      { id: 'insulin_short', name: 'İnsülin (kısa etkili)' },
      { id: 'insulin_long', name: 'İnsülin (uzun etkili)' },
      { id: 'insulin_mixed', name: 'İnsülin (karışık)' },
      { id: 'gliclazide', name: 'Gliklazid' },
    ],
  },
  // Solunum
  {
    id: 'respiratory',
    category: 'Solunum',
    items: [
      { id: 'ics', name: 'İnhale kortikosteroid (Budesonid)' },
      { id: 'bronchodilator', name: 'Bronkodilatör (Salbutamol)' },
      { id: 'montelukast', name: 'Montelukast' },
      { id: 'theophylline', name: 'Teofilin' },
    ],
  },
  // Ağrı / Enflamasyon
  {
    id: 'pain',
    category: 'Ağrı / Enflamasyon',
    items: [
      { id: 'nsaid', name: 'NSAID (İbuprofen, Naproksen)' },
      { id: 'paracetamol', name: 'Parasetamol' },
      { id: 'musclerelax', name: 'Kas gevşetici' },
      { id: 'tramadol', name: 'Tramadol' },
      { id: 'gabapentin', name: 'Gabapentin' },
    ],
  },
  // Psikiyatrik
  {
    id: 'psych',
    category: 'Psikiyatrik',
    items: [
      { id: 'ssri', name: 'SSRI (Sertralin, Fluoksetin)' },
      { id: 'snri', name: 'SNRI (Venlafaksin)' },
      { id: 'anxiolytic', name: 'Anksiyolitik (Alprazolam, Lorazepam)' },
      { id: 'antipsychotic', name: 'Antipsikotik' },
      { id: 'mood_stabilizer', name: 'Duygudurum düzenleyici' },
    ],
  },
  // Gastrointestinal
  {
    id: 'gi',
    category: 'Gastrointestinal',
    items: [
      { id: 'ppi', name: 'Proton pompa inhibitörü (Pantoprazol, Omeprazol)' },
      { id: 'h2_blocker', name: 'H2 reseptör blokeri (Famotidin)' },
      { id: 'antacid', name: 'Antiasit' },
      { id: 'laxative', name: 'Laksatif' },
    ],
  },
  // Antibiyotikler
  {
    id: 'antibiotics',
    category: 'Antibiyotikler',
    items: [
      { id: 'amoxicillin', name: 'Amoksisilin' },
      { id: 'azithro', name: 'Azitromisin' },
      { id: 'ciprofloxacin', name: 'Siprofloksasin' },
      { id: 'doxycycline', name: 'Doksisiklin' },
    ],
  },
  // Nörolojik
  {
    id: 'neurological',
    category: 'Nörolojik',
    items: [
      { id: 'levodopa', name: 'Levodopa (Parkinson)' },
      { id: 'antiepileptic', name: 'Antiepileptik (Karbamazepin, Valproat)' },
      { id: 'triptan', name: 'Triptan (Migren)' },
    ],
  },
  // Endokrin
  {
    id: 'endocrine',
    category: 'Endokrin',
    items: [
      { id: 'levothyroxine', name: 'Levotiroksin' },
      { id: 'methimazole', name: 'Metimazol' },
      { id: 'cortisol', name: 'Kortizol' },
    ],
  },
];

export const prosthetics = [
  // Ortopedik
  { id: 'hip', name: 'Kalça protezi', category: 'Ortopedik' },
  { id: 'knee', name: 'Diz protezi', category: 'Ortopedik' },
  { id: 'shoulder', name: 'Omuz protezi', category: 'Ortopedik' },
  { id: 'ankle', name: 'Ayak bileği protezi', category: 'Ortopedik' },
  { id: 'elbow', name: 'Dirsek protezi', category: 'Ortopedik' },
  
  // Ekstremite
  { id: 'arm_prosthesis', name: 'Kol protezi', category: 'Ekstremite' },
  { id: 'leg_prosthesis', name: 'Bacak protezi', category: 'Ekstremite' },
  { id: 'hand_prosthesis', name: 'El protezi', category: 'Ekstremite' },
  { id: 'foot_prosthesis', name: 'Ayak protezi', category: 'Ekstremite' },
  
  // Kardiyovasküler
  { id: 'pacemaker', name: 'Kalp pili (Pacemaker)', category: 'Kardiyovasküler' },
  { id: 'icd', name: 'ICD (İmplante edilebilir kardiyoverter defibrilatör)', category: 'Kardiyovasküler' },
  { id: 'stent', name: 'Stent', category: 'Kardiyovasküler' },
  { id: 'valve', name: 'Yapay kalp kapağı', category: 'Kardiyovasküler' },
  
  // Diş
  { id: 'dental', name: 'Dental implant (Titanyum / Zirkonyum)', category: 'Diş' },
  { id: 'denture', name: 'Takma diş (Protez)', category: 'Diş' },
  
  // İşitme
  { id: 'cochlear', name: 'Koklear implant', category: 'İşitme' },
  { id: 'hearingaid', name: 'İşitme cihazı', category: 'İşitme' },
  
  // Göz
  { id: 'iol', name: 'Göz içi lens implantı', category: 'Göz' },
  { id: 'artificial_eye', name: 'Yapay göz', category: 'Göz' },
  
  // Spinal
  { id: 'spine_fusion', name: 'Spinal plak-vida sistemi', category: 'Spinal' },
  { id: 'disc_replacement', name: 'Disk protezi', category: 'Spinal' },
  
  // Diğer
  { id: 'breast_implant', name: 'Meme implantı', category: 'Diğer' },
  { id: 'penile_implant', name: 'Penil implant', category: 'Diğer' },
];

// Tüm ilaçları düzleştirilmiş liste olarak döndür
export const getAllMedications = () => {
  return medications.flatMap(category => 
    category.items.map(item => ({
      ...item,
      category: category.category
    }))
  );
};

// Tüm rahatsızlıkları kategoriye göre grupla
export const getDiseasesByCategory = () => {
  const grouped = {};
  diseases.forEach(disease => {
    if (!grouped[disease.category]) {
      grouped[disease.category] = [];
    }
    grouped[disease.category].push(disease);
  });
  return grouped;
};

export default { diseases, medications, prosthetics, getAllMedications, getDiseasesByCategory };

