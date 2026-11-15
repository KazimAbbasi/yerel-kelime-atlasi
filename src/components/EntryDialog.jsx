import React, { useEffect, useRef, useState } from 'react'
import { CATEGORIES, REGIONS, STAGES } from '../data.js'
import { groupConcepts, localSuggestions } from '../atlas.js'
import Icon from './Icon.jsx'

const blank = { word: '', concept: '', definition: '', region: '', place: '', category: 'Mutfak', example: '', source: '', status: 'draft' }

export default function EntryDialog({ initial, entries, onSave, onClose }) {
  const [draft, setDraft] = useState({ ...blank, ...initial })
  const [suggestions, setSuggestions] = useState(null)
  const [mode, setMode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const dialog = useRef(null)
  const controller = useRef(null)

  useEffect(() => {
    const element = dialog.current
    element.showModal()
    return () => { element.close(); controller.current?.abort() }
  }, [])

  function field(name, value) {
    setDraft(current => ({ ...current, [name]: value }))
    if (name === 'definition' || name === 'word') {
      controller.current?.abort()
      setBusy(false)
      setSuggestions(null)
    }
  }

  async function suggest() {
    const abort = new AbortController()
    controller.current = abort
    const backup = localSuggestions(draft, entries)
    const labels = groupConcepts(entries.filter(entry => entry.status === 'approved' && entry.id !== draft.id)).map(group => group.label)
    setBusy(true)
    try {
      const response = await fetch('/api/suggestions', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ definition: draft.definition.trim(), labels }),
        signal: AbortSignal.any([abort.signal, AbortSignal.timeout(9000)]),
      })
      if (!response.ok) throw new Error('API unavailable')
      const result = await response.json()
      if (!Array.isArray(result)) throw new Error('Invalid response')
      setSuggestions(result.filter(item => labels.includes(item.label) && typeof item.reason === 'string'))
      setMode('Yapay zekâ önerileri')
    } catch {
      if (abort.signal.aborted) return
      setSuggestions(backup)
      setMode('Yerel eşleştirme')
    } finally {
      if (!abort.signal.aborted) setBusy(false)
    }
  }

  function submit(event) {
    event.preventDefault()
    const clean = Object.fromEntries(Object.entries(draft).map(([key, value]) => [key, value.trim()]))
    if (['word', 'concept', 'definition', 'place', 'region'].some(key => !clean[key])) {
      setError('Zorunlu alanları doldur.')
      return
    }
    if (clean.source && !/^https?:\/\//i.test(clean.source)) {
      setError('Kaynak bağlantısı http:// veya https:// ile başlamalı.')
      return
    }
    onSave({ ...clean, id: clean.id ?? crypto.randomUUID() })
  }

  return <dialog className="entry-dialog" ref={dialog} aria-labelledby="dialog-title" onCancel={event => { event.preventDefault(); onClose() }}>
    <div className="dialog-head">
      <div><div className="eyebrow">DERLEME ATÖLYESİ</div><h2 id="dialog-title">{initial ? 'Kaydı düzenle' : 'Yeni kelime ekle'}</h2></div>
      <button type="button" className="icon-button close" aria-label="Kapat" onClick={onClose}><Icon name="close" /></button>
    </div>
    <form onSubmit={submit}>
      <div className="form-grid">
        <label>Yöresel kelime <input required maxLength={70} value={draft.word} onChange={e => field('word', e.target.value)} placeholder="ör. makfali" /></label>
        <label>Ortak kavram <input required maxLength={70} value={draft.concept} onChange={e => field('concept', e.target.value)} placeholder="ör. Patates" /></label>
        <label className="wide">Anlam <input required maxLength={240} value={draft.definition} onChange={e => field('definition', e.target.value)} placeholder="Kelimenin anlamını yaz" /></label>
        <div className="suggestion-box wide">
          <div className="suggestion-top">
            <div><strong><Icon name="spark" size={17} /> Kavram asistanı</strong><small>Anlama göre koleksiyondaki ortak başlıkları önerir.</small></div>
            <button type="button" className="button secondary compact" onClick={suggest} disabled={busy || !draft.definition.trim()}>{busy ? 'Aranıyor…' : 'Başlık öner'}</button>
          </div>
          {suggestions && <div className="suggestions" role="status"><small>{mode}</small>
            {suggestions.length ? suggestions.map(item => <div className="suggestion" key={item.label}><div><b>{item.label}</b><p>{item.reason}</p></div><button type="button" className="button secondary compact" onClick={() => field('concept', item.label)}>Uygula</button></div>)
              : <p>Benzer başlık bulunamadı. Yeni bir ortak kavram yazabilirsin.</p>}
          </div>}
        </div>
        <label>Bölge <select required value={draft.region} onChange={e => field('region', e.target.value)}><option value="">Bölge seç</option>{REGIONS.map(r => <option key={r.name}>{r.name}</option>)}</select></label>
        <label>İl / ilçe <input required maxLength={100} value={draft.place} onChange={e => field('place', e.target.value)} placeholder="ör. Artvin · Pazar" /></label>
        <label>Kategori <select value={draft.category} onChange={e => field('category', e.target.value)}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></label>
        <label>Durum <select value={draft.status} onChange={e => field('status', e.target.value)}>{STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}</select></label>
        <label className="wide">Örnek cümle <textarea rows="2" maxLength={350} value={draft.example} onChange={e => field('example', e.target.value)} /></label>
        <label className="wide">Kaynak bağlantısı <input type="url" maxLength={500} value={draft.source} onChange={e => field('source', e.target.value)} placeholder="https://… (isteğe bağlı)" /></label>
      </div>
      {error && <p role="alert" className="form-error">{error}</p>}
      <div className="dialog-actions"><button type="button" className="button secondary" onClick={onClose}>Vazgeç</button><button type="submit" className="button primary"><Icon name="check" size={18} /> Kaydı sakla</button></div>
    </form>
  </dialog>
}
