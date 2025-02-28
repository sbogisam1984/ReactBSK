import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';

interface AddressComponent {
  longText: string;
  shortText: string;
  types: string[];
}

interface Prediction {
  placePrediction: {
    place: string;
    placeId: string;
    text: {
      text: string;
      matches: Array<{ startOffset?: number; endOffset: number }>;
    };
    structuredFormat: {
      mainText: {
        text: string;
        matches: Array<{ startOffset?: number; endOffset: number }>;
      };
      secondaryText: {
        text: string;
      };
    };
    types: string[];
  };
}

interface PlaceDetails {
  id: string;
  formattedAddress: string;
  addressComponents: AddressComponent[];
}

const useAddressAutocomplete = (
  onSelect: (address: { streetAddress: string; city: string; state: string; zip: string }) => void,
  initialValue?: string
) => {
  const [input, setInput] = useState(initialValue || '');
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPredictions = useCallback(
    debounce(async (input: string) => {
      if (input.length > 2) {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch(`/DigitalUnity/api/autocomplete?input=${encodeURIComponent(input)}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setPredictions(data.suggestions || []);
        } catch (error) {
          console.error('Error fetching predictions:', error);
          setError('Failed to fetch address predictions');
        } finally {
          setIsLoading(false);
        }
      } else {
        setPredictions([]);
      }
    }, 300),
    []
  );

  useEffect(() => {
    fetchPredictions(input);
    return () => {
      fetchPredictions.cancel();
    };
  }, [input, fetchPredictions]);

  const handleSelect = async (prediction: Prediction) => {
    setInput(prediction.placePrediction.structuredFormat.mainText.text);
    try {
      const response = await fetch(`/DigitalUnity/api/autocomplete?placeId=${prediction.placePrediction.placeId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const placeDetails: PlaceDetails = await response.json();

      const streetNumber = placeDetails.addressComponents.find(c => c.types.includes('street_number'))?.longText || '';
      const route = placeDetails.addressComponents.find(c => c.types.includes('route'))?.longText || '';
      const streetAddress = `${streetNumber} ${route}`.trim();
      const city = placeDetails.addressComponents.find(c => c.types.includes('locality'))?.longText || '';
      const state =
        placeDetails.addressComponents.find(c => c.types.includes('administrative_area_level_1'))?.shortText || '';
      const postalCode = placeDetails.addressComponents.find(c => c.types.includes('postal_code'))?.longText || '';
      const postalCodeSuffix =
        placeDetails.addressComponents.find(c => c.types.includes('postal_code_suffix'))?.longText || '';
      const zip = postalCodeSuffix ? `${postalCode}-${postalCodeSuffix}` : postalCode;

      onSelect({ streetAddress, city, state, zip });
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
    setPredictions([]);
  };

  return { input, setInput, predictions, handleSelect, isLoading, error };
};

export default useAddressAutocomplete;
