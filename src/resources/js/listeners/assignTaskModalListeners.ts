import { Modal } from "bootstrap";
import userSearchApi from "../api/userSearchApi";
import { taskCreateApi } from "../api/taskCreateApi";
import tasksListRender from "../render/tasksListRender";
import userSearchResultsRender, {
  userSearchMessageRender,
} from "../render/userSearchResultsRender";
import type { UserResultItemElement } from "../render/userSearchResultsRender";
import type { User, UserSearchFilters, UserSearchTextField } from "../types/api";

/** Campos que o select do modal oferece. */
const CAMPOS_VALIDOS: readonly UserSearchTextField[] = [
  "name", "email", "job_title", "bio", "city", "state",
];

/** So aceita o valor do select se for um campo que a API conhece. */
function ehCampoValido(valor: string): valor is UserSearchTextField {
  return CAMPOS_VALIDOS.includes(valor as UserSearchTextField);
}

/** Mensagem de status no rodape do modal. */
function mostrarStatus(texto: string, classe: string): void {
  const status = document.querySelector<HTMLDivElement>("#assign-task-status");

  if (!status) return;

  status.className = `alert ${classe} mb-0`;
  status.innerText = texto;
  status.classList.remove("d-none");
}

function limparStatus(): void {
  const status = document.querySelector<HTMLDivElement>("#assign-task-status");

  if (!status) return;

  status.classList.add("d-none");
  status.innerText = "";
}

export default function assignTaskModalListeners(idUser: number): void {
  const modal = document.querySelector<HTMLDivElement>("#assign-task-modal");

  if (!modal) return;

  const nomeTarefa = modal.querySelector<HTMLInputElement>("#assign-task-name");
  const selectCampo = modal.querySelector<HTMLSelectElement>("#assign-search-field");
  const textoBusca = modal.querySelector<HTMLInputElement>("#assign-search-value");
  const btnBuscar = modal.querySelector<HTMLButtonElement>("#assign-search-submit");
  const resultados = modal.querySelector<HTMLDivElement>("#assign-search-results");
  const selecionado = modal.querySelector<HTMLDivElement>("#assign-selected-user");
  const btnCriar = modal.querySelector<HTMLButtonElement>("#assign-task-submit");

  if (!nomeTarefa || !selectCampo || !textoBusca || !btnBuscar) return;
  if (!resultados || !selecionado || !btnCriar) return;

  // Unico estado do modal: quem foi escolhido.
  let usuarioEscolhido: User | null = null;

  function desenharEscolhido(): void {
    if (!selecionado) return;

    if (!usuarioEscolhido) {
      selecionado.className = "text-muted small";
      selecionado.innerText = "Nenhum usuario escolhido ainda.";
      return;
    }

    selecionado.className = "alert alert-success mb-0";
    selecionado.innerText = `Atribuir para: ${usuarioEscolhido.name} (${usuarioEscolhido.email})`;
  }

  function limparModal(): void {
    usuarioEscolhido = null;
    if (nomeTarefa) nomeTarefa.value = "";
    if (textoBusca) textoBusca.value = "";
    if (resultados) resultados.innerHTML = "";
    desenharEscolhido();
    limparStatus();
  }

  // ── Buscar ───────────────────────────────────────────────────
  async function buscar(): Promise<void> {
    if (!selectCampo || !textoBusca) return;

    limparStatus();

    const termo = textoBusca.value.trim();

    if (!termo) {
      userSearchMessageRender("Digite algo para buscar.", "alert-secondary");
      return;
    }

    const campo = selectCampo.value;

    if (!ehCampoValido(campo)) {
      userSearchMessageRender("Campo de busca invalido.", "alert-danger");
      return;
    }

    // Uma chave so: o campo escolhido no select.
    const filters: UserSearchFilters = { [campo]: termo };

    userSearchMessageRender("Buscando...", "alert-secondary");

    try {
      const resposta = await userSearchApi(filters, 1, 10);
      userSearchResultsRender(resposta);
    } catch (error) {
      console.error("Falha na busca de usuarios:", error);
      userSearchMessageRender("Erro ao buscar usuarios. Tente novamente.", "alert-danger");
    }
  }

  btnBuscar.addEventListener("click", buscar);

  // Enter no campo de texto busca, sem submeter formulario
  textoBusca.addEventListener("keydown", (evento: KeyboardEvent) => {
    if (evento.key !== "Enter") return;

    evento.preventDefault();
    void buscar();
  });

  // ── Escolher (delegacao no container de resultados) ──────────
  resultados.addEventListener("click", (evento: MouseEvent) => {
    const alvo = evento.target;

    if (!(alvo instanceof HTMLElement)) return;

    const botao = alvo.closest<HTMLButtonElement>('[data-acao="escolher-usuario"]');

    if (!botao) return;

    const item = botao.closest<UserResultItemElement>("li");

    if (!item) return;

    usuarioEscolhido = item.user;
    desenharEscolhido();
    limparStatus();
  });

  // ── Criar a tarefa ───────────────────────────────────────────
  btnCriar.addEventListener("click", async () => {
    if (!nomeTarefa) return;

    const nome = nomeTarefa.value.trim();

    if (!nome) {
      mostrarStatus("Digite o nome da tarefa.", "alert-warning");
      return;
    }

    if (!usuarioEscolhido) {
      mostrarStatus("Escolha um usuario para atribuir a tarefa.", "alert-warning");
      return;
    }

    const destino = usuarioEscolhido;

    btnCriar.disabled = true;

    try {
      await taskCreateApi(destino.id, { name: nome });

      // Se a tarefa foi para mim mesmo, a lista da tela mudou.
      if (destino.id === idUser) {
        await tasksListRender(idUser);
      }

      limparModal();
      mostrarStatus(`Tarefa criada para ${destino.name}.`, "alert-success");

      Modal.getOrCreateInstance(modal).hide();
    } catch (error) {
      console.error("Falha ao criar tarefa para outro usuario:", error);
      mostrarStatus("Erro ao criar a tarefa. Tente novamente.", "alert-danger");
    } finally {
      btnCriar.disabled = false;
    }
  });

  // Abrir o modal limpo a cada vez
  modal.addEventListener("show.bs.modal", limparModal);

  desenharEscolhido();
}
