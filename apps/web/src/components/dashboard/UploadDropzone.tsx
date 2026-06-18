'use client';

import React, { useState, useRef } from 'react';
import { Icons } from '../ui/icons';

interface UploadDropzoneProps {
  onUpload: (file: File) => void;
  isUploading: boolean;
}

export default function UploadDropzone({ onUpload, isUploading }: UploadDropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        onUpload(file);
      } else {
        alert('Only PDF documents are allowed');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center cursor-pointer backdrop-blur-md transition duration-300 ${
        isDragActive
          ? 'border-primary bg-primary/10'
          : 'border-white/80 bg-white/60 hover:bg-white/80 hover:border-primary/40 shadow-sm'
      }`}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
        <Icons.UploadCloud size={24} />
      </div>
      <h3 className="font-semibold text-foreground mb-1 text-sm">Upload PDF document</h3>
      <p className="text-xs text-muted-foreground max-w-xs leading-relaxed mb-4">
        Drag & drop contract, invoice or financial report here. Max file size: 20MB.
      </p>
      <button
        type="button"
        className="px-4 py-2 rounded-lg bg-primary hover:bg-[#6d4ae5] text-white text-xs font-semibold shadow-sm shadow-primary/10 transition flex items-center gap-1.5"
        disabled={isUploading}
      >
        {isUploading ? <Icons.Loader2 size={12} className="animate-spin" /> : <Icons.Plus size={12} />}
        Select File
      </button>
    </div>
  );
}
