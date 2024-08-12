"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import ProgressIndicatorCard from "@/components/Cards/progress_indicator_card";
import { useAtomValue } from "jotai";
import { EventDataAtom, AvailableHeightAtom } from "@/atoms/atoms_events";
import { getTicketsEvent, TicketDataType } from "@/services/eventService";
import EventPageSkeleton from "@/components/Skeletons/event_page";
import ErrorBoundaryCard from "@/components/Errors/error_boundary_card";

const EventPage = () => {
  const t = useTranslations("EventPage");
  const t_error = useTranslations("ErrorBoundaryCard");
  const currentPathname = usePathname();
  const eventData = useAtomValue(EventDataAtom);
  const availableHeight = useAtomValue(AvailableHeightAtom);
  const [isMdScreen, setIsMdScreen] = useState(window.innerWidth >= 768);
  const [tickets, setTickets] = useState<TicketDataType[]>([]);
  const [loading, setLoading] = useState(true);

  const getWidthCard = () => {
    if (window.innerWidth >= 1024) {
      return window.innerWidth - 80 - 400 - 32; // sideMenu / participants / padding left
    } else if (window.innerWidth >= 768) {
      return window.innerWidth - 80 - 300 - 32; // sideMenu / smaller participants / padding left
    } else if (window.innerWidth >= 640) {
      return window.innerWidth - 80 - 64; // sideMenu / paddingX
    } else {
      return window.innerWidth - 64; // paddingX
    }
  };

  const [widthCard, setWidthCard] = useState(getWidthCard());
  const eventId = currentPathname.split("/").pop();

  useEffect(() => {
    const handleResize = () => {
      setIsMdScreen(window.innerWidth >= 768);
      setWidthCard(getWidthCard());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const allTickets = await getTicketsEvent(eventId!);
        setTickets(allTickets);
      } catch (error) {
        console.error("Error fetching events: ", error);
      }
      setLoading(false);
    };

    fetchEvents();
  }, [eventId]);

  function calculateTotalAmount(tickets: TicketDataType[]): number {
    let total = tickets.reduce((sum, ticket) => sum + ticket.amount, 0);
    if (total >= 100000) {
      return parseFloat(total.toFixed(0)); // No decimal places for total 100,000 and above
    } else if (total >= 10000) {
        return parseFloat(total.toFixed(1)); // One decimal place for total 10,000 to 99,999
    } else {
        return parseFloat(total.toFixed(2)); // Two decimal places for total below 10,000
    }
  }

  if (loading) {
    return (
      <div className="w-full h-full">
        <EventPageSkeleton isMdScreen={isMdScreen} width={widthCard} height={availableHeight!} />
      </div>
    );
  }

  return (
    <div
      className="lg:w-[85%] flex flex-col overflow-x-hidden overflow-y-hidden md:overflow-y-hidden pt-2 md:gap-8 md:pt-8 md:pl-8 md:pb-8 lg:ml-[15%] max-md:grid max-md:grid-cols-1 max-md:grid-rows-2"
      style={{ height: availableHeight! - 16 }}
    >
      <div className="w-full h-full max-md:pl-8 max-md:pr-8 max-md:py-2 md:pr-0 md:mb-0 max-md:row-span-1">
        <ErrorBoundaryCard errorMessage={t_error("unexpected_error")}>
          <ProgressIndicatorCard
            size={window.innerWidth < 768 ? availableHeight! / 2 : (availableHeight! - 155) / 2}
            title={t("ticket_sold")}
            currentNumber={tickets.length}
            maxNumber={eventData!.availableTickets}
            unit=""
          />
        </ErrorBoundaryCard>
      </div>
      <div className="w-full h-full max-md:pl-8 max-md:pr-8 max-md:py-2 md:pr-0 md:mb-0 max-md:row-span-1">
        <ErrorBoundaryCard errorMessage={t_error("unexpected_error")}>
          <ProgressIndicatorCard
            size={window.innerWidth < 768 ? availableHeight! / 2 : (availableHeight! - 155) / 2}
            title={t("amout_received")}
            currentNumber={calculateTotalAmount(tickets)}
            maxNumber={eventData!.availableTickets * eventData!.priceNormalTicket}
            unit={eventData!.currency}
          />
        </ErrorBoundaryCard>
      </div>
    </div>
  );
};

export default EventPage;
