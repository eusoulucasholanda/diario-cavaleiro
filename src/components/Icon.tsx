import type { IconKey } from '../types';

// Ícones originais simples (traço), 24x24.
const P: Record<IconKey, JSX.Element> = {
  skull: (<><path d="M12 3c-4.4 0-7.5 3-7.5 7 0 2.4 1.1 4.2 2.8 5.3V19h9.4v-3.7c1.7-1.1 2.8-2.9 2.8-5.3 0-4-3.1-7-7.5-7Z" /><circle cx="9" cy="11" r="1.6" /><circle cx="15" cy="11" r="1.6" /><path d="M10 19v2M14 19v2" /></>),
  hex: (<><path d="M12 2.8 20 7.4v9.2l-8 4.6-8-4.6V7.4Z" /><path d="M12 8 15.5 10v4L12 16l-3.5-2v-4Z" /></>),
  mask: (<><path d="M6 4c0 0 1 3 1 5-2 1.5-2.5 4-2 6.5C6 19 9 21 12 21s6-2 7-5.5c.5-2.5 0-5-2-6.5 0-2 1-5 1-5l-3 3.2C14 6.6 13 6.5 12 6.5s-2 .1-3 .7Z" /><ellipse cx="9.3" cy="13.5" rx="1.5" ry="2.2" /><ellipse cx="14.7" cy="13.5" rx="1.5" ry="2.2" /></>),
  nail: (<><path d="M19 3 9 13" /><path d="M7 11l6 6" /><path d="M8.5 15.5 4 20" /><path d="M19 3l-1 4-4 1" /></>),
  claw: (<><path d="M5 20c2-6 4-10 9-15" /><path d="M9 20c1.5-4 3.5-7 7-10" /><path d="M13 20c1-2.5 2.5-4.5 5-6" /></>),
  flame: (<path d="M12 21c-3.9 0-6.5-2.6-6.5-6 0-3.6 3-5.6 3.8-9 2 1.5 2.7 3.3 2.7 4.8 1-1 1.6-2.3 1.6-3.8 2.8 2 4.9 5 4.9 8 0 3.4-2.6 6-6.5 6Z" />),
  map: (<><path d="M3 6.5 8.5 4l7 2.5L21 4v13.5L15.5 20l-7-2.5L3 20Z" /><path d="M8.5 4v13.5M15.5 6.5V20" /></>),
  bench: (<><path d="M4 10h16M5 13.5h14" /><path d="M6 13.5V19M18 13.5V19M7 10V6.5h10V10" /></>),
  stag: (<><ellipse cx="12" cy="14" rx="6" ry="4.5" /><path d="M8.5 10.5 6 4M15.5 10.5 18 4M7 6.5 4.5 6M17 6.5 19.5 6" /><path d="M9 18.5V21M15 18.5V21" /></>),
  shop: (<><path d="M4 9h16l-1.5-4.5h-13Z" /><path d="M5 9v11h14V9" /><path d="M10 20v-6h4v6" /></>),
  book: (<><path d="M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3Z" /><path d="M5 17a3 3 0 0 1 3-3h10" /></>),
  key: (<><circle cx="8" cy="8" r="4" /><path d="M11 11l9 9M16 16l2-2M18.5 18.5l2-2" /></>),
  lantern: (<><path d="M9 4h6M12 2v2" /><path d="M8 7h8l-1 11H9Z" /><circle cx="12" cy="12.5" r="2" /><path d="M8 20h8" /></>),
  person: (<><circle cx="12" cy="7.5" r="3.5" /><path d="M5 21c.5-4.5 3.2-7 7-7s6.5 2.5 7 7" /></>),
  anvil: (<><path d="M3 7h13c0 2.5 2 4 5 4-1 2-3.5 2.5-6 2.5h-1v3h2V20H8v-3.5h2v-3H8C5 13.5 3 11 3 7Z" /></>),
  grub: (<><path d="M7 18c-2-2-2.5-6 0-9s7.5-3.5 10-.5 2 7.5-.5 9.5-7.5 2-9.5 0Z" /><circle cx="10" cy="11" r="1" /><circle cx="14" cy="11" r="1" /><path d="M10.5 14.5c1 .8 2 .8 3 0" /></>),
  coin: (<><circle cx="12" cy="12" r="8" /><path d="M12 7.5 15.5 12 12 16.5 8.5 12Z" /></>),
};

export function Icon({ k, size = 22 }: { k: IconKey; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {P[k]}
    </svg>
  );
}
