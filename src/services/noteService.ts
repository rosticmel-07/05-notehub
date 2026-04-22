import axios from "axios";
import type { Note, NoteTag } from "../types/note";
const KEY_API = import.meta.env.VITE_NOTEHUB_TOKEN;

const apiUrl = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${KEY_API}`,
  },
});

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export interface CreateNoteBody {
  title: string;
  content: string;
  tag: NoteTag;
}
axios.defaults.baseURL = "https://notehub-public.goit.study/api";

export const fetchNotes = async ({
  page,
  perPage,
  search,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const { data } = await apiUrl.get<FetchNotesResponse>("/notes", {
    params: { page, perPage, search },
  });
  return data;
};

export const createNote = async (
  noteData: Omit<Note, "id" | "createdAt" | "updatedAt">,
): Promise<Note> => {
  const { data } = await apiUrl.post<Note>("/notes", noteData);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await apiUrl.delete<Note>(`/notes/${id}`);
  return data;
};
