export enum inputsType {
    Info,
    MultipleChoiceCard,
    MultipleChoiceModal,
    MultipleChoiceSelect,
    Date,
    Text,
    Address,
    Photos,
    AddableChoices,
    Number,
    Boolean,
    Price,
    Groups,
  }

  export type inputFormType = {
    id: string;
    type: inputsType;
    required?: boolean;
    visibility?: { [key: string]: any }; // key will be the id of the input to check the value and any[] will be an array of all possible value of value that make the input visible.
    title?: string;
    description?: string;
    initialValue?: number;
    initialName?: string;
    initialDescription?: string;
    minValue?: number;
    maxValue?: number;
    maxLength?: number; // usefull for all the input text to limit the number of characters
    maxLengthName?: number; // usefull for addable choicesto limit the number of characters for the name
    maxLengthDescription?: number; // usefull for addable choicesto limit the number of characters for the description
    choices?: choicesType[]; // choices is an array of triplet of key, title and icon (icon can be "" if no icon)
    labeledChoices?: {label: string, key: string}[]; // label choices is a list of pair label/value of all possible choice
    initialChoices?: string[]; // value of the initial choices
    initialKey?: string[]; // value of the initial key
    multipleSelection?: boolean; // Can the user select multiple choice
    minNbrChoice?: number;
    maxNbrChoice?: number;
    minWidth?: number; // Minimal width given to the component of each choice
    minHeight?: number; // Minimal height given to the component of each choice
    placeholder?: string; // usefull for Text
    minRow?: number; // usefull for Text
    maxRow?: number; // usefull for Text
    haveIcon?: boolean; // usefull for the MultipleChoice input => party/sport/experience with icon but language without icon.
    canAdd?: boolean; // usefull for the MultipleChoice, NumberCard => Able to add some languages or able to add some teams.
    initialTrue?: boolean // usefull for give an initial value to the boolean
    initialDateRangeTime?: dateRangeTimeType; // usefull to set an inital dateRange
    initialCurrency?: currencyType; // usefull to set an inital currency
    currencyChoices?: currencyType[]; // usefull for price to tell the possible currency
    initialAddress?: addressType; // usefull to set an inital address
    initialAddableChoices?: choiceCardType[];
    initialCover?: string; // usefull to set an inital cover photo
    initialPhotos?: string[]; // usefull to set an inital additionnal photo
    useKeyAsCode?: boolean; // usefull for language to show and use the key as code for the search
    dictionnaryKey?: string; // usefull for multipleChoiceModal in order to change the button text depending of the choices to make (sport, languages...)
    titleAddAddableChoices?: string; // usefull to set the title of the add button addableChoice section. Put here because doesn't depend only of the language (team or included for example)
    titleNameAddableChoices?: string; // usefull to set the title of the name section addableChoice section. Put here because doesn't depend only of the language (team or included for example)
    titleDescriptionAddableChoices?: string; // usefull to set the title of the description section addableChoice section. Put here because doesn't depend only of the language (team or included for example)
    titleNumberAddableChoices?: string; // usefull to set the title of the number section addableChoice section. Put here because doesn't depend only of the language (team or included for example)
    // ADD OTHER MAYBE LATER
  };

export type choicesType = {
  key: string
  title: string
  icon?: string
  originalTitle?: string // Not use but avoid type error for language
  groupTitle?: string // Add some groups to regroup some choice together in the modal
}

export type formPageType = {
    pageTitle: string;
    pageDescription: string;
    inputs: inputFormType[];
  };

export type formType = formPageType[];

export type formValuesType = {
    [key: string]: boolean | number | string | string[] | choiceCardType[] | dateRangeTimeType | priceType | addressType | imagesType;
  };

export type choiceCardType = {
    id: number;
    name: string;
    description: string;
    number: number;
  };

export type dateRangeType = {
    startDate: string;
    endDate: string;
  };
  
export type dateRangeTimeType = {
    dateRange: dateRangeType;
    startTime: string;
    endTime: string;
  };

export type priceType = {
    currency: currencyType;
    price: string;
  };

export type currencyType = {
    key: string;
    symbole: string;
    title: string;
  };
  
export type addressType = {
    formatted_address: string;
    country: string;
    city: string;
    postal_code: string;
    route: string;
    street_number: string;
}

export type imagesType = {
  cover: string
  photos: string[]
}