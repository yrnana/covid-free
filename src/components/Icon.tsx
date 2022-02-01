export type IconProps = {
  name: 'plus' | 'minus' | 'spin';
  size?: number;
};

export default function Icon({ name, size = 5 }: IconProps) {
  if (name === 'plus') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-${size} w-${size}`}
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
          clipRule="evenodd"
        />
      </svg>
    );
  }

  if (name === 'minus') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-${size} w-${size}`}
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
          clipRule="evenodd"
        />
      </svg>
    );
  }

  if (name === 'spin') {
    return (
      <svg
        className={`h-${size} w-${size} animate-spin`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );
  }

  throw new Error('No Icon');
}
