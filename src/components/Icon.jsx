import React from 'react'

const icons = {
  map: 'M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3V6zm6-3v15m6-12v15',
  board: 'M3 4h18v16H3zM9 4v16m6-16v16',
  chart: 'M4 20h16M7 16V9m5 7V5m5 11v-4',
  plus: 'M12 5v14M5 12h14',
  search: 'm20 20-4-4m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z',
  pin: 'M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0zm-5 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
  book: 'M3 5c4-1 7 0 9 2 2-2 5-3 9-2v13c-4-1-7 0-9 2-2-2-5-3-9-2V5zm9 2v13',
  arrow: 'M4 12h15m-6-6 6 6-6 6',
  spark: 'M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2z',
  close: 'm6 6 12 12M6 18 18 6',
  grip: 'M8 5h.01M16 5h.01M8 12h.01M16 12h.01M8 19h.01M16 19h.01',
  check: 'm5 12 4 4 10-10',
  edit: 'm14 6 4 4M4 20l4-.8L20 7l-4-4L4.8 15 4 20z',
}
export default function Icon({ name, size = 19 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={icons[name]} /></svg>
}
