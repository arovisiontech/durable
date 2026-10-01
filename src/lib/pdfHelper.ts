export function safeViewPdf(pdfUrl: string) {
  if (!pdfUrl) return

  if (pdfUrl.startsWith('data:application/pdf;base64,') || pdfUrl.startsWith('data:pdf/')) {
    try {
      const parts = pdfUrl.split(',')
      const base64Data = parts[1] || parts[0]
      const binaryString = atob(base64Data)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      const blob = new Blob([bytes], { type: 'application/pdf' })
      const blobUrl = URL.createObjectURL(blob)
      window.open(blobUrl, '_blank')
    } catch (err) {
      console.error('Failed to convert base64 PDF to blob URL:', err)
      const win = window.open('', '_blank')
      if (win) {
        win.document.write(
          `<html><head><title>PDF Viewer</title></head><body style="margin:0"><iframe src="${pdfUrl}" frameborder="0" style="width:100vw; height:100vh; border:none;" allowfullscreen></iframe></body></html>`
        )
      }
    }
  } else {
    window.open(pdfUrl, '_blank')
  }
}

export function safeDownloadPdf(pdfUrl: string, fileName: string) {
  if (!pdfUrl) return

  const cleanFileName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`

  if (pdfUrl.startsWith('data:application/pdf;base64,') || pdfUrl.startsWith('data:pdf/')) {
    try {
      const parts = pdfUrl.split(',')
      const base64Data = parts[1] || parts[0]
      const binaryString = atob(base64Data)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      const blob = new Blob([bytes], { type: 'application/pdf' })
      const blobUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = cleanFileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000)
      return
    } catch (err) {
      console.error('Failed to download base64 PDF:', err)
    }
  }

  const link = document.createElement('a')
  link.href = pdfUrl
  link.download = cleanFileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
