import {getTranslations} from 'next-intl/server';

export async function generateMetadata() {
    const t = await getTranslations('ForgotPassword');
    return { title: t('header_title') };
  }

  interface MyLayoutProps {
    children: React.ReactNode;
  }
  export default function ForgotPasswordLayout({ children }: MyLayoutProps) {
    return (
      <>
        {children}
      </>
    );
  }