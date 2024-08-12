import React, {useState, useEffect} from "react";
import {Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Card, CardBody} from "@nextui-org/react";
import NumberCardGraph from "@/components/Cards/number_card_graph";
import PaymentSuceededRefundedCard from "@/components/Cards/payments_succeeded_refunded_card";
import { IoMdArrowDropdown } from "react-icons/io";
import CardSkeleton from "@/components/Skeletons/card_skeleton";
import { TicketDataType} from "@/services/dashboardDataService";
import {useTranslations} from 'next-intl';
import {DataType} from "@/type/dashboardType";

type PeriodType = "All" | "1 Year" | "6 Months" | "30 Days" | "7 Days" | "24 Hours";

type SalesCardProps = {
  acceptedTickets: TicketDataType[] | undefined;
  refundedTickets: TicketDataType[] | undefined;
};

const SalesCard: React.FC<SalesCardProps> = ({
  acceptedTickets,
  refundedTickets,
}) => {
  const t = useTranslations('MyDashboard');
  const [acceptedTicketsAmount, setAcceptedTicketsAmount] = useState(0);
  const [refundedTicketsAmount, setRefundedTicketsAmount] = useState(0);
  const [period, setPeriod] = useState<PeriodType>("All");
  const [allData, setAllData] = useState<DataType[]>([]);
  const [oneYearData, setOneYearData] = useState<DataType[]>([]);
  const [sixMonthData, setSixMonthsData] = useState<DataType[]>([]);
  const [thirtyDaysData, setThirtyDaysData] = useState<DataType[]>([]);
  const [sevenDaysData, setSevenDaysData] = useState<DataType[]>([]);
  const [twentyFourHoursData, setTwentyFourHoursData] = useState<DataType[]>([]);
  const [data, setData] = useState<DataType[]>([]);

  const filterAndSortTickets = (tickets: TicketDataType[], period: PeriodType) => {
    const now = new Date();
    return tickets.filter(ticket => {
      switch (period) {
        case "1 Year":
          const oneYearAgo = new Date(now.getUTCFullYear() - 1, now.getUTCMonth(), now.getUTCDate());
          return ticket.date >= oneYearAgo;
        case "6 Months":
          const sixMonthsAgo = new Date(now.getUTCFullYear(), now.getUTCMonth() - 6, now.getUTCDate());
          return ticket.date >= sixMonthsAgo;
        case "30 Days":
          const thirtyDaysAgo = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 30);
          return ticket.date >= thirtyDaysAgo;
        case "7 Days":
          const oneWeekAgo = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 7);
          return ticket.date >= oneWeekAgo;
        case "24 Hours":
          const twentyFourHoursAgo = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours() - 24);
          return ticket.date >= twentyFourHoursAgo;
        case "All":
          return true;
        default:
          return true;
      }
    }).sort((a, b) => a.date.getTime() - b.date.getTime());
};

const calculateTotalAmount = (tickets: TicketDataType[]): number => {
  return tickets.reduce((total, ticket) => total + ticket.amount, 0);
};

const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getUTCDate() + days);
  return result;
};

const getStartDate = (period: string) => {
  const now = new Date();
  switch (period) {
    case "1 Year":
      return new Date(now.setFullYear(now.getUTCFullYear() - 1));
    case "6 Months":
      return new Date(now.setMonth(now.getUTCMonth() - 6));
    case "30 Days":
      return addDays(now, -30);
    case "7 Days":
      return addDays(now, -7);
    case "24 Hours":
      return addDays(now, -1);
    default:
      return acceptedTickets!.length != 0 ? filterAndSortTickets(acceptedTickets!, "All")[0].date : new Date(now.setFullYear(now.getUTCFullYear() - 1));
  }
};

const generateDateArray = (startDate: Date, endDate: Date, granularity: 'month' | 'day' | 'hour'): DataType[] => {
  let currentDate = new Date(startDate);
  const dateArray: DataType[] = [];

  while (currentDate <= endDate) {
    let dateKey;

    switch (granularity) {
      case 'month':
        dateKey = `${monthNames[currentDate.getUTCMonth()]} ${currentDate.getUTCFullYear()}`;
        currentDate.setMonth(currentDate.getUTCMonth() + 1);
        break;
      case 'day':
        dateKey = `${currentDate.getUTCDate()} ${monthNames[currentDate.getUTCMonth()]}`;
        currentDate.setDate(currentDate.getUTCDate() + 1);
        break;
      case 'hour':
        dateKey = `${currentDate.getUTCHours()}:00`;
        currentDate.setHours(currentDate.getUTCHours() + 1);
        break;
      default:
        dateKey = '';
    }
    if (dateKey) {dateArray.push({ date: dateKey, data: 0 });}
  }

  return dateArray;
};

