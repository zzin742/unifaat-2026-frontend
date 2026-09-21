import clientApi from "./_clientApi";
import type { PaginatedResponse, PaginationParams, Task } from "../types/api";

/**
 * GET /me/tasks?page=&limit=
 *
 * Rota CONTEXTUAL: o dono das tarefas vem do JWT no cookie, nao da URL.
 * Antes era /users/{idUser}/tasks, o que mandava a mesma identidade por dois
 * caminhos -- e bastava o backend esquecer de comparar os dois para um usuario
 * conseguir ler a lista de outro trocando o numero na URL. Aqui essa classe de
 * falha deixa de existir: so ha uma fonte, e ela e assinada pelo servidor.
 *
 * O generic de PaginatedResponse<Task> tipa `data` como Task[] sem precisar
 * de uma interface nova por entidade.
 */
export async function tasksListApi(
  { page = 1, limit = 10 }: PaginationParams = {}
): Promise<PaginatedResponse<Task>> {
  const { data } = await clientApi.get<PaginatedResponse<Task>>("/me/tasks", {
    params: { page, limit },
  });

  return data;
}
