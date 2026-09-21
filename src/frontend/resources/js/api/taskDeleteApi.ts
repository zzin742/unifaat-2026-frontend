import clientApi from "./_clientApi";

/**
 * DELETE /me/tasks/{id}
 *
 * Rota contextual: sem idUser na URL. O backend so apaga tarefa do usuario
 * do token, entao nao ha como pedir a exclusao da tarefa de outra pessoa.
 *
 * Retorna Promise<void> e nao devolve o corpo: a resposta e 204 No Content,
 * ou seja, nao ha nada para o chamador usar.
 */
export async function taskDeleteApi(taskId: number): Promise<void> {
  await clientApi.delete(`/me/tasks/${taskId}`);
}
