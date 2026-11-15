import React from 'react'
import { CATEGORIES, REGIONS, STAGES } from '../data.js'
import { groupConcepts } from '../atlas.js'
import Icon from './Icon.jsx'

function Breakdown({ title, note, rows, total }) {
  return <section className="stat-panel"><h2>{title}</h2><p>{note}</p>
    <ul>{rows.map(({ label, count, color }) => <li key={label}>
      <div><span>{label}</span><b>{count}</b></div>
      <div className="bar-track" aria-hidden="true"><span style={{ width: (total ? count / total * 100 : 0) + '%', background: color }} /></div>
    </li>)}</ul>
  </section>
}
export default function Stats({ entries }) {
  const approved = entries.filter(entry => entry.status === 'approved')
  const approval = entries.length ? Math.round(100 * approved.length / entries.length) : 0
  return <section className="workspace-view">
    <div className="eyebrow"><Icon name="chart" size={16} /> KOLEKSİYON ÖZETİ</div>
    <h1>Atlasın istatistikleri</h1>
    <p className="intro">Derleme sürecini ve onaylı kelimelerin bölgelere dağılımını izle.</p>
    <div className="metrics">
      {[['Toplam kayıt', entries.length], ['Onaylı kayıt', approved.length], ['Onay oranı', '%' + approval], ['Ortak kavram', groupConcepts(approved).length]].map(([label, value]) =>
        <article key={label}><span>{label}</span><strong>{value}</strong></article>)}
    </div>
    <div className="stat-grid">
      <Breakdown title="Derleme durumu" note="Tüm kayıtlar" total={entries.length} rows={STAGES.map(stage => ({ label: stage.label, count: entries.filter(entry => entry.status === stage.id).length }))} />
      <Breakdown title="Bölgelere göre dağılım" note="Onaylı kayıtlar" total={approved.length} rows={REGIONS.map(region => ({ label: region.name, color: region.color, count: approved.filter(entry => entry.region === region.name).length }))} />
      <Breakdown title="Kategori dağılımı" note="Onaylı kayıtlar" total={approved.length} rows={CATEGORIES.map(label => ({ label, count: approved.filter(entry => entry.category === label).length }))} />
    </div>
  </section>
}
