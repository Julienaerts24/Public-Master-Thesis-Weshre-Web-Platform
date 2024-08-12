import { LayoutItem } from "react-grid-layout-next";

export type breakpoints = 'xl' | 'lg' | 'sm' | 'phone';

export type SavedLayoutItemType = {
  i: string,
  x: number,
  y: number,
  w: number,
  h: number,
  minW: number,
  maxW: number,
  minH: number,
  maxH: number,
}

export type LayoutMap = Record<breakpoints, LayoutItem[]>;

export type SavedLayoutMap = Record<breakpoints, SavedLayoutItemType[]>;

export type DataType = {
  data: number;
  date: string;
};

export type AvailableComponent = {
  component: React.ComponentType<any>;
  layout: LayoutItem;
};