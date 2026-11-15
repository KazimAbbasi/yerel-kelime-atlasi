import React, { useState } from 'react'
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, pointerWithin, useDroppable, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { STAGES } from '../data.js'
import { matchEntries } from '../atlas.js'
import { Filters } from './AtlasView.jsx'
import Icon from './Icon.jsx'

function Card({ entry, onEdit, onMove }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id: entry.id, data: { status: entry.status },
  })
  return <article ref={setNodeRef} className={'board-card' + (isDragging ? ' dragging' : '')} style={{ transform: CSS.Transform.toString(transform), transition }}>
    <div className="board-card-top">
      <span className="tiny-tag">{entry.category}</span>
      <button type="button" className="icon-button grip" ref={setActivatorNodeRef} {...attributes} {...listeners} aria-label={entry.word + ' kaydını taşı'}><Icon name="grip" size={18} /></button>
    </div>
    <h3>{entry.word}</h3><p>{entry.definition}</p>
    <span className="place"><Icon name="pin" size={15} />{entry.place}</span>
    <div className="card-actions">
      <button type="button" className="edit-button" onClick={() => onEdit(entry)}><Icon name="edit" size={15} /> Düzenle</button>
      <select value={entry.status} onChange={event => onMove(entry.id, event.target.value)} aria-label={entry.word + ' kayıt durumu'}>
        {STAGES.map(stage => <option value={stage.id} key={stage.id}>{stage.label}</option>)}
      </select>
    </div>
  </article>
}
function Column({ stage, items, onEdit, onMove }) {
  const { setNodeRef, isOver } = useDroppable({ id: 'stage-' + stage.id, data: { status: stage.id } })
  return <section ref={setNodeRef} className={'board-column' + (isOver ? ' column-over' : '')} aria-label={stage.label}>
    <div className="column-head"><span className={'status-dot ' + stage.color} /><h2>{stage.label}</h2><span className="count">{items.length}</span></div>
    <SortableContext items={items.map(entry => entry.id)} strategy={verticalListSortingStrategy}>
      {items.map(entry => <Card key={entry.id} {...{ entry, onEdit, onMove }} />)}
    </SortableContext>
    {!items.length && <p className="column-empty">Bu aşamada kayıt yok.</p>}
  </section>
}
function collisionDetection(args) {
  const hits = pointerWithin(args)
  const cards = hits.filter(hit => !String(hit.id).startsWith('stage-'))
  return cards.length ? cards : hits.length ? hits : closestCenter(args)
}

export default function Board({ entries, onEdit, onMove }) {
  const [query, setQuery] = useState('')
  const [region, setRegion] = useState('')
  const [category, setCategory] = useState('')
  const visible = matchEntries(entries, { query, region, category })
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )
  function drop({ active, over }) {
    if (!over || active.id === over.id) return
    onMove(active.id, over.data.current.status, over.id)
  }
  return <section className="workspace-view">
    <div className="eyebrow"><Icon name="board" size={16} /> DERLEME ATÖLYESİ</div>
    <h1>Derleme panosu</h1>
    <p className="intro">Bir kaydı incelemeye almak veya onaylamak için sürükle ya da kartın durum menüsünü kullan. Onaylı kelimeler atlasta görünür.</p>
    <Filters {...{ query, setQuery, region, setRegion, category, setCategory }} />
    <DndContext sensors={sensors} collisionDetection={collisionDetection} onDragEnd={drop}>
      <div className="board-grid">
        {STAGES.map(stage => <Column key={stage.id} stage={stage} items={visible.filter(entry => entry.status === stage.id)} {...{ onEdit, onMove }} />)}
      </div>
    </DndContext>
  </section>
}
