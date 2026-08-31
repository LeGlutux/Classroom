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

export const IconCheck: React.FC<IconProps> = (props) => (
    <Svg {...props}>
        <path d="M5.5 12.2l4.2 4.2L18.5 7.6" />
    </Svg>
)

export const IconClose: React.FC<IconProps> = (props) => (
    <Svg {...props}>
        <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
    </Svg>
)

export const IconQuestion: React.FC<IconProps> = (props) => (
    <Svg {...props}>
        <path d="M9.4 9.2a2.7 2.7 0 1 1 3.4 2.55c-.75.4-1.3.9-1.3 1.85" />
        <path d="M11.5 17.2h1" />
    </Svg>
)

export const IconFlag: React.FC<IconProps> = (props) => (
    <Svg {...props}>
        <path d="M6 4.5v15" />
        <path d="M6 5.2h10.5l-1.6 3.4 1.6 3.4H6" />
    </Svg>
)

export const IconWrench: React.FC<IconProps> = (props) => (
    <Svg {...props}>
        <path d="M14.7 6.3a3.4 3.4 0 0 0-4.7 4.7L5.2 15.8a1.5 1.5 0 0 0 2.1 2.1l4.8-4.8a3.4 3.4 0 0 0 4.7-4.7L15.2 10l-1.5-1.5 1-2.2z" />
    </Svg>
)

export const IconDownload: React.FC<IconProps> = (props) => (
    <Svg {...props}>
        <path d="M12 4v11" />
        <path d="M8 11l4 4 4-4" />
        <path d="M5 19h14" />
    </Svg>
)

export const IconMail: React.FC<IconProps> = (props) => (
    <Svg {...props}>
        <rect x="3.5" y="5.5" width="17" height="13" rx="1.6" />
        <path d="M4.2 7.2L12 13.2l7.8-6" />
    </Svg>
)

export const IconLock: React.FC<IconProps> = (props) => (
    <Svg {...props}>
        <rect x="6.2" y="10.5" width="11.6" height="8.5" rx="1.4" />
        <path d="M8.4 10.5V8.4a3.6 3.6 0 0 1 7.2 0v2.1" />
    </Svg>
)

export const IconUnlock: React.FC<IconProps> = (props) => (
    <Svg {...props}>
        <rect x="6.2" y="10.5" width="11.6" height="8.5" rx="1.4" />
        <path d="M8.4 10.5V8.2a3.6 3.6 0 0 1 6.85-1.65" />
    </Svg>
)

export const IconNote: React.FC<IconProps> = (props) => (
    <Svg {...props}>
        <path d="M7.2 5.2h7.1L17.8 8.7v9.1a1.3 1.3 0 0 1-1.3 1.3H7.2A1.3 1.3 0 0 1 5.9 17.8V6.5A1.3 1.3 0 0 1 7.2 5.2z" />
        <path d="M14.3 5.2v3.5h3.5" />
        <path d="M8.6 12.2h6.2M8.6 15.3h4" />
    </Svg>
)

export const IconChat: React.FC<IconProps> = (props) => (
    <Svg {...props}>
        <path d="M5.2 6.2h13.6A1.6 1.6 0 0 1 20.4 7.8v7.4a1.6 1.6 0 0 1-1.6 1.6H11L7 19.6v-2.8H5.2A1.6 1.6 0 0 1 3.6 15.2V7.8A1.6 1.6 0 0 1 5.2 6.2z" />
        <path d="M8 10.4h8M8 13.2h5" />
    </Svg>
)

export const IconPlay: React.FC<IconProps> = (props) => (
    <Svg {...props}>
        <circle cx="12" cy="12" r="8.25" />
        <path d="M10.2 8.8v6.4L16.2 12z" />
    </Svg>
)

export const IconSearch: React.FC<IconProps> = (props) => (
    <Svg {...props}>
        <circle cx="11" cy="11" r="6.25" />
        <path d="M16.2 16.2L20 20" />
    </Svg>
)
