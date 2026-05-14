/** Jar-specific UI module: jar inline icons. */

export function InfoIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 10V16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="7.2" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function CloseCrossIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M19.5735 6.42596C19.7068 6.29689 19.8132 6.14246 19.8864 5.97171C19.9597 5.80095 19.9982 5.61727 19.9999 5.43139C20.0016 5.24552 19.9664 5.06116 19.8963 4.88908C19.8262 4.71701 19.7227 4.56066 19.5917 4.42915C19.4608 4.29765 19.305 4.19363 19.1335 4.12316C18.9621 4.05269 18.7783 4.01719 18.593 4.01871C18.4077 4.02024 18.2246 4.05877 18.0543 4.13206C17.884 4.20534 17.73 4.31192 17.6012 4.44556L12.0079 10.0545L6.4165 4.44556C6.28874 4.30802 6.13468 4.1977 5.9635 4.12119C5.79231 4.04468 5.60752 4.00353 5.42014 4.00022C5.23276 3.9969 5.04664 4.03148 4.87287 4.10189C4.69911 4.17229 4.54126 4.27709 4.40874 4.41002C4.27622 4.54296 4.17176 4.7013 4.10157 4.87561C4.03138 5.04993 3.99691 5.23664 4.00022 5.4246C4.00352 5.61257 4.04454 5.79794 4.12081 5.96966C4.19708 6.14138 4.30706 6.29593 4.44416 6.42409L10.0318 12.0349L4.44044 17.6439C4.19394 17.9093 4.05974 18.2603 4.06612 18.6229C4.0725 18.9856 4.21896 19.3316 4.47464 19.5881C4.73032 19.8446 5.07527 19.9915 5.4368 19.9979C5.79834 20.0043 6.14824 19.8697 6.41278 19.6224L12.0079 14.0135L17.5993 19.6243C17.8638 19.8716 18.2137 20.0062 18.5753 19.9998C18.9368 19.9934 19.2818 19.8465 19.5374 19.59C19.7931 19.3335 19.9396 18.9875 19.946 18.6248C19.9523 18.2621 19.8181 17.9111 19.5716 17.6457L13.984 12.0349L19.5735 6.42596Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function DepositIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M17 11L15.6 9.6L13 12.2L13 2L11 2L11 12.2L8.4 9.6L7 11L12 16L17 11ZM5 20L5 12L3 12L3 20C3 21.1 3.9 22 5 22L19 22C20.1 22 21 21.1 21 20L21 12L19 12L19 20L5 20Z"
        fill="currentColor"
      />
    </svg>
  );
}
