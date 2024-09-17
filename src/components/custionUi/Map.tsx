'use client';
import { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L, { LatLng } from 'leaflet';
import debounce from 'lodash.debounce';

const markerIcon = new L.Icon({
    iconUrl: '/map-pin.svg',
    iconSize: [38, 50],
    iconAnchor: [22, 51],
    popupAnchor: [-3, -76],
});

interface LocationMarkerProps {
    setSelectedPositions: React.Dispatch<React.SetStateAction<{ position: LatLng; placeName: string }[]>>;
}

const LocationMarker: React.FC<LocationMarkerProps> = ({ setSelectedPositions }) => {
    useMapEvents({
        click(e) {
            fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}&accept-language=en`
            )
                .then((response) => response.json())
                .then((data) => {
                    const placeName = data.display_name || 'Unknown Place';
                    setSelectedPositions((prevPositions) => [
                        ...prevPositions,
                        { position: e.latlng, placeName },
                    ]);
                })
                .catch((error) => {
                    console.error('Error fetching place name:', error);
                });
        },
    });
    return null;
};

// Custom hook to use the map and pan to a specific location
const usePanToLocation = () => {
    const map = useMap();
    const panToLocation = (latlng: LatLng) => {
        map.setView(latlng, 13); // Pan to the specified location and set zoom level
    };
    return panToLocation;
};

// Button to pan to the user's current location
const MyLocationButton: React.FC<{ currentPosition: LatLng | null }> = ({ currentPosition }) => {
    const panToLocation = usePanToLocation();

    return (
        <button
            onClick={() => currentPosition && panToLocation(currentPosition)}
            style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                zIndex: 1000,
                padding: '10px',
                backgroundColor: 'white',
                border: '2px solid black',
                borderRadius: '5px',
            }}
        >
            My Location
        </button>
    );
};

// Search component outside the map
const SearchBox: React.FC<{ onSelectLocation: (latlng: LatLng, placeName: string) => void }> = ({ onSelectLocation }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<{ display_name: string, lat: string, lon: string }[]>([]);

    // Debounced search handler (waits 1 second after the user stops typing)
    const debouncedFetchSearchResults = useCallback(debounce(async (searchQuery: string) => {
        if (searchQuery.length > 2) {
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}&limit=5`);
                const data = await response.json();
                setResults(data);
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        } else {
            setResults([]);
        }
    }, 1000), []);

    useEffect(() => {
        if (query) {
            debouncedFetchSearchResults(query);
        }
    }, [query, debouncedFetchSearchResults]);

    const handleSelectLocation = (lat: string, lon: string, placeName: string) => {
        const latlng = new LatLng(parseFloat(lat), parseFloat(lon));
        onSelectLocation(latlng, placeName);
        setQuery(''); // Reset the query after selection
        setResults([]); // Clear the results
    };

    return (
        <div style={{ marginBottom: '10px' }}>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for a location"
                style={{
                    padding: '8px',
                    width: '100%',
                    maxWidth: '400px',
                    border: '1px solid black',
                    borderRadius: '5px',
                }}
            />
            {results.length > 0 && (
                <ul style={{ listStyleType: 'none', padding: '0', margin: '5px 0', border: '1px solid black', borderRadius: '5px', backgroundColor: 'white', width: '100%', maxWidth: '400px' }}>
                    {results.map((result, index) => (
                        <li
                            key={index}
                            onClick={() => handleSelectLocation(result.lat, result.lon, result.display_name)}
                            style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #ddd' }}
                        >
                            {result.display_name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const Map: React.FC = () => {
    const [currentPosition, setCurrentPosition] = useState<LatLng | null>(null);
    const [selectedPositions, setSelectedPositions] = useState<{ position: LatLng; placeName: string }[]>([]);

    // Get user's current location with high accuracy enabled
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setCurrentPosition(new LatLng(latitude, longitude));
            },
            (error) => {
                console.error('Error getting location:', error);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    }, []);

    const handleSelectLocation = (latlng: LatLng, placeName: string) => {
        setSelectedPositions((prevPositions) => [
            ...prevPositions,
            { position: latlng, placeName },
        ]);
    };

    return (
        <div style={{ position: 'relative' }}>
            <SearchBox onSelectLocation={handleSelectLocation} />

            {currentPosition ? (
                <MapContainer
                    center={currentPosition}
                    zoom={13}
                    style={{ height: '400px', width: '100%' }}
                >
                    {/* OpenStreetMap TileLayer */}
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />

                    {/* Marker for the current location */}
                    <Marker position={currentPosition} icon={markerIcon} />

                    {/* Markers for the selected points */}
                    {selectedPositions.map((item, index) => (
                        <Marker key={index} position={item.position} icon={markerIcon} />
                    ))}

                    {/* Component to handle clicks on the map */}
                    <LocationMarker setSelectedPositions={setSelectedPositions} />

                    {/* My Location button */}
                    <MyLocationButton currentPosition={currentPosition} />
                </MapContainer>
            ) : (
                <p>Loading map...</p>
            )}

            {/* Display selected points coordinates and place names */}
            {selectedPositions.length > 0 && (
                <div>
                    <h3>Selected Points and Place Names:</h3>
                    <ul>
                        {selectedPositions.map((item, index) => (
                            <li key={index}>
                                <strong>Place:</strong> {item.placeName} <br />
                                <strong>Coordinates:</strong> Latitude: {item.position.lat}, Longitude: {item.position.lng}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Map;
