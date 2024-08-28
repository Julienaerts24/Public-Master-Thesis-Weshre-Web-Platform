'use client'

import { getPerformance, trace } from "firebase/performance"; 

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './/custom_movable_item.css'
import React, { useState, useEffect} from "react";
import { useTranslations } from "next-intl";
import { ResponsiveGridLayout, LayoutItem } from "react-grid-layout-next";
import { useAtomValue } from "jotai";
import { AvailableHeightAtom } from "@/atoms/atoms_events"
import CircleIconButton from "@/components/Buttons/circle_icon_button";
import TotalEventsCard from "@/components/Dashboard_widgets/total_events";
import TotalParticipantsCard from "@/components/Dashboard_widgets/total_participants";
import TotalTicketsCard from "@/components/Dashboard_widgets/total_tickets";
import TopNationalitiesCard from "@/components/Dashboard_widgets/top_nationalities";
import TopParticipantsCard from "@/components/Dashboard_widgets/top_participants";
import TotalESNCard from "@/components/Dashboard_widgets/total_esn_card";
import PeriodicGraphCard from "@/components/Dashboard_widgets/periodic_graph";
import SalesCard from "@/components/Dashboard_widgets/sales";
import LoadingDots from "@/components/Loading";
import AddDashboardWidget from '@/components/Modals/add_dashboard_widget';
import {useDisclosure} from '@nextui-org/react';
import { useAtom } from "jotai";
import { isModifyAtom, saveSelectedAtom, nameSaveSelectedAtom} from "@/atoms/atoms_dashboard";
import { saveNewDashboardLayout, deleteAllDashboardUser, updateDashboardLayout, getDashboardsUser, DashboardsType} from "@/services/dashboardLayoutService"
import {getEventsDocumentDataOfUser, TicketDataType, NationalityData, getDataDashboard, DataYear} from "@/services/dashboardDataService"
import { UserInfo } from "@/services/eventService";
import CardSkeleton from "@/components/Skeletons/card_skeleton";
// import NameSavesDashboardLayouts from "@/components/Menus/saves_dashboard_menu";
import {breakpoints, SavedLayoutItemType, LayoutMap, SavedLayoutMap} from "@/type/dashboardType";
import { convertSavedLayoutMapToLayoutMap, convertLayoutMapToSavedLayoutMap, getAvailableComponentsToAdd } from "@/utils/dashboard/layouts";
import { computeGrid, findPositionForNewItem } from "@/utils/dashboard/add_components";
import { useAuth } from "@/context/AuthContext";
import ErrorBoundaryCard from "@/components/Errors/error_boundary_card";
import ConfirmModal from '@/components/Modals/confirm_modal';

