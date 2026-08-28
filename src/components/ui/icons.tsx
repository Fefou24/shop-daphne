type P = { className?: string; size?: number };
const base = (size = 24) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export const SearchIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
);
export const CartIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M2 3h3l2.4 12.4a1.5 1.5 0 0 0 1.5 1.2h8.7a1.5 1.5 0 0 0 1.5-1.2L22 7H6" /></svg>
);
export const UserIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
);
export const MenuIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M3 6h18M3 12h18M3 18h18" /></svg>
);
export const CloseIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M18 6 6 18M6 6l12 12" /></svg>
);
export const PlusIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M12 5v14M5 12h14" /></svg>
);
export const MinusIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M5 12h14" /></svg>
);
export const TrashIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" /></svg>
);
export const CheckIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M20 6 9 17l-5-5" /></svg>
);
export const LeafIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M11 20A7 7 0 0 1 4 13c0-5 5-9 16-9 0 11-4 16-9 16Z" /><path d="M4 20c4-4 7-6 12-7" /></svg>
);
export const SparkleIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.5 2.5M15.2 15.2l2.5 2.5M17.7 6.3l-2.5 2.5M8.8 15.2l-2.5 2.5" /></svg>
);
export const DropletIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z" /></svg>
);
export const InstagramIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" /></svg>
);
export const FacebookIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M14 9h3V5h-3a4 4 0 0 0-4 4v2H7v4h3v6h4v-6h3l1-4h-4V9a1 1 0 0 1 1-1Z" /></svg>
);
export const ArrowRightIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const WhatsAppIcon = ({ className, size = 24 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.2 4.79 1.2h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 1.67c2.2 0 4.27.86 5.82 2.42a8.2 8.2 0 0 1 2.42 5.83c0 4.54-3.7 8.23-8.24 8.23-1.52 0-3.01-.41-4.3-1.19l-.31-.18-3.12.82.83-3.04-.2-.32a8.18 8.18 0 0 1-1.26-4.37c0-4.54 3.7-8.23 8.24-8.23zm-3.6 4.42c-.17 0-.45.06-.68.31-.23.25-.9.88-.9 2.15 0 1.27.92 2.49 1.05 2.66.13.17 1.8 2.85 4.42 3.88 2.18.86 2.62.69 3.1.64.48-.04 1.54-.63 1.76-1.24.22-.61.22-1.13.15-1.24-.06-.11-.23-.17-.48-.3-.25-.13-1.54-.76-1.78-.85-.24-.09-.42-.13-.59.13-.17.25-.67.84-.82 1.01-.15.17-.3.19-.56.06-.25-.13-1.06-.39-2.02-1.25-.75-.66-1.25-1.48-1.4-1.73-.15-.25-.02-.39.11-.51.11-.11.25-.3.38-.44.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.44-.06-.13-.55-1.42-.77-1.92-.2-.48-.4-.42-.55-.42z" />
  </svg>
);
export const UserPlusIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><circle cx="9" cy="8" r="4" /><path d="M2 21a7 7 0 0 1 12 0M19 8v6M22 11h-6" /></svg>
);
export const PackageIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M12 3 3 7.5v9L12 21l9-4.5v-9L12 3Z" /><path d="M3 7.5 12 12l9-4.5M12 12v9" /></svg>
);
export const TruckIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M3 6h11v9H3zM14 9h4l3 3v3h-7z" /><circle cx="7" cy="18" r="1.6" /><circle cx="17.5" cy="18" r="1.6" /></svg>
);
export const FlaskIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M9 3h6M10 3v6l-5 8a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 17l-5-8V3" /><path d="M7.5 14h9" /></svg>
);
export const GridIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>
);
export const MailIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
);
export const StarOutlineIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.6 1-5.8-4.3-4.1 5.9-.9L12 3.5Z" /></svg>
);
export const ChartIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M4 4v16h16" /><path d="M8 16v-4M12 16V8M16 16v-6" /></svg>
);
export const SettingsIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 7 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H1a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 2.6 7a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 7 2.6 1.6 1.6 0 0 0 8 1.1V1a2 2 0 1 1 4 0v.1A1.6 1.6 0 0 0 14.9 2.6a1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.6 1.6 0 0 0 21.4 9H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 2Z" /></svg>
);
export const UsersIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16 5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-4-6" /></svg>
);
export const ListIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>
);
export const ExternalLinkIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M14 4h6v6M20 4l-9 9M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" /></svg>
);
export const ChatIcon2 = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M21 12a8 8 0 0 1-11.5 7.2L4 20l1-4.5A8 8 0 1 1 21 12Z" /><path d="M8.5 11h.01M12 11h.01M15.5 11h.01" /></svg>
);
export const ActivityIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M3 12h4l2 6 4-14 2 8h6" /></svg>
);
export const BriefcaseIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18" /></svg>
);
export const PhoneIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L20 13l1 4v2a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1Z" /></svg>
);
export const MapPinIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M12 21s-6-5.3-6-10a6 6 0 0 1 12 0c0 4.7-6 10-6 10Z" /><circle cx="12" cy="11" r="2.2" /></svg>
);
export const ClockIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
export const BoxIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9Z" /><path d="M3 7.5 12 12l9-4.5M12 12v9" /></svg>
);
export const HandshakeIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="m11 17 2 2a1.5 1.5 0 0 0 2-2M3 11l4-4 4 3 3-3 7 4M3 11l3 6M21 11l-3 6M11 17l-2-2" /></svg>
);
export const CashIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /><path d="M6 9v.01M18 15v.01" /></svg>
);
export const CardIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg>
);
export const DeviceMobileIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 18h2" /></svg>
);
export const DesktopIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></svg>
);

