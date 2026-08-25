export type SmsTemplate = {
    id: string
    title: string
    body: string
}

export type SmsStudent = {
    prenom: string
    nom: string
    classe: string
}

export const DEFAULT_SMS_TEMPLATES: SmsTemplate[] = [
    {
        id: 'travail',
        title: 'Travail non rendu',
        body:
            'Bonjour,\nJe vous contacte au sujet de {prénom} ({classe}) : le travail n’a pas été rendu. Merci de me tenir informé·e.\nCordialement',
    },
    {
        id: 'comportement',
        title: 'Comportement',
        body:
            'Bonjour,\nJe souhaite vous parler du comportement de {prénom} ({classe}) aujourd’hui. N’hésitez pas à me répondre.\nCordialement',
    },
    {
        id: 'positif',
        title: 'Point positif',
        body:
            'Bonjour,\nPetite note positive concernant {prénom} ({classe}) : la séance s’est très bien passée.\nCordialement',
    },
]

const cloneDefaults = () =>
    DEFAULT_SMS_TEMPLATES.map((template) => ({
        id: template.id,
        title: template.title,
        body: template.body,
    }))

export const normalizeSmsTemplates = (raw: unknown): SmsTemplate[] => {
    if (raw == null) return cloneDefaults()
    if (!Array.isArray(raw)) return cloneDefaults()
    const next: SmsTemplate[] = []
    raw.forEach((item, index) => {
        if (!item || typeof item !== 'object') return
        const data = item as { id?: unknown; title?: unknown; body?: unknown }
        const title = String(data.title || '').trim()
        const body = String(data.body || '')
        if (!title && !body.trim()) return
        next.push({
            id: String(data.id || 'sms-' + index),
            title: title || 'Modèle',
            body,
        })
    })
    return next
}

export const fillSmsTemplate = (body: string, student: SmsStudent) => {
    return String(body || '')
        .replace(/\{pr[eé]nom\}/gi, student.prenom || '')
        .replace(/\{nom\}/gi, student.nom || '')
        .replace(/\{classe\}/gi, student.classe || '')
}

export const cleanPhoneNumber = (value: string) =>
    String(value || '').replace(/[^\d+]/g, '')

export const buildSmsUrl = (body: string, tel?: string) => {
    const encoded = encodeURIComponent(body || '')
    const number = tel ? cleanPhoneNumber(tel) : ''
    if (number) return 'sms:' + number + '?&body=' + encoded
    return 'sms:?&body=' + encoded
}

export const copyToClipboard = (text: string) => {
    const value = String(text || '')
    if (!value) return false
    try {
        const area = document.createElement('textarea')
        area.value = value
        area.setAttribute('readonly', '')
        area.style.position = 'fixed'
        area.style.left = '-9999px'
        document.body.appendChild(area)
        area.select()
        const ok = document.execCommand('copy')
        document.body.removeChild(area)
        if (ok) return true
    } catch (error) {
        // Fallback below.
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).catch(() => undefined)
        return true
    }
    return false
}

export const canPickContacts = () => {
    if (typeof navigator === 'undefined') return false
    const contacts = (navigator as any).contacts
    return !!(contacts && typeof contacts.select === 'function')
}

export const pickContactPhone = async () => {
    const contacts = (navigator as any).contacts
    if (!contacts || typeof contacts.select !== 'function') return ''
    const selected = await contacts.select(['tel'], { multiple: false })
    if (!selected || !selected.length) return ''
    const tels = selected[0].tel || []
    for (let i = 0; i < tels.length; i++) {
        const tel = String(tels[i] || '').trim()
        if (tel) return tel
    }
    return ''
}

export const openSmsComposer = (body: string, tel?: string) => {
    const url = buildSmsUrl(body, tel)
    const link = document.createElement('a')
    link.href = url
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

export const sendParentSms = (
    student: SmsStudent,
    template: SmsTemplate,
    tel?: string
) => {
    const body = fillSmsTemplate(template.body, student)
    copyToClipboard(student.prenom)
    openSmsComposer(body, tel)
    return student.prenom
}
