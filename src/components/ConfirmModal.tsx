import React from 'react'

interface ConfirmModalProps {
    confirm: boolean
    confirmAction: () => void
}

export default ({ confirm, confirmAction }: ConfirmModalProps) => {
    return (
        <div
            className={`flex flex-col z-50 fixed w-full h-full items-center justify-center ${
                confirm ? 'visible' : 'invisble'
            }`}
            style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}
        >
            <div className="flex flex-col border-black bg-white shadow-lg justify-center items-center w-3/4 h-100 relative">
                <span className="absolute top-0 right-0 p-4">
                    <svg
                        className="h-12 w-12 fill-current text-grey hover:text-grey-darkest"
                        role="button"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                    >
                        <title>Close</title>
                        <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                    </svg>
                </span>
                <div className="text-3xl">
                    Êtes-vous sûr(e) de vouloir supprimer l'élève ?
                </div>

                <div className="flex flex-row w-full justify-around mt-16">
                    <button
                        className="bg-red-700 rounded-lg w-32 h-16 shadow-xl text-2xl text-bold font-studentName"
                        onClick={() => {
                            confirm = false
                        }}
                    >
                        Annuler
                    </button>
                    <button
                        className="bg-green-700 rounded-lg w-32 h-16 shadow-xl text-2xl text-bold font-studentName"
                        onClick={() => {
                            confirm = false
                            confirmAction()
                        }}
                    >
                        Confirmer
                    </button>
                </div>
            </div>
        </div>
    )
}
