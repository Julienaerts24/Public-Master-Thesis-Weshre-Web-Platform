  const gGeocodeEndpoint = "https://maps.googleapis.com/maps/api/geocode/json?";
  const ApiKey = "AIzaSyAZ8LNIBxGodvZJW0ZuX7TImTI4qVIN_ys";

  async function addressToCoordinates(address: string): Promise<{ lat: number; lng: number }> {
    const uri = `${gGeocodeEndpoint}address=${encodeURIComponent(address)}&key=${ApiKey}`;
  
    return fetch(uri)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "OK" && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location;
          return { lat, lng };
        } else {
          throw new Error("Geocode was not successful: " + data.status);
        }
      });
  }
  
  export { addressToCoordinates };