const monthNames = [t("Jan"), t("Feb"), t("Mar"), t("Apr"), t("May"), t("Jun"), t("Jul"), t("Aug"), t("Sep"), t("Oct"), t("Nov"), t("Dec")];
const groupAndSumAmounts = (tickets: TicketDataType[] = [], period: PeriodType, granularity: 'month' | 'day' | 'hour'): DataType[] => {
  const startDate = getStartDate(period);
  const endDate = new Date();
  const groupedData: DataType[] = generateDateArray(startDate, endDate, granularity);
  tickets.forEach(ticket => {
    if (ticket.date > startDate) {
    let dateKey : string;
    switch (granularity) {
      case 'month':
        dateKey = `${monthNames[ticket.date.getUTCMonth()]} ${ticket.date.getUTCFullYear()}`;
        break;
      case 'day':
        dateKey = `${ticket.date.getUTCDate()} ${monthNames[ticket.date.getUTCMonth()]}`;
        break;
      case 'hour':
        dateKey = `${ticket.date.getUTCHours()}:00`;
        break;
      default:
        dateKey = '';
    }

    if (dateKey != undefined) {
      const existingEntry = groupedData.find(entry => entry.date === dateKey);
      if (existingEntry) {
        existingEntry.data += ticket.amount;
      } else {
        groupedData.push({ date: dateKey, data: ticket.amount }); // Add new entry if not found => This should never happend
      }
    }
  }});

  return groupedData;
};

  useEffect(() => {
    if (acceptedTickets && refundedTickets) {
      const tempAllData = groupAndSumAmounts(filterAndSortTickets(acceptedTickets!, "All"), "All", 'month');
      setAllData(tempAllData);
      setData(tempAllData);
      setOneYearData(groupAndSumAmounts(filterAndSortTickets(acceptedTickets!, "1 Year"), "1 Year", 'month'));
      setSixMonthsData(groupAndSumAmounts(filterAndSortTickets(acceptedTickets!, "6 Months"), "6 Months", 'month'));
      setThirtyDaysData(groupAndSumAmounts(filterAndSortTickets(acceptedTickets!, "30 Days"), "30 Days", 'day'));
      setSevenDaysData(groupAndSumAmounts(filterAndSortTickets(acceptedTickets!, "7 Days"), "7 Days", 'day'));
      setTwentyFourHoursData(groupAndSumAmounts(filterAndSortTickets(acceptedTickets!, "24 Hours"), "24 Hours", 'hour'));
      setAcceptedTicketsAmount(calculateTotalAmount(filterAndSortTickets(acceptedTickets, period)));
      setRefundedTicketsAmount(calculateTotalAmount(filterAndSortTickets(refundedTickets, period)));
    }
  }, [acceptedTickets]);

  useEffect(() => {
    switch (period) {
      case "1 Year":
        setData(oneYearData);
        break;
      case "6 Months":
        setData(sixMonthData);
        break;
      case "30 Days":
        setData(thirtyDaysData);
        break;
      case "7 Days":
        setData(sevenDaysData);
        break;
      case "24 Hours":
        setData(twentyFourHoursData);
        break;
      default:
        setData(allData);
        break;
    }
    if (acceptedTickets && refundedTickets) {
      setAcceptedTicketsAmount(calculateTotalAmount(filterAndSortTickets(acceptedTickets, period)));
      setRefundedTicketsAmount(calculateTotalAmount(filterAndSortTickets(refundedTickets, period)));
    }
  }, [period]); 

  if (acceptedTickets == undefined || refundedTickets == undefined) return (<CardSkeleton />)

  const now = new Date();
  const startDate = acceptedTickets.length != 0 ? filterAndSortTickets(acceptedTickets, "All")[0].date : new Date(now.setFullYear(now.getUTCFullYear() - 1));
  return (
    <Card
      className="w-full h-full cursor-default shadow-none bg-redWS"
      style={{ borderRadius: 35 }}
    >
      <CardBody className="flex flex-col justify-evenly items-center">
        <div className="w-full flex flex-row justify-between items-center">
          <div className="self-start px-4 text-lg md:text-2xl font-semibold text-white">
            {t('title_sales')}
          </div>
          <Dropdown type="menu" className="dark:bg-darkGray">
            <DropdownTrigger>
              <div className="flex flex-row items-center px-4">
                <div className="self-center text-lg md:text-2xl font-semibold text-white">
                  {t(period)}
                </div>
                <IoMdArrowDropdown style={{ color: 'white', fontSize: '30px' }} />
              </div>
            </DropdownTrigger>
            <DropdownMenu aria-label="periodMenu">
              <DropdownItem key="allTime" onPress={() => {setPeriod("All")}}>
                <div className="text-center font-semibold text-xl">
                  {t('All')}
                </div>
              </DropdownItem>
              <DropdownItem key="year" onPress={() => {setPeriod("1 Year")}}>
                <div className="text-center font-semibold text-xl">
                  {t('1 Year')}
                </div>
              </DropdownItem>
              <DropdownItem key="6month" onPress={() => {setPeriod("6 Months")}}>
                <div className="text-center font-semibold text-xl">
                  {t('6 Months')}
                </div>
              </DropdownItem>
              <DropdownItem key="1month" onPress={() => {setPeriod("30 Days")}}>
                <div className="text-center font-semibold text-xl">
                  {t('30 Days')}
                </div>
              </DropdownItem>
              <DropdownItem key="week" onPress={() => {setPeriod("7 Days")}}>
                <div className="text-center font-semibold text-xl">
                  {t('7 Days')}
                </div>
              </DropdownItem>
              <DropdownItem key="today" onPress={() => {setPeriod("24 Hours")}}>
                <div className="text-center font-semibold text-xl">
                  {t('24 Hours')}
                </div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div className="w-full h-[55%] p-[2%]">
          <NumberCardGraph title={t('Total_revenues')} number={acceptedTicketsAmount} tickets={data} startDate={startDate}  period={period}/>
        </div>
        <div className="w-full h-[45%] p-[2%]">
          <PaymentSuceededRefundedCard title={t('payements')} acceptedAmount={acceptedTicketsAmount} refundedAmount={refundedTicketsAmount}/>
        </div>
      </CardBody>
    </Card>
  );
};

export default SalesCard;