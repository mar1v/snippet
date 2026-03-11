import axios from 'axios';
import { Snippet, PaginatedResult } from '@/types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: { 'Content-Type': 'application/json' },
});

export interface GetSnippetsParams {
  q?: string;
  tag?: string;
  page?: number;
  limit?: number;
}

export const snippetsApi = {
  getAll: async (params: GetSnippetsParams = {}): Promise<PaginatedResult<Snippet>> => {
    const { data } = await api.get<PaginatedResult<Snippet>>('/snippets', { params });
    return data;
  },

  getById: async (id: string): Promise<Snippet> => {
    const { data } = await api.get<Snippet>(`/snippets/${id}`);
    return data;
  },

  create: async (payload: Omit<Snippet, '_id' | 'createdAt' | 'updatedAt'>): Promise<Snippet> => {
    const { data } = await api.post<Snippet>('/snippets', payload);
    return data;
  },

  update: async (id: string, payload: Partial<Omit<Snippet, '_id' | 'createdAt' | 'updatedAt'>>): Promise<Snippet> => {
    const { data } = await api.put<Snippet>(`/snippets/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/snippets/${id}`);
  },

  getTags: async (): Promise<string[]> => {
    const { data } = await api.get<string[]>('/snippets/tags');
    return data;
  },
};

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const msg = error.response?.data?.message;
    if (Array.isArray(msg)) return msg.join(', ');
    if (typeof msg === 'string') return msg;
    return error.response?.data?.error || error.message;
  }
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred';
}
