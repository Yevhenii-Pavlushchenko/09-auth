import { create } from "zustand";

import { persist } from "zustand/middleware";
import { CreateNoteBody } from "../api/clientApi";

type NoteDraftStore = {
  draft: CreateNoteBody;
  setDraft: (note: CreateNoteBody) => void;
  clearDraft: () => void;
};

const initialDraft: CreateNoteBody = {
  title: "",
  content: "",
  tag: "Todo",
};

export const useNoteDraftStore = create<NoteDraftStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (note) => set(() => ({ draft: note })),
      clearDraft: () => set(() => ({ draft: initialDraft })),
    }),
    {
      name: "note-draft",
      partialize: (state) => ({ draft: state.draft }),
    },
  ),
);