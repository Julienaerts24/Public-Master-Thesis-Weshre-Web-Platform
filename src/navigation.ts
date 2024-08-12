import {createSharedPathnamesNavigation} from 'next-intl/navigation';
 
export const locales = ['en', 'fr'] as const;
 
export const {usePathname, useRouter} =
  createSharedPathnamesNavigation({locales});