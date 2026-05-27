import { describe, it, expect, beforeEach } from 'vitest'
import { useLogoUpload } from '../useLogoUpload'

describe('useLogoUpload', () => {
  let l: ReturnType<typeof useLogoUpload>

  beforeEach(() => {
    l = useLogoUpload()
  })

  // 7.3.1
  it('logo starts null', () => {
    expect(l.logo.value).toBeNull()
  })

  // 7.3.2
  it('handleFileSelect with valid image sets logo with base64 data and name', async () => {
    // Create a small valid PNG (1x1 pixel)
    const pngBytes = new Uint8Array([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG header
      0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // 1x1 pixel
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
      0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41,
      0x54, 0x08, 0xD7, 0x63, 0x60, 0x60, 0x00, 0x00,
      0x00, 0x04, 0x00, 0x01, 0x27, 0x34, 0x27, 0x8F,
      0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44,
      0xAE, 0x42, 0x60, 0x82,
    ])
    const blob = new Blob([pngBytes], { type: 'image/png' })
    const file = new File([blob], 'logo.png', { type: 'image/png' })

    const result = await l.handleFileSelect(file)
    expect(result.name).toBe('logo.png')
    expect(result.data).toContain('data:image/png;base64,')
    // The composable's internal logo ref should also be set
    expect(l.logo.value).not.toBeNull()
    expect(l.logo.value!.name).toBe('logo.png')
  })

  // 7.3.3
  it('handleFileSelect rejects non-image file type', async () => {
    const file = new File(['text'], 'doc.txt', { type: 'text/plain' })
    await expect(l.handleFileSelect(file)).rejects.toThrow('Invalid file type')
  })

  // 7.3.4
  it('handleFileSelect rejects file > 2MB', async () => {
    // Create a 3MB array
    const large = new Array(3 * 1024 * 1024).fill('x').join('')
    const blob = new Blob([large], { type: 'image/png' })
    const file = new File([blob], 'large.png', { type: 'image/png' })
    await expect(l.handleFileSelect(file)).rejects.toThrow('too large')
  })

  // 7.3.5
  it('clearLogo sets logo to null', () => {
    l.clearLogo()
    expect(l.logo.value).toBeNull()
  })

  // 7.3.6
  it('isDragging toggles on dragenter/dragleave', () => {
    expect(l.isDragging.value).toBe(false)
    l.isDragging.value = true
    expect(l.isDragging.value).toBe(true)
    l.isDragging.value = false
    expect(l.isDragging.value).toBe(false)
  })
})
