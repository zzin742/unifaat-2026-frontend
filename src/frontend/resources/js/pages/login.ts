import loginRender from "../render/loginRender";
import loginListeners from "../listeners/loginListeners";
import { checkAuthentication } from "../utils/checkAuthentication";
import { setUserId } from "../utils/getUserIdFromAuth";

window.addEventListener("DOMContentLoaded", async () => {
  try {
    // Valida se o usuário já está logado com token válido
    const auth = await checkAuthentication();

    if (auth.authenticated && auth.idUser !== undefined) {
      setUserId(auth.idUser);
      window.location.href = "/tasks.html";
      return;
    }

    // Se não tiver token válido, renderiza o login
    await loginRender();
    await loginListeners();
  } catch (error) {
    console.error("Falha ao carregar login:", error);
    // Mesmo com erro, renderiza o login
    await loginRender();
    await loginListeners();
  }
});
