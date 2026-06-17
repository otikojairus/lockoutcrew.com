type IconProps = {
  className?: string;
};

export function PhoneIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7.2 3.5 4.8 5.1c-.9.6-1.2 1.7-.8 2.7 2.1 5.6 6.6 10.1 12.2 12.2 1 .4 2.1.1 2.7-.8l1.6-2.4c.4-.6.2-1.4-.4-1.8l-3.2-2c-.5-.3-1.2-.2-1.6.2l-1.1 1.1c-2.1-1.1-3.8-2.8-4.9-4.9l1.1-1.1c.4-.4.5-1.1.2-1.6l-2-3.2c-.4-.6-1.2-.8-1.8-.4Z" />
    </svg>
  );
}

export function BoltIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M13.4 2 5 13.1h6.4L10.6 22 19 10.4h-6.2L13.4 2Z" />
    </svg>
  );
}

export function KeyIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8.2 14.4a5.2 5.2 0 1 1 4.5-2.6l7.3 7.3-2.1 2.1-2-2-1.8 1.8-2-2 1.8-1.8-2.7-2.7a5.3 5.3 0 0 1-3 .9Zm0-3.1a2.1 2.1 0 1 0 0-4.2 2.1 2.1 0 0 0 0 4.2Z" />
    </svg>
  );
}

export function ShieldIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.5 20 5v6.2c0 4.7-3.2 8.9-8 10.3-4.8-1.4-8-5.6-8-10.3V5l8-2.5Zm0 4.1a3.2 3.2 0 0 0-3.2 3.2v1.4h-.9v5.5h8.2v-5.5h-.9V9.8A3.2 3.2 0 0 0 12 6.6Zm0 2a1.2 1.2 0 0 1 1.2 1.2v1.4h-2.4V9.8A1.2 1.2 0 0 1 12 8.6Z" />
    </svg>
  );
}
