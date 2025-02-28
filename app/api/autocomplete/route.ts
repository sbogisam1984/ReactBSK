import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const input = searchParams.get('input')
  const placeId = searchParams.get('placeId')

  if (!input && !placeId) {
    return NextResponse.json(
      { error: 'Either input or placeId is required' },
      { status: 400 }
    )
  }

  try {
    let response
    if (input) {
      // Autocomplete request
      response = await fetch(
        'https://places.googleapis.com/v1/places:autocomplete',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': process.env.GOOGLE_MAPS_API_KEY!,
          },
          body: JSON.stringify({
            input,
            includedRegionCodes: ['us'],
            // locationBias: {
            //   circle: {
            //     center: {
            //       latitude: 37.7937,
            //       longitude: -122.3965,
            //     },
            //     radius: 50000.0,
            //   },
            // },
          }),
        }
      )
    } else {
      // Place Details request
      response = await fetch(
        `https://places.googleapis.com/v1/places/${placeId}`,
        {
          method: 'GET',
          headers: {
            'X-Goog-Api-Key': process.env.GOOGLE_MAPS_API_KEY!,
            'X-Goog-FieldMask': 'id,formattedAddress,addressComponents',
          },
        }
      )
    }

    if (!response.ok) {
      throw new Error(`Google API responded with status ${response.status}`)
    }

    const data = await response.json()
    // console.log('Full response data:', JSON.stringify(data, null, 2))
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching place data:', error)
    return NextResponse.json(
      { error: 'Error fetching place data' },
      { status: 500 }
    )
  }
}
