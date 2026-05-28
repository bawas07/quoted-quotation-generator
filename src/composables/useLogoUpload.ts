// Logo upload — handle file selection, drag-and-drop, base64 encoding

import { ref, type Ref } from 'vue'
import type { QuotationLogo } from '../types/quotation'

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']

export function useLogoUpload() {
  const logo: Ref<QuotationLogo | null> = ref(null)
  const isDragging: Ref<boolean> = ref(false)

  function handleFileSelect(file: File): Promise<QuotationLogo> {
    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return Promise.reject(
        new Error(`Invalid file type "${file.type || 'unknown'}". Please upload an image file (JPEG, PNG, GIF, WebP, or SVG).`)
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1)
      return Promise.reject(
        new Error(`File is too large (${sizeMB}MB). Maximum size is 2MB.`)
      )
    }

    return new Promise<QuotationLogo>((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = () => {
        const result: QuotationLogo = {
          data: reader.result as string,
          name: file.name,
        }
        logo.value = result
        resolve(result)
      }

      reader.onerror = () => {
        reject(new Error('Failed to read the image file.'))
      }

      reader.readAsDataURL(file)
    })
  }

  function clearLogo(): void {
    logo.value = null
  }

  return {
    logo,
    isDragging,
    handleFileSelect,
    clearLogo,
  }
}
