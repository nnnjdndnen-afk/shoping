
import React from 'react';

export const AvatarIcon2: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <circle cx="12" cy="12" r="10" fill="#FEE2E2" stroke="#DC2626" strokeWidth="1.5" />
        <path d="M15 9.5L13 11.5L15 13.5" stroke="#F87171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 9.5L11 11.5L9 13.5" stroke="#F87171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 17C8.5 18 9.5 18.5 12 18.5C14.5 18.5 15.5 18 16 17" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
);
