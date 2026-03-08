import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ className = "", size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Mountain backdrop */}
    <path
      d="M4 52 L20 20 L28 32 L36 16 L48 36 L56 28 L60 52 Z"
      fill="currentColor"
      opacity="0.15"
    />
    {/* Main mountain */}
    <path
      d="M8 52 L24 22 L32 34 L40 18 L56 52"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    {/* Winding road */}
    <path
      d="M18 52 C22 44, 28 46, 32 40 C36 34, 38 38, 46 52"
      stroke="hsl(var(--primary))"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
    {/* Sun */}
    <circle
      cx="50"
      cy="16"
      r="5"
      fill="hsl(var(--primary))"
      opacity="0.9"
    />
    {/* Sun rays */}
    <g stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinecap="round" opacity="0.6">
      <line x1="50" y1="7" x2="50" y2="9" />
      <line x1="56" y1="10" x2="54.5" y2="11.5" />
      <line x1="59" y1="16" x2="57" y2="16" />
      <line x1="44" y1="10" x2="45.5" y2="11.5" />
      <line x1="41" y1="16" x2="43" y2="16" />
    </g>
  </svg>
);

export default Logo;
