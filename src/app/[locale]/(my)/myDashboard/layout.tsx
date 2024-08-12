import {getTranslations} from 'next-intl/server';

export async function generateMetadata() {
    const t = await getTranslations('MyDashboard');
    return { title: t('header_title') };
  }

  interface MyLayoutProps {
    children: React.ReactNode;
  }
  export default function MyDashboardLayout({ children }: MyLayoutProps) {
    return (
      <>
        {children}
      </>
    );
  }