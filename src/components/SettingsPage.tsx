import React, { useContext, useEffect, useState } from 'react'
import { Link, Route, Switch, useHistory } from 'react-router-dom'
import firebase from 'firebase/app'
import { AuthContext } from '../Auth'
import {
    useGroups,
    useLists,
    usePeriodes,
    useStudents,
} from '../hooks'
import SettingsLayout from './SettingsLayout'
import CreateGroups from './Create/CreateGroups'
import CreateStudent from './Create/CreateStudent'
import CardCustomer from './CardCustomization/CardCustomer'
import FileUploader from './FileUploader'
import PeriodeFilter from './PeriodeFilter'
import ConfirmModal from './ConfirmModal'
import Podium from './Podium'
import ReportProblem from './ReportProblem'
import AdminTools from './AdminTools'
import {
    IconCalendar,
    IconChevronRight,
    IconFlag,
    IconGrid,
    IconLogout,
    IconTrash,
    IconUpload,
    IconUser,
    IconUsers,
    IconTrophy,
    IconWrench,
} from './Icons'
import { isAdminUser } from '../functions'

interface SettingsRowProps {
    to?: string
    onClick?: () => void
    icon: React.ReactNode
    title: string
    subtitle?: string
    logout?: boolean
}

const SettingsRow = ({
    to,
    onClick,
    icon,
    title,
    subtitle,
    logout,
}: SettingsRowProps) => {
    const className = `settings-row${logout ? ' settings-row-logout' : ''}`
    const content = (
        <React.Fragment>
            <span className="settings-row-icon">{icon}</span>
            <span className="settings-row-body">
                <span className="settings-row-title">{title}</span>
                {subtitle ? (
                    <span className="settings-row-sub">{subtitle}</span>
                ) : null}
            </span>
            {logout ? null : <IconChevronRight className="settings-row-chevron" />}
        </React.Fragment>
    )

    if (to) {
        return (
            <Link to={to} className={className}>
                {content}
            </Link>
        )
    }

    return (
        <button type="button" className={className} onClick={onClick}>
            {content}
        </button>
    )
}

const SettingsMenu = () => {
    const { currentUser } = useContext(AuthContext)
    if (currentUser === null) return <div />

    const adminConnected = isAdminUser(currentUser)
    const email = currentUser.email || 'Compte'
    const initial = email.charAt(0).toUpperCase()

    return (
        <SettingsLayout title="Paramètres">
            <div className="settings-profile">
                <div className="settings-avatar">{initial}</div>
                <div>
                    <div className="settings-profile-label">Compte</div>
                    <div className="settings-profile-email">{email}</div>
                </div>
            </div>

            <div className="settings-group-label">Classes et élèves</div>
            <div className="settings-group">
                <SettingsRow
                    to="/create/pronote"
                    icon={<IconUpload />}
                    title="Importer depuis Pronote"
                    subtitle="À partir d’un export CSV"
                />
                <SettingsRow
                    to="/create/classe"
                    icon={<IconUsers />}
                    title="Créer une classe manuellement"
                    subtitle="Une classe à la fois"
                />
                <SettingsRow
                    to="/create/eleves"
                    icon={<IconUser />}
                    title="Ajouter des élèves manuellement"
                    subtitle="Un élève à la fois, dans une classe"
                />
                <SettingsRow
                    to="/create/cartes"
                    icon={<IconGrid />}
                    title="Personnaliser les croix"
                    subtitle="Croix négatives et positives"
                />
            </div>

            <div className="settings-group-label">Suivi</div>
            <div className="settings-group">
                <SettingsRow
                    to="/create/podium"
                    icon={<IconTrophy />}
                    title="Podium"
                    subtitle="Les meilleurs élèves de chaque classe"
                />
            </div>

            <div className="settings-group-label">Année</div>
            <div className="settings-group">
                <SettingsRow
                    to="/create/periodes"
                    icon={<IconCalendar />}
                    title="Périodes"
                    subtitle="Changer de période ou en commencer une nouvelle"
                />
                <SettingsRow
                    to="/create/annee"
                    icon={<IconTrash />}
                    title="Réinitialiser l’année"
                    subtitle="Supprimer classes, élèves et listes"
                />
            </div>

            <div className="settings-group-label">Aide</div>
            <div className="settings-group">
                <SettingsRow
                    to="/create/signaler"
                    icon={<IconFlag />}
                    title="Signaler un problème, faire une suggestion"
                    subtitle="Un bug, une idée… Léo le reçoit"
                />
            </div>

            {adminConnected && (
                <div className="settings-group">
                    <SettingsRow
                        to="/create/admin"
                        icon={<IconWrench />}
                        title="Maintenance"
                        subtitle="Signalements et comptes"
                    />
                </div>
            )}

            <div className="settings-group">
                <SettingsRow
                    logout
                    icon={<IconLogout />}
                    title="Se déconnecter"
                    onClick={() => firebase.auth().signOut()}
                />
            </div>
        </SettingsLayout>
    )
}

