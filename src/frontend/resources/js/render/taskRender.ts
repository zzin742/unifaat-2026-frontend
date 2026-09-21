import type { Task } from "../types/api";
import type { TaskListItemElement } from "../types/dom";
import taskToggleHandler from "../listeners/taskToggleHandler";
import taskDeleteHandler from "../listeners/taskDeleteHandler";
import taskEditHandler from "../listeners/taskEditHandler";

export default function taskRender(task: Task, idUser: number): TaskListItemElement {
  const liElement = document.createElement("li") as TaskListItemElement;
  liElement.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center", "gap-2");

  // taskId e userId ficam no proprio <li>: os handlers localizam o item com
  // closest("li") e nao precisam conhecer a estrutura interna, so que existe
  // um <li> ancestral.
  liElement.taskId = task.id;
  liElement.userId = idUser;

  const nameElement = document.createElement("span");
  nameElement.innerText = task.name;
  nameElement.classList.add("flex-grow-1");

  liElement.append(nameElement);

  // ── Checkbox de concluída (PUT /me/tasks/{id} com { is_done }) ──────────
  const checkboxElement = document.createElement("input");
  checkboxElement.type = "checkbox";
  checkboxElement.classList.add("form-check-input");
  checkboxElement.checked = task.is_done;

  // "change" e nao "click": change tambem dispara quando o estado muda pelo
  // teclado (barra de espaco), o que mantem o recurso acessivel sem mouse.
  checkboxElement.addEventListener("change", taskToggleHandler);

  liElement.prepend(checkboxElement);

  // O risco vem do dado que a API devolveu, nao do clique: assim o visual
  // sempre reflete o que esta gravado, inclusive ao recarregar a pagina.
  if (task.is_done) {
    nameElement.classList.add("text-decoration-line-through", "text-muted");
  }

  // ── Botão Editar (PUT /me/tasks/{id} com { name }) ─────────────────────
  const buttonEditElement = document.createElement("button");
  buttonEditElement.type = "button";
  buttonEditElement.classList.add("btn", "btn-secondary", "btn-sm");
  buttonEditElement.innerText = "Editar";
  buttonEditElement.addEventListener("click", taskEditHandler);

  liElement.append(buttonEditElement);

  // ── Botão Excluir (DELETE /me/tasks/{id}) ──────────────────────────────
  const buttonDeleteElement = document.createElement("button");
  buttonDeleteElement.type = "button";
  buttonDeleteElement.classList.add("btn", "btn-danger", "btn-sm");
  buttonDeleteElement.innerText = "Excluir";
  buttonDeleteElement.addEventListener("click", taskDeleteHandler);

  liElement.append(buttonDeleteElement);

  return liElement;
}
