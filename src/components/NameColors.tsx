import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../Auth'
import SettingsLayout from './SettingsLayout'
import ConfirmModal from './ConfirmModal'
import { IconTrash } from './Icons'
import { useNameColorRules } from '../hooks'
import {
    addNameColorRule,
    NAME_COLOR_PALETTE,
    NameColorRule,
    removeNameColorRule,
    setNameColorRuleColor,
} from '../utils/nameColors'

export default () => {
    const { currentUser } = useContext(AuthContext)
    const uid = currentUser ? currentUser.uid : ''
    const { rules, loading, save, saving } = useNameColorRules(uid)
    const [draft, setDraft] = useState<NameColorRule[]>([])
    const [keyword, setKeyword] = useState('')
    const [openId, setOpenId] = useState('')
    const [error, setError] = useState('')
    const [toast, setToast] = useState('')
    const [pendingDelete, setPendingDelete] = useState<NameColorRule | null>(
        null
    )
    const hydrated = React.useRef(false)

    useEffect(() => {
        if (loading || hydrated.current) return
        setDraft(rules)
        hydrated.current = true
    }, [loading, rules])

    if (currentUser === null) return <div />

    const persist = async (next: NameColorRule[], message: string) => {
        setDraft(next)
        setError('')
        await save(next)
        setToast(message)
        window.setTimeout(() => setToast(''), 2200)
    }

    const handleAdd = async () => {
        const result = addNameColorRule(draft, keyword)
        if ('error' in result) {
            setError(result.error)
            return
        }
        setKeyword('')
        setOpenId(result.rules[result.rules.length - 1].id)
        await persist(result.rules, 'Mot-clé ajouté')
    }

    const handleColor = async (id: string, color: string) => {
        await persist(setNameColorRuleColor(draft, id, color), 'Couleur enregistrée')
    }

    const handleDelete = async () => {
        if (!pendingDelete) return
        const next = removeNameColorRule(draft, pendingDelete.id)
        setPendingDelete(null)
        if (openId === pendingDelete.id) setOpenId('')
        await persist(next, 'Détecteur supprimé')
    }

    return (
        <SettingsLayout
            title="Couleurs des élèves"
            backTo="/create"
            toast={toast || undefined}
        >
            <ConfirmModal
                confirm={pendingDelete !== null}
                setConfirm={(value) => {
                    const next =
                        typeof value === 'function'
                            ? value(pendingDelete !== null)
                            : value
                    if (!next) setPendingDelete(null)
                }}
                confirmAction={handleDelete}
                danger
                textBox={
                    pendingDelete
                        ? 'Supprimer le détecteur « ' +
                          pendingDelete.keyword +
                          ' » ?'
                        : 'Supprimer ce détecteur ?'
                }
                subTextBox="Les noms redeviendront noirs si plus rien ne matche dans la note."
            />
            <div className="settings-panel">
                <p
                    className="settings-panel-note"
                    style={{ textAlign: 'left' }}
                >
                    Si la note en bas de la fiche contient un de ces mots, le
                    nom s’affiche dans la couleur choisie (accueil et plan de
                    classe). La casse, les accents et les points ne comptent
                    pas. « pap » ne prend pas « papa ».
                </p>
            </div>
            {loading ? (
                <p className="settings-panel-note">Chargement…</p>
            ) : (
                <React.Fragment>
                    <div className="settings-group-label">Mots-clés</div>
                    <div className="settings-group">
                        {draft.length === 0 ? (
                            <div className="settings-empty">
                                Aucun détecteur pour le moment.
                            </div>
                        ) : (
                            draft.map((rule) => (
                                <div key={rule.id}>
                                    <div className="name-color-row">
                                        <span
                                            className="name-color-word"
                                            style={{ color: rule.color }}
                                        >
                                            {rule.keyword}
                                        </span>
                                        <button
                                            type="button"
                                            className={`name-color-swatch${
                                                openId === rule.id
                                                    ? ' is-open'
                                                    : ''
                                            }`}
                                            style={{ background: rule.color }}
                                            aria-label={
                                                'Couleur de ' + rule.keyword
                                            }
                                            onClick={() =>
                                                setOpenId(
                                                    openId === rule.id
                                                        ? ''
                                                        : rule.id
                                                )
                                            }
                                        />
                                        <button
                                            type="button"
                                            className="class-delete-btn"
                                            aria-label={
                                                'Supprimer ' + rule.keyword
                                            }
                                            onClick={() =>
                                                setPendingDelete(rule)
                                            }
                                        >
                                            <IconTrash />
                                        </button>
                                    </div>
                                    {openId === rule.id ? (
                                        <div className="name-color-palette">
                                            {NAME_COLOR_PALETTE.map(
                                                (swatch) => (
                                                    <button
                                                        type="button"
                                                        key={swatch.id}
                                                        className={`name-color-choice${
                                                            rule.color.toLowerCase() ===
                                                            swatch.hex.toLowerCase()
                                                                ? ' is-on'
                                                                : ''
                                                        }`}
                                                        style={{
                                                            background:
                                                                swatch.hex,
                                                        }}
                                                        aria-label={
                                                            swatch.label
                                                        }
                                                        title={swatch.label}
                                                        onClick={() =>
                                                            handleColor(
                                                                rule.id,
                                                                swatch.hex
                                                            )
                                                        }
                                                    />
                                                )
                                            )}
                                        </div>
                                    ) : null}
                                </div>
                            ))
                        )}
                    </div>
                    <div className="settings-panel">
                        <label className="modal-field">
                            <span className="modal-label">Nouveau mot-clé</span>
                            <input
                                className="modal-input"
                                value={keyword}
                                onChange={(event) => {
                                    setKeyword(event.target.value)
                                    if (error) setError('')
                                }}
                                placeholder="Ex. AESH, dys…"
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        event.preventDefault()
                                        handleAdd()
                                    }
                                }}
                            />
                        </label>
                        {error ? (
                            <p
                                className="settings-panel-note"
                                style={{
                                    textAlign: 'left',
                                    color: '#dc2626',
                                    margin: '0.5rem 0 0',
                                }}
                            >
                                {error}
                            </p>
                        ) : (
                            <p
                                className="settings-panel-note"
                                style={{
                                    textAlign: 'left',
                                    margin: '0.5rem 0 0',
                                }}
                            >
                                Toutes les casses et accents seront reconnus.
                                Noir par défaut, comme le nom habituel.
                            </p>
                        )}
                        <button
                            type="button"
                            className={`settings-btn${
                                saving || !keyword.trim() ? ' is-disabled' : ''
                            }`}
                            onClick={handleAdd}
                        >
                            Ajouter
                        </button>
                    </div>
                </React.Fragment>
            )}
        </SettingsLayout>
    )
}
