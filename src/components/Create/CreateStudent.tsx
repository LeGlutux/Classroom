import React, { useState, useRef, useEffect } from 'react'
import solo from '../../images/solo.png'
import Firebase from '../../firebase'
import NewStudentGroups from '../NewStudentGroups'
import ok from '../../images/ok.png'
import { useLists } from '../../hooks'

interface Props {
    groups: string[]
    currentUserId: string
}

export default (props: Props) => {
    const [sent, setSent] = useState(false)
    const [list, setList] = useState<string[]>([])
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
        <div className="flex flex-col">
            <div
                className={`absolute sm:ok-position2 w-10 h-10 ${
                    sent ? 'fade-out' : 'invisible'
                }`}
            >
                <img src={ok} alt="ok" />
            </div>
            <form
                className="flex flex-col w-full h-full bg-transparent mt-5"
                onSubmit={(e) => {
                    if (
                        nameInputValue !== '' &&
                        surnameInputValue !== '' &&
                        list.length === 1
                    ) {
                        const id = Date.now().toString()
                        const nameCased = nameInputValue.replace(/\b\w/g, (c) =>
                            c.toUpperCase()
                        )

                        const surnameCased = surnameInputValue.replace(
                            /\b\w/g,
                            (c) => c.toUpperCase()
                        )
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
                        setList(list)
                        setSent(true)
                        setTimeout(() => setSent(false), 1000)
                        clearTimeout()
                    } else {
                        if (list.length !== 1)
                            alert('Il faut selectionner une classe !')
                        else alert("Le formulaire n'est pas complet !")
                    }

                    e.preventDefault()
                    e.stopPropagation()
                }}
                action=""
            >
                <div className="flex flex-col h-full items-center pb-4">
                    <div className="flex flex-col h-full justify-around items-center w-full">
                        <div className="settings-title">
                            Ajoutez vos élèves
                        </div>
                        <div className="field">
                            <img src={solo} alt="" />
                            <input
                                ref={firstInputRef}
                                value={surnameInputValue}
                                onChange={(e) =>
                                    setSurnameInputValue(e.target.value)
                                }
                                className="field-input"
                                type="text"
                                placeholder="Prénom de l'élève"
                            />
                        </div>
                        <div className="field" style={{ marginTop: '0.6rem' }}>
                            <input
                                className="field-input"
                                value={nameInputValue}
                                onChange={(e) =>
                                    setNameInputValue(e.target.value)
                                }
                                type="text"
                                placeholder="Nom de l'élève"
                            />
                        </div>

                        <div className="w-full flex flex-wrap flex-row justify-evenly mx-1 mt-6 px-2">
                            {props.groups.map((value, index) => {
                                return (
                                    <NewStudentGroups
                                        list={list}
                                        classe={value}
                                        key={index}
                                    />
                                )
                            })}
                        </div>
                        <div
                            className={`btn-disabled mt-6 ${
                                clickable ? 'hidden' : 'visible'
                            }`}
                        >
                            Ajouter l'élève
                        </div>
                        <button
                            type="submit"
                            className={`btn-primary mt-6 ${
                                clickable ? 'visible' : 'hidden'
                            }`}
                        >
                            Ajouter l'élève
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}
