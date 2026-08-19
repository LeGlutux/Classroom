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
        className={className || 'icon'}
        {...props}
    >
        {children}
    </svg>
)

export const IconMenu: React.FC<IconProps> = (props) => (
    <Svg {...props}>
        <path d="M4 7h16M4 12h16M4 17h16" />
    </Svg>
)

export const IconShuffle: React.FC<IconProps> = (props) => (
    <Svg {...props}>
        <path d="M16 3h5v5" />
        <path d="M4 20l7-7" />
        <path d="M21 8l-7 7" />
        <path d="M16 21h5v-5" />
        <path d="M15 4l6 4" />
        <path d="M4 4l5 5" />
    </Svg>
)

export const IconBrain: React.FC<IconProps> = (props) => (
    <Svg {...props}>
        <path d="M9.5 8a2.5 2.5 0 1 1 2.5-2.5V17" />
        <path d="M14.5 8A2.5 2.5 0 1 0 12 5.5V17" />
        <path d="M8 12a3 3 0 0 0-3 3c0 2 1.5 3.5 3.5 3.5H12" />
        <path d="M16 12a3 3 0 0 1 3 3c0 2-1.5 3.5-3.5 3.5H12" />
    </Svg>
)

export const IconNote: React.FC<IconProps> = (props) => (
    <Svg {...props}>
        <path d="M8 3h8a2 2 0 0 1 2 2v11l-4 4H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
        <path d="M14 20v-4h4" />
        <path d="M9 8h6M9 12h4" />
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

export const IconMail: React.FC<IconProps> = (props) => (
    <Svg {...props}>
        <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
        <path d="M4 7l8 6 8-6" />
    </Svg>
)

export const IconLock: React.FC<IconProps> = (props) => (
    <Svg {...props}>
        <rect x="5" y="11" width="14" height="9" rx="1.5" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </Svg>
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

export const IconInfo: React.FC<IconProps> = (props) => (
    <Svg {...props}>
        <circle cx="12" cy="12" r="8.25" />
        <path d="M12 11v5" />
        <path d="M12 8h.01" />
    </Svg>
)

export const IconPencil: React.FC<IconProps> = (props) => (
    <Svg {...props}>
        <path d="M4 20l4.2-1.1L19 8.1 15.9 5 5.1 15.8 4 20z" />
        <path d="M13.5 7.5l3 3" />
    </Svg>
)

export const IconCheck: React.FC<IconProps> = (props) => (
    <Svg {...props}>
        <path d="M5 12.5l4.2 4.2L19 7.5" />
    </Svg>
)

export const IconCalendar: React.FC<IconProps> = (props) => (
    <Svg {...props}>
        <rect x="4" y="5.5" width="16" height="14.5" rx="1.5" />
        <path d="M8 3.5v4M16 3.5v4M4 10h16" />
    </Svg>
)

export const IconChevronUp: React.FC<IconProps> = (props) => (
    <Svg {...props}>
        <path d="M6 14l6-6 6 6" />
    </Svg>
)

export const IconChevronDown: React.FC<IconProps> = (props) => (
    <Svg {...props}>
        <path d="M6 10l6 6 6-6" />
    </Svg>
)

export const IconList: React.FC<IconProps> = (props) => (
    <Svg {...props}>
        <path d="M8 7h12M8 12h12M8 17h12" />
        <path d="M4.5 7h.01M4.5 12h.01M4.5 17h.01" />
    </Svg>
)

export const IconHome: React.FC<IconProps> = (props) => (
    <Svg {...props}>
        <path d="M4.5 11L12 4.5 19.5 11" />
        <path d="M6.5 9.8V19h11V9.8" />
    </Svg>
)

export const IconSettings: React.FC<IconProps> = (props) => (
    <Svg {...props}>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3.5v2.2M12 18.3v2.2M4.8 6.5l1.6 1.6M17.6 15.9l1.6 1.6M3.5 12h2.2M18.3 12h2.2M4.8 17.5l1.6-1.6M17.6 8.1l1.6-1.6" />
    </Svg>
)
