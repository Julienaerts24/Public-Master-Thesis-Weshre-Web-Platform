type dateRangeErrorType = {
    startDate?: string;
    endDate?: string;
  };
  
export type dateRangeTimeErrorType = {
    dateRange?: dateRangeErrorType;
    startTime?: string;
    endTime?: string;
  };

export type choiceCardErrorType = {
  id?: string;
  name?: string;
  description?: string;
  number?: string;
};

export type choiceCardsErrorType = {
  [key: number]: choiceCardErrorType;
};

export type priceErrorType = {
    currency?: currencyErrorType;
    price?: string;
  };

export type currencyErrorType = {
    key?: string;
    symbole?: string;
    title?: string;
  };
  
export type addressErrorType = {
    country?: string;
    city?: string;
    postal_code?: string;
    route?: string;
    street_number?: string;
}

export type imagesErrorType = {
  cover?: string
  photos?: string
}