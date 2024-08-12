import {getTranslations} from 'next-intl/server';

export async function generateMetadata() {
    const t = await getTranslations('SignUp');
    return { title: t('header_title') };
  }

  interface MyLayoutProps {
    children: React.ReactNode;
  }
  export default function SignUpLayout({ children }: MyLayoutProps) {
    return (
      <>
        {children}
      </>
    );
  }