/**
 * Tipos e generics compartilhados por todas as chamadas de API.
 * Ver Aula 05, seção 3.4 (Generics com Axios e API Responses).
 */

// ── Entidades ────────────────────────────────────────────────

export interface User {
  id: number;
  name: string;
  email: string;
  // Campos de perfil (usados pela API de busca)
  job_title: string | null;
  bio: string | null;
  city: string | null;
  state: string | null;
  birth_date: string | null; // "AAAA-MM-DD"
  is_active: boolean;
}

export interface Task {
  id: number;
  name: string;
  is_done: boolean;
  id_user: number;
}

/**
 * Filtros aceitos pelo POST /users/search.
 *
 * Os campos de texto sao buscados como "contem" (LIKE '%valor%') pelo
 * Elasticsearch; is_active e comparado por valor exato. Todos sao opcionais:
 * o modal monta o objeto com UMA chave, a do campo escolhido no select.
 */
export interface UserSearchFilters {
  name?: string;
  email?: string;
  job_title?: string;
  bio?: string;
  city?: string;
  state?: string;
  is_active?: boolean;
}

/** Campos de texto que o select do modal oferece. */
export type UserSearchTextField = Extract<
  keyof UserSearchFilters,
  "name" | "email" | "job_title" | "bio" | "city" | "state"
>;

// ── Generics para respostas de API ──────────────────────────

/**
 * Formato padrão de listagem paginada usado pelo backend
 * (users, tasks, etc). T é o tipo do item da lista.
 *
 * Ex: PaginatedResponse<Task> → { data: Task[], page, limit, total }
 */
export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
}

/** Parâmetros aceitos por qualquer endpoint de listagem paginada. */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

// ── Tipos específicos de autenticação ───────────────────────

export interface LoginResponse {
  userId: number;
}

/**
 * Resultado da validação do token (union discriminada por "valid").
 * Quando valid é true, "data" existe e o TypeScript sabe disso
 * automaticamente (narrowing) sem precisar de type assertion.
 */
export type ValidationResult =
  | { valid: true; data: User }
  | { valid: false };

export interface AuthCheckResult {
  authenticated: boolean;
  idUser?: number;
}
