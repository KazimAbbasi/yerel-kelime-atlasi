import React, { useEffect, useState } from 'react'
import { SEED, SOURCE, SOURCE_LABEL } from './data.js'
import { moveEntry } from './atlas.js'
import AtlasView from './components/AtlasView.jsx'
import Board from './components/Board.jsx'
import EntryDialog from './components/EntryDialog.jsx'
import Icon from './components/Icon.jsx'
import Stats from './components/Stats.jsx'

const STORAGE_KEY = 'yerel-kelime-atlasi:v1'
const NAV = [
  { id: 'atlas', label: 'Atlas', icon: 'map' },
  { id: 'board', label: 'Derleme panosu', icon: 'board' },
  { id: 'stats', label: 'İstatistikler', icon: 'chart' },
]

function readEntries() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (Array.isArray(saved) && saved.every(item =>
      item && ['id', 'word', 'concept', 'definition', 'region', 'place', 'category', 'example', 'status', 'source']
        .every(key => typeof item[key] === 'string'))) return saved
  } catch {
    // An unreadable or unavailable store starts with the sample collection.
  }
  return SEED
}

export default function App() {
  const [entries, setEntries] = useState(readEntries)
  const [view, setView] = useState('atlas')
  const [dialog, setDialog] = useState(null)
  const [notice, setNotice] = useState('')
  const [storageError, setStorageError] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
    } catch {
      setStorageError(true)
    }
  }, [entries])

  function navigate(id) {
    setView(id)
    setNotice('')
    window.scrollTo({ top: 0 })
  }

  function save(entry) {
    setEntries(current => current.some(item => item.id === entry.id)
      ? current.map(item => item.id === entry.id ? entry : item)
      : [...current, entry])
    setDialog(null)
    navigate('board')
    setNotice(entry.status === 'approved' ? 'Kayıt saklandı ve atlasta yayımlandı.' : 'Kayıt derleme panosuna eklendi.')
  }

  function move(id, status, targetId) {
    setEntries(current => moveEntry(current, id, status, targetId))
  }

  return <>
    <a className="skip" href="#content">İçeriğe geç</a>
    <header className="header"><div className="shell header-inner">
      <button className="brand" type="button" onClick={() => navigate('atlas')}>
        <img src="/atlas.svg" alt="" width="42" height="42" />
        <span><strong>Yerel Kelime Atlası</strong><small>Türkiye’nin söz arşivi</small></span>
      </button>
      <nav aria-label="Ana menü">{NAV.map(item => <button type="button" className={view === item.id ? 'current' : ''} aria-current={view === item.id ? 'page' : undefined} key={item.id} onClick={() => navigate(item.id)}>
        <Icon name={item.icon} size={17} /> <span>{item.label}</span>
      </button>)}</nav>
      <button className="button primary header-add" onClick={() => setDialog({})}><Icon name="plus" size={18} /> Kelime ekle</button>
    </div></header>
    <main className="shell" id="content">
      {storageError && <p className="notice" role="alert">Tarayıcı kaydı kullanılamıyor. Bu oturumdaki değişiklikler sayfa kapandığında silinebilir.</p>}
      {notice && <p className="notice" role="status">{notice}</p>}
      {view === 'atlas' && <AtlasView entries={entries} />}
      {view === 'board' && <Board entries={entries} onEdit={entry => setDialog({ initial: entry })} onMove={move} />}
      {view === 'stats' && <Stats entries={entries} />}
    </main>
    <footer className="footer"><div className="shell footer-inner">
      <div><Icon name="book" size={17} /><span>Yerel Kelime Atlası <small>· Öğrenci projesi</small></span></div>
      <span>Başlangıç verisi <a href={SOURCE} target="_blank" rel="noreferrer" title={SOURCE_LABEL}>Genç ve Cin’in çalışması ↗</a></span>
    </div></footer>
    {dialog && <EntryDialog initial={dialog.initial} entries={entries} onSave={save} onClose={() => setDialog(null)} />}
  </>
}