const SettingsClasse = () => {
    const { currentUser } = useContext(AuthContext)
    const uid = currentUser ? currentUser.uid : ''
    const { groups, loading, refreshGroups } = useGroups(uid)
    const { students } = useStudents(uid)
    const { lists } = useLists(uid)
    const [pendingClass, setPendingClass] = useState<string | null>(null)
    if (currentUser === null) return <div />

    const studentInClass = (student: { classes: string | string[] }, group: string) => {
        const classes = student.classes
        if (Array.isArray(classes)) return classes.includes(group)
        return classes === group
    }

    const studentCount = (group: string) =>
        students.filter((student) => studentInClass(student, group)).length

    const handleDeleteClass = async () => {
        if (!pendingClass) return
        const classe = pendingClass
        const db = firebase.firestore()
        const classStudents = students.filter((student) =>
            studentInClass(student, classe)
        )

        for (const student of classStudents) {
            const studentRef = db
                .collection('users')
                .doc(currentUser.uid)
                .collection('eleves')
                .doc(student.id)
            const [crossesSnap, listesSnap] = await Promise.all([
                studentRef.collection('crosses').get(),
                studentRef.collection('listes').get(),
            ])
            const batch = db.batch()
            crossesSnap.forEach((doc) => batch.delete(doc.ref))
            listesSnap.forEach((doc) => batch.delete(doc.ref))
            batch.delete(studentRef)
            await batch.commit()
        }

        const classLists = lists.filter((list) => {
            const group = list.group
            if (Array.isArray(group)) return group.includes(classe)
            return group === classe
        })
        if (classLists.length > 0) {
            const listBatch = db.batch()
            classLists.forEach((list) => {
                listBatch.delete(
                    db
                        .collection('users')
                        .doc(currentUser.uid)
                        .collection('lists')
                        .doc(list.id)
                )
            })
            await listBatch.commit()
        }

        const userRef = db.collection('users').doc(currentUser.uid)
        const userSnap = await userRef.get()
        const postIts = (userSnap.data()?.postIt || []).filter(
            (item: { classe: string }) => item.classe !== classe
        )
        await userRef.update({
            classes: firebase.firestore.FieldValue.arrayRemove(classe),
            postIt: postIts,
        })

        if (localStorage.getItem('displayedGroup') === classe) {
            localStorage.setItem('displayedGroup', 'tous')
        }
        refreshGroups()
        setPendingClass(null)
    }

    return (
        <SettingsLayout title="Créer une classe manuellement" backTo="/create">
            <ConfirmModal
                confirm={pendingClass !== null}
                setConfirm={(value) => {
                    const next =
                        typeof value === 'function'
                            ? value(pendingClass !== null)
                            : value
                    if (!next) setPendingClass(null)
                }}
                confirmAction={() => {
                    handleDeleteClass()
                }}
                danger
                textBox={`Supprimer la classe ${pendingClass || ''} ?`}
                subTextBox="Tous les élèves de cette classe seront supprimés, avec leurs croix, notes et listes. Cette action est définitive."
            />
            <div className="settings-panel">
                <CreateGroups onAddGroup={refreshGroups} />
            </div>
            <div className="settings-group-label">Classes actuelles</div>
            <div className="settings-group">
                {loading && groups.length === 0 ? (
                    <div className="settings-empty">Chargement…</div>
                ) : groups.length === 0 ? (
                    <div className="settings-empty">
                        Aucune classe pour le moment.
                    </div>
                ) : (
                    groups.map((group) => {
                        const count = studentCount(group)
                        return (
                            <div
                                className="settings-row settings-row-static"
                                key={group}
                            >
                                <span className="settings-row-icon">
                                    <IconUsers />
                                </span>
                                <span className="settings-row-body">
                                    <span className="settings-row-title">
                                        {group}
                                    </span>
                                    <span className="settings-row-sub">
                                        {count} {count > 1 ? 'élèves' : 'élève'}
                                    </span>
                                </span>
                                <button
                                    type="button"
                                    className="class-delete-btn"
                                    aria-label={`Supprimer ${group}`}
                                    onClick={() => setPendingClass(group)}
                                >
                                    <IconTrash />
                                </button>
                            </div>
                        )
                    })
                )}
            </div>
        </SettingsLayout>
    )
}

