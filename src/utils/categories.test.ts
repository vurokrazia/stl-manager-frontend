import { describe, it, expect } from 'vitest'
import { buildCategoryOptions, extractCategoryIds } from './categories'

describe('buildCategoryOptions', () => {
  it('construye opciones desde categorias con id y name', () => {
    const categories = [
      { id: '1', name: 'Category 1' },
      { id: '2', name: 'Category 2' },
    ]
    const result = buildCategoryOptions(categories)
    expect(result).toEqual([
      { label: 'Category 1', value: '1' },
      { label: 'Category 2', value: '2' },
    ])
  })

  it('ignora strings en recordCategories', () => {
    const categories = ['cat1', 'cat2'] as any
    const result = buildCategoryOptions(categories)
    expect(result).toEqual([])
  })

  it('agrega system categories', () => {
    const recordCategories = [{ id: '1', name: 'Record Cat' }]
    const systemCategories = [{ id: '2', name: 'System Cat', createdAt: '' }]
    const result = buildCategoryOptions(recordCategories, systemCategories)
    expect(result).toEqual([
      { label: 'Record Cat', value: '1' },
      { label: 'System Cat', value: '2' },
    ])
  })

  it('no duplica categorias con mismo value', () => {
    const recordCategories = [{ id: '1', name: 'Category' }]
    const systemCategories = [{ id: '1', name: 'Category', createdAt: '' }]
    const result = buildCategoryOptions(recordCategories, systemCategories)
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({ label: 'Category', value: '1' })
  })

  it('maneja array vacio', () => {
    const result = buildCategoryOptions([])
    expect(result).toEqual([])
  })

  it('ignora objetos sin id o name', () => {
    const categories = [
      { id: '1', name: 'Valid' },
      { id: '2' }, // sin name
      { name: 'NoId' }, // sin id
      null,
      undefined,
    ] as any
    const result = buildCategoryOptions(categories)
    expect(result).toEqual([{ label: 'Valid', value: '1' }])
  })
})

describe('extractCategoryIds', () => {
  it('extrae ids de objetos con id', () => {
    const categories = [
      { id: '1', name: 'Cat 1' },
      { id: '2', name: 'Cat 2' },
    ]
    expect(extractCategoryIds(categories)).toEqual(['1', '2'])
  })

  it('extrae strings directamente', () => {
    const categories = ['cat1', 'cat2'] as any
    expect(extractCategoryIds(categories)).toEqual(['cat1', 'cat2'])
  })

  it('maneja mezcla de objetos y strings', () => {
    const categories = [
      { id: '1', name: 'Cat 1' },
      'cat2',
      { id: '3', name: 'Cat 3' },
    ] as any
    expect(extractCategoryIds(categories)).toEqual(['1', 'cat2', '3'])
  })

  it('devuelve array vacio para input no-array', () => {
    expect(extractCategoryIds(null as any)).toEqual([])
    expect(extractCategoryIds(undefined as any)).toEqual([])
    expect(extractCategoryIds('string' as any)).toEqual([])
  })

  it('filtra valores null y undefined', () => {
    const categories = [
      { id: '1', name: 'Cat 1' },
      null,
      undefined,
      { id: '2', name: 'Cat 2' },
    ] as any
    expect(extractCategoryIds(categories)).toEqual(['1', '2'])
  })

  it('maneja array vacio', () => {
    expect(extractCategoryIds([])).toEqual([])
  })
})
