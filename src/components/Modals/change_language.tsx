'use client'

import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody} from "@nextui-org/react";
import FlagButton from "@/components/Buttons/flag_button";
import {useTranslations} from 'next-intl';
import {usePathname, useRouter} from '@/navigation';
import {useLocale} from 'next-intl';

type ChangeLanguageModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

const ChangeLanguageModal: React.FC<ChangeLanguageModalProps> = ({isOpen, onOpenChange}) => {
  const t = useTranslations('profileDropDown');
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const ChangeLanguage = (lang: string) => {
    if (lang == locale){
      onOpenChange(false);
    }
    else {
      router.push(pathname, { locale: lang });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="lg"
      placement="center"
      backdrop="opaque"
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          exit: {
            y: -40,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        },
      }}
    >
      <ModalContent className="bg-lightBackground dark:bg-darkGray">
      <ModalHeader className="border-b-1 border-black dark:border-white font-bold text-lg lg:text-xl xl:text-2xl">{t('changeLanguageModalsTitle')}</ModalHeader>
        <ModalBody className="flex flex-row justify-around items-center">
          <div className="m-4">
            <FlagButton lang="en" text="English" width={140} height={100} fontSize={25} onPress={() => ChangeLanguage('en')} />
          </div>
          <div className="m-4">
            <FlagButton lang="fr" text="Français" width={140} height={100} fontSize={25} onPress={() => ChangeLanguage('fr')}/>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ChangeLanguageModal;
