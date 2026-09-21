import type { PaginatedResponse, Task } from "../types/api";

/**
 * Controles de navegacao entre paginas.
 *
 * Recebe a resposta paginada da API e calcula o total de paginas a partir de
 * `total` e `limit`, em vez de fixar um numero aqui. Se o backend mudar o
 * tamanho da pagina, os botoes continuam corretos sem tocar neste arquivo.
 *
 * `aoTrocarPagina` e injetado pelo chamador para este modulo nao precisar
 * importar tasksListRender -- o que criaria um ciclo, ja que tasksListRender
 * importa este arquivo.
 */
export default function paginationRender(
  listApi: PaginatedResponse<Task>,
  aoTrocarPagina: (pagina: number) => void
): HTMLDivElement {
  const { page, limit, total } = listApi;

  // Math.ceil porque a ultima pagina quase sempre fica incompleta: 11 itens
  // com limite 10 sao 2 paginas, nao 1.
  const totalPaginas = Math.max(1, Math.ceil(total / limit));

  const containerElement = document.createElement("div");
  containerElement.classList.add(
    "d-flex", "justify-content-between", "align-items-center", "mt-3", "gap-2"
  );

  const criarBotao = (rotulo: string, paginaDestino: number, desabilitado: boolean): HTMLButtonElement => {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.classList.add("btn", "btn-outline-primary", "btn-sm");
    botao.innerText = rotulo;
    botao.disabled = desabilitado;

    botao.addEventListener("click", () => {
      // Cliques repetidos enquanto a busca esta em curso disparariam varias
      // requisicoes, e a ultima a responder venceria -- que nao e
      // necessariamente a ultima clicada.
      botao.disabled = true;
      aoTrocarPagina(paginaDestino);
    });

    return botao;
  };

  const statusElement = document.createElement("small");
  statusElement.classList.add("text-muted");
  statusElement.innerText = `Página ${page} de ${totalPaginas} — ${total} tarefa(s)`;

  containerElement.append(
    criarBotao("Anterior", page - 1, page <= 1),
    statusElement,
    criarBotao("Próxima", page + 1, page >= totalPaginas)
  );

  return containerElement;
}
