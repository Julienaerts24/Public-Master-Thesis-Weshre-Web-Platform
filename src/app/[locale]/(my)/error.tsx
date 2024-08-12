'use client'
 
import { useEffect } from 'react'
import RedRoundedButton from "@/components/Buttons/rounded_button";
import { Image } from "@nextui-org/react";
import {useLocale} from 'next-intl';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])
 
  const locale = useLocale();

  let text: string;
  switch (locale) {
    case "en":
      text = "Retry";
      break;
    case "fr":
      text = "Réessayer";
      break;
    default:
      text = "Retry";
  }

  return (
    <div className='flex flex-col h-full justify-center items-center'>
      <div className='w-3/4 h-1/3 flex justify-center'>
        <Image
            alt={"slow loading image"}
            className="w-full h-full object-fit"
            src={`/images/error_loading_${locale}.svg`}
          />
      </div>
      <RedRoundedButton text={text} sizeText={30} onClick={
          () => reset()
        }/>
    </div>
  )
}