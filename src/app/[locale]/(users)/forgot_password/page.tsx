import SignContainer from "@/components/Containers/sign_container";
import ForgotPasswordInput from "@/components/login_user/input/forget_password/forget_password_input";
import Link from "next/link";
import {useTranslations} from 'next-intl';
import {useLocale} from 'next-intl';

export default function ForgotPassword() {

  const t = useTranslations('ForgotPassword');
  const locale = useLocale();
  return (
    <SignContainer
      container={
        <>
          <div className="font-extrabold text-center leading-snug text-2xl lg:text-2xl xl:text-3xl p-[2%]">
            {t('question_email')}
          </div>
          <div className="w-full">
            <ForgotPasswordInput />
          </div>
          <div className="flex flex-row justify-between items-center underline w-[95%] sm:w-4/5 text-[12px] md:text-base lg:text-lg xl:text-xl text-redWS cursor-pointer pt-2">
            <div className="hover:text-hoverRedWS">
              <Link href={`/${locale}/login`}> {t('login')} </Link>
            </div>
            <div className="hover:text-hoverRedWS">
              <Link href={`/${locale}/sign_up`}> {t('sign_up')} </Link>
            </div>
          </div>
        </>
      }
    />
  );
}
