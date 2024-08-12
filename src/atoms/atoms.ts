import { atom, useSetAtom } from 'jotai';
import { useCallback } from 'react';
import { ConfirmationResult} from "firebase/auth";

export type UserType = {
    uid: string | null;
    displayName: string | null;
    photoURL: string | null;
  } | null;
  
export const UserAtom = atom<UserType>(null);

type LoadState = "EmailPassword" | "PhoneNumber" | "VerificationCode";

export const LoginStateAtom = atom<LoadState>('EmailPassword');
export const LoginEmailAtom = atom('');
export const LoginEmailNotValidAtom = atom(false);
export const LoginEmailErrorMessageAtom = atom<JSX.Element | undefined>(undefined);
export const LoginPasswordAtom = atom('');
export const LoginPasswordNotValidAtom = atom(false);
export const LoginPasswordErrorMessageAtom = atom<JSX.Element | undefined>(undefined);
export const LoginPhoneNumberAtom = atom<string | undefined>(undefined);
export const LoginPhoneNumberNotValidAtom = atom(false);
export const LoginPhoneNumberErrorMessageAtom = atom<JSX.Element | null>(null);
export const LoginVerificationCodeAtom = atom('');
export const LoginVerificationCodeNotValidAtom = atom(false);
export const LoginVerificationCodeErrorMessageAtom = atom<JSX.Element | null>(null);
export const LoginResultCodeErrorMessageAtom = atom<ConfirmationResult | null>(null);
export const RecaptchaWidgetIdAtom = atom<number | null>(null);

export const useResetLoginAtoms = () => {
    const setLoginState = useSetAtom(LoginStateAtom);
    const setEmail = useSetAtom(LoginEmailAtom);
    const setEmailNotValid = useSetAtom(LoginEmailNotValidAtom);
    const setEmailErrorMessage = useSetAtom(LoginEmailErrorMessageAtom);
    const setPassword = useSetAtom(LoginPasswordAtom);
    const setPasswordNotValid = useSetAtom(LoginPasswordNotValidAtom);
    const setPasswordErrorMessage = useSetAtom(LoginPasswordErrorMessageAtom);
    const setPhoneNumber = useSetAtom(LoginPhoneNumberAtom);
    const setPhoneNumberNotValid = useSetAtom(LoginPhoneNumberNotValidAtom);
    const setPhoneNumberErrorMessage = useSetAtom(LoginPhoneNumberErrorMessageAtom);
    const setVerificationCode = useSetAtom(LoginVerificationCodeAtom);
    const setVerificationCodeNotValid = useSetAtom(LoginVerificationCodeNotValidAtom);
    const setVerificationCodeErrorMessage = useSetAtom(LoginVerificationCodeErrorMessageAtom);
    const setResultCodeErrorMessage = useSetAtom(LoginResultCodeErrorMessageAtom);
    const setRecaptchaWidgetIdAtom = useSetAtom(RecaptchaWidgetIdAtom);

    const resetAtoms = useCallback(() => {
        // Reset all login atoms to initial value => if deconnection go back to login email page
        setLoginState('EmailPassword');
        setEmail('');
        setEmailNotValid(false);
        setEmailErrorMessage(undefined);
        setPassword('');
        setPasswordNotValid(false);
        setPasswordErrorMessage(undefined);
        setPhoneNumber(undefined);
        setPhoneNumberNotValid(false);
        setPhoneNumberErrorMessage(null);
        setVerificationCode('');
        setVerificationCodeNotValid(false);
        setVerificationCodeErrorMessage(null);
        setResultCodeErrorMessage(null);
        setRecaptchaWidgetIdAtom(null);
    }, [
        setLoginState, setEmail, setEmailNotValid, setEmailErrorMessage, setPassword, setPasswordNotValid, setPasswordErrorMessage, setPhoneNumber, setPhoneNumberNotValid, setPhoneNumberErrorMessage, setVerificationCode, setVerificationCodeNotValid, setVerificationCodeErrorMessage, setResultCodeErrorMessage
    ]);

    return resetAtoms;
};