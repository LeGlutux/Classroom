import React, { useContext } from 'react'
import Student from '../components/Student'
import ClassListFilter from '../components/ClassListFilter'
import NavBar from './NavBar'
import { useGroups, useStudents, useRunningPeriode, useNewbie } from '../hooks'
import { AuthContext } from '../Auth'
import 'firebase/firestore'
import addPage from '../images/addPage.png'

export default () => {
    const { currentUser } = useContext(AuthContext)
    if (currentUser === null) return <div />
    const newbie = useNewbie(currentUser.uid)
    const { students, filterStudents } = useStudents(currentUser.uid)
    const { groups } = useGroups(currentUser.uid)
    const { runningPeriode } = useRunningPeriode(currentUser.uid)

    if (newbie === 0) {
        return (
            <div className="w-full h-full flex flex-col">
                <div className="h-24">
                    <NavBar />
                </div>
                <div className="flex w-full h-full flex-col bg-white overflow-y-scroll justify-around items-center">
                    <div className="font-studentName text-justify mx-4 font-bold">
                        Bienvenue sur Thòt Note, ton cahier de classe en ligne.
                        Pour commencer il faut ajouter tes classes et tes
                        élèves.
                    </div>
                    <div className="flex flex-row items-center">
                        <img className="w-16 h-16 ml-4" src={addPage} alt="" />
                        <div className="font-studentName text-justify mx-4">
                            Ici tu trouveras le menu pour ajouter des classes et
                            des élèves. Tu pourras également créer une nouvelle
                            période lorsque la période en cours sera terminée.
                            Attention, dans ce cas là tu ne pourras plus revenir
                            en arrière !
                        </div>
                    </div>
                    <div className="flex flex-row items-center">
                        <div className="flex flex-col align-text-top mb-6 ml-4">
                            <div className="h-8 text-4xl font-title">Thòt</div>
                            <div className="ml-6 h-6 text-4xl font-title">
                                Note
                            </div>
                        </div>
                        <div className="font-studentName text-justify mx-4">
                            Ce bouton te permettra de revenir sur la page
                            d'accueil sur laquelle tu trouveras ta liste
                            d'élève.
                        </div>
                    </div>
                    <div className="font-studentName text-justify mx-4">
                        En bas se trouve la barre des classes, à gauche tu peux
                        cliquer sur la classe que tu souhaites afficher (par
                        défaut tous les élèves s'affichent). À droite tu peux
                        voir la période que tu es en train de consulter.
                    </div>
                </div>
                <div className="w-full h-12 bg-gray-300 table-footer-group">
                    <div className="ml-3 pt-2 font-bold text-xl flex justify-between align-top">
                        <div className="overflow-x-scroll flex flex-">
                            <div className="font-studentName h-8 mb-2 mx-2 bg-gray-100 w-auto text-center rounded-lg px-3 flex items-center">
                                5e3
                            </div>
                            <div className="font-studentName h-8 mb-2 mx-2 bg-gray-100 w-auto text-center rounded-lg px-3 flex items-center">
                                5e4
                            </div>
                        </div>

                        <div className="mr-6 text-gray-700 rounded">P3</div>
                    </div>
                </div>
            </div>
        )
    }

    if (newbie === 1) {
        return (
            <div className="w-full h-screen flex flex-col">
                <div className="h-24">
                    <NavBar />
                </div>
                <div className="flex w-full h-full flex-col bg-white overflow-y-scroll">
                    <div className="flex flex-row mt-8">
                        <div className="font-studentName text-justify mx-4 flex flex-row flex-wrap">
                            Tu dois maintenant ajouter des élèves à une de tes
                            classes en allant dans le menu
                            <img
                                className="w-8 h-8 ml-4"
                                src={addPage}
                                alt=""
                            />
                            Pense à mettre un prénom, un nom et à cocher une (et
                            une seule classe) pour ton élève.
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full h-screen flex flex-col">
            <div className="h-24">
                <NavBar />
            </div>

            <div className="flex w-full h-full flex-col bg-white overflow-y-scroll xl:flex-row xl:flex-wrap xl:content-start">
                {students.map(({ name, surname, classes, id }) => {
                    return (
                        <Student
                            key={id}
                            classes={classes}
                            name={name}
                            surname={surname}
                            id={id}
                        />
                    )
                })}
            </div>
            <div className="w-full h-12 bg-gray-300 table-footer-group">
                <div className="ml-3 pt-2 font-bold text-xl flex justify-between align-top">
                    <div className="overflow-x-scroll">
                        <ClassListFilter
                            onFilter={(group) => {
                                filterStudents(group)
                            }}
                            groups={groups}
                        />
                    </div>

                    <div className="mr-6 text-gray-700 rounded">
                        {'P'.concat(runningPeriode.toString())}
                    </div>
                </div>
            </div>
        </div>
    )
}
