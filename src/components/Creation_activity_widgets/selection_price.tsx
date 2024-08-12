import React from "react";
import InputFloatNumber from "@/components/Inputs/input_float_number";
import {Select, SelectItem, Divider, useDisclosure} from "@nextui-org/react";
import { FaEuroSign, FaDollarSign } from "react-icons/fa";
import InformationModal from '@/components/Modals/information_modal';
import CircleIconButton from "@/components/Buttons/circle_icon_button";
import { useTranslations } from "next-intl";
import { currencyType, priceType } from '@/type/formType';
import {priceErrorType} from '@/type/formErrorType';

type PriceProps = {
  price: priceType;
  setPrice: (value: priceType) => void;
  currencies: currencyType[];
  title?: string;
  minValue?: number;
  maxValue?: number;
  disableChange?: boolean;
  errors?: priceErrorType;
};

const Price: React.FC<PriceProps> = ({
  price,
  setPrice,
  currencies,
  title = "",
  minValue = 0,
  maxValue,
  errors,
}) => {
  const t = useTranslations("Price");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const noCurrencies = (currencies.length === 0);

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCurrencyKey = e.target.value;
    const selectedCurrency = currencies.find(currency => currency.key === selectedCurrencyKey);
    if (selectedCurrency){ setPrice({...price, currency: {key: selectedCurrencyKey, title: selectedCurrency.title, symbole: selectedCurrency.symbole}});}
  };

  const calculateTotal = (value: string) => {
    if (value === "") return ""
    return (parseFloat(value) * 1.05).toFixed(2);
  };

  const handlePriceChange = (newPrice: string) => {
    setPrice({...price, price: newPrice});
  };

  const handleTotalChange = (totalValue: string) => {
    handlePriceChange((parseFloat(totalValue) / 1.05).toFixed(2))
  };
  return (
    <div className={`w-full flex flex-col bg-white dark:bg-darkGray rounded-3xl overflow-hidden my-5 py-4 ${errors ? "border-2 border-redError md:mb-2" : ""}`}>
      {title && <div className="text-lg lg:text-xl xl:text-2xl font-semibold px-4 pb-3">
        {title}
      </div> }
      {title && <Divider className="bg-black dark:bg-white opacity-75 mb-3" />}
      <div className={`w-full sm:max-h-[160px] grid ${noCurrencies ? "grid-cols-3" : "grid-cols-2 sm:grid-cols-4"} gap-5 px-2`}>
        <div className={`w-full h-full flex flex-col justify-between items-center px-1 gap-2 ${(errors?.price || errors?.currency) ? "sm:gap-0" : "sm:gap-3"}`}>
            <div className="h-[30px] sm:h-[50px] flex items-center text-base lg:text-xl xl:text-2xl font-semibold">{t("price")}</div>
            {errors?.price && (
              <div className="w-full text-redError text-center text-sm font-bold pb-4">
                {errors.price}
              </div>
            )}
            <InputFloatNumber
              value={price.price}
              setValue={handlePriceChange}
              minValue={minValue}
              maxValue={maxValue}
              isError={errors?.price !== undefined}
            />
        </div>
        {!noCurrencies &&
        <div className={`w-full h-full flex flex-col justify-between items-center px-1 gap-2 ${(errors?.price || errors?.currency) ? "sm:gap-0" : "sm:gap-3"}`}>
          <div className="h-[30px] sm:h-[50px] flex items-center text-base lg:text-xl xl:text-2xl font-semibold">{t("currency")}</div>
            {errors?.currency && (
              <div className="w-full text-redError text-center text-sm font-bold pb-4">
                {errors.currency.title ? errors.currency.title : errors.currency.key}
              </div>
            )}
          <div className="w-[130px]">
            <Select
              aria-label="Labeled Choices Cancelation"
              onChange={handleSelectionChange}
              defaultSelectedKeys={price.currency !== undefined ? [price.currency.key] : undefined}
              size={"md"}
              isInvalid={errors?.currency !== undefined}
              startContent={<div className={`text-sm lg:text-md xl:text-lg ${errors?.currency && "text-redError"}`}>{price.currency !== undefined && price.currency.symbole}</div>}
              disallowEmptySelection={true}
              classNames={{
                base: "text-sm lg:text-xl xl:text-2xl font-bold",
                value: "text-black dark:text-white text-sm lg:text-lg xl:text-xl font-bold",
                trigger: `bg-grayBackground dark:bg-fadeGray ${errors?.currency && "border-2 border-redError"}`,
              }}
            >
              {currencies.map((currency) => (
                <SelectItem aria-label={currency.title} key={currency.key} value={currency.key} startContent={currency.symbole ? currency.symbole : null}>
                  {currency.title}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>}
        <div className={`w-full h-full flex flex-col justify-between items-center px-1 gap-2 ${(errors?.price || errors?.currency) ? "sm:gap-0" : "sm:gap-3"}`}>
            <div className="h-[30px] sm:h-[50px] flex flex-row justify-center items-center">
            <div className="w-fit h-[30px] sm:h-[50px] flex items-center text-base lg:text-xl xl:text-2xl font-semibold text-center">{t("service_fee")}</div>
              <div className="pl-2">
              <CircleIconButton
                circleSize={24}
                iconSize={14}
                circleColor='#ff5757'
                iconFileAddress="/icons/information.svg"
                onClick={onOpen}
                responsiveness={10}
              />
              </div>
            </div>
            <div className="h-[56px] flex items-center text-base lg:text-2xl xl:text-3xl font-bold cursor-default"> {price.price !== "" ? ((parseFloat(price.price) * 1.05) - parseFloat(price.price)).toFixed(2) : "..."} </div>
        </div>
        <div className={`w-full h-full flex flex-col justify-between items-center px-1 gap-2 ${(errors?.price || errors?.currency) ? "sm:gap-0" : "sm:gap-3"}`}>
            <div className="h-[30px] sm:h-[50px] flex items-center text-base lg:text-xl xl:text-2xl font-semibold">{t("total")} </div>
            <InputFloatNumber
              value={calculateTotal(price.price)}
              setValue={handleTotalChange as any}
              minValue={parseFloat(calculateTotal(String(minValue)))}
              maxValue={parseFloat(calculateTotal(String(maxValue)))}
              isError={errors?.price !== undefined}
            />
        </div>
      </div>
      <InformationModal isOpen={isOpen} onOpenChange={onOpenChange} title={t("title_information_service_fee")} text={t("text_information_service_fee")}/>
    </div>
  );
};

export default Price;
