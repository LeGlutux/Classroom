import React, { useEffect, useState } from 'react'
import Papa from 'papaparse'
import { isUpperCase } from './Tools/Strings'
import Firebase from 'firebase'

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
        const id = Math.random().toString(36).substring(2, 9)
        const words = s.split(' ')
        const nameArray = [] as string[]
        const surnameArray = [] as string[]
        words.forEach((w) => {
            const lowerCased = w.toLowerCase()
            const cased = lowerCased.replace(/\b\w/g, (c) => c.toUpperCase())
            const debuggedCased1 =
                cased.indexOf('É') === -1
                    ? cased
                    : cased.substring(0, 1).toUpperCase() +
                      cased.substring(1, cased.indexOf('É')) +
                      'é' +
                      cased.substring(cased.indexOf('É') + 1)
            const debuggedCased =
                debuggedCased1.indexOf('È') === -1
                    ? debuggedCased1
                    : debuggedCased1.substring(0, 1).toUpperCase() +
                      debuggedCased1.substring(1, debuggedCased1.indexOf('È')) +
                      'è' +
                      debuggedCased1.substring(debuggedCased1.indexOf('è') + 1)
            isUpperCase(w)
                ? nameArray.push(debuggedCased)
                : surnameArray.push(debuggedCased)
        })

        const name = nameArray.join(' ')
        const surname = surnameArray.join(' ')
        return { name, surname, id }
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
                classes: Firebase.firestore.FieldValue.arrayUnion(classe),
            })
    }

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return {}
        Papa.parse(e.target.files[0], {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const students = [] as {
                    surname: string
                    name: string
                    id: string
                    pap: string
                }[]
                results.data.forEach((d) => {
                    const data = d as {
                        Élève: string
                        Sexe: string
                        ["Projet d'accompagnement"]: string
                    }
                    const pap = data["Projet d'accompagnement"]
                        ? data["Projet d'accompagnement"]
                        : ''
                    const student = Object.assign(splitter(data.Élève), { pap })
                    students.push(student)
                })
                setStudents(students)
            },
        })
    }
    return (
        <div className="flex flex-col h-full items-center">
            <div className="font-title text-3xl">Importer</div>
            <div className="font-student italic text-sm text-gray-500">
                fichiers acceptés : xlsx, csv
            </div>
            <input
                value={classe}
                onChange={(e) => setClasse(e.target.value)}
                className="h-10 w-10/12 z-50 placeholder-gray-700 my-2 bg-transparent border-b-2 border-gray-600 text-lg xl:text-center"
                type="text"
                placeholder="Nom de la classe"
            />

            <input
                className="my-6 w-48"
                type="file"
                name="file"
                accept=".csv"
                onChange={changeHandler}
                style={{ display: 'block' }}
            />

            <button
                className={`flex h-12 w-40 self-center pt-2 mt-6 rounded  text-lg font-bold justify-center
                ${
                    clickable
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-300 text-gray-100 pointer-events-none'
                }`}
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
