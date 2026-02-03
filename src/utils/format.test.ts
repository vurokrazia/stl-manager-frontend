import { describe, it, expect } from 'vitest'
import {
  formatBytes,
  formatFileType,
  getFileTypeColor,
  getScanStatusColor,
  truncateFileName,
} from './format'

describe('formatBytes', () => {
  it('devuelve "0 Bytes" para 0', () => {
    expect(formatBytes(0)).toBe('0 Bytes')
  })

  it('convierte bytes correctamente', () => {
    expect(formatBytes(500)).toBe('500 Bytes')
  })

  it('convierte a KB correctamente', () => {
    expect(formatBytes(1024)).toBe('1 KB')
    expect(formatBytes(1536)).toBe('1.5 KB')
  })

  it('convierte a MB correctamente', () => {
    expect(formatBytes(1048576)).toBe('1 MB')
    expect(formatBytes(1572864)).toBe('1.5 MB')
  })

  it('convierte a GB correctamente', () => {
    expect(formatBytes(1073741824)).toBe('1 GB')
  })

  it('respeta el parametro decimals', () => {
    expect(formatBytes(1536, 0)).toBe('2 KB')
    expect(formatBytes(1536, 3)).toBe('1.5 KB')
  })

  it('maneja decimals negativos como 0', () => {
    expect(formatBytes(1536, -1)).toBe('2 KB')
  })
})

describe('formatFileType', () => {
  it('convierte stl a STL', () => {
    expect(formatFileType('stl')).toBe('STL')
  })

  it('convierte zip a ZIP', () => {
    expect(formatFileType('zip')).toBe('ZIP')
  })

  it('convierte rar a RAR', () => {
    expect(formatFileType('rar')).toBe('RAR')
  })

  it('maneja mayusculas/minusculas', () => {
    expect(formatFileType('STL')).toBe('STL')
    expect(formatFileType('Zip')).toBe('ZIP')
  })

  it('convierte tipos desconocidos a mayusculas', () => {
    expect(formatFileType('obj')).toBe('OBJ')
    expect(formatFileType('gcode')).toBe('GCODE')
  })
})

describe('getFileTypeColor', () => {
  it('devuelve blue para stl', () => {
    expect(getFileTypeColor('stl')).toBe('blue')
  })

  it('devuelve green para zip', () => {
    expect(getFileTypeColor('zip')).toBe('green')
  })

  it('devuelve orange para rar', () => {
    expect(getFileTypeColor('rar')).toBe('orange')
  })

  it('maneja mayusculas/minusculas', () => {
    expect(getFileTypeColor('STL')).toBe('blue')
    expect(getFileTypeColor('ZIP')).toBe('green')
  })

  it('devuelve default para tipos desconocidos', () => {
    expect(getFileTypeColor('obj')).toBe('default')
    expect(getFileTypeColor('unknown')).toBe('default')
  })
})

describe('getScanStatusColor', () => {
  it('devuelve default para pending', () => {
    expect(getScanStatusColor('pending')).toBe('default')
  })

  it('devuelve processing para running', () => {
    expect(getScanStatusColor('running')).toBe('processing')
  })

  it('devuelve success para completed', () => {
    expect(getScanStatusColor('completed')).toBe('success')
  })

  it('devuelve error para failed', () => {
    expect(getScanStatusColor('failed')).toBe('error')
  })

  it('devuelve default para estados desconocidos', () => {
    expect(getScanStatusColor('unknown')).toBe('default')
  })
})

describe('truncateFileName', () => {
  it('no trunca nombres cortos', () => {
    expect(truncateFileName('short.stl')).toBe('short.stl')
  })

  it('no trunca nombres exactamente del limite', () => {
    const name = 'a'.repeat(46) + '.stl'
    expect(truncateFileName(name, 50)).toBe(name)
  })

  it('trunca nombres largos', () => {
    const longName = 'a'.repeat(60) + '.stl'
    const result = truncateFileName(longName, 50)
    expect(result.length).toBeLessThanOrEqual(50)
    expect(result).toContain('...')
    expect(result).toMatch(/\.stl$/)
  })

  it('preserva la extension del archivo', () => {
    const longName = 'verylongfilename'.repeat(5) + '.rar'
    const result = truncateFileName(longName, 30)
    expect(result).toMatch(/\.rar$/)
  })

  it('usa maxLength por defecto de 50', () => {
    const longName = 'a'.repeat(100) + '.zip'
    const result = truncateFileName(longName)
    expect(result.length).toBeLessThanOrEqual(50)
  })
})
