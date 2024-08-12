import {getTranslations} from 'next-intl/server';

export async function generateMetadata() {
    const t = await getTranslations('Login');
    return { title: t('header_title') };
  }

  interface MyLayoutProps {
    children: React.ReactNode;
  }
  export default function LoginLayout({ children }: MyLayoutProps) {
    return (
      <>
        {children}
      </>
    );
  }