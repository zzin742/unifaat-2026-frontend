import clientApi from "./_clientApi";
import type { PaginatedResponse, User, UserSearchFilters } from "../types/api";

/**
 * Busca usuarios pelo POST /users/search.
 *
 * O backend resolve em duas etapas: o Elasticsearch aplica os filtros e
 * devolve so os ids; esses ids voltam para o Postgres num WHERE IN pela
 * chave primaria, que e a fonte da verdade. Por isso a busca precisa ser
 * esta rota, e nao um GET /users listando todo mundo.
 */
export async function userSearchApi(
  filters: UserSearchFilters,
  page = 1,
  limit = 10,
): Promise<PaginatedResponse<User>> {
  const { data } = await clientApi.post<PaginatedResponse<User>>("/users/search", {
    filters,
    page,
    limit,
  });

  return data;
}

export default userSearchApi;
