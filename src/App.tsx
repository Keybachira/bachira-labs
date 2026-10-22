import { Shell } from "./components/layout/Shell"
import { GitHubProvider } from "./context/GitHubContext"
import { AboutPage } from "./pages/AboutPage"
import { ContactPage } from "./pages/ContactPage"
import { GitHubPage } from "./pages/GitHubPage"
import { HomePage } from "./pages/HomePage"
import { ProjectPage } from "./pages/ProjectPage"
import { ProjectsPage } from "./pages/ProjectsPage"
import { useRoute } from "./router"

export default function App() {
    const route = useRoute()

    return (
        <GitHubProvider>
            <Shell route={route}>
                {route.page === "inicio" && <HomePage />}
                {route.page === "projetos" &&
                    (route.projectId ? (
                        <ProjectPage projectId={route.projectId} />
                    ) : (
                        <ProjectsPage />
                    ))}
                {route.page === "github" && <GitHubPage />}
                {route.page === "sobre" && <AboutPage />}
                {route.page === "contacto" && <ContactPage />}
            </Shell>
        </GitHubProvider>
    )
}