const SettingsPronote = () => {
    const { currentUser } = useContext(AuthContext)
    const [saveConfirm, setSaveConfirm] = useState(false)

    useEffect(() => {
        if (!saveConfirm) return
        const timeoutId = setTimeout(() => setSaveConfirm(false), 3500)
        return () => clearTimeout(timeoutId)
    }, [saveConfirm])

    if (currentUser === null) return <div />

    return (
        <SettingsLayout
            title="Importer depuis Pronote"
            backTo="/create"
            toast={
                saveConfirm ? 'Les modifications ont été enregistrées' : undefined
            }
        >
            <div className="settings-panel">
                <FileUploader
                    currentUserId={currentUser.uid}
                    setSaveConfirm={setSaveConfirm}
                />
            </div>
        </SettingsLayout>
    )
}

const SettingsEleves = () => {
    const { currentUser } = useContext(AuthContext)
    const uid = currentUser ? currentUser.uid : ''
    const { groups } = useGroups(uid)
    if (currentUser === null) return <div />

    return (
        <SettingsLayout title="Ajouter des élèves manuellement" backTo="/create">
            <div className="settings-panel">
                <CreateStudent groups={groups} currentUserId={currentUser.uid} />
            </div>
        </SettingsLayout>
    )
}

const SettingsCartes = () => {
    const { currentUser } = useContext(AuthContext)
    const [saveConfirm, setSaveConfirm] = useState(false)

    useEffect(() => {
        if (!saveConfirm) return
        const timeoutId = setTimeout(() => setSaveConfirm(false), 3500)
        return () => clearTimeout(timeoutId)
    }, [saveConfirm])

    if (currentUser === null) return <div />

    return (
        <SettingsLayout
            title="Personnaliser les croix"
            backTo="/create"
            toast={
                saveConfirm ? 'Les modifications ont été enregistrées' : undefined
            }
        >
            <div className="settings-panel">
                <CardCustomer
                    userId={currentUser.uid}
                    setSaveConfirm={setSaveConfirm}
                />
            </div>
        </SettingsLayout>
    )
}

