import { GeoPoint, doc, Timestamp} from "firebase/firestore";
import { db } from "@/firebase/config.js";
import {formValuesType, choiceCardType, dateRangeTimeType, priceType, addressType, imagesType} from '@/type/formType';
import {eventType, partialEventType, groupsType, facilitiesType, includedCategoryType, includedType, dateRangeType} from '@/type/eventType';
import {generateLanguagesList} from '@/form/data/list_languages'
import { uploadImageSupabaseFromBlobUrl, getBlobFromSupabaseUrl, deleteAllEventPhotos} from "@/utils/upload_image/upload_image_supabase"
import { addressToCoordinates } from "@/utils/map/addressToCoordinates"
import { encodeBase32 } from 'geohashing';

const originalLanguages = generateLanguagesList();

type keyType = {key: string}

  function getOriginalTitleByCode(code: string, languagesList: {key: string, title: string, originalTitle: string}[]) {
    const language = languagesList.find(lang => lang.key === code);
    return language ? language.originalTitle : code; // Fallback to code if not found
  }

  function transformItem(item: choiceCardType, categoryKey: string): includedType {
    return {
      key: categoryKey,
      title: item.name,
      desc: item.description || "",
      quantity: item.number,
      included: true,
    };
  }
  
  function transformFormDataToIncluded(formData: formValuesType): includedCategoryType[] {
    const categories = [
      { key: 'drink', booleanKey: 'booleanDrink', includedKey: 'includedDrink' },
      { key: 'equipment', booleanKey: 'booleanEquipment', includedKey: 'includedEquipment' },
      { key: 'food', booleanKey: 'booleanFood', includedKey: 'includedFood' },
      { key: 'others', booleanKey: 'booleanOthers', includedKey: 'includedOthers' }
    ];
  
    const includedCategories: includedCategoryType[] = categories.reduce((acc, category) => {
      if (formData[category.booleanKey]) {
        const choices = (formData[category.includedKey] as choiceCardType[]).map(item => transformItem(item, category.key));
        acc.push({
          key: category.key,
          choices: choices,
        });
      }
      return acc;
    }, [] as includedCategoryType[]);
  
    return includedCategories;
  }

  function convertToDateType(activityDate: dateRangeTimeType): dateRangeType {
    const from = new Date(`${activityDate.dateRange.startDate}T${activityDate.startTime}:00.000Z`);
    const to = new Date(`${activityDate.dateRange.endDate}T${activityDate.endTime}:00.000Z`);
    return {
      from: Timestamp.fromDate(from),
      to: Timestamp.fromDate(to)
    }
  }

  function convertStringArrayToMap(strings: string[]): { key: string } | null {
    return strings !== undefined && strings.length > 0 ? {
      key: strings[0] 
    } : null;
  }

  function getUniquePhotoPath(eventId: string, blobUrl: string) {
    const timestamp = new Date().toISOString().replace(/[:\-\.]/g, '');

    const parts = new URL(blobUrl).pathname.split('-');
    const lastPart = parts.pop() || '';
    const secondLastPart = parts.pop() || '';
    const photoId = `${timestamp}-${secondLastPart}-${lastPart}`;
    const photoPath = `events/${eventId}/${photoId}`;
    return photoPath;
}

