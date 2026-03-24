import { useRef, useState, type ChangeEvent, type DragEvent } from "react";

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void;
}

const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validatePdf = (candidate: File | null) => {
    if (!candidate) {
      setError(null);
      return null;
    }

    const isPdf =
      candidate.type === "application/pdf" || candidate.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setError("Please upload a PDF file.");
      return null;
    }

    if (candidate.size > MAX_FILE_SIZE_BYTES) {
      setError("File is too large. Max size is 20MB.");
      return null;
    }

    setError(null);
    return candidate;
  };

  const updateSelectedFile = (candidate: File | null) => {
    const validFile = validatePdf(candidate);
    setFile(validFile);
    onFileSelect?.(validFile);
  };

  const openPicker = () => {
    inputRef.current?.click();
  };

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null;
    updateSelectedFile(selectedFile);
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0] ?? null;
    updateSelectedFile(droppedFile);
  };

  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="w-full gradient-border">
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={onInputChange}
      />

      <div
        className="cursor-pointer space-y-4 text-center"
        onClick={openPicker}
        onDrop={onDrop}
        onDragOver={onDragOver}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openPicker();
          }
        }}
      >
        <div className="mx-auto w-16 h-16 flex items-center justify-center">
          <img src="/icons/info.svg" alt="Upload" className="size-20" />
        </div>

        {file ? (
          <p className="text-lg font-medium break-all">{file.name}</p>
        ) : (
          <div>
            <p className="text-lg text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-sm text-gray-500">PDF only (max 20MB)</p>
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
};

export default FileUploader;
