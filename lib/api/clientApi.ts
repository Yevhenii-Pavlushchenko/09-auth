import { Note, NoteTag } from "@/types/note";
import { nextServer } from "./api";
import { User } from "@/types/user";

export const ENDPOINT = "/notes";

export interface FetchNotesParams {
  search?: string;
  tag?: NoteTag;
  page?: number;
  perPage?: number;
  sortBy?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNoteBody {
  title: string;
  content: string;
  tag: NoteTag;
}

export type RegisterRequest = {
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

type CheckSessionRequest = {
  success: boolean;
};

export type UpdateUserRequest = {
  email?: string;
  username: string;
};

export async function register(data: RegisterRequest) {
  const response = await nextServer.post<User>("/auth/register", data);
  return response.data;
}

export async function login(data: LoginRequest) {
  const response = await nextServer.post<User>("/auth/login", data);
  return response.data;
}

export async function logout(): Promise<void> {
  await nextServer.post("/auth/logout");
}

export async function checkSession() {
  const response = await nextServer.get<CheckSessionRequest>("/auth/session");
  return response.data.success;
}

export async function getMe() {
  const { data } = await nextServer.get<User>("/users/me");
  return data;
}

export async function updateMe(payload: UpdateUserRequest) {
  const res = await nextServer.patch<User>("/users/me", payload);
  return res.data;
}

export async function fetchNotes(
  params: FetchNotesParams,
): Promise<FetchNotesResponse> {
  const response = await nextServer.get<FetchNotesResponse>(ENDPOINT, {
    params,
  });
  return response.data;
}

export async function createNote(body: CreateNoteBody): Promise<Note> {
  const response = await nextServer.post<Note>(ENDPOINT, body);
  return response.data;
}

export async function deleteNote(id: Note["id"]): Promise<Note> {
  const response = await nextServer.delete<Note>(`${ENDPOINT}/${id}`);
  return response.data;
}

export async function fetchNoteById(id: Note["id"]): Promise<Note> {
  const response = await nextServer.get<Note>(`${ENDPOINT}/${id}`);
  return response.data;
}