import { LayoutItem } from "react-grid-layout-next";

export const computeGrid = (layoutItems: LayoutItem[], gridWidth: number): boolean[] => {
    // Find the highest index that needs to be occupied = size of the initial grid
    let highestIndex = 0;
    layoutItems.forEach(item => {
      const index = (item.y + item.h - 1) * gridWidth + (item.x + item.w - 1);
      highestIndex = Math.max(highestIndex, index);
    });
  
    const grid = new Array(highestIndex + 1).fill(false);
  
    // Update the grid for each layout item
    layoutItems.forEach(item => {
      for (let x = item.x; x < item.x + item.w; x++) {
        for (let y = item.y; y < item.y + item.h; y++) {
          grid[y * gridWidth + x] = true;
        }
      }
    });
    return grid;
  };
  
export const findPositionForNewItem = (grid: boolean[], gridWidth: number, widgetWidth: number, widgetHeight: number): { x: number, y: number } => {
    let newX = 0;
    let newY = 0;
  
    while (true) {
      if (newX + widgetWidth <= gridWidth) {
        let isSpaceFree = true;
        for (let x = newX; x < newX + widgetWidth; x++) {
          for (let y = newY; y < newY + widgetHeight; y++) {
            if (doesCollide(grid, gridWidth, x, y)) {
              isSpaceFree = false;
              break;
            }
          }
          if (!isSpaceFree) {break;}
        }
        if (isSpaceFree) {return { x: newX, y: newY }}
      }
      newX++;
      if (newX + widgetWidth > gridWidth) {
        newX = 0;
        newY++;
      }
    }
  };
  
const doesCollide = (grid: boolean[], gridWidth: number, x: number, y: number): boolean => {
    let index = y * gridWidth + x;
    if (index >= grid.length) {
      return false; // Assuming unoccupied if out of current grid bounds
    }
    return grid[index];
  };