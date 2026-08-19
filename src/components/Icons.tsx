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
