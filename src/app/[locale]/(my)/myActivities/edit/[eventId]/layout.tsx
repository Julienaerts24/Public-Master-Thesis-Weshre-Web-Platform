import {getTranslations} from 'next-intl/server';

export async function generateMetadata() {
    const t = await getTranslations('MyActivities');
    return { title: t('header_title') };
  }

  interface MyLayoutProps {
    children: React.ReactNode;
  }
  export default function MyActivitiesEditLayout({ children }: MyLayoutProps) {
    return (
      <>
        {children}
      </>
    );
  }