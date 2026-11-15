import { describe, expect, it } from 'vitest'
import { groupConcepts, localSuggestions, matchEntries, moveEntry, normalize } from './atlas.js'
import { SEED } from './data.js'

describe('atlas collection', () => {
  it('matches Turkish search with or without accents and honors filters', () => {
    expect(normalize(' İÇ Anadolu ')).toBe('ic anadolu')
    expect(matchEntries(SEED, { query: 'yozgat patates', region: 'İç Anadolu' }).map(item => item.word)).toEqual(['domatça'])
    expect(matchEntries(SEED, { query: 'makfali', category: 'Hayvanlar' })).toEqual([])
  })

  it('groups variations of the same concept heading', () => {
    const entries = [{ concept: 'İğne' }, { concept: 'igne' }, { concept: 'Kedi' }]
    expect(groupConcepts(entries).map(group => group.entries.length)).toEqual([2, 1])
  })

  it('moves a draft into review without mutating the saved input', () => {
    const draft = SEED.find(item => item.status === 'draft')
    const review = SEED.find(item => item.status === 'review')
    const next = moveEntry(SEED, draft.id, 'review', review.id)
    expect(next.filter(item => item.status === 'review').map(item => item.id)).toEqual([draft.id, review.id])
    expect(draft.status).toBe('draft')
  })

  it('reorders cards in both directions and ignores an invalid target status', () => {
    const [a, b, c] = SEED
    expect(moveEntry([a, b, c], a.id, 'approved', c.id).map(item => item.id)).toEqual([b.id, c.id, a.id])
    expect(moveEntry([a, b, c], c.id, 'approved', a.id).map(item => item.id)).toEqual([c.id, a.id, b.id])
    expect(moveEntry(SEED, a.id, 'unknown')).toBe(SEED)
  })

  it('suggests only established, approved labels and leaves unrelated entries alone', () => {
    const labels = localSuggestions({ definition: 'Bostanda yetişen patates' }, SEED)
    expect(labels[0].label).toBe('Patates')
    expect(localSuggestions({ definition: 'Yel değirmeni' }, SEED)).toEqual([])
    expect(localSuggestions({ id: SEED[0].id, definition: 'Patates' }, [SEED[0]])).toEqual([])
  })
})

