import { useState, type ChangeEvent, type FormEvent } from "react"
import { DashIcon } from "../components/dashboard/icons"
import { PanelHead } from "../components/dashboard/PanelHead"
import { PageHead } from "../components/ui/PageHead"
import { DEFAULT_CONFIG } from "../constants"
import { useGitHubContext } from "../context/GitHubContext"

interface FormState {
    name: string
    email: string
    subject: string
    message: string
}

const EMPTY: FormState = { name: "", email: "", subject: "", message: "" }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function ContactPage() {
    const { data } = useGitHubContext()
    const [form, setForm] = useState<FormState>(EMPTY)
    const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
    const [sentTo, setSentTo] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)

    const email = DEFAULT_CONFIG.email
    const profileUrl = data?.profile.htmlUrl ?? "https://github.com/Keybachira"
    const location = data?.profile.location ?? DEFAULT_CONFIG.location

    const update =
        (key: keyof FormState) =>
        (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const { value } = event.target
            setForm((current) => ({ ...current, [key]: value }))
            setErrors((current) => ({ ...current, [key]: undefined }))
            setSentTo(null)
        }

    function validate(): boolean {
        const next: Partial<Record<keyof FormState, string>> = {}
        if (form.name.trim().length < 2) next.name = "Diz-me como te chamas."
        if (!EMAIL_RE.test(form.email.trim())) next.email = "Preciso de um email válido."
        if (form.message.trim().length < 10) next.message = "Escreve pelo menos 10 caracteres."
        setErrors(next)
        return Object.keys(next).length === 0
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!validate()) return

        const subject = form.subject.trim() || `Contacto de ${form.name.trim()}`
        const body = `${form.message.trim()}\n\n— ${form.name.trim()}\n${form.email.trim()}`
        const link = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

        setSentTo(link)
        window.location.href = link
    }

    async function copyEmail() {
        try {
            await navigator.clipboard.writeText(email)
            setCopied(true)
            window.setTimeout(() => setCopied(false), 2000)
        } catch {
            setCopied(false)
        }
    }

    return (
        <div className="page">
            <PageHead
                eyebrow="aberto a conversa"
                title="Contacto"
                description="Freelance, colaborações ou só uma ideia para trocar. O formulário abre o teu cliente de email com a mensagem já escrita."
                aside={<span className="count-pill">{DEFAULT_CONFIG.availability}</span>}
            />

            <div className="contact-grid">
                <form className="panel contact-form" onSubmit={handleSubmit} noValidate>
                    <PanelHead icon="mail" title="Enviar mensagem" />

                    <div className="field">
                        <label htmlFor="contact-name">Nome</label>
                        <input
                            id="contact-name"
                            name="name"
                            value={form.name}
                            onChange={update("name")}
                            placeholder="O teu nome"
                            autoComplete="name"
                            aria-invalid={Boolean(errors.name)}
                            aria-describedby={errors.name ? "contact-name-error" : undefined}
                        />
                        {errors.name && (
                            <p className="field__error" id="contact-name-error">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div className="field">
                        <label htmlFor="contact-email">Email</label>
                        <input
                            id="contact-email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={update("email")}
                            placeholder="tu@exemplo.com"
                            autoComplete="email"
                            aria-invalid={Boolean(errors.email)}
                            aria-describedby={errors.email ? "contact-email-error" : undefined}
                        />
                        {errors.email && (
                            <p className="field__error" id="contact-email-error">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div className="field">
                        <label htmlFor="contact-subject">Assunto</label>
                        <input
                            id="contact-subject"
                            name="subject"
                            value={form.subject}
                            onChange={update("subject")}
                            placeholder="Sobre o que queres falar?"
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="contact-message">Mensagem</label>
                        <textarea
                            id="contact-message"
                            name="message"
                            rows={6}
                            value={form.message}
                            onChange={update("message")}
                            placeholder="Conta-me o contexto, o objectivo e o prazo."
                            aria-invalid={Boolean(errors.message)}
                            aria-describedby={errors.message ? "contact-message-error" : undefined}
                        />
                        {errors.message && (
                            <p className="field__error" id="contact-message-error">
                                {errors.message}
                            </p>
                        )}
                    </div>

                    <div className="contact-form__actions">
                        <button type="submit" className="btn btn--primary">
                            <DashIcon name="send" size={13} />
                            Abrir email
                        </button>
                        <span className="contact-form__hint">Nada é enviado para um servidor.</span>
                    </div>

                    {sentTo && (
                        <div className="form__success" role="status">
                            <DashIcon name="check" size={14} />
                            <span>
                                Cliente de email aberto. Se nada acontecer,{" "}
                                <a href={sentTo}>clica aqui</a>.
                            </span>
                        </div>
                    )}
                </form>

                <aside className="contact-aside">
                    <section className="panel">
                        <PanelHead icon="mail" title="Directo" />
                        <p className="contact-email">{email}</p>
                        <button type="button" className="btn btn--block" onClick={copyEmail}>
                            <DashIcon name={copied ? "check" : "copy"} size={13} />
                            {copied ? "Copiado" : "Copiar email"}
                        </button>
                    </section>

                    <section className="panel">
                        <PanelHead icon="github" title="Onde estou" />
                        <ul className="contact-links">
                            <li>
                                <DashIcon name="github" size={13} />
                                <a href={profileUrl} target="_blank" rel="noreferrer">
                                    @{data?.profile.login ?? "Keybachira"}
                                </a>
                            </li>
                            <li>
                                <DashIcon name="pin" size={13} />
                                <span>{location}</span>
                            </li>
                            <li>
                                <DashIcon name="terminal" size={13} />
                                <span>Seg a sex · resposta em 24–48h</span>
                            </li>
                        </ul>
                    </section>
                </aside>
            </div>
        </div>
    )
}
