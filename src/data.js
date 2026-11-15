export const SOURCE = 'https://agiz.tdk.gov.tr/tdk_arsiv_pdf/TDKAA5.pdf'
export const SOURCE_LABEL = 'Safiye Genç ve Ali Cin · Türkiye Türkçesi Ağızlarında “Domates, Kedi, Patates”'
export const STAGES = [
  { id: 'draft', label: 'Taslak', color: 'ochre' },
  { id: 'review', label: 'İncelemede', color: 'blue' },
  { id: 'approved', label: 'Onaylandı', color: 'green' },
]
export const REGIONS = [
  { name: 'Marmara', short: 'Marmara', x: 111, y: 102, color: '#7b699d' },
  { name: 'Ege', short: 'Ege', x: 118, y: 192, color: '#c77955' },
  { name: 'Akdeniz', short: 'Akdeniz', x: 284, y: 224, color: '#b8863b' },
  { name: 'İç Anadolu', short: 'İç Anadolu', x: 296, y: 146, color: '#659177' },
  { name: 'Karadeniz', short: 'Karadeniz', x: 380, y: 81, color: '#467b94' },
  { name: 'Doğu Anadolu', short: 'Doğu Anadolu', x: 529, y: 139, color: '#946185' },
  { name: 'Güneydoğu Anadolu', short: 'Güneydoğu', x: 502, y: 213, color: '#a46a49' },
]
export const CATEGORIES = ['Mutfak', 'Hayvanlar', 'Doğa', 'Gündelik yaşam', 'Diğer']

const examples = [
  ['makfali', 'Patates', 'Karadeniz', 'Artvin · Pazar', 'Mutfak', 'Akşama makfali haşladık.'],
  ['domatça', 'Patates', 'İç Anadolu', 'Yozgat · Çayıralan', 'Mutfak', 'Bahçeden domatça topladık.'],
  ['marsili', 'Patates', 'Akdeniz', 'Burdur', 'Mutfak', 'Sepete birkaç marsili koyduk.'],
  ['sev', 'Patates', 'Doğu Anadolu', 'Hakkâri · Yüksekova', 'Mutfak', 'Yemek için sev aldık.'],
  ['mendura', 'Patates', 'Akdeniz', 'Hatay · Samandağ', 'Mutfak', 'Mendurayı yemeğe ekledik.'],
  ['tomalta', 'Domates', 'Ege', 'Muğla · Milas', 'Mutfak', 'Salataya tomalta doğradık.'],
  ['alaganta', 'Domates', 'Karadeniz', 'Samsun', 'Mutfak', 'Bugün bahçeden alaganta topladık.', 'review'],
  ['hilek', 'Domates', 'Akdeniz', 'Antalya', 'Mutfak', 'Pazardan taze hilek aldık.'],
  ['bacansor', 'Domates', 'Güneydoğu Anadolu', 'Diyarbakır · Bismil', 'Mutfak', 'Bacansoru yıkayıp doğradık.'],
  ['kavanez', 'Domates', 'İç Anadolu', 'Konya · Bozkır', 'Mutfak', 'Kavanezle salata yaptık.'],
  ['manık', 'Kedi', 'Akdeniz', 'Adana', 'Hayvanlar', 'Manık kapının önünde uyudu.'],
  ['maçi', 'Kedi', 'Marmara', 'Tekirdağ', 'Hayvanlar', 'Maçi avludan içeri girdi.'],
  ['pencik', 'Kedi', 'Karadeniz', 'Bartın · Amasra', 'Hayvanlar', 'Pencik pencerenin önüne oturdu.'],
  ['bavuk', 'Kedi', 'Doğu Anadolu', 'Malatya · Arapkir', 'Hayvanlar', 'Bavuk bahçede dolaşıyor.'],
  ['apoti', 'Patates', 'Doğu Anadolu', 'Posof (kaynakta Kars)', 'Mutfak', 'Apotileri sepete dizdik.', 'draft'],
]
export const SEED = examples.map(([word, concept, region, place, category, example, status = 'approved'], i) => ({
  id: 'atlas-' + (i + 1), word, concept, definition: concept,
  region, place, category, example, status, source: SOURCE,
}))

