"use client";

import React, { useState } from "react";
import { useBookCart } from "@/lib/store";
import { BookOpen, Palette, X, Download, Trash2, Library } from "lucide-react";

export default function BookCartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"coloring" | "worksheet">("coloring");
  
  const [bookTitle, setBookTitle] = useState("My Awesome Book");
  const [childName, setChildName] = useState("");

  const {
    worksheets,
    coloringPages,
    removeWorksheet,
    removeColoringPage,
    clearWorksheets,
    clearColoringPages,
  } = useBookCart();

  const totalItems = worksheets.length + coloringPages.length;

  const downloadColoringBook = async () => {
    if (coloringPages.length === 0) return;
    const { generateColoringBookPDF, forceDownloadPDF } = await import("@/lib/pdfGenerator");
    const pdf = generateColoringBookPDF(bookTitle, childName || "A Special Kid", coloringPages);
    const safeTitle = bookTitle.replace(/[^a-zA-Z0-9_-]/g, "_") || "Coloring_Book";
    forceDownloadPDF(pdf, `${safeTitle}.pdf`);
    clearColoringPages();
    setIsOpen(false);
  };

  const downloadWorksheetBook = async () => {
    if (worksheets.length === 0) return;
    const { generateWorksheetBookPDF, forceDownloadPDF } = await import("@/lib/pdfGenerator");
    const pdf = generateWorksheetBookPDF(bookTitle, childName || "A Special Kid", worksheets);
    const safeTitle = bookTitle.replace(/[^a-zA-Z0-9_-]/g, "_") || "Workbook";
    forceDownloadPDF(pdf, `${safeTitle}.pdf`);
    clearWorksheets();
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-sky-deep to-ocean-deep text-white rounded-full px-5 py-3 shadow-playful-lg hover:scale-105 transition-transform flex items-center gap-2 font-heading font-bold"
      >
        <Library className="w-5 h-5" />
        Book Cart
        {totalItems > 0 && (
          <span className="bg-white text-sky-deep rounded-full w-6 h-6 flex items-center justify-center text-xs ml-1">
            {totalItems}
          </span>
        )}
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b flex justify-between items-center bg-gray-50">
          <h2 className="font-heading font-black text-xl text-gray-800 flex items-center gap-2">
            <Library className="w-5 h-5 text-sky-deep" />
            Your Book Cart
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("coloring")}
            className={`flex-1 py-3 font-heading font-bold text-sm flex justify-center items-center gap-2 ${
              activeTab === "coloring"
                ? "border-b-2 border-lavender-deep text-lavender-deep bg-lavender-light/10"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <Palette className="w-4 h-4" />
            Coloring ({coloringPages.length})
          </button>
          <button
            onClick={() => setActiveTab("worksheet")}
            className={`flex-1 py-3 font-heading font-bold text-sm flex justify-center items-center gap-2 ${
              activeTab === "worksheet"
                ? "border-b-2 border-sky-deep text-sky-deep bg-sky-light/10"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Worksheets ({worksheets.length})
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Metadata Inputs */}
          <div className="space-y-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <div>
              <label className="block text-xs font-heading font-bold text-gray-500 mb-1 uppercase tracking-wider">
                Book Title
              </label>
              <input
                type="text"
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
                className="input-playful text-sm py-2"
                placeholder="My Coloring Book"
              />
            </div>
            <div>
              <label className="block text-xs font-heading font-bold text-gray-500 mb-1 uppercase tracking-wider">
                Child's Name (For Cover)
              </label>
              <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                className="input-playful text-sm py-2"
                placeholder="Leo"
              />
            </div>
          </div>

          {/* List Items */}
          <div>
            {activeTab === "coloring" && (
              <div className="space-y-3">
                {coloringPages.length === 0 ? (
                  <p className="text-center text-gray-400 text-sm py-8">
                    No coloring pages added yet.
                  </p>
                ) : (
                  coloringPages.map((p, i) => (
                    <div key={i} className="flex gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm items-center">
                      <img src={p.image} alt="thumb" className="w-16 h-16 object-contain bg-gray-50 rounded-lg border" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-700 truncate">{p.prompt}</p>
                        <p className="text-xs text-gray-400">Page {i + 1}</p>
                      </div>
                      <button onClick={() => removeColoringPage(i)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "worksheet" && (
              <div className="space-y-3">
                {worksheets.length === 0 ? (
                  <p className="text-center text-gray-400 text-sm py-8">
                    No worksheets added yet.
                  </p>
                ) : (
                  worksheets.map((ws, i) => (
                    <div key={i} className="flex gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm items-center">
                      <div className="w-10 h-10 bg-sky-100 text-sky-deep rounded-lg flex items-center justify-center font-bold">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-700 truncate">{ws.title}</p>
                        <p className="text-xs text-gray-400">{ws.subject} • {ws.grade}</p>
                      </div>
                      <button onClick={() => removeWorksheet(i)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t bg-gray-50">
          {activeTab === "coloring" ? (
            <button
              onClick={downloadColoringBook}
              disabled={coloringPages.length === 0}
              className="btn-primary w-full disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Coloring Book
            </button>
          ) : (
            <button
              onClick={downloadWorksheetBook}
              disabled={worksheets.length === 0}
              className="btn-primary w-full disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Workbook
            </button>
          )}
        </div>
      </div>
    </>
  );
}
