import tasksListRender from "../render/tasksListRender";
import { taskUpdateApi } from "../api/taskUpdateApi";
import type { TaskListItemElement } from "../types/dom";

/**
 * Edicao do NOME da tarefa (o checkbox ja cuida do is_done).
 *
 * Fluxo: "Editar" troca o <span> por um <input> preenchido; "Salvar" (ou
 * Enter) chama PUT /me/tasks/{id} com { name }; "Cancelar" (ou Esc) volta ao
 * estado anterior sem tocar na API.
 */

/** Restaura o item para leitura sem ir ao servidor. */
function sairDaEdicao(idUser: number): void {
  // Recarregar a lista devolve o estado que o backend tem, sem precisar
  // guardar o valor antigo em lugar nenhum.
  void tasksListRender(idUser);
}

async function salvar(
  liElement: TaskListItemElement,
  inputElement: HTMLInputElement,
  botaoSalvar: HTMLButtonElement
): Promise<void> {
  const { userId: idUser, taskId } = liElement;

  // trim() e o que impede " " de passar como nome valido: sem ele o campo
  // pareceria preenchido e o backend gravaria um espaco em branco.
  const nome = inputElement.value.trim();

  if (nome === "") {
    inputElement.classList.add("is-invalid");
    inputElement.focus();
    return;
  }

  inputElement.classList.remove("is-invalid");
  botaoSalvar.disabled = true;
  inputElement.disabled = true;

  try {
    // Só o campo que mudou vai no corpo -- Partial<Pick<...>> permite isso.
    await taskUpdateApi(taskId, { name: nome });

    // Recarrega só DEPOIS da resposta: mostrar o nome novo antes seria exibir
    // algo que o servidor ainda pode recusar (nome duplicado, por exemplo).
    await tasksListRender(idUser);
  } catch (error) {
    botaoSalvar.disabled = false;
    inputElement.disabled = false;
    alert("Não foi possível salvar o nome da tarefa. Tente novamente.");
    console.error("Erro ao editar tarefa:", error);
  }
}

export default function taskEditHandler(event: Event): void {
  const liElement = (event.target as HTMLElement).closest("li") as TaskListItemElement | null;
  if (!liElement) return;

  const { userId: idUser } = liElement;

  const nameElement = liElement.querySelector("span");
  if (!nameElement) return;

  const nomeAtual = nameElement.innerText;

  // Troca o texto por um input ja preenchido, no lugar do <span>.
  const inputElement = document.createElement("input");
  inputElement.type = "text";
  inputElement.value = nomeAtual;
  inputElement.classList.add("form-control", "form-control-sm", "flex-grow-1", "me-2");

  const botaoSalvar = document.createElement("button");
  botaoSalvar.type = "button";
  botaoSalvar.classList.add("btn", "btn-success", "btn-sm");
  botaoSalvar.innerText = "Salvar";

  const botaoCancelar = document.createElement("button");
  botaoCancelar.type = "button";
  botaoCancelar.classList.add("btn", "btn-outline-secondary", "btn-sm");
  botaoCancelar.innerText = "Cancelar";

  botaoSalvar.addEventListener("click", () => {
    void salvar(liElement, inputElement, botaoSalvar);
  });

  botaoCancelar.addEventListener("click", () => sairDaEdicao(idUser));

  // Enter salva e Esc cancela: numa lista de tarefas o teclado e o caminho
  // natural, e obrigar o mouse para confirmar atrapalha quem edita varias.
  inputElement.addEventListener("keydown", (teclaEvent: KeyboardEvent) => {
    if (teclaEvent.key === "Enter") {
      teclaEvent.preventDefault();
      void salvar(liElement, inputElement, botaoSalvar);
      return;
    }

    if (teclaEvent.key === "Escape") {
      sairDaEdicao(idUser);
    }
  });

  // Reescreve o item inteiro: o botao "Editar" e o "Excluir" saem de cena
  // enquanto a edicao esta aberta, para nao dar para excluir uma tarefa que
  // esta sendo renomeada.
  liElement.innerHTML = "";
  liElement.append(inputElement, botaoSalvar, botaoCancelar);

  inputElement.focus();
  inputElement.select();
}
