'use server';

interface GeocodeResponse {
  results: {
    address_components: {
      types: string[];
      short_name: string;
    }[];
  }[];
}

export const getZipCodeFromCoords = async (latitude: number, longitude: number): Promise<string> => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.GOOGLE_MAPS_API_KEY}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch zip code');
  }

  const data: GeocodeResponse = await response.json();
  console.log(data);
  return (
    data.results[0].address_components.find(component => component.types.includes('postal_code'))?.short_name || ''
  );
};
