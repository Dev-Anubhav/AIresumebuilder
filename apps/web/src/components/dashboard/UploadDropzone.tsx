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
      className={`border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center cursor-pointer transition ${
        isDragActive
          ? 'border-primary bg-primary/5'
          : 'border-slate-800 bg-[#131b2e] hover:bg-slate-800/40 hover:border-slate-700'
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
      <h3 className="font-semibold text-slate-200 mb-1 text-sm">Upload PDF document</h3>
      <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-4">
        Drag & drop contract, invoice or financial report here. Max file size: 20MB.
      </p>
      <button
        type="button"
        className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/95 text-white text-xs font-semibold transition flex items-center gap-1.5"
        disabled={isUploading}
      >
        {isUploading ? <Icons.Loader2 size={12} className="animate-spin" /> : <Icons.Plus size={12} />}
        Select File
      </button>
    </div>
  );
}
