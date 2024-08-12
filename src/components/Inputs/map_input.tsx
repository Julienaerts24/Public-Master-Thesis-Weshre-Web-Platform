import React, { useState, useEffect, useRef } from "react";
import { Input } from "@nextui-org/react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useLocale } from "next-intl";
import InputTextBordered from "@/components/Inputs/text_bordered";
import CircleIconButton from "@/components/Buttons/circle_icon_button";
import { useTranslations } from "next-intl";
import { addressType } from '@/type/formType';
import {addressErrorType} from '@/type/formErrorType';
import {addressToCoordinates} from "@/utils/map/addressToCoordinates"

declare global {
  interface Window {
    initMap?: () => void;
  }
}

type Callback = (
  error: Error | null,
  result?: google.maps.GeocoderResult[],
  searchTime?: Date
) => void;

type CoordinatesCallback = (
  error: Error | null,
  coordinates?: { lat: number; lng: number }[],
  searchTime?: Date
) => void;

export type MapInputProps = {
  address: addressType;
  setAddress: (address: addressType) => void;
  disableChange?: boolean;
  errors?: addressErrorType;
};

const MapInput: React.FC<MapInputProps> = ({
  address,
  setAddress,
  disableChange,
  errors,
}) => {
  const t = useTranslations("MapInput");
  const currentMarkerRef = useRef<google.maps.Marker | null>(null);
  const [addressMap, setAddressMap] = useState("");
  const [badResearch, setBadResearch] = useState(false)
  const [markerPlaced, setMarkerPlaced] = useState(false);
  const mapRef = useRef<google.maps.Map>();
  const ApiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY!;
  const language = useLocale();
  const defaultPosition = { lat: 30, lng: 20 };

  const updateAddress = (newFormattedAddress?: string, newCountry?: string, newCity?: string, newPostalCode?: string, newRoute?: string, newStreetNumber?: string, newAppartment?: string) => {
    setAddress({formatted_address: newFormattedAddress !== undefined ? newFormattedAddress : address.formatted_address, country: newCountry !== undefined ? newCountry : address.country, city: newCity !== undefined ? newCity : address.city, postal_code: newPostalCode !== undefined ? newPostalCode : address.postal_code, route: newRoute !== undefined ? newRoute : address.route, street_number: newStreetNumber !== undefined ? newStreetNumber : address.street_number});
  };
  
  const handleCountryChange = (newCountry: string) => {
    setAddress({...address, country: newCountry});
  };

  const handleCityChange = (newCity: string) => {
    setAddress({...address, city: newCity});
  };

  const handlePostalCodeChange = (newPostalCode: string) => {
    setAddress({...address, postal_code: newPostalCode});
  };

  const handleRouteChange = (newRoute: string) => {
    setAddress({...address, route: newRoute});
  };

  const handleStreetNumberChange = (newStreetNumber: string) => {
    setAddress({...address, street_number: newStreetNumber});
  };

  useEffect(() => {
    const scriptId = "google-maps-script";
    const existingScript = document.getElementById(scriptId);

    if (!existingScript) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${ApiKey}&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    window.initMap = () => {
      const initializeMap = (
        position: google.maps.LatLngLiteral,
        zoom: number
      ) => {
        const mapInstance = new google.maps.Map(
          document.getElementById("map") as HTMLElement,
          {
            zoom,
            center: position,
            fullscreenControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            draggableCursor: "pointer",
          }
        );

        mapRef.current = mapInstance;

        {!disableChange && mapInstance.addListener("click", (e: google.maps.MapMouseEvent) => {
          setAddressMap("");

          if (currentMarkerRef.current) {
            currentMarkerRef.current.setMap(null);
          }

          const clickedLocation = e.latLng!.toJSON();
          const newMarker = new google.maps.Marker({
            position: clickedLocation,
            map: mapInstance,
          });
          coordinatesToAddress(
            clickedLocation.lat,
            clickedLocation.lng,
            getAddress
          );
          currentMarkerRef.current = newMarker;
          setMarkerPlaced(true);
        });
      };}

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          initializeMap(currentPosition, 12);
        },
        () => {
          console.error(
            "Geolocation failed or permission denied. Using default location."
          );
          initializeMap(defaultPosition, 2);
        },
        { enableHighAccuracy: true, timeout: 1000, maximumAge: 0 }
      );

      onBlurUpdateMap(); // Initially place a marker on the map some initial address is given
    };

    if (window.google && window.google.maps) {
      window.initMap();
    }

    return () => {
      delete window.initMap;
    };
  }, []);

  const useCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        coordinatesToAddress(latitude, longitude, (error, results) => {
          if (error) {
            console.error('Error converting coordinates to address:', error);
            return;
          }
          if (results && results.length > 0) {
            const result = results[0];
            getAddress(null, [result]);

            if (mapRef.current) {
              placeMarkerAtCoordinates(null, [{ lat: latitude, lng: longitude }]);
            }
          }
        });
      },
      (error) => {
        console.error("Error getting current position:", error);
      },
      { enableHighAccuracy: true, timeout: 1000, maximumAge: 0 }
    );
  };
  const onBlurUpdateMap = async () => {
    await updateMapMarkerFromInputs();
  };

  const updateMapMarkerFromInputs = async () => {
    if (address.country != "" || address.route != "" || address.street_number != "" || address.postal_code != "" || address.city != "") {
      const fullAddress = `${address.route} ${address.street_number}, ${address.city}, ${address.postal_code}, ${address.country}`;
      try {
        const { lat, lng } = await addressToCoordinates(fullAddress);
        placeMarkerAtCoordinates(null, [{ lat, lng }]);
      } catch (error) {
        console.error("Failed to geocode address:", error);
        setMarkerPlaced(false);
      }
    }
    else {
      // If all input are clear, reset the map as default (remove markern, center and reset zoom)
      if (currentMarkerRef.current) {
        currentMarkerRef.current.setMap(null);
        currentMarkerRef.current = null;
      }
      if (mapRef.current) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const currentPosition = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            mapRef.current!.setCenter(currentPosition);
            mapRef.current!.setZoom(12);
          },
          () => {
            console.error(
              "Geolocation failed or permission denied. Using default location."
            );
            mapRef.current!.setCenter(defaultPosition);
            mapRef.current!.setZoom(2);
          },
          { enableHighAccuracy: true, timeout: 1000, maximumAge: 0 }
        );
      }
      setMarkerPlaced(false);
    }
  };

  const getAddress: Callback = (error, results) => {
    if (error) {
      console.error("Error:", error);
      return;
    }
    if (results && results.length > 0) {
      const result = results[0];
      let newCountry = "";
      let newRoute = "";
      let newStreetNumber = "";
      let newCity = "";
      let newPostalCode = "";
      result.address_components.forEach(component => {
        if (component.types.includes("country")) {
          newCountry = component.long_name;
        } else if (component.types.includes("locality")) {
          newCity = component.long_name;
        } else if (component.types.includes("postal_code")) {
          newPostalCode = component.long_name;
        } else if (component.types.includes("route")) {
          newRoute = component.long_name;
        } else if (component.types.includes("street_number")) {
          newStreetNumber = component.long_name;
        }
      });

      updateAddress(result.formatted_address, newCountry, newCity, newPostalCode, newRoute, newStreetNumber)
    }
  };

  const placeMarkerAtCoordinates: CoordinatesCallback = (
    error,
    coordinates
  ) => {
    if (error || !coordinates || coordinates.length === 0) {
      console.error("Failed to get coordinates:", error);
      if (currentMarkerRef.current) {
        currentMarkerRef.current.setMap(null); // Remove the existing marker
        currentMarkerRef.current = null;
      }
      setMarkerPlaced(false);
      return;
    }
    if (coordinates && coordinates.length > 0) {
      const { lat, lng } = coordinates[0];

      if (currentMarkerRef.current) {
        currentMarkerRef.current.setMap(null);
      }

      const newMarker = new google.maps.Marker({
        position: { lat, lng },
        map: mapRef.current,
      });
      
      currentMarkerRef.current = newMarker;
      setMarkerPlaced(true);

      const position = newMarker.getPosition();
      if (position) {
        mapRef.current?.setCenter(position);
        mapRef.current?.setZoom(17);
      }
    }
  };

  const gGeocodeEndpoint = "https://maps.googleapis.com/maps/api/geocode/json?";

  function coordinatesToAddress(
    latitude: number,
    longitude: number,
    callback: Callback
  ) {
    const latlng = `${latitude},${longitude}`;
    const uri = `${gGeocodeEndpoint}latlng=${latlng}&language=${language}&key=${ApiKey}`;

    fetch(uri)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "OK") {
          callback(null, data.results, new Date());
        } else {
          callback(new Error("Geocoding failed: " + data.status));
        }
      })
      .catch((error) => {
        callback(error);
      });
  }

  function centerMapOnAddress(address: string) {
    const uri = `${gGeocodeEndpoint}address=${encodeURIComponent(address)}&language=${language}&key=${ApiKey}`;
  
    fetch(uri)
      .then(response => response.json())
      .then(data => {
        if (data.status === "OK" && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location;
          let zoomLevel = 17;
          const resultType = data.results[0].types[0];
          if (resultType === "country") {
            zoomLevel = 5;
          } else if (resultType.includes("administrative_area_level_1") || resultType.includes("locality")) {
            zoomLevel = 11;
          } else if (resultType.includes("street_number") || resultType.includes("route")) {
            zoomLevel = 17;
          }
          if (mapRef.current) {
            mapRef.current.setCenter({ lat, lng });
            mapRef.current.setZoom(zoomLevel);
          }
        } else {
          setBadResearch(true);
          console.error("Geocode was not successful: " + data.status);
        }
      })
      .catch(error => {
        setBadResearch(true);
        console.error("Geocoding error: ", error)}
      );
  }

  function centerMapOnCurrentMarker() {
    if (currentMarkerRef.current && mapRef.current) {
      mapRef.current.setCenter(currentMarkerRef.current.getPosition()!);
      mapRef.current.setZoom(17);
    }
  }

  return (
    <div className="w-full h-full min-h-[538px] flex flex-col px-4 lg:px-0">
      <div className="w-full flex flex-col py-5 gap-5">
        <div className="w-full flex flex-col md:flex-row gap-5">
          <InputTextBordered
            value={address.country}
            onValueChange={handleCountryChange}
            label={t("country")}
            placeholder={t("enter_country")}
            onBlur={onBlurUpdateMap}
            onKeyDown={onBlurUpdateMap}
            invalid={errors?.country !== undefined}
            disable={disableChange}
            errorMessage={errors?.country}
          />
          <InputTextBordered
            value={address.city}
            onValueChange={handleCityChange}
            label={t("city")}
            placeholder={t("enter_city")}
            onBlur={onBlurUpdateMap}
            onKeyDown={onBlurUpdateMap}
            invalid={errors?.city !== undefined}
            disable={disableChange}
            errorMessage={errors?.city}
          />
          <InputTextBordered
            value={address.postal_code}
            onValueChange={handlePostalCodeChange}
            label={t("postal_code")}
            placeholder={t("enter_postal_code")}
            onBlur={onBlurUpdateMap}
            onKeyDown={onBlurUpdateMap}
            invalid={errors?.postal_code !== undefined}
            disable={disableChange}
            errorMessage={errors?.postal_code}
          />
        </div>
        <div className="w-full h-full flex flex-col md:flex-row gap-5">
        <InputTextBordered
          value={address.route}
          onValueChange={handleRouteChange}
          label={t("route")}
          placeholder={t("enter_route")}
          onBlur={onBlurUpdateMap}
          onKeyDown={onBlurUpdateMap}
          invalid={errors?.route !== undefined}
          disable={disableChange}
          errorMessage={errors?.route}
        />
        <InputTextBordered
          value={address.street_number}
          onValueChange={handleStreetNumberChange}
          label={t("street_number")}
          placeholder={t("enter_street_number")}
          invalid={errors?.street_number !== undefined}
          disable={disableChange}
          errorMessage={errors?.street_number}
        />
        </div>
      </div>
      <div className="w-full h-full min-h-[350px] relative">
        <style>
          {`
        #map:focus, #map *:focus {
          outline: none !important;
        }
      `}
        </style>
        <div className="w-full px-5 self-center absolute top-5 z-10 flex flex-row items-center">
          <div className="w-full rounded-full flex flex-col opacity-80 bg-white dark:bg-darkGray hover:bg-white dark:hover:bg-darkGray mr-2">
              <Input
                value={addressMap}
                onValueChange={(newAddress) => {
                  setAddressMap(newAddress);
                  setBadResearch(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    centerMapOnAddress(addressMap);
                  }
                }}
                variant="bordered"
                isClearable
                size={"md"}
                radius="full"
                aria-label="address"
                classNames={{
                  input: `text-xl ${badResearch ? 'text-red-600' : 'text-black dark:text-white'}`,
                  inputWrapper: `border-none shadow-none text-black dark:text-white bg-transparent dark:bg-darkGray hover:bg-transparent dark:hover:bg-darkGray opacity-80`,
                }}
                placeholder={t("research")}
                startContent={<FaMapMarkerAlt className={`text-2xl ${badResearch ? 'text-red-600' : 'text-black dark:text-white'}`} />}
              />
              {badResearch && <div className="relative top-[-8px] h-4 text-red-600 text-sm pl-[46px] flex items-center">
                {t("address_not_found")}
              </div>}
          </div>
          <CircleIconButton
              circleSize={50}
              iconSize={25}
              circleColor="#ff5757"
              iconFileAddress="/icons/search.svg"
              onClick={() => centerMapOnAddress(addressMap)}
              responsiveness={0}
              isDisabled={addressMap === ""}
          />
        </div>
        <div className="absolute bottom-8 left-3 z-10 flex flex-col gap-2">
         <CircleIconButton
              circleSize={40}
              iconSize={27}
              circleColor="#ff5757"
              messageToolTip={t("center_actual_address")}
              iconFileAddress="/icons/marker.svg"
              onClick={centerMapOnCurrentMarker}
              placementToolTip="right"
              sizeMessage={15}
              isDisabled={!markerPlaced}
          />
          <CircleIconButton
              circleSize={40}
              iconSize={38}
              circleColor="#ff5757"
              messageToolTip={t("use_actual_position")}
              iconFileAddress="/icons/current_location.svg"
              onClick={useCurrentLocation}
              isDisabled={disableChange}
              placementToolTip="right"
              sizeMessage={15}
          />
        </div>
        <div
          id="map"
          className="w-full h-full min-h-[380px] bg-transparent rounded-3xl"
        ></div>
      </div>
    </div>
  );
};

export default MapInput;
