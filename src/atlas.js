import { STAGES } from './data.js'

export function normalize(value = '') {
  return value.trim().toLocaleLowerCase('tr')
    .normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/ı/g, 'i')
}

export function matchEntries(entries, { query = '', region = '', category = '' } = {}) {
  const terms = normalize(query).split(/\s+/).filter(Boolean)
  return entries.filter(entry => {
    const searchable = normalize([entry.word, entry.concept, entry.definition, entry.place, entry.region, entry.category].join(' '))
    return (!region || entry.region === region) && (!category || entry.category === category)
      && terms.every(term => searchable.includes(term))
  })
}

export function groupConcepts(entries) {
  const groups = new Map()
  for (const entry of entries) {
    const key = normalize(entry.concept)
    if (!groups.has(key)) groups.set(key, { key, label: entry.concept, entries: [] })
    groups.get(key).entries.push(entry)
  }
  return [...groups.values()]
}

export function moveEntry(entries, id, status, targetId) {
  const active = entries.find(entry => entry.id === id)
  if (!active || id === targetId || !STAGES.some(stage => stage.id === status)) return entries
  const rest = entries.filter(entry => entry.id !== id)
  const target = rest.findIndex(entry => entry.id === targetId && entry.status === status)
  const source = entries.findIndex(entry => entry.id === id)
  const movingDown = active.status === status && target >= source
  rest.splice(target < 0 ? rest.length : target + Number(movingDown), 0, { ...active, status })
  return rest
}

export function localSuggestions(entry, entries) {
  const tokens = text => normalize(text).split(/[^a-z0-9]+/).filter(term => term.length > 2)
  const meaning = new Set(tokens(entry.definition))
  return groupConcepts(entries.filter(item => item.id !== entry.id && item.status === 'approved'))
    .map(group => {
      const exact = group.key === normalize(entry.definition)
      const overlap = tokens(group.label).filter(term => meaning.has(term)).length
      return { label: group.label, score: exact ? 10 : overlap, count: group.entries.length }
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score || b.count - a.count)
    .slice(0, 3)
    .map(({ label, count }) => ({ label, reason: 'Anlam alanıyla eşleşen bu başlıkta ' + count + ' onaylı kayıt var.' }))
}

