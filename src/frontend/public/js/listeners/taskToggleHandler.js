import tasksListRender from "../render/tasksListRender.js";
import { taskUpdateApi } from "../api/taskUpdateApi.js";

export default async function taskToggleHandler(event) {
    const checkboxElement = event.target;
    const liElement = checkboxElement.closest("li");
    const idUser = liElement.userId;
    const taskId = liElement.taskId;
    const isDone = checkboxElement.checked;

    // O navegador ja marcou/desmarcou o checkbox antes do handler rodar. Se a
    // requisicao falhar, a tela fica mostrando um estado que o banco nao tem -
    // por isso o catch tambem recarrega a lista, restaurando o valor real.
    checkboxElement.disabled = true;

    try {
        await taskUpdateApi(idUser, taskId, { is_done: isDone });

        // Recarregar em vez de so riscar o texto na tela: o strikethrough passa
        // a vir do dado devolvido pela API, entao o que aparece e o que foi
        // realmente gravado.
        await tasksListRender(idUser);
    } catch (error) {
        alert("Não foi possível atualizar a tarefa. Tente novamente.");
        console.error("Erro ao atualizar tarefa:", error);

        // Desfaz o estado visual, voltando ao que o servidor tem.
        await tasksListRender(idUser);
    }
}
