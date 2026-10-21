import { WebTerminal } from "./components/WebTerminal"
import { DEFAULT_CONFIG } from "./constants"
import { PROJECTS } from "./data/projects"

export default function App() {
    return <WebTerminal config={DEFAULT_CONFIG} projects={PROJECTS} />
}
