import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter} from "@nextui-org/react";;
import RedRoundedButton from "@/components/Buttons/rounded_button";
import {useTranslations} from 'next-intl';

type ConfirmModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: string;
  text: string;
  onConfirm: () => void
  onCancel: () => void
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({isOpen, onOpenChange, title, text, onConfirm, onCancel}) => {
  const t = useTranslations('ConfirmModal');
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="2xl"
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
      <ModalHeader className="border-b-1 border-black dark:border-white font-bold text-lg lg:text-xl xl:text-2xl">{title}</ModalHeader>
        <ModalBody className="flex flex-row justify-around items-center">
          <div className="m-2">
            {text}
          </div>
        </ModalBody>
        <ModalFooter className="h-[72px] py-3 flex flex-row gap-4">
          <RedRoundedButton
            text={t('cancel')}
            sizeText={18}
            size="md"
            onClick={onCancel}
            color="secondary"
          />
          <RedRoundedButton
            text={t('confirm')}
            sizeText={18}
            size="md"
            onClick={onConfirm}
            isError={true}
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmModal;