export default function MyDashboard() {
  const t = useTranslations("MyDashboard");
  const t_error = useTranslations("ErrorBoundaryCard");
  const [isModify, setIsModify] = useAtom(isModifyAtom); // use atom instead of useState because if switch from "< 640" at "> 640" Rerender and lose of modification
  // const [saveSelected, setSaveSelected] = useAtom(saveSelectedAtom); 
  // const [inputValue, setInputValue] = useAtom(nameSaveSelectedAtom);
  // const [nameSave, setNameSave] = useAtom(nameSaveSelectedAtom);
  const availableHeight = useAtomValue(AvailableHeightAtom);
  const [sizeScreen, setsizeScreen] = useState<breakpoints>(window.innerWidth >= 1280 ? "xl" : window.innerWidth >= 1024 ? "lg" : window.innerWidth >= 640 ? "sm" : "phone");
  const [width, setWidth] = useState(window.innerWidth < 640 ? window.innerWidth : window.innerWidth - 88);
  const [isLoading, setIsLoading] = useState(true);
  
  const { isOpen: isAddWidgetOpen, onOpen: onAddWidgetOpen, onOpenChange: onAddWidgetOpenChange } = useDisclosure();
  const { isOpen: isConfirmationOpen, onOpen: onConfirmationOpen, onOpenChange: onConfirmationOpenChange, onClose: onConfirmationClose } = useDisclosure();
  const default_layouts : LayoutMap = {
    xl:[
      { i: "total_event", x: 0, y: 0, w: 1, h: 1, minW: 1, maxW: 1, minH: 1, maxH: 1, isResizable: false},
      { i: "total_participant", x: 1, y: 0, w: 1, h: 1, minW: 1, maxW: 1, minH: 1, maxH: 1, isResizable: false},
      { i: "total_ticket", x: 2, y: 0, w: 1, h: 1, minW: 1, maxW: 1, minH: 1, maxH: 1, isResizable: false},
      { i: "top_nationalities", x: 3, y: 0, w: 2, h: 1, minW: 1, maxW: 4, minH: 1, maxH: 1},
      { i: "top_20", x: 4, y: 1, w: 1, h: 3, minW: 1, maxW: 2, minH: 2, maxH: 4},
      { i: "graph", x: 0, y: 1, w: 2, h: 3, minW: 2, maxW: 2, minH: 2, maxH: 4},
      { i: "sales", x: 2, y: 1, w: 2, h: 3, minW: 2, maxW: 2, minH: 3, maxH: 3, isResizable: false},
    ],
    lg:[
      { i: "total_event", x: 0, y: 0, w: 1, h: 1, minW: 1, maxW: 1, minH: 1, maxH: 1, isResizable: false},
      { i: "total_participant", x: 1, y: 0, w: 1, h: 1, minW: 1, maxW: 1, minH: 1, maxH: 1, isResizable: false},
      { i: "total_ticket", x: 2, y: 0, w: 1, h: 1, minW: 1, maxW: 1, minH: 1, maxH: 1, isResizable: false},
      { i: "top_nationalities", x: 2, y: 1, w: 1, h: 1, minW: 1, maxW: 4, minH: 1, maxH: 1},
      { i: "top_20", x: 4, y: 0, w: 1, h: 2, minW: 1, maxW: 2, minH: 2, maxH: 4},
      { i: "graph", x: 2, y: 2, w: 2, h: 2, minW: 2, maxW: 2, minH: 2, maxH: 4},
      { i: "sales", x: 0, y: 1, w: 2, h: 3, minW: 2, maxW: 2, minH: 3, maxH: 3, isResizable: false},
    ],
    sm:[
      { i: "total_event", x: 0, y: 0, w: 1, h: 1, minW: 1, maxW: 1, minH: 1, maxH: 1, isResizable: false},
      { i: "total_participant", x: 1, y: 0, w: 1, h: 1, minW: 1, maxW: 1, minH: 1, maxH: 1, isResizable: false},
      { i: "total_ticket", x: 2, y: 0, w: 1, h: 1, minW: 1, maxW: 1, minH: 1, maxH: 1, isResizable: false},
      { i: "top_nationalities", x: 0, y: 1, w: 3, h: 1, minW: 1, maxW: 4, minH: 1, maxH: 1},
      { i: "top_20", x: 2, y: 2, w: 1, h: 4, minW: 1, maxW: 2, minH: 2, maxH: 4},
      { i: "graph", x: 0, y: 1, w: 2, h: 2, minW: 2, maxW: 2, minH: 2, maxH: 4},
      { i: "sales", x: 0, y: 3, w: 2, h: 2, minW: 2, maxW: 2, minH: 2, maxH: 2, isResizable: false},
    ],
    phone:[
      { i: "total_event", x: 0, y: 0, w: 1, h: 1, minW: 1, maxW: 1, minH: 1, maxH: 1, isResizable: false},
      { i: "total_participant", x: 1, y: 1, w: 1, h: 1, minW: 1, maxW: 1, minH: 1, maxH: 1, isResizable: false},
      { i: "top_nationalities", x: 1, y: 0, w: 1, h: 1, minW: 1, maxW: 4, minH: 1, maxH: 1},
      { i: "total_ticket", x: 0, y: 1, w: 1, h: 1, minW: 1, maxW: 1, minH: 1, maxH: 1, isResizable: false},
      { i: "top_20", x: 0, y: 6, w: 2, h: 3, minW: 2, maxW: 2, minH: 2, maxH: 4},
      { i: "graph", x: 0, y: 4, w: 2, h: 2, minW: 2, maxW: 2, minH: 2, maxH: 4},
      { i: "sales", x: 0, y: 2, w: 2, h: 2, minW: 2, maxW: 2, minH: 2, maxH: 2, isResizable: false},
    ],
  }

  const [layout, setLayout] = useState<LayoutItem[]>([]);
  const [layouts, setLayouts] = useState<LayoutMap>();
  // const [listSavesNames, setListSavesNames] = useState<string[]>();
  const [dashboardData, setDashboardData] = useState<DashboardsType[]>([]);
  const [gridXl, setGridXl] = useState<boolean[]>([]);
  const [gridLg, setGridLg] = useState<boolean[]>([]);
  const [gridSm, setGridSm] = useState<boolean[]>([]);
  const [gridPhone, setGridPhone] = useState<boolean[]>([]);

  const [totalEvents, setTotalEvents] = useState<number | undefined>();
  const [totalParticipants, setTotalParticipants] = useState<number | undefined>();
  const [totalTickets, setTotalTickets] = useState<number | undefined>();
  const [allNationalities, setAllNationalities] = useState<NationalityData[] | undefined>();
  const [listUserInfo, setListUserInfo] = useState<UserInfo[] | undefined>();
  const [dataYears, setDataYears] = useState<DataYear[] | undefined>();
  const [acceptedTickets, setAcceptedTickets] = useState<TicketDataType[] | undefined>();
  const [refundedTickets, setRefundedTickets] = useState<TicketDataType[] | undefined>();
  const { user } = useAuth();

  const updateToDefaultLayout = async () => {
    setIsLoading(true);
    setDashboardData([]);
    setLayouts(default_layouts) 
    if (window.innerWidth >= 1280) setLayout(default_layouts.xl);
    else if (window.innerWidth >= 1024) setLayout(default_layouts.lg);
    else if (window.innerWidth >= 640) setLayout(default_layouts.sm);
    else setLayout(default_layouts.phone);
    setGridXl(computeGrid(default_layouts.xl, 5));
    setGridLg(computeGrid(default_layouts.lg, 4));
    setGridSm(computeGrid(default_layouts.sm, 3));
    setGridPhone(computeGrid(default_layouts.phone, 2));
    setIsLoading(false);
  }

  useEffect(() => {
    const performance = getPerformance();
    const dashboardTrace = trace(performance, 'dashboard_load_time');
    dashboardTrace.start();

    const handleResize = () => {
      setWidth(window.innerWidth < 640 ? window.innerWidth : window.innerWidth - 80);
    };

    const setInitialLayout = async () => {
      const data : DashboardsType[] = await getDashboardsUser(user.uid == "UejXmdldJweqYzIu2aLixhrjMdz2" ? "mDlFjIykC9WUsB9EIT26mzyhUxm1" : user.uid);
      setDashboardData(data);
      const initialLayout = data.length == 0 ? default_layouts : convertSavedLayoutMapToLayoutMap(data[0].layouts);
      setLayouts(initialLayout) 
      // const initialNames = data.length == 0 ? ["Default"] : data.map(item => item.name);
      // setListSavesNames(initialNames);
      if (window.innerWidth >= 1280) setLayout(initialLayout.xl);
      else if (window.innerWidth >= 1024) setLayout(initialLayout.lg);
      else if (window.innerWidth >= 640) setLayout(initialLayout.sm);
      else setLayout(initialLayout.phone);
      setGridXl(computeGrid(initialLayout.xl, 5));
      setGridLg(computeGrid(initialLayout.lg, 4));
      setGridSm(computeGrid(initialLayout.sm, 3));
      setGridPhone(computeGrid(initialLayout.phone, 2));
      setIsLoading(false);
      dashboardTrace.stop();
    }

    const fetchData = async () => {
      try {
        const EventsData = await getEventsDocumentDataOfUser(user.uid == "UejXmdldJweqYzIu2aLixhrjMdz2" ? "mDlFjIykC9WUsB9EIT26mzyhUxm1" : user.uid); 
        if (EventsData != null) {
          const result = await getDataDashboard(EventsData);
          if (result !== null) {
            const tempTotalNumberTickets = result.totalNumberTickets;
            const tempTotalNumberParticipants = result.totalNumberParticipants;
            const tempTicketDatasAccepted = result.ticketDatasAccepted;
            const tempTicketDatasRefunded = result.ticketDatasRefunded;
            const tempNationalitiesData = result.nationalitiesData;
            const tempListUserInfo = result.listUserInfo;
            const tempDataYears = result.dataYears;
            
            setTotalEvents(EventsData.size);
            setTotalTickets(tempTotalNumberTickets);
            setTotalParticipants(tempTotalNumberParticipants);
            setAcceptedTickets(tempTicketDatasAccepted);
            setRefundedTickets(tempTicketDatasRefunded);
            setAllNationalities(tempNationalitiesData);
            setListUserInfo(tempListUserInfo);
            setDataYears(tempDataYears);
          }   
          /*
          getNumberParticipants(EventsData).then(tempTotalParticipants => {setTotalParticipants(tempTotalParticipants);}).catch(error => console.error("Error fetching number of participants: ", error));
          getDataDashboard(EventsData).then(tempAllNationalities => {setAllNationalities(tempAllNationalities);}).catch(error => console.error("Error fetching all nationalities: ", error));
          getTicketsUser(EventsData).then(tempTickets => {setAcceptedTickets(tempTickets[0]);setRefundedTickets(tempTickets[1]);}).catch(error => console.error("Error fetching tickets user: ", error));
          getUsersEvent("1LogqRBCV8mnqCg9XxhL").then(UserData => {setListUserInfo(UserData);}).catch(error => console.error("Error fetching user event data: ", error));
          */
        }
      } catch (error) {
        console.error("Error fetching events: ", error);
      }
    }

    handleResize();
    setInitialLayout();
    fetchData();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* Usefull if want to have multiple dashboard save
  useEffect(() => {
    if(!isLoading){
      const selectedLayout : LayoutMap = dashboardData[saveSelected].layouts;
      setLayouts(selectedLayout);
    }
  }, [saveSelected]);
  */

  const renderComponent = (id: string) => {
    let component: JSX.Element | null = null;
    switch (id) {
      case "total_event":
        component = <ErrorBoundaryCard errorMessage={t_error("unexpected_error")}><TotalEventsCard totalEvents={totalEvents} /></ErrorBoundaryCard>;
        break;
      case "total_participant":
        component = <ErrorBoundaryCard errorMessage={t_error("unexpected_error")}><TotalParticipantsCard totalParticipants={totalParticipants}/></ErrorBoundaryCard>;
        break;
      case "total_ticket":
        component = <ErrorBoundaryCard errorMessage={t_error("unexpected_error")}><TotalTicketsCard totalTickets={totalTickets}/></ErrorBoundaryCard>;
        break;
      case "top_nationalities":
        component = <ErrorBoundaryCard errorMessage={t_error("unexpected_error")}><TopNationalitiesCard allNationalities={allNationalities}/></ErrorBoundaryCard>;
        break;
      case "top_20":
        component = <ErrorBoundaryCard errorMessage={t_error("unexpected_error")}><TopParticipantsCard listUserInfo={listUserInfo} /></ErrorBoundaryCard>;
        break;
      case "esn_card":
        component = <ErrorBoundaryCard errorMessage={t_error("unexpected_error")}><TotalESNCard/></ErrorBoundaryCard>;
        break;
      case "graph":
        component = <ErrorBoundaryCard errorMessage={t_error("unexpected_error")}><PeriodicGraphCard dataYears={dataYears}/></ErrorBoundaryCard>;
        break;
      case "sales":
        component = <ErrorBoundaryCard errorMessage={t_error("unexpected_error")}><SalesCard acceptedTickets={acceptedTickets} refundedTickets={refundedTickets}/></ErrorBoundaryCard>;
        break;
      default:
        component = <ErrorBoundaryCard errorMessage={t_error("unexpected_error")}><CardSkeleton /></ErrorBoundaryCard>
        break;
    }
  
    return (
      <div aria-label={id} className="h-full w-full flex">
        {isModify && (
          <div aria-label={`delete_${id}`} className="absolute right-[-5px] top-[-5px] z-20">
            <CircleIconButton
              circleSize={(sizeScreen !== 'phone' && sizeScreen !== 'sm') ? 25 : 35}
              iconSize={(sizeScreen !== 'phone' && sizeScreen !== 'sm') ? 15 : 22}
              circleColor="#ff5757"
              iconFileAddress="/icons/cross_white.svg"
              responsiveness={10}
              onClick={() => handleRemoveComponent(id)}
            />
          </div>
        )}
        <div className={`w-full h-full ${isModify ? 'select-none' : ''}`}>
          {isModify && <div className='w-full h-full absolute left-0 top-0 bg-transparent z-10'></div>}
          {component}
        </div>
      </div>
    );
  };
  

const handleRemoveComponent = (componentId: string) => {
  // Update the layout for the current screen size
  setLayout(prevLayout => prevLayout.filter(item => item.i !== componentId));

  // Update the layouts object to remove the component from all layouts
  setLayouts(prevLayouts => {
    const updatedLayouts = { ...prevLayouts! };
    updatedLayouts["xl"] = updatedLayouts["xl"]!.filter(item => item.i !== componentId);
    setGridXl(computeGrid(updatedLayouts["xl"], 5));
    updatedLayouts["lg"] = updatedLayouts["lg"]!.filter(item => item.i !== componentId);
    setGridLg(computeGrid(updatedLayouts["lg"], 4));
    updatedLayouts["sm"] = updatedLayouts["sm"]!.filter(item => item.i !== componentId);
    setGridSm(computeGrid(updatedLayouts["sm"], 3));
    updatedLayouts["phone"] = updatedLayouts["phone"]!.filter(item => item.i !== componentId);
    setGridPhone(computeGrid(updatedLayouts["phone"], 2));
    return updatedLayouts;
  });
};

/* Usefull if want to have multiple dashboard save
const handleRemoveSave = (index: number) => {
  if (dashboardData.length != 0){
    deleteDashboard(dashboardData[saveSelected].id)
    const newDashboard = dashboardData!.filter((_, i) => i !== index);
    setDashboardData(newDashboard);
    const initialLayout = newDashboard.length == 0 ? default_layouts : convertSavedLayoutMapToLayoutMap(newDashboard[0].layouts);
    const initialNames = newDashboard.length == 0 ? ["Default"] : listSavesNames!.filter((_, i) => i !== index);
    setLayouts(initialLayout) 
    setListSavesNames(initialNames);
    if (window.innerWidth >= 1280) setLayout(initialLayout.xl);
    else if (window.innerWidth >= 1024) setLayout(initialLayout.lg);
    else if (window.innerWidth >= 640) setLayout(initialLayout.sm);
    else setLayout(initialLayout.phone);
    setGridXl(computeGrid(initialLayout.xl, 5));
    setGridLg(computeGrid(initialLayout.lg, 4));
    setGridSm(computeGrid(initialLayout.sm, 3));
    setGridPhone(computeGrid(initialLayout.phone, 2));
  }
};
*/ 

const handleAddComponent = (newLayoutItem: LayoutItem) => {
  const positionXl = findPositionForNewItem(gridXl, 5, newLayoutItem.w, newLayoutItem.h);
  const newItemXl = { ...newLayoutItem, ...positionXl };
  const positionLg = findPositionForNewItem(gridLg, 4, newLayoutItem.w, newLayoutItem.h);
  const newItemLg = { ...newLayoutItem, ...positionLg };
  const newLayoutItemSmPhone = newLayoutItem.i === "sales" ? { ...newLayoutItem, h: 2, minH: 2, maxH: 2 } : newLayoutItem;
  const positionSm = findPositionForNewItem(gridSm, 3, newLayoutItemSmPhone.w, newLayoutItemSmPhone.h);
  const newLayoutItemPhone = newLayoutItemSmPhone.i === "top_20" ? { ...newLayoutItemSmPhone, w: 2, minW: 2} : newLayoutItemSmPhone;
  const newItemSm = { ...newLayoutItemSmPhone, ...positionSm };
  const positionPhone = findPositionForNewItem(gridPhone, 2, newLayoutItemPhone.w, newLayoutItemPhone.h);
  const newItemPhone = { ...newLayoutItemPhone, ...positionPhone };

  if (window.innerWidth >= 1280) setLayout(prevLayout => [...prevLayout, newItemXl]);
  else if (window.innerWidth >= 1024) setLayout(prevLayout => [...prevLayout, newItemLg]);
  else if (window.innerWidth >= 640) setLayout(prevLayout => [...prevLayout, newItemSm]);
  else setLayout(prevLayout => [...prevLayout, newItemPhone]);;

  setLayouts(prevLayouts => {
    const updatedLayouts = { ...prevLayouts! };
    updatedLayouts["xl"] = [...(prevLayouts!["xl"] || []), newItemXl];
    setGridXl(computeGrid(updatedLayouts["xl"], 5));
    updatedLayouts["lg"] = [...(prevLayouts!["lg"] || []), newItemLg];
    setGridLg(computeGrid(updatedLayouts["lg"], 4));
    updatedLayouts["sm"] = [...(prevLayouts!["sm"] || []), newItemSm];
    setGridSm(computeGrid(updatedLayouts["sm"], 3));
    updatedLayouts["phone"] = [...(prevLayouts!["phone"] || []), newItemPhone];
    setGridPhone(computeGrid(updatedLayouts["phone"], 2));
    return updatedLayouts;
  });
};

const handleDashboardSave = async () => {
  if (dashboardData.length == 0){
    saveNewDashboardLayout("save", convertLayoutMapToSavedLayoutMap(layouts!), user.uid == "UejXmdldJweqYzIu2aLixhrjMdz2" ? "mDlFjIykC9WUsB9EIT26mzyhUxm1" : user.uid).then((id) => {
        if (typeof id === 'string') {
          setDashboardData([{ id: id, name: "save", layouts: convertLayoutMapToSavedLayoutMap(layouts!) }]);
        }
      })
  } else{
    updateDashboardLayout(
      dashboardData[0].id, // if want to have multiple dashboard save: dashboardData[saveSelected].id
      "save",
      convertLayoutMapToSavedLayoutMap(layouts!))
  }
};

const onLayoutChange = (layoutChangeProps: { 
  layout: LayoutItem[], 
  layouts: Record<string, LayoutItem[]> 
}) => {
  const { layout, layouts } = layoutChangeProps;

  setLayout(layout);
  setLayouts(layouts as LayoutMap);
  setGridXl(computeGrid(layouts["xl"], 5));
  setGridLg(computeGrid(layouts["lg"], 4));
  setGridSm(computeGrid(layouts["sm"], 3));
  setGridPhone(computeGrid(layouts["phone"], 2));
};

const onConfirmDelete = async () => {
    try {
      await deleteAllDashboardUser(user.uid == "UejXmdldJweqYzIu2aLixhrjMdz2" ? "mDlFjIykC9WUsB9EIT26mzyhUxm1" : user.uid)
      updateToDefaultLayout();
      setIsModify(false)
      onConfirmationClose();
    } catch (error) {
      console.error("Failed to delete event: ", error);
    }
};

if (isLoading) {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <LoadingDots size={50} />
    </div>
  );
}

return (
  <div className="flex flex-col h-full">
    {/* Usefull if want to have multiple dashboard save
    <div className="flex flex-col sm:flex-row justify-center items-between sm:justify-between sm:items-center h-[80px] w-full px-5 flex-shrink-0">
      <div className="text-2xl sm:text-3xl lg:text-4xl font-bold flex-shrink-0">
    */}
    <div className="flex flex-row justify-between items-center h-[80px] w-full px-5 flex-shrink-0">
      <div className="text-2xl sm:text-3xl lg:text-4xl font-bold flex-shrink-0">
        {t("page_title")}
      </div>
      <div className='flex flex-row h-full w-full justify-end items-center'>
        {/* Usefull if want to have multiple dashboard save
        <div className="w-full h-full sm:max-w-[310px] pr-4 sm:px-4 py-2 sm:py-5 flex justify-center flex-shrink-1">
          <NameSavesDashboardLayouts listSavesNames={listSavesNames!} cantBeChange={isModify}/>
        </div>
        */}
        <div className="flex flex-row gap-3">
          {isModify && <CircleIconButton
            aria-label="default_layout"
            circleSize={60}
            iconSize={40}
            sizeMessage={18}
            sizePaddingMessage={13}
            circleColor="#ff5757"
            messageToolTip={t("tip_back_default_layout")}
            placementToolTip='bottom'
            iconFileAddress={"/icons/delete.svg"}
            onClick={onConfirmationOpen}
          />}
          {isModify ? <CircleIconButton
            aria-label="add_widget"
            circleSize={60}
            iconSize={40}
            sizeMessage={18}
            sizePaddingMessage={13}
            circleColor="#ff5757"
            messageToolTip={isModify ? t("tip_add_widget") : t("tip_delete_save")}
            placementToolTip='bottom'
            iconFileAddress={
              isModify
                ? "/icons/plus_white.svg"
                : "/icons/dashboard/delete.svg"
            }
            onClick={onAddWidgetOpen} // onClick={isModify ? onOpen : () => {deleteDashboard(dashboardData[0].id)}} if want to have multiple dashboard save: handleRemoveSave(saveSelected)
          /> : ""}
          <CircleIconButton
            arie-label="customize"
            circleSize={60}
            iconSize={40}
            sizeMessage={18}
            sizePaddingMessage={13}
            circleColor="#ff5757"
            messageToolTip={isModify ? t("tip_validate") : t("tip_customize")}
            placementToolTip={isModify ? 'bottom' : 'left'}
            iconFileAddress={
              isModify
                ? "/icons/dashboard/validation.svg"
                : "/icons/dashboard/customization.svg"
            }
            onClick={() => {
              if (isModify){
                /* if want to have multiple dashboard save:
                const newListSavesNames = [...listSavesNames!];
                newListSavesNames[saveSelected] = nameSave;  newListSavesNames[saveSelected] = nameSave;
                setListSavesNames(newListSavesNames);
                */
                handleDashboardSave();
              }
              // if want to have multiple dashboard save: else{setInputValue(listSavesNames![saveSelected]);}
              setIsModify(!isModify);
            }}
          />
        </div>
      </div>
    </div>
    <div className="overflow-y-auto overflow-x-hidden pb-[10px]">
      <ResponsiveGridLayout
        className="layout flex-grow dark:dark"
        layouts={layouts}
        breakpoints={{ xl: 1280 - 81, lg: 1024 - 81, sm: 639, phone: 0 }} // -81 because look the width given and not the screenWidth (80 for the size of the sideMenu, 1 for the fact that it use < instead of <=)
        cols={{ xl: 5, lg: 4, sm: 3, phone: 2 }}
        rowHeight={Math.max((sizeScreen == 'xl' || sizeScreen == 'lg') ? (availableHeight! - 30 - 3 * 30) / 4 : (sizeScreen == 'sm') ? (window.innerWidth - 70) / 3 - 45 : (window.innerWidth > 640) ? (window.innerWidth - 80) / 2 - 30 : window.innerWidth / 2 - 30 , 140)}
        width={width}
        margin={sizeScreen == 'phone' ? [20, 20] : [30, 30]}
        containerPadding={sizeScreen == 'phone' ? [20, 10] : [30, 10]}
        isDraggable={isModify}
        isResizable={isModify}
        onBreakpointChange={(newBreakpoint: string) => setsizeScreen(newBreakpoint as breakpoints)}
        onLayoutChange={onLayoutChange}
      >
        {layout.map((layoutItem) => (
          <div key={layoutItem.i}>
            {renderComponent(layoutItem.i)}
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
    <AddDashboardWidget 
      isOpen={isAddWidgetOpen} 
      onOpenChange={onAddWidgetOpenChange} 
      widgetIds={getAvailableComponentsToAdd(layout)} 
      onAdd={handleAddComponent}
      totalEvents={totalEvents!}
      totalTickets={totalTickets!}
      totalParticipants={totalParticipants!}
      allNationalities={allNationalities!}
      listUserInfo={listUserInfo!}
      dataYears={dataYears!}
      acceptedTickets={acceptedTickets!} 
      refundedTickets={refundedTickets!}
      />
      <ConfirmModal isOpen={isConfirmationOpen} onOpenChange={onConfirmationOpenChange} title={t('title_confirmation_default')} text={t('text_confirmation_default')} onCancel={() => onConfirmationOpenChange()} onConfirm={onConfirmDelete}/>
    </div>
    
  );
}