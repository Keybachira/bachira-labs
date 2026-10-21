import { Shell } from "./components/layout/Shell"
import { GitHubProvider } from "./context/GitHubContext"
import { AboutPage } from "./pages/AboutPage"
import { ContactPage } from "./pages/ContactPage"
import { GitHubPage } from "./pages/GitHubPage"
import { HomePage } from "./pages/HomePage"
import { ProjectsPage } from "./pages/ProjectsPage"
import { useRoute } from "./router"

export default function App() {
    const route = useRoute()

    return (
        <GitHubProvider>
            <Shell route={route}>
                {route.page === "inicio" && <HomePage />}
                {route.page === "projetos" && <ProjectsPage projectId={route.projectId} />}
                {route.page === "github" && <GitHubPage />}
                {route.page === "sobre" && <AboutPage />}
                {route.page === "contacto" && <ContactPage />}
            </Shell>
        </GitHubProvider>
    )
}
