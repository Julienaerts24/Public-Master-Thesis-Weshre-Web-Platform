import React, { useState } from "react";
import { Input } from "@nextui-org/react";
import { Checkbox } from "@nextui-org/react";
import { IoMdEyeOff } from "react-icons/io";
import {useTranslations} from 'next-intl';

type EmailPasswordWidgetProps = {
  email: string;
  setEmail: (email: string) => void;
  password?: string;
  setPassword?: (password: string) => void;
  showPassword?: boolean;
  emailNotValid?: boolean;
  setEmailNotValid?: (emailNotValid: boolean) => void;
  emailErrorMessage?: JSX.Element;
  passwordNotValid?: boolean;
  setPasswordNotValid?: (passwordNotValid: boolean) => void;
  passwordErrorMessage?: JSX.Element;
}

const EmailPasswordWidget: React.FC<EmailPasswordWidgetProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  emailNotValid,
  setEmailNotValid,
  emailErrorMessage,
  passwordNotValid,
  setPasswordNotValid,
  passwordErrorMessage,
}) => {
  const t = useTranslations('InputEmailPassword');
  const allowedDomains = ["@gmail.com", "@outlook.be", "@outlook.fr"];
  const [emailIsFinish, setEmailIsFinish] = useState(false);
  const [isVisible, setIsVisible] = React.useState(false);

  const handleEmailChange = (newEmail: string) => {
    if (newEmail.length > 80) {
      newEmail = newEmail.substring(0, 80);
    }
    setEmail(newEmail);
    if (setEmailNotValid != null) {
      setEmailNotValid(false);
    }
    setEmailIsFinish(newEmail.includes("@"));
  };

  const addEmailDomain = (domain: string) => {
    setEmail(email + domain);
    if (setEmailNotValid != null) {
      setEmailNotValid(false);
    }
    setEmailIsFinish(true);
  };

  const handlePasswordChange = (newPassword: string) => {
    if (newPassword.length > 40) {
      newPassword = newPassword.substring(0, 40);
    }
    setPassword!(newPassword);
    if (setPasswordNotValid != null) {
      setPasswordNotValid(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center">
      <div className="pb-[2%]">
        <Input
          id={"email"}
          value={email}
          onValueChange={handleEmailChange}
          type="email"
          label={t('email')}
          isClearable
          variant="bordered"
          size="md"
          radius="full"
          isInvalid={emailNotValid ? true : false}
          errorMessage={emailNotValid ? emailErrorMessage : ""}
        />
      </div>
      {email !== "" && !emailIsFinish && (
        <div className="w-full h-[30px] flex flex-row justify-evenly items-center p-[2%]">
          {allowedDomains.map((domain) => (
            <div
              key={domain}
              className="text-sm font-semibold rounded-[15px] cursor-pointer bg-transparent px-[1%] py-[0.5%] hover:bg-gray-200 dark:hover:bg-darkBackground"
              onClick={() => addEmailDomain(domain)}
            >
              {domain}
            </div>
          ))}
        </div>
      )}
      {showPassword && (
        <div className="pt-[2%]">
          <Input
            id={"password"}
            value={password}
            onValueChange={handlePasswordChange}
            type={isVisible ? "text" : "password"}
            label={t('password')}
            variant="bordered"
            isClearable
            size="md"
            radius="full"
            isInvalid={passwordNotValid ? true : false}
            errorMessage={passwordNotValid ? passwordErrorMessage : ""}
          />
          {password !== "" && (
            <Checkbox
              id={"show_password"}
              className="pt-[3%] pl-[3%] "
              size="md"
              isSelected={isVisible}
              color="default"
              icon={<IoMdEyeOff />}
              onValueChange={setIsVisible}
            >
              {" "}
              {isVisible ? t('hide_password') : t('show_password')}
            </Checkbox>
          )}
        </div>
      )}
    </div>
  );
};

export default EmailPasswordWidget;
