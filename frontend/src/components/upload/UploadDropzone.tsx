import { useCallback, useRef, useState } from 'react'
import { Upload, CheckCircle, XCircle, FileArchive } from 'lucide-react'

interface Props {
  caseId: string
  onUploadComplete: () => void
}

type UploadState = 'idle' | 'dragging' | 'uploading' | 'success' | 'error'

function fakeSha256(filename: string): string {
  // Deterministic mock hash based on filename
  const chars = 'abcdef0123456789'
  let hash = ''
  for (let i = 0; i < 64; i++) {
    hash += chars[(filename.charCodeAt(i % filename.length) + i) % chars.length]
  }
  return hash
}

export default function UploadDropzone({ caseId, onUploadComplete }: Props) {
  const [state, setState] = useState<UploadState>('idle')
  const [progress, setProgress] = useState(0)
  const [fileName, setFileName] = useState('')
  const [sha256, setSha256] = useState('')
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const ACCEPTED = ['.E01', '.dd', '.img', '.raw', '.dmp', '.pcap', '.pcapng', '.zip', '.tar.gz']

  const handleFile = useCallback(async (file: File) => {
    setFileName(file.name)
    setState('uploading')
    setProgress(0)
    setError('')

    // Simulate upload progress
    for (let p = 0; p <= 100; p += 5) {
      await new Promise((r) => setTimeout(r, 60))
      setProgress(p)
    }

    // Mock 5% chance of error for realism
    if (file.name.includes('bad')) {
      setState('error')
      setError('Upload failed: unsupported file format.')
      return
    }

    setSha256(fakeSha256(file.name))
    setState('success')
    onUploadComplete()
  }, [onUploadComplete])

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setState('idle')
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  function reset() {
    setState('idle')
    setProgress(0)
    setFileName('')
    setSha256('')
    setError('')
  }

  return (
    <div className="mb-6">
      {state === 'idle' || state === 'dragging' ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setState('dragging') }}
          onDragLeave={() => setState('idle')}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            state === 'dragging'
              ? 'border-navy-500 bg-navy-900/20'
              : 'border-gray-700 hover:border-navy-600 hover:bg-gray-900/40'
          }`}
        >
          <Upload className="w-8 h-8 text-gray-500 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-300 mb-1">
            Drag & drop artefact or <span className="text-navy-400 hover:text-navy-300">browse</span>
          </p>
          <p className="text-xs text-gray-600">
            Accepted: {ACCEPTED.join(', ')}
          </p>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept={ACCEPTED.join(',')}
            onChange={handleChange}
          />
        </div>
      ) : state === 'uploading' ? (
        <div className="border border-gray-800 rounded-xl p-6 bg-gray-900">
          <div className="flex items-center gap-3 mb-4">
            <FileArchive className="w-5 h-5 text-navy-400 flex-shrink-0" />
            <span className="text-sm text-white font-medium truncate">{fileName}</span>
            <span className="text-xs text-gray-500 ml-auto">{progress}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-navy-600 h-2 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">Uploading and hashing…</p>
        </div>
      ) : state === 'success' ? (
        <div className="border border-green-800/50 rounded-xl p-5 bg-green-950/30 flex items-start gap-4">
          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white">{fileName} uploaded successfully</p>
            <p className="text-xs text-gray-400 font-mono mt-1 truncate">SHA-256: {sha256}</p>
          </div>
          <button onClick={reset} className="text-xs text-gray-500 hover:text-white transition-colors">
            Upload another
          </button>
        </div>
      ) : (
        <div className="border border-red-800/50 rounded-xl p-5 bg-red-950/30 flex items-start gap-4">
          <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Upload failed</p>
            <p className="text-xs text-gray-400 mt-0.5">{error}</p>
          </div>
          <button onClick={reset} className="text-xs text-gray-500 hover:text-white transition-colors">
            Try again
          </button>
        </div>
      )}
    </div>
  )
}
