'use client'

import React, {useState} from "react";
import { Modal, ModalContent, ModalBody, Pagination} from "@nextui-org/react";
import {useTranslations} from 'next-intl';
import CircleIconButton from "@/components/Buttons/circle_icon_button";
import RedRoundedButton from "@/components/Buttons/rounded_button";
import TotalEventsCard from "@/components/Dashboard_widgets/total_events";
import TotalTicketsCard from "@/components/Dashboard_widgets/total_tickets";
import TotalParticipantsCard from "@/components/Dashboard_widgets/total_participants";
import TopNationalitiesCard from "@/components/Dashboard_widgets/top_nationalities";
import TopParticipantsCard from "@/components/Dashboard_widgets/top_participants";
import TotalESNCard from "@/components/Dashboard_widgets/total_esn_card";
import PeriodicGraphCard from "@/components/Dashboard_widgets/periodic_graph";
import SalesCard from "@/components/Dashboard_widgets/sales";
import { LayoutItem } from "react-grid-layout-next";
import {TicketDataType, NationalityData, DataYear} from "@/services/dashboardDataService"
import { UserInfo } from "@/services/eventService";
import CardSkeleton from "@/components/Skeletons/card_skeleton";
import { AvailableComponent } from "@/type/dashboardType"
import { getComponentsToAddInitialValues } from "@/utils/dashboard/layouts";

type AddDashboardWidgetModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  widgetIds: string[];
  onAdd: (item: LayoutItem) => void;
  totalEvents: number;
  totalTickets: number;
  totalParticipants: number;
  allNationalities: NationalityData[];
  listUserInfo: UserInfo[];
  dataYears: DataYear[];
  acceptedTickets: TicketDataType[];
  refundedTickets: TicketDataType[];
};

const AddDashboardWidgetModal: React.FC<AddDashboardWidgetModalProps> = ({isOpen, onOpenChange, widgetIds, onAdd, totalEvents, totalTickets, totalParticipants, allNationalities, listUserInfo, dataYears, acceptedTickets, refundedTickets}) => {
  const t = useTranslations('addDashboardWidget');
  const [currentIndex, setCurrentIndex] = useState(1);

  const availableComponents: AvailableComponent[] = getComponentsToAddInitialValues();

  const goToNext = () => {
    if (currentIndex < widgetIds.length)
      setCurrentIndex(currentIndex + 1);
  };

  const goToPrev = () => {
    if (currentIndex > 1) 
      setCurrentIndex(currentIndex - 1);
  };
  
  const AddLayoutItem = (widgetId: string) => {
    const component = availableComponents.find(comp => comp.layout.i === widgetId);
    if(component){
      onAdd(component.layout);
    }
  };

  const getComponentInfo = (widgetId: string) => {
    const component = availableComponents.find(comp => comp.layout.i === widgetId);
    if(component){
      return component;
    }
    return null;
  };

  const computeMaxDimensions = (widgetIds: string[]): { maxWidth: number; maxHeight: number } => {
    let maxWidth = 0;
    let maxHeight = 0;
    widgetIds.forEach((id) => {
      const componentInfo = getComponentInfo(id);
      if (componentInfo) {
        maxWidth = Math.max(maxWidth, componentInfo.layout.w);
        maxHeight = Math.max(maxHeight, componentInfo.layout.h);
      }
    });
    return { maxWidth, maxHeight };
  };

  const renderComponent = (id: string) => {
    const componentInfo = getComponentInfo(id);
    if (componentInfo) {
      const { maxWidth, maxHeight } = computeMaxDimensions(widgetIds);
      
      let component: JSX.Element | null = null;
      switch (id) {
        case "total_event":
          component = <TotalEventsCard totalEvents={totalEvents} />;
          break;
        case "total_participant":
          component = <TotalParticipantsCard totalParticipants={totalParticipants}/>;
          break;
        case "total_ticket":
          component = <TotalTicketsCard totalTickets={totalTickets}/>;
          break;
        case "top_nationalities":
          component = <TopNationalitiesCard allNationalities={allNationalities}/>;
          break;
        case "top_20":
          component = <TopParticipantsCard listUserInfo={listUserInfo} />;
          break;
        case "esn_card":
          component = <TotalESNCard/>;
          break;
        case "graph":
          component = <PeriodicGraphCard dataYears={dataYears}/>;
          break;
        case "sales":
          component = <SalesCard acceptedTickets={acceptedTickets} refundedTickets={refundedTickets}/>;
          break;
        default:
          component = (<CardSkeleton />)
          break;
      }
      const widthCellMaxHeight = (window.innerHeight - 200) / maxHeight;
      const widthCellMaxWidth = Math.min(584, window.innerWidth - 144) / maxWidth;
      const widthCell = Math.min(widthCellMaxHeight, widthCellMaxWidth);
      return <div className="py-5" style={{width: Math.max(componentInfo.layout.w * widthCell, 150), height: Math.max(componentInfo.layout.h * widthCell, 150)}}>
              {component}
             </div>;
    }
    return null;
  };

  const empty = widgetIds.length == 0
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size={empty ? "2xl" : "3xl"}
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
      <ModalContent className="bg-grayBackground dark:bg-darkGray">
      {empty ? 
        <ModalBody className="flex flex-col justify-center items-center py-10">
          <div className="text-lg lg:text-xl xl:text-2xl font-bold pb-7 text-center">
            {t("empty")}
          </div>
          <RedRoundedButton
                text={t('back')}
                sizeText={24}
                onClick={() => {onOpenChange(!open)}}
              />
        </ModalBody> :
            <ModalBody className="w-full h-full flex flex-row justify-start items-center p-5 pb-0">
            <div className="flex-shrink-0">
              <CircleIconButton
                circleSize={60}
                iconSize={35}
                circleColor="#ff5757"
                iconFileAddress="/icons/left_arrow_white.svg"
                onClick={goToPrev}
                isDisabled={currentIndex === 1}
              />
            </div>
            <div className="w-full flex flex-col justify-center items-center overflow-x-hidden">
              {renderComponent(widgetIds[currentIndex - 1])}
              <div className="pb-5">
                <RedRoundedButton
                  text={t('add')}
                  sizeText={Math.min(window.innerWidth / 25, 25)}
                  onClick={() => {
                    AddLayoutItem(widgetIds[currentIndex - 1])
                    if(currentIndex != 1) setCurrentIndex(currentIndex - 1)
                    onOpenChange(!open)
                  }}
                />
              </div>
              <div className="pb-5">
                <Pagination total={widgetIds.length} page={currentIndex} onChange={setCurrentIndex}/>
              </div>
            </div>
            <div className="flex-shrink-0">
              <CircleIconButton
                circleSize={60}
                iconSize={35}
                circleColor="#ff5757"
                iconFileAddress="/icons/right_arrow_white.svg"
                onClick={goToNext}
                isDisabled={currentIndex == widgetIds.length}
              />
            </div>
        </ModalBody>
      }
      </ModalContent>
    </Modal>
  );
};

export default AddDashboardWidgetModal;
