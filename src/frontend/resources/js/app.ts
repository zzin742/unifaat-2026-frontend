// Vendor bundle: dependências de terceiros que antes vinham de CDN
// agora são instaladas via npm e compiladas pelo Vite junto com o resto.
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import axios from "axios";

export { axios };

// Redirecionado para /login.html
// As funcionalidades foram migradas para:
// - /login.html → Login de usuários
// - /tasks.html → Listing de tarefas do usuário
