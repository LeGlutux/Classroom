import React from 'react'

type IconProps = React.SVGProps<SVGSVGElement>

const Svg: React.FC<IconProps> = ({ children, className, ...props }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={className || 'tn-icon'}
        {...props}
    >
        {children}
    </svg>
)

export const IconUser: React.FC<IconProps> = (props) => (
    <Svg {...props}>
        <circle cx="12" cy="8" r="3.25" />
        <path d="M5.5 19a6.5 6.5 0 0 1 13 0" />
    </Svg>
)

export const IconUsers: React.FC<IconProps> = (props) => (
    <Svg {...props}>
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
        <circle cx="17" cy="9" r="2.4" />
        <path d="M16 19a4.8 4.8 0 0 1 4.5-4.6" />
    </Svg>
)

export const IconCalendar: React.FC<IconProps> = (props) => (
    <Svg {...props}>
        <rect x="4" y="5.5" width="16" height="14.5" rx="1.5" />
        <path d="M8 3.5v4M16 3.5v4M4 10h16" />
    </Svg>
)

export const IconPlus: React.FC<IconProps> = (props) => (
    <Svg {...props}>
        <path d="M12 5v14M5 12h14" />
    </Svg>
)

export const IconMinus: React.FC<IconProps> = (props) => (
    <Svg {...props}>
        <path d="M5 12h14" />
    </Svg>
)

export const IconChevronRight: React.FC<IconProps> = (props) => (
    <Svg {...props}>
        <path d="M9 6l6 6-6 6" />
    </Svg>
)

export const IconChevronLeft: React.FC<IconProps> = (props) => (
    <Svg {...props}>
        <path d="M15 6l-6 6 6 6" />
    </Svg>
)

export const IconLogout: React.FC<IconProps> = (props) => (
    <Svg {...props}>
        <path d="M9 7V5.8A1.8 1.8 0 0 1 10.8 4h8.4A1.8 1.8 0 0 1 21 5.8v12.4a1.8 1.8 0 0 1-1.8 1.8h-8.4A1.8 1.8 0 0 1 9 18.2V17" />
        <path d="M4 12h11M12 9l3 3-3 3" />
    </Svg>
)

export const IconGrid: React.FC<IconProps> = (props) => (
    <Svg {...props}>
        <rect x="4" y="4" width="7" height="7" rx="1.2" />
        <rect x="13" y="4" width="7" height="7" rx="1.2" />
        <rect x="4" y="13" width="7" height="7" rx="1.2" />
        <rect x="13" y="13" width="7" height="7" rx="1.2" />
    </Svg>
)

export const IconTrash: React.FC<IconProps> = (props) => (
    <Svg {...props}>
        <path d="M5 7h14M9.5 7V5.6A1.1 1.1 0 0 1 10.6 4.5h2.8A1.1 1.1 0 0 1 14.5 5.6V7M8.5 7l.7 12h5.6l.7-12" />
    </Svg>
)

export const IconUpload: React.FC<IconProps> = (props) => (
    <Svg {...props}>
        <path d="M12 16V7M8.5 10.5L12 7l3.5 3.5M5 19h14" />
    </Svg>
)

export const IconTrophy: React.FC<IconProps> = (props) => (
    <Svg {...props}>
        <path d="M8 4h8v4.2a4 4 0 0 1-8 0V4z" />
        <path d="M8 5.5H5.2A2.2 2.2 0 0 0 7.4 8.2" />
        <path d="M16 5.5h2.8A2.2 2.2 0 0 1 16.6 8.2" />
        <path d="M12 12.2v3.3" />
        <path d="M9 20h6M10 16h4v4h-4z" />
    </Svg>
)
