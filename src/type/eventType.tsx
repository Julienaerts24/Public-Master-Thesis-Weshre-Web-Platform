import { GeoPoint, DocumentReference, Timestamp } from "firebase/firestore";
// OK
type cancelPolicyType = {
    customCancelPolicy: boolean // true if period not default one, undefined if not
    period: number // In hours
  }

export type facilitiesType = {
    key: string
  }

// OK
type groupsTeamsType = {
    enableGroupsTeams: boolean
    groups: groupsType[]
  }

// OK Change done
export type groupsType = {
    id: number
    name: string
    description: string
    number: number
  }

export type includedCategoryType = {
    key: string
    choices: includedType[]
  }
  
export type includedType = {
    key: string
    title: string
    desc: string
    quantity: number
    included: boolean
  }

// Work to do when conversion
type guestsType = {
    hosts: string
    age: number
    languages: string[] // Tableau of key => When conversion need to change to language in the language itself so that it work on the app
  }

// OK
export type dateRangeType = {
    from: Timestamp
    to: Timestamp
  }

// Confirmation Bill
export type typeType = {
    key: string
  }

// OK Confirmation Bill pourquoi utilisé que la
type sportType = {
    key: string
  }

// OK Confirmation Bill pourquoi utilisé que la
type sportLocationType = {
    key: string
  }

// Confirmation Bill // 4RctKqxOSf1LvaPf2SS8
type experienceType = {
  key: string
  // group: string Confirmation que ok si pas la
}

// Confirmation Bill for typeType
type informationType = {
    date: dateRangeType
    title: string
    description: string
    type: typeType 
    sportLocation?: sportType
    sport?: sportLocationType
    experience?: experienceType
  }
  
// Work to do when conversion
type photoType = {
    cover: { uri: string }
    photos: { uri: string }[]
  }

// OK Change done
export type currencyType = { 
  key: string
  title: string
  symbole: string
}

// Work to do when conversion
type priceType = {
    acceptAutomatic: boolean
    cleaningFee: string // Put always to zero for now
    currency: currencyType
    discountPrice?: string
    price: string
    fee: number
    esnDiscount: boolean
    paid: Boolean // Put to true if price != 0, false otherwise
    processPayement: boolean // Put always to true for now
  }

// Work to do when conversion
type privacyType = {
    private: boolean
    groupRestriction: boolean
    groups: DocumentReference[]
    group: {id: string, name: string | null}[]
    requirements: [] // Put always to [] for now
  }

// Work to do when conversion
type rulesType = {
    rules: [] // Put always to [] for now
    otherRules: string
  }

// Confirmation Bill + Work to do when conversion
  type locationType = {
    address: {
      geohash: string // USE
      formatted_address: string // USE
      geopoint: GeoPoint // USE
      political: string // NOT USE
      locality: string // USE
      postalCode: string // NOT USE
      route: string // NOT USE
      streetNumber: string // NOT USE
    }
  }

  type partialLocationType = {
    address: Partial<{
      geohash: string // USE
      formatted_address: string // USE
      geopoint: GeoPoint // USE
      political: string // NOT USE
      locality: string // USE
      postalCode: string // NOT USE
      route: string // NOT USE
      streetNumber: string // NOT USE
    }>
  }
  
type draftType = {
    draft: boolean
    last_modification: Timestamp
  }

export type eventType = {
    cancelPolicy: cancelPolicyType // OK
    facilities: {facilities: facilitiesType[]} // OK
    groups: groupsTeamsType // OK
    guests: guestsType // OK
    included: {included: includedCategoryType[]} // OK
    information: informationType // OK
    location: locationType // TODO
    photos: photoType // OK
    price: priceType // OK
    privacy: privacyType // OK
    rules: rulesType // OK
    tickets: number // put always at zero when creation
    deleted: boolean // put always at false when creation
    draft: draftType // Dans l'application put deleted to true si draft
    userRef: DocumentReference // put a ref to the user that create the event
    requirements: {groupRestricion: false, requirements: []} // Default value for now
    listing: 	{included: []} // Default value for now
  }

export type partialEventType = {
  cancelPolicy: Partial<cancelPolicyType> // OK
  facilities: Partial<{facilities: facilitiesType[]}> // OK
  groups: Partial<groupsTeamsType> // OK
  guests: Partial<guestsType> // OK
  included: Partial<{included: includedCategoryType[]}> // OK
  information: Partial<informationType> // OK
  location: Partial<partialLocationType> // TODO
  photos: Partial<photoType> // OK
  price: Partial<priceType> // OK
  privacy: Partial<privacyType> // OK
  rules: Partial<rulesType> // OK
  tickets: number // put always at zero when creation
  deleted: boolean // put always at false when creation
  draft: Partial<draftType> // Dans l'application put deleted to true si draft
  userRef: DocumentReference // put a ref to the user that create the event
  requirements: Partial<{groupRestricion: false, requirements: []}> // Default value for now
  listing: 	Partial<{included: []}> // Default value for now
}