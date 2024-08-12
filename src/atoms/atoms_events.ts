import { atom } from 'jotai';
import {EventDataType} from "@/services/eventService";
import {formValuesType} from '@/type/formType';

export const ComingPastChoiceAtom = atom('coming'); // possible: coming, past, draft
export const OpenParticipantsAtom = atom(false);
export const sortChoiceAtom = atom('09'); 
export const researchEventAtom = atom(''); 
export const EventDataAtom = atom<EventDataType | null>(null);
export const AvailableHeightAtom = atom<number | null>(null);
export const createEventsubmittedFormValuesAtom = atom<formValuesType>({});
export const createEventCurrentStepFormAtom = atom<number>(0);

