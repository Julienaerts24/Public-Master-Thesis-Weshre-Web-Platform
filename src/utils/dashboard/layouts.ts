import { LayoutItem } from "react-grid-layout-next";
import {breakpoints, SavedLayoutItemType, LayoutMap, SavedLayoutMap} from "@/type/dashboardType";
import TotalEventsCard from "@/components/Dashboard_widgets/total_events";
import TotalParticipantsCard from "@/components/Dashboard_widgets/total_participants";
import TotalTicketsCard from "@/components/Dashboard_widgets/total_tickets";
import TopNationalitiesCard from "@/components/Dashboard_widgets/top_nationalities";
import TopParticipantsCard from "@/components/Dashboard_widgets/top_participants";
import TotalESNCard from "@/components/Dashboard_widgets/total_esn_card";
import PeriodicGraphCard from "@/components/Dashboard_widgets/periodic_graph";
import SalesCard from "@/components/Dashboard_widgets/sales";
import { AvailableComponent } from "@/type/dashboardType"
  
// Convert needed because can't have undefined object in firebase. And if we give a value to isDragable and isResizable then widget can be change even when isModify is false.
export const convertToLayoutItem = (savedItem: SavedLayoutItemType): LayoutItem => {
    return {
      ...savedItem,
      isResizable: (savedItem.minW == savedItem.maxW && savedItem.minH == savedItem.maxH) ? false : undefined,
    };
  };
  
  export const convertSavedLayoutMapToLayoutMap = (savedLayoutMap: SavedLayoutMap): LayoutMap => {
    const layoutMap: LayoutMap = {
      xl: savedLayoutMap.xl.map(convertToLayoutItem),
      lg: savedLayoutMap.lg.map(convertToLayoutItem),
      sm: savedLayoutMap.sm.map(convertToLayoutItem),
      phone: savedLayoutMap.phone.map(convertToLayoutItem),
    };
    return layoutMap;
  };
  
  export const convertToSavedLayoutItem = (layoutItem: LayoutItem): SavedLayoutItemType => {
    return {
      i: layoutItem.i,
      x: layoutItem.x,
      y: layoutItem.y,
      w: layoutItem.w,
      h: layoutItem.h,
      minW: layoutItem.minW ?? 1,
      maxW: layoutItem.maxW ?? 1,
      minH: layoutItem.minH ?? 1,
      maxH: layoutItem.maxH ?? 1,
    };
  };
  
  export const convertLayoutMapToSavedLayoutMap = (layoutMap: LayoutMap): SavedLayoutMap => {
    const savedLayoutMap: SavedLayoutMap = {
      xl: layoutMap.xl.map(convertToSavedLayoutItem),
      lg: layoutMap.lg.map(convertToSavedLayoutItem),
      sm: layoutMap.sm.map(convertToSavedLayoutItem),
      phone: layoutMap.phone.map(convertToSavedLayoutItem),
    };
    return savedLayoutMap;
  };
  
  export const getAvailableComponentsToAdd = (layout: LayoutItem[]): string[] => {
    const availableComponents = [
      { i: "total_event", component: TotalEventsCard },
      { i: "total_participant", component: TotalParticipantsCard },
      { i: "total_ticket", component: TotalTicketsCard },
      { i: "top_nationalities", component: TopNationalitiesCard },
      { i: "top_20", component: TopParticipantsCard },
      // { i: "esn_card", component: TotalESNCard },
      { i: "graph", component: PeriodicGraphCard },
      { i: "sales", component: SalesCard },
    ];
    return availableComponents.filter(comp => !layout.some(layoutItem => layoutItem.i === comp.i)).map(comp => comp.i);
  };

  export const getComponentsToAddInitialValues = (): AvailableComponent[] => {
    return [
      {component: TotalEventsCard, layout:{ i: "total_event", x: 0, y: 0, w: 1, h: 1, minW: 1, maxW: 1, minH: 1, maxH: 1, isResizable: false}},
      {component: TotalTicketsCard, layout:{ i: "total_ticket", x: 0, y: 0, w: 1, h: 1, minW: 1, maxW: 1, minH: 1, maxH: 1, isResizable: false}},
      {component: TotalParticipantsCard, layout:{ i: "total_participant", x: 0, y: 0, w: 1, h: 1, minW: 1, maxW: 1, minH: 1, maxH: 1, isResizable: false}},
      {component: TopNationalitiesCard, layout:{ i: "top_nationalities", x: 0, y: 0, w: 2, h: 1, minW: 1, maxW: 4, minH: 1, maxH: 1}},
      {component: TopParticipantsCard, layout:{ i: "top_20", x: 0, y: 0, w: 1, h: 2, minW: 1, maxW: 1, minH: 2, maxH: 4}},
      // {component: TotalESNCard, layout:  { i: "esn_card", x: 0, y: 0, w: 2, h: 1, minW: 1, maxW: 2, minH: 1, maxH: 1}},
      {component: PeriodicGraphCard, layout:{ i: "graph", x: 0, y: 0, w: 2, h: 2, minW: 2, maxW: 2, minH: 2, maxH: 2, isResizable: false}},
      {component: SalesCard, layout:  { i: "sales", x: 0, y: 0, w: 2, h: 3, minW: 2, maxW: 2, minH: 3, maxH: 3, isResizable: false}},
    ];
  };
  
  export const computeGrid = (layoutItems: LayoutItem[], gridWidth: number): boolean[] => {
    let highestIndex = 0;
    layoutItems.forEach(item => {
      const index = (item.y + item.h - 1) * gridWidth + (item.x + item.w - 1);
      highestIndex = Math.max(highestIndex, index);
    });
  
    const grid = new Array(highestIndex + 1).fill(false);
  
    layoutItems.forEach(item => {
      for (let x = item.x; x < item.x + item.w; x++) {
        for (let y = item.y; y < item.y + item.h; y++) {
          grid[y * gridWidth + x] = true;
        }
      }
    });
    return grid;
  };
  