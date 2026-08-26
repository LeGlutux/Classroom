import React, { useState, useRef, useEffect } from 'react'
import Firebase from '../../firebase'
import NewStudentGroups from '../NewStudentGroups'
import { useLists } from '../../hooks'
import { titleCasePersonName } from '../../utils/names'

interface Props {
    groups: string[]
    currentUserId: string
}

export default (props: Props) => {
    const [list] = useState<string[]>([])
    const db = Firebase.firestore()
    const [nameInputValue, setNameInputValue] = useState('')
    const [surnameInputValue, setSurnameInputValue] = useState('')
    const { lists } = useLists(props.currentUserId)
    const firstInputRef = useRef<HTMLInputElement>(null)

    const [clickable, setClickable] = useState(false)

    useEffect(() => {
        if (nameInputValue !== '' && surnameInputValue !== '') {
            setClickable(true)
        } else setClickable(false)
    }, [nameInputValue, surnameInputValue])

    return (
        <form
            className="flex flex-col w-full bg-transparent"
            onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (
                    nameInputValue !== '' &&
                    surnameInputValue !== '' &&
                    list.length === 1
                ) {
                    const id = Date.now().toString()
                    const nameCased = titleCasePersonName(nameInputValue)
                    const surnameCased = titleCasePersonName(surnameInputValue)
                    db.collection('users')
                        .doc(props.currentUserId)
                        .collection('eleves')
                        .doc(id)
                        .set({
                            name: nameCased,
                            surname: surnameCased,
                            classes: list,
                            id,
                            highlight: false,
                            selected: false,
                            crosses: [] as string[],
                            notes: '',
                        })

                    lists.forEach((l) => {
                        if (l.group.includes(list[0])) {
                            db.collection('users')
                                .doc(props.currentUserId)
                                .collection('eleves')
                                .doc(id)
                                .collection('listes')
                                .doc(l.id.concat('s'))
                                .set({
                                    state: [0, 0, 0, 0],
                                    id: l.id.concat('s'),
                                })
                        }
                    })
                    setNameInputValue('')
                    setSurnameInputValue('')

                    firstInputRef.current!.focus()
                } else {
                    if (list.length !== 1)
                        alert('Il faut selectionner une classe !')
                    else alert("Le formulaire n'est pas complet !")
                }
            }}
            action=""
        >
            <label className="modal-field" style={{ marginTop: 0 }}>
                <span className="modal-label">Prénom</span>
                <input
                    ref={firstInputRef}
                    value={surnameInputValue}
                    onChange={(e) => setSurnameInputValue(e.target.value)}
                    className="modal-input"
                    type="text"
                    placeholder="Prénom de l'élève"
                />
            </label>
            <label className="modal-field">
                <span className="modal-label">Nom</span>
                <input
                    className="modal-input"
                    value={nameInputValue}
                    onChange={(e) => setNameInputValue(e.target.value)}
                    type="text"
                    placeholder="Nom de l'élève"
                />
            </label>
            <div className="modal-field">
                <span className="modal-label">Classe</span>
                <div className="list-class-chips">
                    {props.groups.map((value, index) => (
                        <NewStudentGroups
                            list={list}
                            classe={value}
                            key={index}
                        />
                    ))}
                </div>
            </div>
            <button
                type="submit"
                className={`settings-btn ${clickable ? '' : 'is-disabled'}`}
            >
                Ajouter l'élève
            </button>
        </form>
    )
}
