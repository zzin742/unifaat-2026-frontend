/**
 * Declaracao minima do Bootstrap.
 *
 * O pacote bootstrap@5.3 nao publica tipos proprios, e o TF restringe as
 * dependencias a Bootstrap e Axios — entao em vez de instalar
 * @types/bootstrap, declaramos aqui so a parte que o projeto usa: a classe
 * Modal, para fechar o modal por codigo depois de criar a tarefa.
 *
 * Sem isso o `import { Modal } from "bootstrap"` seria `any` implicito e o
 * tsc em modo strict reprovaria (TS7016).
 */
declare module "bootstrap" {
  export class Modal {
    constructor(element: Element, options?: Record<string, unknown>);
    show(): void;
    hide(): void;
    dispose(): void;
    static getInstance(element: Element): Modal | null;
    static getOrCreateInstance(element: Element, options?: Record<string, unknown>): Modal;
  }
}
