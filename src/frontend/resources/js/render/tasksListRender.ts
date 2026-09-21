import taskRender from "./taskRender";
import paginationRender from "./paginationRender";
import { tasksListApi } from "../api/tasksListApi";

export default async function tasksListRender(idUser: number, page = 1): Promise<void> {
  const container = document.querySelector("#tasks-container");

  if (!container) return;

  // A busca acontece ANTES de limpar a tela: esvaziar primeiro faria a lista
  // piscar vazia durante a requisicao.
  //
  // idUser nao vai mais para a API (a rota e contextual) -- ele so serve para
  // recarregar a lista depois de uma acao.
  const listApi = await tasksListApi({ page });

  // Excluir o ultimo item de uma pagina deixaria a lista vazia com controles
  // apontando para o nada. Nesse caso volta uma pagina e refaz a busca.
  if (listApi.data.length === 0 && page > 1) {
    await tasksListRender(idUser, page - 1);
    return;
  }

  container.innerHTML = "";

  const ulElement = document.createElement("ul");
  ulElement.id = "tasks-list";
  ulElement.classList.add("list-group");

  container.append(ulElement);

  if (listApi.data.length === 0) {
    const emptyElement = document.createElement("li");
    emptyElement.classList.add("list-group-item", "text-center", "text-muted");
    emptyElement.innerText = "Nenhuma tarefa encontrada. Crie uma nova!";
    ulElement.append(emptyElement);
    return;
  }

  listApi.data.forEach((task) => {
    const liElement = taskRender(task, idUser);
    ulElement.append(liElement);
  });

  // A paginacao recebe a resposta crua da API e uma funcao de callback, em
  // vez de importar este modulo de volta (evita import circular).
  const paginationElement = paginationRender(listApi, (novaPagina) => {
    void tasksListRender(idUser, novaPagina);
  });

  container.append(paginationElement);
}
