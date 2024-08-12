'use client'

import React, {useState, useEffect} from "react";
import {useTranslations} from 'next-intl';
import { useRouter, usePathname } from "next/navigation";
import DynamicForm from "@/components/Form/dynamic_form"
import {formType} from '@/type/formType';
import { generateCreationEventForm } from "@/form/pages/create_event"
import { generateLanguagesList } from '@/form/data/list_languages';
import { generateExperienceList } from "@/form/data/list_experience";
import { generateSportList } from "@/form/data/list_sport";
import { isEventCreator, getFormDataFromEvent } from "@/services/eventService";
import { useSetAtom} from "jotai";
import LoadingDots from "@/components/Loading";
import { createEventCurrentStepFormAtom, createEventsubmittedFormValuesAtom} from "@/atoms/atoms_events";
import { useAuth } from "@/context/AuthContext";


const DraftActivity = () => {
  const t = useTranslations("NewActivity");
  const router = useRouter();
  const currentPathname = usePathname();
  const eventId = currentPathname.split("/").pop();
  const t_form = useTranslations("CreationEventForm")
  const [isLoading, setIsLoading] = useState(true)
  const languages = generateLanguagesList(useTranslations("ListLanguages"))
  const experience = generateExperienceList(useTranslations("ListExperiences"))
  const sports = generateSportList(useTranslations("ListSports"))
  const formData: formType = generateCreationEventForm(t_form, languages, experience, sports)
  const setCurrentStep = useSetAtom(createEventCurrentStepFormAtom);
  const setSubmittedFormValues = useSetAtom(createEventsubmittedFormValuesAtom);
  const { user } = useAuth();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const creatorStatus = await isEventCreator(eventId!, user.uid)
        if (creatorStatus == "isCreator"){
            const initialFormData = await getFormDataFromEvent(eventId!);
            setSubmittedFormValues(initialFormData);
            setIsLoading(false)
        }
        else{
            // ADD ALERT TO SHOW WHAT TYPE OF PROBLEM
            alert(t(creatorStatus));
            router.push("/myActivities/newActivity")
        }
      } catch (error) {
        console.error("Failed to fetch event or verify user", error);
        // ADD ALERT TO SHOW WHAT TYPE OF PROBLEM
        alert('Error message here');
        router.push("/myActivities/newActivity")
      }
    };

    if (eventId) {
      verifyUser();
    }
  }, []);
 
  return (
    <>
      {isLoading ? (
        <div className="h-full w-full flex justify-center items-center">
          <LoadingDots size={50} />
        </div>
      ) : (
        <div className="w-full h-full">
          <DynamicForm formData={formData} eventId={eventId!} />
        </div>
      )}
    </>
  );
};

export default DraftActivity;