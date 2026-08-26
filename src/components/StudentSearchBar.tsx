import React from 'react'
import { IconClose, IconSearch } from './Icons'

interface StudentSearchBarProps {
    value: string
    onChange: (value: string) => void
    onFocus?: () => void
    onBlur?: () => void
}

const StudentSearchBar = ({
    value,
    onChange,
    onFocus,
    onBlur,
}: StudentSearchBarProps) => (
    <form
        className="student-search"
        action=""
        onSubmit={(event) => {
            event.preventDefault()
        }}
    >
        <span className="student-search-icon" aria-hidden="true">
            <IconSearch />
        </span>
        <input
            className="student-search-input"
            type="search"
            inputMode="search"
            enterKeyHint="search"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            placeholder="Rechercher un élève"
            aria-label="Rechercher un élève"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
        />
        {value ? (
            <button
                type="button"
                className="student-search-clear"
                aria-label="Effacer la recherche"
                onClick={() => onChange('')}
            >
                <IconClose />
            </button>
        ) : null}
    </form>
)

export default StudentSearchBar
