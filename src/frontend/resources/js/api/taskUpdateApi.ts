import clientApi from "./_clientApi";
import type { Task } from "../types/api";

/**
 * PUT /me/tasks/{id}
 *
 * Rota contextual: o backend descobre o dono pelo JWT, entao a assinatura
 * perdeu o idUser.
 *
 * Partial<Pick<Task, "name" | "is_done">> permite mandar so o que mudou:
 * o toggle envia { is_done }, a edicao de nome envia { name }. Pick restringe
 * aos dois campos editaveis (ninguem manda `id` ou `id_user` por engano) e
 * Partial torna ambos opcionais.
 */
export async function taskUpdateApi(
  taskId: number,
  updates: Partial<Pick<Task, "name" | "is_done">>
): Promise<Task> {
  const { data } = await clientApi.put<Task>(`/me/tasks/${taskId}`, updates);

  return data;
}
