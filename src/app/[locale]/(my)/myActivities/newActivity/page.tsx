'use client'

import React from "react";
import { collection, doc} from "firebase/firestore";
import { db } from "@/firebase/config.js";
import {useTranslations} from 'next-intl';
import DynamicForm from "@/components/Form/dynamic_form"
import {formType} from '@/type/formType';
import { generateCreationEventForm } from "@/form/pages/create_event"
import { generateLanguagesList } from '@/form/data/list_languages';
import { generateExperienceList } from "@/form/data/list_experience";
import { generateSportList } from "@/form/data/list_sport";

const NewActivity = () => {
  const t_form = useTranslations("CreationEventForm")
  const languages = generateLanguagesList(useTranslations("ListLanguages"))
  const experience = generateExperienceList(useTranslations("ListExperiences"))
  const sports = generateSportList(useTranslations("ListSports"))
  const formData: formType = generateCreationEventForm(t_form, languages, experience, sports)
 
  const newEventId = doc(collection(db, "events")).id

  return (
    <div className="w-full h-full">
      <DynamicForm formData={formData} eventId={newEventId}/>
    </div>
  );
};

export default NewActivity;