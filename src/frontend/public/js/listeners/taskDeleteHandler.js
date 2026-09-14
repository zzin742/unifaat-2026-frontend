import tasksListRender from "../render/tasksListRender.js";
import { taskDeleteApi } from "../api/taskDeleteApi.js";

export default async function taskDeleteHandler(event) {
    const liElement = event.target.closest("li");
    const idUser = liElement.userId;
    const taskId = liElement.taskId;

    // O nome da tarefa entra na pergunta para o usuario saber EXATAMENTE o
    // que vai sumir - "Excluir esta tarefa?" nao ajuda quem tem uma lista
    // grande e clicou na linha errada.
    const nomeTarefa = liElement.querySelector("span")?.innerText ?? "esta tarefa";

    // O enunciado pede "usar alert" para confirmar, mas alert() so exibe uma
    // mensagem e tem um unico botao - nao ha como o usuario dizer "nao".
    // Quem confirma e o confirm(), que devolve true/false. Usar alert aqui
    // apagaria a tarefa de qualquer jeito, que e o oposto de confirmar.
    const confirmado = confirm(`Excluir a tarefa "${nomeTarefa}"?`);

    if (!confirmado) {
        return;
    }

    // Desabilita o botao durante a requisicao: sem isso, dois cliques rapidos
    // disparam dois DELETE, e o segundo falha com 404 numa tarefa que ja nao
    // existe - o usuario veria um erro por uma acao que deu certo.
    const buttonElement = event.currentTarget;
    buttonElement.disabled = true;

    try {
        await taskDeleteApi(idUser, taskId);

        // Recarrega a lista so DEPOIS da resposta: remover o item da tela
        // antes seria mentir para o usuario caso o servidor recusasse.
        await tasksListRender(idUser);
    } catch (error) {
        buttonElement.disabled = false;

        // O enunciado pede tratamento de erro COM MENSAGEM AO USUARIO. Só
        // console.error deixaria a falha invisivel para quem esta usando.
        alert("Não foi possível excluir a tarefa. Tente novamente.");
        console.error("Erro ao excluir tarefa:", error);
    }
}
