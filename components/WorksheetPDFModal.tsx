"use client";

import React from "react";
import { X, Download } from "lucide-react";

interface WorksheetPDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
  title: string;
}

export default function WorksheetPDFModal({
  isOpen,
  onClose,
  onDownload,
  title,
}: WorksheetPDFModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-playful-lg max-w-md w-full p-6 animate-scale-in">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        {/* Content */}
        <div className="text-center">
          <div className="text-5xl mb-4">📄</div>
          <h3 className="font-heading font-bold text-xl text-gray-800 mb-2">
            Download PDF
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            Your &ldquo;{title}&rdquo; worksheet is ready to download as a
            printable PDF with an answer key included.
          </p>

          <div className="space-y-3">
            <button onClick={onDownload} className="btn-primary w-full">
              <Download className="w-5 h-5" />
              Download Printable PDF
            </button>
            <button
              onClick={onClose}
              className="btn-secondary w-full"
            >
              Cancel
            </button>
          </div>

          <p className="text-xs text-gray-400 mt-4">
            PDF includes: questions, answer key, and student name/date lines.
          </p>
        </div>
      </div>
    </div>
  );
}
