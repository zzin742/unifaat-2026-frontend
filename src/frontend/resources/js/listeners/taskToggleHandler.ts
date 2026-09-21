import tasksListRender from "../render/tasksListRender";
import { taskUpdateApi } from "../api/taskUpdateApi";
import type { TaskListItemElement } from "../types/dom";

export default async function taskToggleHandler(event: Event): Promise<void> {
  const checkboxElement = event.target as HTMLInputElement;
  const liElement = checkboxElement.closest("li") as TaskListItemElement | null;
  if (!liElement) return;

  const { userId: idUser, taskId } = liElement;
  const isDone = checkboxElement.checked;

  // O navegador ja marcou o checkbox antes do handler rodar. Se o PUT falhar,
  // a tela fica mostrando um estado que o banco nao tem -- por isso o catch
  // tambem recarrega, restaurando o valor real.
  checkboxElement.disabled = true;

  try {
    await taskUpdateApi(taskId, { is_done: isDone });
    await tasksListRender(idUser);
  } catch (error) {
    alert("Não foi possível atualizar a tarefa. Tente novamente.");
    console.error("Erro ao atualizar tarefa:", error);

    await tasksListRender(idUser);
  }
}
