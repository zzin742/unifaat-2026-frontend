export default async function loginRender(): Promise<void> {
  const container = document.querySelector("#login-container");

  if (!container) return;

  container.innerHTML = "";

  const formElement = document.createElement("form");
  formElement.id = "login-form";
  formElement.classList.add("d-flex", "flex-column", "gap-3");

  const titleElement = document.createElement("h2");
  titleElement.classList.add("text-center", "mb-4");
  titleElement.innerText = "Login";

  const emailLabelElement = document.createElement("label");
  emailLabelElement.htmlFor = "email-input";
  emailLabelElement.classList.add("form-label");
  emailLabelElement.innerText = "Email";

  const emailInputElement = document.createElement("input");
  emailInputElement.id = "email-input";
  emailInputElement.type = "email";
  emailInputElement.classList.add("form-control");
  emailInputElement.placeholder = "seu@email.com";
  emailInputElement.required = true;

  const passwordLabelElement = document.createElement("label");
  passwordLabelElement.htmlFor = "password-input";
  passwordLabelElement.classList.add("form-label");
  passwordLabelElement.innerText = "Senha";

  const passwordInputElement = document.createElement("input");
  passwordInputElement.id = "password-input";
  passwordInputElement.type = "password";
  passwordInputElement.classList.add("form-control");
  passwordInputElement.placeholder = "sua senha";
  passwordInputElement.required = true;

  const submitButtonElement = document.createElement("button");
  submitButtonElement.type = "submit";
  submitButtonElement.classList.add("btn", "btn-primary", "btn-lg", "mt-3");
  submitButtonElement.innerText = "Entrar";

  const messageElement = document.createElement("div");
  messageElement.id = "login-message";
  messageElement.classList.add("alert", "alert-danger", "d-none");

  formElement.append(
    titleElement,
    emailLabelElement,
    emailInputElement,
    passwordLabelElement,
    passwordInputElement,
    submitButtonElement,
    messageElement
  );

  container.append(formElement);
}