const SettingsPeriodes = () => {
    const { currentUser } = useContext(AuthContext)
    const uid = currentUser ? currentUser.uid : ''
    const [confirm, setConfirm] = useState(false)
    const { periodes, refreshPeriodes, runningPeriode, refreshRunningPeriode } =
        usePeriodes(uid)
    const db = firebase.firestore()
    const history = useHistory()
    if (currentUser === null) return <div />

    const handleNewPeriode = () => {
        db.collection('users')
            .doc(currentUser.uid)
            .update({
                periodes: firebase.firestore.FieldValue.arrayUnion(new Date()),
                runningPeriode: periodes.length + 1,
            })
        refreshPeriodes()
        refreshRunningPeriode()
        history.push('/create')
    }

    return (
        <SettingsLayout title="Périodes" backTo="/create">
            <ConfirmModal
                confirm={confirm}
                setConfirm={setConfirm}
                confirmAction={handleNewPeriode}
                textBox="Êtes-vous sûr(e) de vouloir commencer une nouvelle période ?"
                subTextBox="En faisant cela, vous ne pourrez plus ajouter de croix pour les périodes précédentes"
            />
            <div className="settings-panel">
                <p className="settings-panel-note">
                    En cours : période {runningPeriode}
                </p>
                <PeriodeFilter
                    periodes={periodes}
                    currentUser={currentUser.uid}
                    refresh={refreshRunningPeriode}
                />
                <button
                    type="button"
                    className="settings-btn"
                    onClick={() => setConfirm(true)}
                >
                    Commencer une nouvelle période
                </button>
            </div>
        </SettingsLayout>
    )
}

const SettingsAnnee = () => {
    const { currentUser } = useContext(AuthContext)
    const uid = currentUser ? currentUser.uid : ''
    const [confirm, setConfirm] = useState(false)
    const history = useHistory()
    const { students } = useStudents(uid)
    const { lists } = useLists(uid)
    const db = firebase.firestore()
    if (currentUser === null) return <div />

    const handleDeleteAll = () => {
        const batch = db.batch()

        students.forEach((student) => {
            lists.forEach((l) => {
                const listRef = db
                    .collection('users')
                    .doc(currentUser.uid)
                    .collection('eleves')
                    .doc(student.id)
                    .collection('listes')
                    .doc(l.id.concat('s'))
                batch.delete(listRef)
            })

            const studentRef = db
                .collection('users')
                .doc(currentUser.uid)
                .collection('eleves')
                .doc(student.id)
            batch.delete(studentRef)
        })

        lists.forEach((l) => {
            const listRef = db
                .collection('users')
                .doc(currentUser.uid)
                .collection('lists')
                .doc(l.id)
            batch.delete(listRef)
        })

        batch
            .commit()
            .then(() => {
                db.collection('users')
                    .doc(currentUser.uid)
                    .update({
                        classes: [] as string[],
                        periodes: [new Date()],
                        runningPeriode: 1 as number,
                    })
                history.replace('/')
            })
            .catch((error) => {
                console.error('Erreur lors de la suppression des données: ', error)
            })
    }

    return (
        <SettingsLayout title="Réinitialiser l’année" backTo="/create">
            <ConfirmModal
                confirm={confirm}
                setConfirm={setConfirm}
                confirmAction={handleDeleteAll}
                danger
                textBox="Êtes-vous sûr(e) de vouloir supprimer toutes les données ?"
                subTextBox="En faisant cela, vous supprimez définitivement vos élèves et vos classes"
            />
            <div className="settings-panel">
                <p className="settings-panel-note">
                    Cette action vide vos classes, vos élèves et vos listes. Elle
                    ne peut pas être annulée.
                </p>
                <button
                    type="button"
                    className="settings-btn settings-btn-danger"
                    onClick={() => setConfirm(true)}
                >
                    Supprimer toutes les données
                </button>
            </div>
        </SettingsLayout>
    )
}

export default () => {
    return (
        <Switch>
            <Route path="/create/classe" component={SettingsClasse} />
            <Route path="/create/pronote" component={SettingsPronote} />
            <Route path="/create/eleves" component={SettingsEleves} />
            <Route path="/create/cartes" component={SettingsCartes} />
            <Route path="/create/podium" component={Podium} />
            <Route path="/create/periodes" component={SettingsPeriodes} />
            <Route path="/create/annee" component={SettingsAnnee} />
            <Route path="/create/signaler" component={ReportProblem} />
            <Route path="/create/admin" component={AdminTools} />
            <Route path="/create" component={SettingsMenu} />
        </Switch>
    )
}
