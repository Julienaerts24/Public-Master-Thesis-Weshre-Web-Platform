export function formatDate(date: Date): string {
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // getUTCMonth() returns month from 0-11
    const year = date.getUTCFullYear().toString().slice(-2);
    return `${day}-${month}-${year}`;
}

export const formatEventDate = (date: Date): string => {
    const yearSuffix = ` '${date.getUTCFullYear().toString().slice(-2)}`;
    return `${date.getUTCDate()} ${new Intl.DateTimeFormat("en-US", {
      month: "short",
    }).format(date)}${yearSuffix}`;
  };
  
export const formatEventTime = (date: Date): string => {
    let hours = date.getUTCHours();
    let minutes: string | number = date.getUTCMinutes();
  
    minutes = minutes < 10 ? "0" + minutes : minutes;
  
    return `${hours}h${minutes}`;
  };