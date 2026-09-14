import taskToggleHandler from "../listeners/taskToggleHandler.js";
import taskDeleteHandler from "../listeners/taskDeleteHandler.js";

export default function taskRender(task, idUser) {
    const liElement = document.createElement("li");
    liElement.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");

    // Os ids ficam no proprio <li> porque os handlers localizam o item com
    // event.target.closest("li") - assim eles nao precisam saber a estrutura
    // interna do item, so que existe um <li> ancestral.
    liElement.taskId = task.id;
    liElement.userId = idUser;

    const nameElement = document.createElement("span");
    nameElement.innerText = task.name;
    nameElement.classList.add("flex-grow-1");

    liElement.append(nameElement);

    // ------------------------------------------------------------------
    // Checkbox de concluida (UPDATE)
    // ------------------------------------------------------------------
    // O evento e "change", nao "click": change dispara tambem quando o
    // estado muda por teclado (barra de espaco), o que mantem o recurso
    // acessivel para quem nao usa mouse.
    const checkboxElement = document.createElement("input");
    checkboxElement.type = "checkbox";
    checkboxElement.classList.add("form-check-input");
    checkboxElement.checked = task.is_done;
    checkboxElement.addEventListener("change", taskToggleHandler);

    // prepend coloca o checkbox ANTES do nome, como pede o enunciado.
    liElement.prepend(checkboxElement);

    // O strikethrough e aplicado na renderizacao, a partir do dado que veio
    // da API - e nao no clique. Assim o estado visual sempre reflete o que
    // esta gravado no banco, inclusive ao recarregar a pagina.
    if (task.is_done) {
        nameElement.classList.add("text-decoration-line-through", "text-muted");
    }

    // ------------------------------------------------------------------
    // Botao de excluir (DELETE)
    // ------------------------------------------------------------------
    const buttonDeleteElement = document.createElement("button");
    buttonDeleteElement.classList.add("btn", "btn-danger", "btn-sm");
    buttonDeleteElement.innerText = "Excluir";
    buttonDeleteElement.addEventListener("click", taskDeleteHandler);

    liElement.append(buttonDeleteElement);

    return liElement;
}
