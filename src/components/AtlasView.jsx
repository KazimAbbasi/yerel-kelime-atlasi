import React, { useState } from 'react'
import { CATEGORIES, REGIONS } from '../data.js'
import { groupConcepts, matchEntries, normalize } from '../atlas.js'
import Icon from './Icon.jsx'

export function Filters({ query, setQuery, region, setRegion, category, setCategory }) {
  return <div className="filters">
    <label className="search"><Icon name="search" /><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Kelime, anlam veya şehir ara" aria-label="Kelime, anlam veya şehir ara" /></label>
    <label className="select"><span className="sr-only">Bölge</span><select value={region} onChange={event => setRegion(event.target.value)}><option value="">Tüm bölgeler</option>{REGIONS.map(item => <option key={item.name}>{item.name}</option>)}</select></label>
    <label className="select"><span className="sr-only">Kategori</span><select value={category} onChange={event => setCategory(event.target.value)}><option value="">Tüm kategoriler</option>{CATEGORIES.map(item => <option key={item}>{item}</option>)}</select></label>
  </div>
}

function AtlasMap({ entries, selectedRegion, onRegion }) {
  const activeRegions = new Set(entries.map(entry => entry.region))
  const outline = 'M59 106 75 91 74 78 96 69 122 80 138 76 158 95 179 92 196 80 222 84 242 74 276 72 297 56 321 57 350 66 376 58 401 67 427 61 448 75 473 79 495 65 512 69 534 56 550 75 566 78 573 96 591 110 580 127 594 145 588 163 606 186 584 198 556 198 539 212 516 207 490 222 468 209 444 222 420 215 400 230 378 222 370 248 351 240 340 221 321 219 306 241 282 246 263 237 242 248 217 240 201 218 180 222 166 237 145 229 125 233 120 218 98 220 107 204 92 202 94 188 78 188 84 174 64 163 76 154 63 145 77 129 65 125 80 110z'
  return <div className="map" aria-label="Türkiye'nin şematik bölge haritası">
    <svg viewBox="0 0 640 300" className="map-art" aria-hidden="true">
      <defs>
        <pattern id="map-grid" width="22" height="22" patternUnits="userSpaceOnUse"><path d="M22 0H0v22" fill="none" stroke="#c9d6ca" strokeWidth=".65" opacity=".75" /></pattern>
        <pattern id="map-lines" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(34)"><path d="M0 0v8" stroke="#9baa96" opacity=".27" /></pattern>
        <clipPath id="land"><path d={outline} /></clipPath>
      </defs>
      <rect width="640" height="300" fill="url(#map-grid)" />
      <path d={outline} fill="#d8e2cd" stroke="#899f85" strokeWidth="1.5" strokeLinejoin="round" />
      <path d={outline} fill="url(#map-lines)" />
      <g clipPath="url(#land)" fill="none" stroke="#96aa92" strokeWidth="1" strokeDasharray="3 4" opacity=".9">
        <path d="M165 61q32 66-26 104t-14 87M67 146q77-27 132 0t34 115M205 105q66-28 151 3t151-12M356 95q-8 42 25 79t10 83M204 208q59-38 125-16t119-6 159-10" />
      </g>
      <path d="M552 241v34m-8-26 8-8 8 8m-20 17h24" fill="none" stroke="#657b6a" />
      <text x="552" y="235" textAnchor="middle" fill="#657b6a" fontSize="10">K</text>
      <g fill="#607967" fontSize="9" letterSpacing="3">
        <text x="260" y="37">KARADENİZ</text><text x="215" y="274">AKDENİZ</text>
      </g>
    </svg>
    {REGIONS.map(item => <button key={item.name} type="button" className={'map-pin' + (activeRegions.has(item.name) ? ' pin-active' : '')}
      style={{ left: (item.x / 6.4) + '%', top: (item.y / 3) + '%', '--pin': item.color }}
      aria-pressed={selectedRegion === item.name} aria-label={item.name + ' bölgesine göre filtrele'}
      onClick={() => onRegion(selectedRegion === item.name ? '' : item.name)}>
      <span /><strong>{item.short}</strong>
    </button>)}
    <span className="map-caption">Şematik bölge haritası</span>
  </div>
}

export default function AtlasView({ entries }) {
  const [query, setQuery] = useState('')
  const [region, setRegion] = useState('')
  const [category, setCategory] = useState('')
  const [selection, setSelection] = useState('patates')
  const approved = entries.filter(entry => entry.status === 'approved')
  const groups = groupConcepts(matchEntries(approved, { query, region, category }))
  const active = groups.find(group => group.key === selection) ?? groups[0]
  const totalRegions = new Set(approved.map(entry => entry.region)).size

  return <>
    <section className="hero">
      <div className="hero-copy">
        <div className="eyebrow"><span className="ornament">✦</span> TÜRKİYE SÖZ VARLIĞI ARŞİVİ</div>
        <h1>Aynı anlam,<br /><em>başka bir kelime.</em></h1>
        <p>Türkiye’nin yöresel sözcüklerini keşfet. Aynı kavramın farklı yörelerde nasıl söylendiğini, örnek cümlelerle karşılaştır.</p>
        <div className="hero-metrics">
          <div><strong>{approved.length}</strong><span>Onaylı kelime</span></div>
          <div><strong>{totalRegions}</strong><span>Coğrafi bölge</span></div>
          <div><strong>{groupConcepts(approved).length}</strong><span>Ortak kavram</span></div>
        </div>
      </div>
      <AtlasMap entries={active?.entries ?? []} selectedRegion={region} onRegion={setRegion} />
    </section>

    <section className="explore">
      <div className="section-heading">
        <div><div className="eyebrow">KEŞİF DEFTERİ</div><h2>Kelimeleri karşılaştır</h2></div>
        <span className="quiet"><Icon name="check" size={15} /> Yalnızca onaylı kayıtlar</span>
      </div>
      <Filters {...{ query, setQuery, region, setRegion, category, setCategory }} />
      {active ? <>
        <div className="concepts" aria-label="Kavramlar">
          {groups.map(group => <button key={group.key} type="button" aria-pressed={active.key === group.key} onClick={() => setSelection(group.key)}>
            {group.label}<span>{group.entries.length}</span>
          </button>)}
        </div>
        <div className="comparison-heading"><h3>{active.label}</h3><span>{active.entries.length} yöresel kayıt</span></div>
        <div className="word-grid">
          {active.entries.map(entry => {
            const color = REGIONS.find(item => item.name === entry.region)?.color
            return <article className="word-card" key={entry.id} style={{ '--region-color': color }}>
              <div className="word-card-top"><span className="region-badge"><i />{entry.region}</span><span>{entry.category}</span></div>
              <h4>{entry.word}</h4>
              <p className="place"><Icon name="pin" size={16} /> {entry.place}</p>
              <p className="definition">{entry.definition}</p>
              {entry.example && <blockquote>“{entry.example}”</blockquote>}
              {entry.source && <a className="source" href={entry.source} target="_blank" rel="noreferrer">Kaynağı incele <span aria-hidden="true">↗</span></a>}
            </article>
          })}
        </div>
      </> : <div className="empty"><Icon name="search" size={26} /><h3>Kayıt bulunamadı</h3><p>Başka bir kelime ara veya bölge ve kategori filtrelerini değiştir.</p><button className="button secondary" onClick={() => { setQuery(''); setRegion(''); setCategory('') }}>Filtreleri temizle</button></div>}
    </section>
  </>
}
