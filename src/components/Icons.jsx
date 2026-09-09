function SvgIcon({ children, size = 20, className = '', viewBox = '0 0 24 24', ...props }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {children}
    </svg>
  );
}

export function SearchIcon(props) {
  return <SvgIcon {...props}><circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8"/><path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></SvgIcon>;
}
export function CartIcon(props) {
  return <SvgIcon {...props}><path d="M3 4h2l1.7 10.1a2 2 0 0 0 2 1.7h7.9a2 2 0 0 0 1.9-1.4L20 8H6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9" cy="20" r="1.3" fill="currentColor"/><circle cx="17" cy="20" r="1.3" fill="currentColor"/></SvgIcon>;
}
export function MenuIcon(props) {
  return <SvgIcon {...props}><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></SvgIcon>;
}
export function ArrowLeftIcon(props) {
  return <SvgIcon {...props}><path d="m15 18-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></SvgIcon>;
}
export function ChevronDownIcon(props) {
  return <SvgIcon {...props}><path d="m7 10 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></SvgIcon>;
}
export function ChevronLeftIcon(props) {
  return <SvgIcon {...props}><path d="m14 7-5 5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></SvgIcon>;
}
export function ChevronRightIcon(props) {
  return <SvgIcon {...props}><path d="m10 7 5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></SvgIcon>;
}
export function CloseIcon(props) {
  return <SvgIcon {...props}><path d="m7 7 10 10M17 7 7 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></SvgIcon>;
}
export function AlertIcon(props) {
  return <SvgIcon {...props}><path d="M12 8v5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/><circle cx="12" cy="17" r="1.2" fill="currentColor"/></SvgIcon>;
}
