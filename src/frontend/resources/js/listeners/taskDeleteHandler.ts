import tasksListRender from "../render/tasksListRender";
import { taskDeleteApi } from "../api/taskDeleteApi";
import type { TaskListItemElement } from "../types/dom";

export default async function taskDeleteHandler(event: Event): Promise<void> {
  const liElement = (event.target as HTMLElement).closest("li") as TaskListItemElement | null;
  if (!liElement) return;

  // userId continua vindo do <li> porque a TELA precisa saber de quem e a
  // lista para recarregar. Ele so nao vai mais para o backend -- la o dono
  // sai do JWT.
  const { userId: idUser, taskId } = liElement;

  const nomeTarefa = liElement.querySelector("span")?.innerText ?? "esta tarefa";

  // O nome entra na pergunta para o usuario saber o que vai sumir: "Excluir
  // esta tarefa?" nao ajuda quem clicou na linha errada.
  if (!confirm(`Excluir a tarefa "${nomeTarefa}"?`)) return;

  const buttonElement = event.currentTarget as HTMLButtonElement;

  // Dois cliques rapidos disparariam dois DELETE, e o segundo falharia com
  // 404 numa tarefa que ja nao existe -- o usuario veria erro por uma acao
  // que deu certo.
  buttonElement.disabled = true;

  try {
    await taskDeleteApi(taskId);

    // Recarrega so DEPOIS da resposta: sumir com o item antes seria mentir
    // caso o servidor recusasse.
    await tasksListRender(idUser);
  } catch (error) {
    buttonElement.disabled = false;
    alert("Não foi possível excluir a tarefa. Tente novamente.");
    console.error("Erro ao excluir tarefa:", error);
  }
}
