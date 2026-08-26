import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WorksheetQuestion {
  question: string;
  answer: string;
  options?: string[];
}

export interface WorksheetData {
  title: string;
  subject: string;
  grade: string;
  difficulty: string;
  questions: WorksheetQuestion[];
}

export interface ColoringPageData {
  prompt: string;
  image: string;
}

interface BookCartState {
  worksheets: WorksheetData[];
  coloringPages: ColoringPageData[];
  addWorksheet: (ws: WorksheetData) => void;
  removeWorksheet: (index: number) => void;
  addColoringPage: (page: ColoringPageData) => void;
  removeColoringPage: (index: number) => void;
  clearWorksheets: () => void;
  clearColoringPages: () => void;
}

export const useBookCart = create<BookCartState>()(
  persist(
    (set) => ({
      worksheets: [],
      coloringPages: [],
      addWorksheet: (ws) => set((state) => ({ worksheets: [...state.worksheets, ws] })),
      removeWorksheet: (index) =>
        set((state) => ({
          worksheets: state.worksheets.filter((_, i) => i !== index),
        })),
      addColoringPage: (page) =>
        set((state) => ({ coloringPages: [...state.coloringPages, page] })),
      removeColoringPage: (index) =>
        set((state) => ({
          coloringPages: state.coloringPages.filter((_, i) => i !== index),
        })),
      clearWorksheets: () => set({ worksheets: [] }),
      clearColoringPages: () => set({ coloringPages: [] }),
    }),
    {
      name: "kiddleaf-book-cart",
    }
  )
);
