import { ActivityPanel } from "../components/dashboard/ActivityPanel"
import { CommitsPanel } from "../components/dashboard/CommitsPanel"
import { Hero } from "../components/dashboard/Hero"
import { LanguagesPanel } from "../components/dashboard/LanguagesPanel"
import { ProjectsPanel } from "../components/dashboard/ProjectsPanel"
import { QuickDetails } from "../components/dashboard/QuickDetails"
import { RecentRepos } from "../components/dashboard/RecentRepos"
import { StatsPanel } from "../components/dashboard/StatsPanel"
import { DEFAULT_CONFIG } from "../constants"
import { useGitHubContext } from "../context/GitHubContext"
import { FEATURED_PROJECTS, PROJECTS } from "../data/projects"

const BRAND = "Aquiles_Bachira Repository"

export function HomePage() {
    const { data, loading } = useGitHubContext()
    const featured = FEATURED_PROJECTS.slice(0, 4)
    const name = (data?.profile.name ?? DEFAULT_CONFIG.brandName).replace(/_/g, " ")

    return (
        <div className="workspace__grid">
            <div className="col-main">
                <Hero name={name} brand={BRAND} />
                <ProjectsPanel projects={featured} />
                <ActivityPanel activity={data?.activity ?? []} loading={loading} />
            </div>

            <div className="col-rail">
                <StatsPanel stats={data?.stats ?? null} loading={loading} />
                <CommitsPanel commits={data?.commits ?? []} loading={loading} />
                <LanguagesPanel languages={data?.languages ?? []} loading={loading} />
                <QuickDetails
                    projects={PROJECTS.length}
                    codeBytes={data?.stats.codeBytes ?? 0}
                    languages={data?.stats.languages ?? 0}
                    followers={data?.profile.followers ?? 0}
                />
                <RecentRepos repos={data?.recentRepos ?? []} loading={loading} />
            </div>
        </div>
    )
}
