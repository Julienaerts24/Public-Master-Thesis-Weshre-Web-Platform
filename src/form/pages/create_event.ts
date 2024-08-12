import {inputsType} from '@/type/formType';

type languagesType = {
  key: string
  title: string
  originalTitle: string
}[]

type experiencesType = {
  key: string
  title: string
  group: string
  groupTitle: string
  icon: string
}[]

type sportsType = {
  key: string
  title: string
  icon: string
}[]

function generateCreationEventForm(t: (key: string) => string, languages: languagesType, experience: experiencesType, sports: sportsType) {
  return [
    {
      "pageTitle": t('activity_page_title'),
      "pageDescription": t('activity_page_description'),
      "inputs": [
        {
          "id": "activityType",
          "title": t('activity_type_title'),
          "choices": [
            {key: "party", title: t('party_title'), icon: "/icons/newActivity/types/party.svg"}, 
            {key: "sport", title: t('sport_title'), icon: "/icons/newActivity/types/sport.svg"}, 
            {key: "experience", title: t('experience_title'), icon: "/icons/newActivity/types/experience.svg"}
          ],
          "type": inputsType.MultipleChoiceCard,
          "multipleSelection": false,
          "minNbrChoice": 1,
          "maxNbrChoice": 1,
          "minWidth": 150,
          "minHeight": 120,
          "visibility": {}
        },
        {
          "id": "activityDate",
          "type": inputsType.Date,
          "visibility": {}
        },
      ]
    },
    {
      "pageTitle": t('information_page_title'),
      "pageDescription": t('information_page_description'),
      "inputs": [
        {
          "id": "informationTitle",
          "type": inputsType.Text,
          "title": t('information_title_title'),
          "placeholder": t('information_title_placeholder'),
          "maxLength": 150,
          "minRow": 2,
          "maxRow": 5,
          "visibility": {}
        },
        {
          "id": "informationDescription",
          "type": inputsType.Text,
          "title": t('information_description_title'),
          "placeholder": t('information_description_placeholder'),
          "minRow": 6,
          "maxRow": 20,
          "maxLength": 1000000000,
          "visibility": {}
        },
        {
          "id": "sport",
          "title": t('information_sport_title'),
          "type": inputsType.MultipleChoiceModal,
          "choices": sports,
          "dictionnaryKey": "MultipleChoiceModalSport",
          "minNbrChoice": 1,
          "maxNbrChoice": 1,
          "multipleSelection": false,
          "visibility": {"activityType": ['sport']}
        },
        {
          "id": "sportLocation",
          "type": inputsType.MultipleChoiceSelect,
          "title": t('information_sport_location_title'),
          "labeledChoices": [
            {label: t('indoor'), key: "indoor"},
            {label: t('outdoor'), key: "outdoor"}],
          "initialKey": ["indoor"],
          "visibility": {"activityType": ['sport']}
        },
        {
          "id": "experience",
          "title": t('information_experience_title'),
          "type": inputsType.MultipleChoiceModal,
          "choices": experience,
          "dictionnaryKey": "MultipleChoiceModalExperience",
          "minNbrChoice": 1,
          "maxNbrChoice": 1,
          "multipleSelection": false,
          "visibility": {"activityType": ['experience']}
        },
      ]
    },
    {
      "pageTitle": t('address_page_title'),
      "pageDescription": t('address_page_description'),
      "inputs": [
        {
          "id": "activityAddress",
          "type": inputsType.Address,
          "visibility": {}
        },
      ]
    },
    {
      "pageTitle": t('photo_page_title'),
      "pageDescription": t('photo_page_description'),
      "inputs": [
        {
          "id": "activityPhotos",
          "type": inputsType.Photos,
          "visibility": {}
        },
      ]
    },
    {
      "pageTitle": t('guests_page_title'),
      "pageDescription": t('guests_page_description'),
      "inputs": [
        {
          "id": "numberGuests",
          "title": t('number_guests_title'),
          "type": inputsType.Number,
          "minValue": 0,
          "initialValue": 0,
          "visibility": {}
        },
        {
          "id": "ageGuests",
          "title": t('age_guests_title'),
          "type": inputsType.Number,
          "initialValue": 18,
          "minValue": 0,
          "maxValue": 99,
          "visibility": {}
        },
        {
          "id": "languagesGuests",
          "title": t('languages_guests_title'),
          "description": t('languages_guests_description'),
          "type": inputsType.MultipleChoiceModal,
          "choices": languages,
          "useKeyAsCode": true,
          "dictionnaryKey": "MultipleChoiceModalLanguage",
          "multipleSelection": true,
          "visibility": {}
        }
      ]
    },
    {
      "pageTitle": t('groups_page_title'),
      "pageDescription": t('groups_page_description'),
      "inputs": [
        {
          "id": "activateTeam",
          "title": t('activate_team_title'),
          "type": inputsType.Boolean,
          "visibility": {}
        },
        {
          "id": "team",
          "title": t('team_title'),
          "type": inputsType.AddableChoices,
          "titleAddAddableChoices": t('team_add_title'),
          "titleNameAddableChoices": t('team_name_title'),
          "titleNumberAddableChoices": t('team_number_title'),
          "initialName": t('team_initial_name'),
          "initialValue": 0,
          "minNbrChoice": 1,
          "minValue": 0,
          "visibility": {"activateTeam": true},
        }
      ]
    },
    {
      "pageTitle": t('facilities_page_title'),
      "pageDescription": t('facilities_page_description'),
      "inputs": [
        {
          "id": "activityFacilities",
          "title": "",
          "choices": [
            {key: "parking", title: t('parking_title'), icon: "/icons/newActivity/facilities/parking.svg"}, 
            {key: "pool", title: t('pool_title'), icon: "/icons/newActivity/facilities/pool.svg"}, 
            {key: "jacuzzi", title: t('jacuzzi_title'), icon: "/icons/newActivity/facilities/jacuzzi.svg"},
            {key: "rooftop", title: t('rooftop_title'), icon: "/icons/newActivity/facilities/rooftop.svg"}, 
             // {key: "outdoor_space", title: "Outdoor space", icon: "/icons/newActivity/facilities/outdoor.svg"}, 
            {key: "8pool", title: t('pool_table_title'), icon: "/icons/newActivity/facilities/pool_table.svg"}
          ],
          "type": inputsType.MultipleChoiceCard,
          "multipleSelection": true,
          "minWidth": 150,
          "minHeight": 120,
          "minNbrChoice": 0,
          "visibility": {}
        },
      ]
    },
    {
      "pageTitle": t('included_page_title'),
      "pageDescription": t('included_page_description'),
      "inputs": [
        {
          "id": "booleanDrink",
          "type": inputsType.Boolean,
          "title": t('drinks_title'),
          "initialTrue": false,
          "visibility": {}
        },
        {
          "id": "includedDrink",
          "type": inputsType.AddableChoices,
          "titleAddAddableChoices": t('drinks_add_title'),
          "titleNameAddableChoices": t('drinks_name_title'),
          "titleNumberAddableChoices": t('drinks_number_title'),
          "initialName": t('drinks_initial_name'),
          "initialValue": 1,
          "minNbrChoice": 1,
          "minValue": 0,
          "visibility": {"booleanDrink": true},
        },
        {
          "id": "booleanFood",
          "type": inputsType.Boolean,
          "title": t('food_title'),
          "initialTrue": false,
          "visibility": {}
        },
        {
          "id": "includedFood",
          "type": inputsType.AddableChoices,
          "titleAddAddableChoices": t('food_add_title'),
          "titleNameAddableChoices": t('food_name_title'),
          "titleNumberAddableChoices": t('food_number_title'),
          "initialName": t('food_initial_name'),
          "initialValue": 1,
          "minNbrChoice": 1,
          "minValue": 0,
          "visibility": {"booleanFood": true},
        },
        {
          "id": "booleanEquipment",
          "type": inputsType.Boolean,
          "title": t('equipment_title'),
          "initialTrue": false,
          "visibility": {}
        },
        {
          "id": "includedEquipment",
          "type": inputsType.AddableChoices,
          "titleAddAddableChoices": t('equipment_add_title'),
          "titleNameAddableChoices": t('equipment_name_title'),
          "titleNumberAddableChoices": t('equipment_number_title'),
          "initialName": t('equipment_initial_name'),
          "initialValue": 1,
          "minNbrChoice": 1,
          "minValue": 0,
          "visibility": {"booleanEquipment": true},
        },
        {
          "id": "booleanOthers",
          "type": inputsType.Boolean,
          "title": t('other_title'),
          "initialTrue": false,
          "visibility": {}
        },
        {
          "id": "includedOthers",
          "type": inputsType.AddableChoices,
          "titleAddAddableChoices": t('other_add_title'),
          "titleNameAddableChoices": t('other_name_title'),
          "titleNumberAddableChoices": t('other_number_title'),
          "initialName": t('other_initial_name'),
          "initialValue": 1,
          "minNbrChoice": 1,
          "minValue": 0,
          "visibility": {"booleanOthers": true},
        }
      ]
    },
    {
      "pageTitle": t('respect_page_title'),
      "pageDescription": t('respect_page_description'),
      "inputs": [
        {
          "id": "otherRules",
          "type": inputsType.Text,
          "title": t('other_rules_title'),
          "required": false,
          "placeholder": t('other_rules_placeholder'),
          "maxLength": 1000000000,
          "minRow": 6,
          "maxRow": 19,
          "visibility": {}
        },
      ]
    },
    {
      "pageTitle": t('visibility_page_title'),
      "pageDescription": t('visibility_page_description'),
      "inputs": [
        {
          "id": "privateActivity",
          "type": inputsType.Boolean,
          "title": t('private_activity_title'),
          "initialTrue": false,
          "visibility": {"restrictedToGroup": false}
        },
        {
          "id": "restrictedToGroup",
          "type": inputsType.Boolean,
          "title": t('restricted_to_group_title'),
          "initialTrue": false,
          "visibility": {"privateActivity": false}
        },
        {
          "id": "selectionGroup",
          "type": inputsType.Groups,
          "title": t('selection_group_title'),
          "description": t('selection_group_description'),
          "minNbrChoice": 0,
          "multipleSelection": true,
          "visibility": {"restrictedToGroup": true}
        },
      ]
    },
    {
      "pageTitle": t('price_page_title'),
      "pageDescription": t('price_page_description'),
      "inputs": [
        {
          "id": "autoAcceptRequests",
          "type": inputsType.Boolean,
          "title": t('auto_accept_requests_title'),
          "description": t('auto_accept_requests_description'),
          "initialTrue": false,
          "visibility": {}
        },
        {
          "id": "priceSelection",
          "title": t('price_selection_title'),
          "currencyChoices": [
            {key: "EUR", title: t('euro'), symbole: "€"},
            {key: "USD", title: t('dollar'), symbole: "$"},
          ],
          "initialCurrency": {key: "EUR", title: t('euro'), symbole: "€"},
          "type": inputsType.Price,
          "visibility": {}
        },
        {
          "id": "enableReduction",
          "type": inputsType.Boolean,
          "title": t('enable_reduction_title'),
          "description": t('enable_reduction_description'),
          "initialTrue": false,
          "visibility": {}
        },
        {
          "id": "priceSelectionESN",
          "title": t('price_selection_ESN_title'),
          "currencyChoices": [],
          "type": inputsType.Price,
          "visibility": {"enableReduction": true}
        },
        {
          "id": "infoCancellation",
          "type": inputsType.Info,
          "title": t('info_cancellation_title'),
          "description": t('info_cancellation_description'),
          "visibility": {}
        },
        {
          "id": "changeCancellationPolicyBoolean",
          "type": inputsType.Boolean,
          "title": t('change_cancellation_title'),
          "initialTrue": false,
          "visibility": {}
        },
        {
          "id": "changeCancellationPolicyChoices",
          "type": inputsType.MultipleChoiceSelect,
          "title": t('change_cancellation_choices_title'),
          "description": t('change_cancellation_choices_description'),
          "labeledChoices": [
            {label: t('change_cancellation_choices_1_day'), key: "24"},
            {label: t('change_cancellation_choices_2_day'), key: "48"},
            {label: t('change_cancellation_choices_3_day'), key: "72"},
            {label: t('change_cancellation_choices_4_day'), key: "96"},
            {label: t('change_cancellation_choices_5_day'), key: "120"},
            {label: t('change_cancellation_choices_6_day'), key: "144"},
            {label: t('change_cancellation_choices_7_day'), key: "168"}],
          "initialKey": ["48"],
          "visibility": {"changeCancellationPolicyBoolean": true}
        },
      ]
    }
  ];
}

export { generateCreationEventForm };