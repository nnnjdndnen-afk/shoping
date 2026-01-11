
import React from 'react';

interface HeartIconProps extends React.SVGProps<SVGSVGElement> {
  isFilled?: boolean;
}

export const HeartIcon: React.FC<HeartIconProps> = ({ isFilled = false, ...props }) => {
  if (isFilled) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M11.645 20.91a.75.75 0 0 0 .71 0l6.3-4.183a4.5 4.5 0 0 0-6.364-6.364L12 10.81l-.99-1.455a4.5 4.5 0 0 0-6.364 6.364l6.3 4.183Z" />
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
  );
};