export async function convertFormToEventType(form: formValuesType, draft: boolean, userId: string, eventId: string): Promise<eventType> {
    // CANCEL POLICY:
    const policyChoice = form.changeCancellationPolicyChoices as string[];
    
    // GUESTS:
    const hosts = form.numberGuests as string;
    const hostsString = hosts.toString();

    // PHOTOS:
    // CLEAR THE SUPABASE PREVIOUS PHOTOS:
    await deleteAllEventPhotos(eventId);
    const photosSelection = form.activityPhotos as imagesType;
    const coverPhotoUrl = { uri: await uploadImageSupabaseFromBlobUrl(photosSelection.cover as string, `events/${eventId}/${eventId}`)};
    const photosUploadPromises = (photosSelection.photos as string[]).map(async (blobUrl) => {
        const photoPath = getUniquePhotoPath(eventId, blobUrl);
        const url = await uploadImageSupabaseFromBlobUrl(blobUrl, photoPath);
        return { uri: url };
    });
    const photos = await Promise.all(photosUploadPromises);
    
    // ADDRESS:
    const addressSelection = form.activityAddress as addressType;
    let geoPoint = new GeoPoint(0, 0); // Initial value to verify if can't do better
    let geoHash = encodeBase32(0, 0); // Initial value to verify if can't do better
    const fullAddress = (addressSelection.formatted_address !== undefined && addressSelection.formatted_address !== null && addressSelection.formatted_address !== "") ? addressSelection.formatted_address : `${addressSelection.route} ${addressSelection.street_number}, ${addressSelection.postal_code} ${addressSelection.city}, ${addressSelection.country}`;
    try {
      const coordinates = await addressToCoordinates(fullAddress);
      geoPoint = new GeoPoint(coordinates.lat, coordinates.lng);
      geoHash = encodeBase32(coordinates.lat, coordinates.lng);
    } catch (error) {
      console.error("Failed to obtain coordinates:", error);
      // Optionally handle the error more gracefully or set defaults
    }

    // PRICE:
    const priceSelection = form.priceSelection as priceType | null;
    const priceSelectionESN = form.priceSelectionESN as priceType | null;
    const event: eventType = {
      cancelPolicy: {
        customCancelPolicy: form.changeCancellationPolicyBoolean as boolean,
        period: parseInt(policyChoice[0]),
      },

      facilities: {
        facilities: (form.activityFacilities as string[]).map(keyValue => ({
          key: keyValue,
        })) as facilitiesType[],
      },

      groups: {
        enableGroupsTeams: form.activateTeam as boolean,
        groups: form.team as groupsType[],
      },

      guests: {
        hosts: hostsString,
        age: form.ageGuests as number,
        languages: (form.languagesGuests as string[]).map(code => getOriginalTitleByCode(code, originalLanguages))
      },

      included: {
        included: transformFormDataToIncluded(form) as includedCategoryType[]
      },

      information: {
        date: convertToDateType(form.activityDate as dateRangeTimeType) as dateRangeType,
        title: form.informationTitle as string,
        description: form.informationDescription as string,
        type: convertStringArrayToMap(form.activityType as string[]) as keyType,
        ...(convertStringArrayToMap(form.activityType as string[]) && convertStringArrayToMap(form.activityType as string[])!.key === "sport" && {
          sportLocation: convertStringArrayToMap(form.sportLocation as string[]) as keyType,
          sport: convertStringArrayToMap(form.sport as string[]) as keyType,
        }),
        ...(convertStringArrayToMap(form.activityType as string[]) && convertStringArrayToMap(form.activityType as string[])!.key === "experience" && {
          experience: convertStringArrayToMap(form.experience as string[]) as keyType,
        }),
      },

      location: {
        address: {
          geohash: geoHash,
          formatted_address: fullAddress,
          geopoint: geoPoint,
          political: addressSelection.country,
          locality: addressSelection.city,
          postalCode: addressSelection.postal_code,
          route: addressSelection.route,
          streetNumber: addressSelection.street_number,
        }
      },
      
      photos: {
        cover: coverPhotoUrl,
        photos: photos
      },

      price: {
        currency: priceSelection!.currency,
        price: priceSelection!.price,
        fee: parseFloat(((parseFloat(priceSelection!.price) * 1.05) - parseFloat(priceSelection!.price)).toFixed(2)),
        paid: parseFloat(priceSelection!.price) !== 0,
        ...(form.enableReduction == true && priceSelectionESN && {
            discountPrice: priceSelectionESN.price,
        }),
        esnDiscount: form.enableReduction as boolean,
        acceptAutomatic: form.autoAcceptRequests as boolean,
        cleaningFee: "0",
        processPayement: true
      },

      privacy: {
        private: form['privateActivity'] as boolean,
        groupRestriction: form['restrictedToGroup'] as boolean,
        groups: (form.selectionGroup as string[]).map(groupId => (doc(db, "groups", groupId))),
        group: (form.selectionGroup as string[]).map(groupId => ({id: groupId, name: null})), // By looking at the app code I didn't see any use of groups.group so I don't do a request to the database here to find the name if futur use, the name could be retreive by doing the same database call (put it to "" to avoid any error if it is indeed use)
        requirements: []
      },

      rules: {
        rules:[],
        otherRules: form['otherRules'] as string
      },

      requirements: {groupRestricion: false, requirements: []},

      listing: 	{included: []},

      tickets: 0,

      userRef: doc(db, "users", userId),

      deleted: draft,
      
      draft: {
        draft: draft,
        last_modification: Timestamp.fromDate(new Date()),
      },
    };
    
    return event;
  }
  
 export async function convertFormToEventTypeNotComplete(form: formValuesType, draft: boolean, userId: string, eventId: string): Promise<Partial<partialEventType>> {
    const partialEvent: Partial<partialEventType> = {};

    const policyChoice = (form.changeCancellationPolicyChoices !== undefined) ? form.changeCancellationPolicyChoices as string[] : []
    if (form.changeCancellationPolicyBoolean !== undefined || policyChoice.length !== 0) {
      partialEvent.cancelPolicy = {
        ...(form.changeCancellationPolicyBoolean !== undefined && {
          customCancelPolicy: form.changeCancellationPolicyBoolean as boolean,
        }),
        ...(policyChoice.length !== 0 && {
          period: parseInt(policyChoice[0]),
        }),
      }
    }
  
    if (form.activityFacilities !== undefined) {
      partialEvent.facilities = {facilities: (form.activityFacilities as string[]).map(keyValue => ({key: keyValue}))}
    }
  
    if (form.activateTeam !== undefined || form.team !== undefined) {
      partialEvent.groups = {
        ...(form.activateTeam !== undefined && {
          enableGroupsTeams: form.activateTeam as boolean,
        }),
        ...(form.team !== undefined && {
          groups: form.team as groupsType[]
        }),
      }
    }
  
    const languages = (form.languagesGuests !== undefined) ? form.languagesGuests as string[] : []
    if (form.numberGuests !== undefined || form.ageGuests !== undefined || languages.length !== 0) {
      partialEvent.guests = {
        ...(form.numberGuests !== undefined && {
          hosts: form.numberGuests!.toString(),
        }),
        ...(form.ageGuests !== undefined && {
          age: form.ageGuests as number,
        }),
        ...(languages.length !== 0 && {
          languages: (form.languagesGuests as string[]).map(code => getOriginalTitleByCode(code, originalLanguages)),
        }),
      }
    }
  
    const includedEventFormat = transformFormDataToIncluded(form)
    if (includedEventFormat.length !== 0) {
      partialEvent.included = {included: includedEventFormat}
    }
  
    const type = convertStringArrayToMap(form.activityType as string[])
    const sport = convertStringArrayToMap(form.sport as string[])
    const sportLocation = convertStringArrayToMap(form.sportLocation as string[])
    const experience = convertStringArrayToMap(form.experience as string[])
    if (form.activityDate !== undefined || form.informationTitle !== undefined || type !== null || sport !== null || sportLocation !== null || experience !== null) {
      partialEvent.information = {
        ...(form.activityDate !== undefined && {
          date: convertToDateType(form.activityDate as dateRangeTimeType) as dateRangeType,
        }),
        ...(form.informationTitle !== undefined && {
          title: form.informationTitle as string,
        }),
        ...(form.informationDescription !== undefined && {
          description: form.informationDescription as string,
        }),
        ...(type !== null && {
          type: type,
        }),
        ...(type !== null && type.key === "sport" && sport !== null &&{
          sport: sport,
        }),
        ...(type !== null && type.key === "sport" && sportLocation !== null &&{
          sportLocation: sportLocation,
        }),
        ...(type !== null && type.key === "experience" && experience !== null &&{
          experience: experience,
        }),
      }
    }
  
    if (form.activityAddress !== undefined && form.activityAddress !== null) {
      const addressSelection = form.activityAddress as addressType;
      let fullAddress = (addressSelection.formatted_address !== undefined && addressSelection.formatted_address !== null && addressSelection.formatted_address !== "") ? addressSelection.formatted_address : null;
      if (fullAddress === null && addressSelection.route !== undefined && addressSelection.street_number !== undefined && addressSelection.postal_code !== undefined && addressSelection.city !== undefined && addressSelection.country !== undefined){
        fullAddress = `${addressSelection.route} ${addressSelection.street_number}, ${addressSelection.postal_code} ${addressSelection.city}, ${addressSelection.country}`;
      }
  
      let geoPoint = null;
      let geoHash = null;
      if(fullAddress !== null){
        try {
          const coordinates = await addressToCoordinates(fullAddress);
          geoPoint = new GeoPoint(coordinates.lat, coordinates.lng);
          geoHash = encodeBase32(coordinates.lat, coordinates.lng);
        } catch (error) {
          console.error("Failed to obtain coordinates:", error);
          // HANDLE THE ERROR HERE IF WE SEPARE IN MULTIPLE FUNCTION (CONVERSION COMPLETE AND CONVERSION UNCOMPLETE THEN JUST DON'T SET GEOPOINT AND GEOHASH)
        }
      }
      if ((fullAddress !== null || addressSelection.route !== undefined || addressSelection.street_number !== undefined || addressSelection.postal_code !== undefined || addressSelection.city !== undefined || addressSelection.country !== undefined)){
        partialEvent.location = { address : {
          ...(geoHash !== null && {
            geohash: geoHash,
          }),
          ...(geoPoint !== null && {
            geopoint: geoPoint,
          }),
          ...(fullAddress !== null && {
            formatted_address: fullAddress,
          }),
          ...(addressSelection.country !== undefined && {
            political: addressSelection.country,
          }),
          ...(addressSelection.city !== undefined &&{
            locality: addressSelection.city,
          }),
          ...(addressSelection.postal_code !== undefined &&{
            postalCode: addressSelection.postal_code,
          }),
          ...(addressSelection.route !== undefined &&{
            route: addressSelection.route,
          }),
          ...(addressSelection.street_number !== undefined &&{
            streetNumber: addressSelection.street_number,
          }),
        }
      }
      }
    }
  
    if (form.activityPhotos !== undefined){
      let coverPhotoUrl = null
      let photos = null;
      const photosSelection = form.activityPhotos as imagesType;
      const activityPhotos = (photosSelection.photos !== undefined) ? photosSelection.photos as string[] : [];
      if(photosSelection.cover !== undefined || activityPhotos.length !== 0){
        await deleteAllEventPhotos(eventId);
        if(photosSelection.cover !== undefined){
          const publicUrl = await uploadImageSupabaseFromBlobUrl(photosSelection.cover as string, `events/${eventId}/${eventId}`)
          coverPhotoUrl = { uri: publicUrl };
        }
        if(activityPhotos.length !== 0){
          const photosUploadPromises = (photosSelection.photos as string[]).map(async (blobUrl) => {
            const photoPath = getUniquePhotoPath(eventId, blobUrl);
            const url = await uploadImageSupabaseFromBlobUrl(blobUrl, photoPath);
            return { uri: url };
          });
          photos = await Promise.all(photosUploadPromises);
        }
      }
      if (coverPhotoUrl !== null || photos !== null){
        partialEvent.photos = {
          ...(coverPhotoUrl !== null &&{
            cover: coverPhotoUrl,
          }),
          ...(photos !== null &&{
            photos: photos
          }),
        }
      }
    }
  
    const priceSelection = (form.priceSelection !== undefined) ? form.priceSelection as priceType : null
    const priceSelectionESN = (form.priceSelectionESN !== undefined) ? form.priceSelectionESN as priceType : null
    if (priceSelection !== null || priceSelectionESN !== null || form.enableReduction !== undefined || form.autoAcceptRequests !== undefined) {
      partialEvent.price = {
        ...(priceSelection !== null && priceSelection.currency !== undefined && {
          currency: priceSelection.currency,
        }),
        ...(priceSelection !== null && priceSelection.price !== undefined && {
          price: priceSelection.price,
          fee: parseFloat(((parseFloat(priceSelection.price) * 1.05) - parseFloat(priceSelection.price)).toFixed(2)),
          paid: parseFloat(priceSelection.price) !== 0,
        }),
        ...(priceSelectionESN !== null && priceSelectionESN.price !== undefined && {
          discountPrice: priceSelectionESN.price,
        }),
        ...(form.enableReduction !== undefined &&{
          esnDiscount: form.enableReduction as boolean,
        }),
        ...(form.autoAcceptRequests !== undefined &&{
          acceptAutomatic: form.autoAcceptRequests as boolean,
        }),
        cleaningFee: "0",
        processPayement: true
      }
    }
  
    const selectionGroup = (form.selectionGroup !== undefined) ? form.selectionGroup as string[] : [];
    if (form.privateActivity !== undefined || form.restrictedToGroup !== undefined || selectionGroup.length !== 0) {
      partialEvent.privacy = {
        ...(form.privateActivity !== undefined && {
          private: form.privateActivity as boolean,
        }),
        ...(form.restrictedToGroup !== undefined && {
          groupRestriction: form.restrictedToGroup as boolean,
        }),
        ...(selectionGroup.length !== 0 && {
          groups: selectionGroup.map(groupId => (doc(db, "groups", groupId))),
        }),
        ...(selectionGroup.length !== 0 && {
          group: selectionGroup.map(groupId => ({id: groupId, name: null})),
        }),
        requirements: []
      }
    }
  
    if (form.otherRules !== undefined) {
      partialEvent.rules = {
        rules:[],
        otherRules: form.otherRules as string
      }
    }
  
    partialEvent.requirements = {groupRestricion: false, requirements: []},
    partialEvent.listing = 	{included: []},
    partialEvent.tickets = 0,
    partialEvent.userRef = doc(db, "users", userId),
    partialEvent.deleted = draft,
    partialEvent.draft = {
      draft: draft,
      last_modification: Timestamp.fromDate(new Date()),
    }

    return partialEvent;
  }

  export async function convertEventToFormType(event: partialEventType): Promise<formValuesType> {
    const form: formValuesType = {};
  
    if (event.cancelPolicy) {
      if (event.cancelPolicy.customCancelPolicy !== undefined) {form.changeCancellationPolicyBoolean = event.cancelPolicy.customCancelPolicy;}
      if (event.cancelPolicy.period !== undefined) {form.changeCancellationPolicyChoices = [event.cancelPolicy.period.toString()];}
    }
    if (event.guests) {
      if (event.guests.hosts !== undefined) {form.numberGuests = parseInt(event.guests.hosts)}
      if (event.guests.age !== undefined) {form.ageGuests = event.guests.age}
      if (event.guests.languages) {form.languagesGuests = event.guests.languages.map(lang => originalLanguages.find(language => language.originalTitle === lang)?.key || '');}
    }

    if (event.photos && event.photos.cover && event.photos.cover!.uri) {
      try {
          const coverBlobUrl = await getBlobFromSupabaseUrl(event.photos.cover!.uri);
          const photosBlobUrl = (event.photos.photos) ? await Promise.all(event.photos.photos!.map(photo => getBlobFromSupabaseUrl(photo.uri))) : [];
          form.activityPhotos = {
            cover: coverBlobUrl,
            photos: photosBlobUrl,
          };
        }
      catch (error) {
        console.error('Error fetching images as blobs:', error);
      }
    }

    if (event.location && event.location.address) {
      form.activityAddress = {
        formatted_address: event.location.address.formatted_address,
        route: event.location.address.route,
        street_number: event.location.address.streetNumber,
        postal_code: event.location.address.postalCode,
        city: event.location.address.locality,
        country: event.location.address.political,
      } as addressType;
    }
    if (event.price) {
      if (event.price.currency && event.price.price) {
        form.priceSelection = {
          currency: event.price.currency,
          price: event.price.price.toString(),
        };
      }
      if (event.price.currency && event.price.discountPrice) {
        form.priceSelectionESN = {
          price: event.price.discountPrice.toString(),
          currency: event.price.currency,
        };
      }
      if (event.price.esnDiscount !== undefined) {form.enableReduction = event.price.esnDiscount}
      if (event.price.acceptAutomatic !== undefined) {form.autoAcceptRequests = event.price.acceptAutomatic}
    }
    if (event.facilities && event.facilities.facilities) {
      form.activityFacilities = event.facilities.facilities.map(fac => fac.key);
    }
    if (event.included && event.included.included) {
      event.included.included.forEach(category => {
        const booleanKey = `boolean${category.key.charAt(0).toUpperCase() + category.key.slice(1)}`;
        const includedKey = `included${category.key.charAt(0).toUpperCase() + category.key.slice(1)}`;
        form[booleanKey] = true;
        form[includedKey] = category.choices.map((choice, index) => ({
          id: index,
          name: choice.title,
          description: choice.desc,
          number: choice.quantity,
        }));
      });
    }
    if (event.groups) {
      if (event.groups.enableGroupsTeams !== undefined) {form.activateTeam = event.groups.enableGroupsTeams}
      if (event.groups.groups !== undefined) {form.team = event.groups.groups}
    }
    if (event.information) {
      if (event.information.title !== undefined) {form.informationTitle = event.information.title}
      if (event.information.description !== undefined) {form.informationDescription = event.information.description}
      if (event.information.type) {form.activityType = [event.information.type.key];}
      if (event.information.sportLocation) {form.sportLocation = [event.information.sportLocation.key];}
      if (event.information.sport) {form.sport = [event.information.sport.key];}
      if (event.information.experience) {form.experience = [event.information.experience.key];}
      if (event.information.date) {
        form.activityDate = {
          dateRange: {
            startDate: event.information.date.from.toDate().toISOString().substring(0, 10),
            endDate: event.information.date.to.toDate().toISOString().substring(0, 10),
          },
          startTime: event.information.date.from.toDate().toISOString().substring(11, 16),
          endTime: event.information.date.to.toDate().toISOString().substring(11, 16),
        };
      }
    }
    if (event.privacy) {
      if (event.privacy.private !== undefined) {form.privateActivity = event.privacy.private;}
      if (event.privacy.groupRestriction !== undefined) {form.restrictedToGroup = event.privacy.groupRestriction;}
      if (event.privacy.groups) {
        form.selectionGroup = event.privacy.groups.map(g => g.id);
      }
    }
    if (event.rules && event.rules.otherRules !== undefined) {
      form.otherRules = event.rules.otherRules;
    }

    return form as formValuesType;
  }