import React, { useEffect, useState } from 'react'
import Firebase from '../firebase'
import firebase from 'firebase/app'
import { parsePronoteCsv, PronoteStudent } from '../utils/pronoteImport'

interface FileUploaderProps {
    currentUserId: string
    setSaveConfirm: React.Dispatch<React.SetStateAction<boolean>>
}

export default (props: FileUploaderProps) => {
    const [students, setStudents] = useState<PronoteStudent[]>([])
    const [clickable, setClickable] = useState(false)
    const [classe, setClasse] = useState('')
    const db = Firebase.firestore()

    useEffect(() => {
        const hasClass =
            classe.trim() !== '' ||
            students.some((student) => student.classe.trim() !== '')
        setClickable(students.length !== 0 && hasClass)
    }, [classe, students])

    const handleSave = (rows: PronoteStudent[]) => {
        const classesToAdd: string[] = []
        rows.forEach((s) => {
            const studentClass = classe.trim() || s.classe.trim()
            if (!studentClass) return
            if (classesToAdd.indexOf(studentClass) === -1) {
                classesToAdd.push(studentClass)
            }
            db.collection('users')
                .doc(props.currentUserId)
                .collection('eleves')
                .doc(s.id)
                .set({
                    name: s.name,
                    surname: s.surname,
                    classes: studentClass,
                    id: s.id,
                    highlight: false,
                    selected: false,
                    crosses: [] as string[],
                    comment: s.pap,
                    notes: '',
                })
        })
        classesToAdd.forEach((group) => {
            db.collection('users')
                .doc(props.currentUserId)
                .update({
                    classes: firebase.firestore.FieldValue.arrayUnion(group),
                })
        })
    }

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return

        const file = e.target.files[0]
        const fileName = file.name.toLowerCase()

        if (!fileName.endsWith('.csv') && !fileName.endsWith('.txt')) {
            alert(
                'Seuls les fichiers CSV sont supportés. Exportez depuis Pronote en CSV.'
            )
            setStudents([])
            return
        }

        const applyParsed = (text: string) => {
            try {
                const parsed = parsePronoteCsv(text)
                if (parsed.length > 0) {
                    setStudents(parsed)
                    return true
                }
            } catch (error) {
                console.error(error)
            }
            return false
        }

        const reader = new FileReader()
        reader.onload = () => {
            const text = String(reader.result || '')
            if (applyParsed(text)) return
            const latin = new FileReader()
            latin.onload = () => {
                if (applyParsed(String(latin.result || ''))) return
                alert(
                    'Aucun élève trouvé. Vérifiez que le fichier CSV contient bien les noms (et si possible les classes).'
                )
                setStudents([])
            }
            latin.onerror = () => {
                alert('Erreur lors de la lecture du fichier CSV.')
                setStudents([])
            }
            latin.readAsText(file, 'windows-1252')
        }
        reader.onerror = () => {
            alert('Erreur lors de la lecture du fichier CSV.')
            setStudents([])
        }
        reader.readAsText(file, 'UTF-8')
    }

    const classHint = (() => {
        const fromFile = Array.from(
            new Set(
                students
                    .map((student) => student.classe.trim())
                    .filter(Boolean)
            )
        )
        if (students.length === 0) return ''
        if (fromFile.length === 0) return 'Aucune classe détectée dans le fichier.'
        return (
            students.length +
            ' élève' +
            (students.length > 1 ? 's' : '') +
            ' · ' +
            fromFile.join(', ')
        )
    })()

    return (
        <div className="flex flex-col">
            <label className="modal-field" style={{ marginTop: 0 }}>
                <span className="modal-label">Nom de la classe (optionnel)</span>
                <input
                    value={classe}
                    onChange={(e) => setClasse(e.target.value)}
                    className="modal-input"
                    type="text"
                    placeholder="Si vide, les classes du fichier sont utilisées"
                />
            </label>
            <label className="file-pick">
                <span className="modal-label">Fichier Pronote</span>
                <input
                    type="file"
                    name="file"
                    accept=".csv,.txt"
                    onChange={changeHandler}
                />
                <span className="file-pick-btn">
                    {students.length > 0
                        ? students.length + ' élèves prêts'
                        : 'Choisir un fichier CSV'}
                </span>
            </label>
            <p className="settings-panel-note" style={{ textAlign: 'left' }}>
                {classHint ||
                    'Export Pronote en CSV (ou « Enregistrer sous » depuis Excel). L’import repère nom, prénom, classe et aménagements même si les colonnes bougent.'}
            </p>
            <button
                type="button"
                className={`settings-btn ${clickable ? '' : 'is-disabled'}`}
                onClick={() => {
                    handleSave(students)
                    setClasse('')
                    props.setSaveConfirm(true)
                    setStudents([])
                }}
            >
                Importer
            </button>
        </div>
    )
}
