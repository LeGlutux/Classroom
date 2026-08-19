import React, { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../Auth'
import Firebase from '../firebase'
import NavBar from './NavBar'
import NewStudentGroups from './NewStudentGroups'
import { useGroups, useLists, useStudents } from '../hooks'
import { useHistory } from 'react-router-dom'
import { IconChevronLeft, IconClose, IconPlus } from './Icons'
import { ListStatusMark, listStatusClass } from './ListStatusButton'

const ItemRow = ({
    value,
    onChange,
    placeholder,
    inputRef,
    state,
    onCycleState,
    onRemove,
}: {
    value: string
    onChange: (value: string) => void
    placeholder: string
    inputRef: React.RefObject<HTMLInputElement>
    state: number
    onCycleState: () => void
    onRemove?: () => void
}) => (
    <div className="list-item-row">
        {onRemove ? (
            <button
                type="button"
                className="icon-step"
                onClick={onRemove}
                aria-label="Retirer l'item"
            >
                <IconClose />
            </button>
        ) : (
            <span className="list-item-spacer" />
        )}
        <input
            value={value}
            ref={inputRef}
            onChange={(e) => onChange(e.target.value)}
            className="modal-input"
            type="text"
            placeholder={placeholder}
        />
        <button
            type="button"
            className={`list-swatch ${listStatusClass(state)}`}
            onClick={onCycleState}
            aria-label="État par défaut"
        >
            <ListStatusMark state={state} />
        </button>
    </div>
)

export default () => {
    const db = Firebase.firestore()
    const { currentUser } = useContext(AuthContext)
    if (currentUser === null) return <div />
    const lists = useLists(currentUser.uid)
    const history = useHistory()
    const { groups } = useGroups(currentUser.uid)
    const { students } = useStudents(currentUser.uid)
    const [listNameInputValue, setListNameInputValue] = useState('')
    const [defaultList] = useState<string[]>([])
    const [itemN, setItemN] = useState(1)
    const [item1, setItem1] = useState('')
    const [item2, setItem2] = useState('')
    const [item3, setItem3] = useState('')
    const [item4, setItem4] = useState('')
    const [item5, setItem5] = useState('')
    const [defaultValue, setDefaultValue] = useState([0, 0, 0, 0, 0])

    const handleCreateList = (empty: boolean) => {
        const item1IfEmpty = empty ? listNameInputValue : item1
        defaultList.forEach((elem) => {
            const id = Date.now().toString() + (Math.random() * 1000).toString()
            db.collection('users')
                .doc(currentUser.uid)
                .collection('lists')
                .doc(id)
                .set({
                    name: listNameInputValue,
                    id: id,
                    date: new Date(),
                    group: [elem],
                    itemN,
                    items: [item1IfEmpty, item2, item3, item4, item5],
                })
            students
                .filter((s) => s.classes.includes(elem))
                .forEach((s) => {
                    db.collection('users')
                        .doc(currentUser.uid)
                        .collection('eleves')
                        .doc(s.id)
                        .collection('listes')
                        .doc(id.concat('s'))
                        .set({
                            state: defaultValue,
                            id: id.concat('s'),
                        })
                })
        })
    }

    const handleHomeClick = () => {
        localStorage.removeItem('displayedGroup')
    }

    const cycleState = (index: number) => {
        setDefaultValue((previous) => {
            const next = previous.slice()
            next[index] = next[index] >= 3 ? 0 : next[index] + 1
            return next
        })
    }

    const ref1 = useRef<HTMLInputElement>(null)
    const ref2 = useRef<HTMLInputElement>(null)
    const ref3 = useRef<HTMLInputElement>(null)
    const ref4 = useRef<HTMLInputElement>(null)
    const ref5 = useRef<HTMLInputElement>(null)
    const submitButtonRef = useRef<HTMLButtonElement>(null)

    const nextInputRef =
        itemN === 1
            ? ref2
            : itemN === 2
            ? ref3
            : itemN === 3
            ? ref4
            : itemN === 4
            ? ref5
            : submitButtonRef

    const [clickable, setClickable] = useState(false)

    useEffect(() => {
        if (
            lists !== undefined &&
            listNameInputValue !== '' &&
            !(listNameInputValue in lists) &&
            (item1 !== '' || (item1 === '' && itemN === 1)) &&
            !(itemN >= 2 && item2 === '') &&
            !(itemN >= 3 && item3 === '') &&
            !(itemN === 4 && item4 === '')
        ) {
            setClickable(true)
        } else setClickable(false)
    }, [lists, listNameInputValue, item1, itemN, item2, item3, item4])

    const canCreate =
        lists !== undefined &&
        listNameInputValue !== '' &&
        defaultList.length >= 0 &&
        !(listNameInputValue in lists) &&
        (item1 !== '' || (item1 === '' && itemN === 1)) &&
        !(itemN >= 2 && item2 === '') &&
        !(itemN >= 3 && item3 === '') &&
        !(itemN === 4 && item4 === '')

    return (
        <div className="h-screen w-full flex flex-col app-bg overflow-hidden">
            <div className="flex-shrink-0 relative flex flex-row w-full h-12 page-header items-center justify-center">
                <button
                    type="button"
                    className="settings-back"
                    onClick={() => history.goBack()}
                    aria-label="Retour"
                >
                    <IconChevronLeft />
                </button>
                <span className="page-header-title">Créer une liste</span>
            </div>

            <form
                className="flex flex-col flex-1 min-h-0 w-full overflow-y-auto settings-body"
                onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setItemN(1)
                    if (canCreate) {
                        handleCreateList(item1 === '' && itemN === 1)
                    } else {
                        alert("le formulaire n'est pas complet")
                    }
                }}
                action=""
            >
                <div className="settings-panel">
                    <label className="modal-field" style={{ marginTop: 0 }}>
                        <span className="modal-label">Nom de la liste</span>
                        <input
                            value={listNameInputValue}
                            onChange={(e) =>
                                setListNameInputValue(e.target.value)
                            }
                            className="modal-input"
                            type="text"
                            placeholder="Devoirs, participation…"
                        />
                    </label>
                </div>

                <div className="settings-panel">
                    <div className="settings-group-label" style={{ padding: 0 }}>
                        Classes concernées
                    </div>
                    <div className="list-class-chips">
                        {groups.map((value, index) => (
                            <NewStudentGroups
                                list={defaultList}
                                classe={value}
                                key={index}
                            />
                        ))}
                    </div>
                    <p className="settings-panel-note" style={{ marginBottom: 0, marginTop: '0.85rem', textAlign: 'left' }}>
                        Sélectionnez les classes pour lesquelles cette liste
                        sera utilisée.
                    </p>
                </div>

                <div className="settings-panel">
                    <div className="settings-group-label" style={{ padding: 0 }}>
                        Items de la liste
                    </div>
                    {itemN >= 1 && (
                        <ItemRow
                            value={item1}
                            onChange={setItem1}
                            placeholder="Item 1 (ex. Fait, à faire…)"
                            inputRef={ref1}
                            state={defaultValue[0]}
                            onCycleState={() => cycleState(0)}
                        />
                    )}
                    {itemN >= 2 && (
                        <ItemRow
                            value={item2}
                            onChange={setItem2}
                            placeholder="Item 2"
                            inputRef={ref2}
                            state={defaultValue[1]}
                            onCycleState={() => cycleState(1)}
                            onRemove={() => {
                                setItemN(itemN - 1)
                                setItem2('')
                            }}
                        />
                    )}
                    {itemN >= 3 && (
                        <ItemRow
                            value={item3}
                            onChange={setItem3}
                            placeholder="Item 3"
                            inputRef={ref3}
                            state={defaultValue[2]}
                            onCycleState={() => cycleState(2)}
                            onRemove={() => {
                                setItemN(itemN - 1)
                                setItem3('')
                            }}
                        />
                    )}
                    {itemN >= 4 && (
                        <ItemRow
                            value={item4}
                            onChange={setItem4}
                            placeholder="Item 4"
                            inputRef={ref4}
                            state={defaultValue[3]}
                            onCycleState={() => cycleState(3)}
                            onRemove={() => {
                                setItemN(itemN - 1)
                                setItem4('')
                            }}
                        />
                    )}
                    {itemN === 5 && (
                        <ItemRow
                            value={item5}
                            onChange={setItem5}
                            placeholder="Item 5"
                            inputRef={ref5}
                            state={defaultValue[4]}
                            onCycleState={() => cycleState(4)}
                            onRemove={() => {
                                setItemN(itemN - 1)
                                setItem5('')
                            }}
                        />
                    )}
                    {itemN < 5 && (
                        <button
                            type="button"
                            className="list-add-item"
                            onClick={() => {
                                if (itemN <= 5) setItemN(itemN + 1)
                                setTimeout(
                                    () => nextInputRef.current!.focus(),
                                    10
                                )
                            }}
                        >
                            <IconPlus />
                            Ajouter un item
                        </button>
                    )}
                </div>

                <div className="settings-panel">
                    <button
                        type="submit"
                        ref={submitButtonRef}
                        onClick={() => {
                            if (clickable) history.goBack()
                        }}
                        className={`settings-btn ${
                            clickable ? '' : 'is-disabled'
                        }`}
                        style={{ marginTop: 0 }}
                    >
                        Créer la liste
                    </button>
                </div>
            </form>
            <div className="flex-shrink-0 w-full h-12 nav-wrap">
                <NavBar activeMenu="list" onHomeClick={handleHomeClick} />
            </div>
        </div>
    )
}
