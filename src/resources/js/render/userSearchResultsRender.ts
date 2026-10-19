import type { PaginatedResponse, User } from "../types/api";

/** O <li> guarda o usuario inteiro, para o listener nao precisar buscar de novo. */
export interface UserResultItemElement extends HTMLLIElement {
  user: User;
}

/** Monta "Cidade/UF" tolerando os campos nulos do perfil. */
function formatarLocal(user: User): string {
  const partes = [user.city, user.state].filter((parte): parte is string => Boolean(parte));

  if (partes.length === 0) return "Local nao informado";

  return partes.join("/");
}

function montarMensagem(texto: string, classe: string): HTMLDivElement {
  const aviso = document.createElement("div");
  aviso.className = `alert ${classe} mb-0`;
  aviso.innerText = texto;

  return aviso;
}

/** Linha de um usuario encontrado, com o botao "Escolher". */
function montarItem(user: User): UserResultItemElement {
  const item = document.createElement("li") as UserResultItemElement;
  item.user = user;
  item.className = "list-group-item d-flex justify-content-between align-items-center gap-3";

  const dados = document.createElement("div");

  const nome = document.createElement("div");
  nome.className = "fw-semibold";
  nome.innerText = user.name;

  const email = document.createElement("div");
  email.className = "small text-muted";
  email.innerText = user.email;

  const detalhe = document.createElement("div");
  detalhe.className = "small text-muted";
  detalhe.innerText = `${user.job_title ?? "Cargo nao informado"} · ${formatarLocal(user)}`;

  dados.append(nome, email, detalhe);

  const escolher = document.createElement("button");
  escolher.type = "button";
  escolher.className = "btn btn-sm btn-outline-primary flex-shrink-0";
  escolher.dataset.acao = "escolher-usuario";
  escolher.innerText = "Escolher";

  item.append(dados, escolher);

  return item;
}

/**
 * Desenha os resultados da busca dentro de #assign-search-results.
 *
 * Nao registra listener nenhum: quem trata o clique em "Escolher" e o
 * assignTaskModalListeners, por delegacao no container.
 */
export default function userSearchResultsRender(
  resultado: PaginatedResponse<User>,
): void {
  const container = document.querySelector<HTMLDivElement>("#assign-search-results");

  if (!container) return;

  container.innerHTML = "";

  if (resultado.data.length === 0) {
    container.append(montarMensagem("Nenhum usuario encontrado para essa busca.", "alert-warning"));
    return;
  }

  const total = document.createElement("div");
  total.className = "small text-muted mb-2";
  total.innerText = `${resultado.total} usuario(s) encontrado(s) — exibindo ${resultado.data.length}.`;

  const lista = document.createElement("ul");
  lista.className = "list-group";

  resultado.data.forEach((user) => lista.append(montarItem(user)));

  container.append(total, lista);
}

/** Mensagem avulsa no lugar dos resultados (texto vazio, erro da API). */
export function userSearchMessageRender(texto: string, classe = "alert-info"): void {
  const container = document.querySelector<HTMLDivElement>("#assign-search-results");

  if (!container) return;

  container.innerHTML = "";
  container.append(montarMensagem(texto, classe));
}
