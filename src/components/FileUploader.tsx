import React, { useEffect, useState } from 'react'
import Papa from 'papaparse'
import Firebase from '../firebase'
import firebase from 'firebase/app'

interface FileUploaderProps {
    currentUserId: string
    setSaveConfirm: React.Dispatch<React.SetStateAction<boolean>>
}

export default (props: FileUploaderProps) => {
    const [students, setStudents] = useState<
        { surname: string; name: string; id: string; pap: string }[]
    >([])
    const [clickable, setClickable] = useState(false)
    const [classe, setClasse] = useState('')
    const db = Firebase.firestore()

    useEffect(() => {
        if (classe !== '' && students.length !== 0) {
            setClickable(true)
        } else setClickable(false)
    }, [classe, students])

    const splitter = (s: string) => {
        const id = Math.random().toString(36).substring(2, 9);
        const words = s.split(' ');
        const nameArray = [] as string[];
        const surnameArray = [] as string[];
    
        words.forEach((w) => {
            const lowerCased = w.toLowerCase();
            // Transforme correctement la première lettre en majuscule, même pour les lettres accentuées
            const cased = lowerCased.charAt(0).toUpperCase() + lowerCased.slice(1);
            
            // Place le mot dans le bon tableau
            if (isUpperCase(w)) {
                nameArray.push(cased);
            } else {
                surnameArray.push(cased);
            }
        });
    
        const name = nameArray.join(' ');
        const surname = surnameArray.join(' ');
        return { name, surname, id };
    }
    
    // Fonction pour vérifier si une chaîne est en majuscule
    const isUpperCase = (str: string) => {
        return str === str.toUpperCase();
    }

    const handleSave = (
        students: { surname: string; id: string; name: string; pap: string }[]
    ) => {
        students.forEach((s) => {
            db.collection('users')
                .doc(props.currentUserId)
                .collection('eleves')
                .doc(s.id)
                .set({
                    name: s.name,
                    surname: s.surname,
                    classes: classe,
                    id: s.id,
                    highlight: false,
                    selected: false,
                    crosses: [] as string[],
                    comment: s.pap,
                    notes: '',
                })
        })
        db.collection('users')
            .doc(props.currentUserId)
            .update({
                classes: firebase.firestore.FieldValue.arrayUnion(classe),
            })
    }

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return
        
        const file = e.target.files[0]
        const fileName = file.name.toLowerCase()
        
        // Vérifie que c'est un fichier CSV
        if (!fileName.endsWith('.csv')) {
            alert('Seuls les fichiers CSV sont supportés. Veuillez exporter votre fichier depuis Pronote en format CSV.')
            setStudents([])
            return
        }
        
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            delimiter: ';', // Pronote utilise le point-virgule comme séparateur
            encoding: 'UTF-8',
            transformHeader: (header, index) => {
                // Normalise les en-têtes pour gérer les variations et colonnes vides
                const trimmedHeader = header.trim()
                if (trimmedHeader === 'Élèves' || trimmedHeader === 'Élève') return 'Élève'
                // Si l'en-tête est vide, utilise un nom générique
                if (!trimmedHeader || trimmedHeader === '') return `Colonne_${index}`
                return trimmedHeader
            },
            complete: (results) => {
                const students = [] as {
                    surname: string
                    name: string
                    id: string
                    pap: string
                }[]
                
                if (results.errors && results.errors.length > 0) {
                    console.error('Erreurs de parsing CSV:', results.errors)
                }
                
                results.data.forEach((d) => {
                    const data = d as any
                    
                    // Cherche la colonne des élèves (peut être "Élève" ou "Élèves")
                    const eleveName = data['Élève'] || data['Élèves'] || ''
                    
                    if (!eleveName || eleveName.trim() === '') {
                        return // Ignore les lignes sans nom d'élève
                    }
                    
                    // Cherche les informations PAP/PPS dans toutes les colonnes
                    let pap = ''
                    const papKeywords = ['PAP', 'PPS', 'PAI', 'mdph', 'bilan']
                    
                    // Parcourt toutes les colonnes pour trouver les informations PAP/PPS
                    Object.keys(data).forEach((key) => {
                        const value = data[key]
                        if (value && typeof value === 'string' && value.trim() !== '') {
                            const lowerValue = value.toLowerCase()
                            if (papKeywords.some(keyword => lowerValue.includes(keyword.toLowerCase()))) {
                                if (pap) {
                                    pap += ', ' + value.trim()
                                } else {
                                    pap = value.trim()
                                }
                            }
                        }
                    })
                    
                    const student = Object.assign(splitter(eleveName), { pap })
                    students.push(student)
                })
                
                if (students.length > 0) {
                    setStudents(students)
                } else {
                    console.error('Aucun élève trouvé dans le fichier CSV')
                    alert('Erreur : Aucun élève trouvé dans le fichier. Vérifiez que le fichier est au format Pronote avec la colonne "Élèves".')
                }
            },
            error: (error) => {
                console.error('Erreur lors du parsing du fichier:', error)
                alert('Erreur lors de la lecture du fichier CSV. Vérifiez que le fichier est valide.')
                setStudents([])
            }
        })
    }
    return (
        <div className="flex flex-col h-full items-center">
            <div className="settings-title">Importer</div>
            <div className="empty-state-text">
                Fichiers acceptés : csv (export Pronote)
            </div>
            <div className="field my-2">
                <input
                    value={classe}
                    onChange={(e) => setClasse(e.target.value)}
                    className="field-input"
                    type="text"
                    placeholder="Nom de la classe"
                />
            </div>

            <input
                className="file-input my-6"
                type="file"
                name="file"
                accept=".csv,.xlsx,.xls"
                onChange={changeHandler}
            />

            <button
                className={clickable ? 'btn-primary' : 'btn-disabled'}
                onClick={() => {
                    handleSave(students)
                    setClasse('')
                    props.setSaveConfirm(true)
                    setStudents([])
                }}
            >
                Ajouter le groupe
            </button>
        </div>
    )
}
