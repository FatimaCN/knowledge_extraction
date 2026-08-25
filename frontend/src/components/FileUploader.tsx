import { useRef, useState } from "react";
import type { DragEvent } from "react";

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
}

const acceptedExtensions = [".ttl", ".pdf"];

function isAccepted(file: File) {
  return acceptedExtensions.some((extension) =>
    file.name.toLowerCase().endsWith(extension),
  );
}

export function FileUploader({ onFilesSelected }: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  const processFiles = (files: File[]) => {
    const accepted = files.filter(isAccepted);
    const rejected = files.length - accepted.length;

    setError(
      rejected > 0
        ? `${rejected} file${rejected > 1 ? "s were" : " was"} ignored. Only TTL and PDF files are supported.`
        : "",
    );

    if (accepted.length > 0) onFilesSelected(accepted);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    processFiles(Array.from(event.dataTransfer.files));
  };

  return (
    <>
      <div
        className={`drop-zone ${isDragging ? "dragging" : ""}`}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".ttl,.pdf,text/turtle,application/pdf"
          multiple
          hidden
          onChange={(event) => {
            processFiles(Array.from(event.target.files ?? []));
            event.target.value = "";
          }}
        />

        <div className="upload-icon" aria-hidden="true">↑</div>
        <h3>Upload your source files</h3>
        <p>Drag and drop ontologies or documents here</p>
        <button
          className="secondary-button"
          type="button"
          onClick={() => inputRef.current?.click()}
        >
          Browse files
        </button>
        <small>Supported formats: TTL and PDF · Multiple files allowed</small>
      </div>

      {error && <p className="upload-error">{error}</p>}
    </>
  );
}
