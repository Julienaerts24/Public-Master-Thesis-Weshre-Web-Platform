import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useRouter, usePathname } from "next/navigation";
import EventCard from "@/components/Cards/event_card";
import { getEventsUser, EventDataType, deleteEvent } from "@/services/eventService";
import GroupEventCardsSkeleton from "@/components/Skeletons/group_event_card_skeleton";
import { useAtomValue, useAtom} from "jotai";
import { ComingPastChoiceAtom, sortChoiceAtom, researchEventAtom} from "@/atoms/atoms_events";
import RedRoundedButton from "@/components/Buttons/rounded_button";
import {useTranslations} from 'next-intl';
import {useDisclosure} from '@nextui-org/react';
import ConfirmModal from '@/components/Modals/confirm_modal';
import { useAuth } from "@/context/AuthContext";
import ErrorBoundaryCard from "@/components/Errors/error_boundary_card";

const GroupEventCards: React.FC = () => {
  const t = useTranslations('MyActivities');
  const t_modal = useTranslations('ConfirmModal');
  const t_error = useTranslations("ErrorBoundaryCard");
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { theme, resolvedTheme } = useTheme();
  const isDark = theme === "dark" || (!theme && resolvedTheme === "dark");
  const currentPathname = usePathname();
  let minSizeCard = window.innerWidth >= 640 ? 340 : 260;
  let sizeAvailableCard = typeof window !== "undefined" ? window.innerWidth >= 640 ? window.innerWidth - 145 : window.innerWidth - 40 : 0; // 80 sideBar + 20 scrollBar + 40 padding
  const paddingCard = (window.innerWidth >= 640 ? 40 : 16)
  let numberPossibleCard = Math.round(sizeAvailableCard / (minSizeCard + paddingCard));
  const [events, setEvents] = useState<EventDataType[]>([]);
  const [researchEvents, setResearchEvents] = useState<EventDataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [dimensions, setDimensions] = useState({ width: minSizeCard, height: minSizeCard});
  const selectedChoice = useAtomValue(ComingPastChoiceAtom);
  const selectedSort = useAtomValue(sortChoiceAtom);
  const [search, setSearch] = useAtom(researchEventAtom);
  const [deletedEventId, setDeletedEventId] = useState<string>();
  const { user } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const fetchedEvents = await getEventsUser(user.uid == "UejXmdldJweqYzIu2aLixhrjMdz2" ? "mDlFjIykC9WUsB9EIT26mzyhUxm1" : user.uid);
        const newSortEvents = sortEvents([...fetchedEvents]);
        setEvents(newSortEvents);
        setResearchEvents(newSortEvents.filter((event) => {
          const searchTerm = search.toLowerCase();
          // return event.title.toLowerCase().split(' ').some(word => word.startsWith(searchTerm));
          return event.title.toLowerCase().includes(searchTerm);
        }))
      } catch (error) {
        console.error("Error fetching events: ", error);
      }
      setLoading(false);
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const newSortEvents = sortEvents([...events]);
    setEvents(newSortEvents);
    setResearchEvents(newSortEvents.filter((event) => {
      const searchTerm = search.toLowerCase();
      // return event.title.toLowerCase().split(' ').some(word => word.startsWith(searchTerm));
      return event.title.toLowerCase().includes(searchTerm);
    }))
  }, [selectedSort]);

  useEffect(() => {
    setResearchEvents(events.filter((event) => {
      const searchTerm = search.toLowerCase();
      // return event.title.toLowerCase().split(' ').some(word => word.startsWith(searchTerm));
      return event.title.toLowerCase().includes(searchTerm);
    }))
  }, [search]);

  useEffect(() => {
    const handleResize = () => {
      minSizeCard = window.innerWidth >= 640 ? 340 : 260;
      sizeAvailableCard = window.innerWidth >= 640 ? window.innerWidth - 145 : window.innerWidth - 40
      const paddingCard = (window.innerWidth >= 640 ? 40 : 16)
      numberPossibleCard = Math.round(sizeAvailableCard / (minSizeCard + paddingCard));
      let width = numberPossibleCard != 0 ? Math.floor((sizeAvailableCard - paddingCard * numberPossibleCard) / numberPossibleCard) : minSizeCard;
      let height = width;
      setDimensions({ width, height });
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Function to determine if an event is coming, past or draft
  const filterEvents = (event: EventDataType) => {
    const now = new Date();
    const eventDate = new Date(event.date_end);
    if (selectedChoice === 'coming') {
      return eventDate >= now && !event.draft;
    } 
    else if (selectedChoice === 'past') {
      return eventDate < now && !event.draft;
    }
    else if (selectedChoice === 'draft')
      return event.draft === true
  };

  // Function to sort the event by the selected method
  const sortEvents = (eventToSort : EventDataType[]) => {
    let sortedEvents = eventToSort;
    switch (selectedSort) {
      case 'AZ':
        sortedEvents.sort((a, b) => a.title.trimStart().localeCompare(b.title.trimStart()));
        break;
      case 'ZA':
        sortedEvents.sort((b, a) => a.title.trimStart().localeCompare(b.title.trimStart()));
        break;
      case '90':
        sortedEvents.sort((b, a) => new Date(a.date_begin).getTime() - new Date(b.date_begin).getTime());
        break;
      default:
        sortedEvents.sort((a, b) => new Date(a.date_begin).getTime() - new Date(b.date_begin).getTime());
        break;
    }
    return sortedEvents;
  };

  const filteredEvents = researchEvents.filter(filterEvents);

  if (loading) {
    return (
      <div className="w-full h-full">
        <GroupEventCardsSkeleton width={dimensions.width} height={dimensions.height}/>
      </div>
    );
  }

  const handleEventPress = async (event: EventDataType) => {
    if (event.draft) {
      router.push(`/myActivities/edit/${event.id}`);
    } else {
      router.push(`${currentPathname}/${event.id}`);
    }
  };

  const handleOnDelete = (eventId: string) => {
    setDeletedEventId(eventId);
    onOpen();
  };

  const onConfirmDelete = async () => {
    if (deletedEventId) {
      try {
        await deleteEvent(deletedEventId);
        const updatedEvents = events.filter(event => event.id !== deletedEventId);
        setEvents(updatedEvents);
        const updatedResearchEvents = researchEvents.filter(event => event.id !== deletedEventId);
        setResearchEvents(updatedResearchEvents);
        onClose();
      } catch (error) {
        console.error("Failed to delete event: ", error);
      }
    }
  };

  return (
    <>
    <div className="w-full h-full overflow-y-scroll snap-y snap-mandatory mt-3">
      <div className="flex flex-wrap w-full h-full px-5 pb-5">
        {filteredEvents.length == 0 ? (
          <div className="w-full h-full flex flex-col justify-center items-center px-5">
            <div className="text-xl lg:text-2xl xl:text-3xl font-bold pb-5 text-center"> 
              {search == "" ? selectedChoice === 'coming' ? t('no_activities_coming') : selectedChoice === 'past' ? t('no_activities_past') : t('no_activities_draft') : t('no_result_search')} 
            </div>
            <RedRoundedButton
              text={search == "" ? t('creation_button') : t('delete_search_button')}
              sizeText={24}
              onClick={search == "" ? () => router.push("/myActivities/newActivity") : () => {setSearch('')}}
              responsiveness={20}
            />
          </div>
        ) : (
          filteredEvents.map((event: EventDataType, index) => (
            <div key={index} aria-label={event.id} className="snap-start p-2 sm:p-5">
              <div style={{width: dimensions.width, height: dimensions.height}}>
                <ErrorBoundaryCard errorMessage={t_error("unexpected_error")}>
                  <EventCard
                    aria-label={event.id}
                    title={event!.title}
                    description={event!.description}
                    date={event!.date_begin}
                    image={isDark ? event!.image_dark : event!.image}
                    displayButton={false}
                    onPress={() => handleEventPress(event)}
                    deletable={selectedChoice === 'draft' || selectedChoice === 'coming'}
                    onDelete={() => (selectedChoice === 'draft' || selectedChoice === 'coming') ? handleOnDelete(event.id) : undefined}
                  />
                </ErrorBoundaryCard>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
    <ConfirmModal isOpen={isOpen} onOpenChange={onOpenChange} title={t_modal('title')} text={t_modal('text')} onCancel={() => onOpenChange()} onConfirm={onConfirmDelete}/>
    </>

  );
};

export default GroupEventCards;