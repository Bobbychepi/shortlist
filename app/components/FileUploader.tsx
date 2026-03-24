'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
  const [file, setFile] = useState<File | null>(null)

    const onDrop:(acceptedFiles: File[]) => void = useCallback((acceptedFiles) => {
        const file: File = acceptedFiles[0] || null;

        onFileSelect?.(file);
    }, [onFileSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': [] },
    maxSize: 20 * 1024 * 1024,
    multiple: false,
  })

  return (
    <div className="w-full gradient-border">
      <div {...getRootProps()} className="cursor-pointer">
        <input {...getInputProps()} />

        <div className="space-y-4 text-center">
          <div className="mx-auto w-16 h-16 flex items-center justify-center">
            <img src="/icons/info.svg" alt="Upload" className="size-20" />
          </div>

          {file ? (
            <p className="text-lg font-medium">{file.name}</p>
          ) : (
            <div>
              <p className="text-lg text-gray-500">
                <span className="font-semibold">
                  {isDragActive ? 'Drop the file here' : 'Click to upload'}
                </span>{' '}
                or drag and drop
              </p>
              <p className="text-sm text-gray-500">PDF only (max 20MB)</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FileUploader
