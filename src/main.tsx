import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App"
import "./styles.css"
import { initAnalytics, trackPageView } from "./services/analytics"

// Inicializa o Analytics Hub (chave browser — só no cliente)
const analytics = initAnalytics()

// Rastreia a página inicial
if (analytics) {
    const path = window.location.hash.replace(/^#/, "") || "/"
    trackPageView(path)
}

// Rastreia mudanças de rota (hashchange)
window.addEventListener("hashchange", () => {
    const path = window.location.hash.replace(/^#/, "") || "/"
    trackPageView(path)
})

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>
)
