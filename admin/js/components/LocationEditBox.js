// js/components/LocationEditBox.js

import { useContext, useState, useEffect, useRef } from 'https://cdn.skypack.dev/preact/hooks';
import { html } from 'https://cdn.skypack.dev/htm/preact';
import { DataContext } from '../contexts/Data.js';

export const LocationEditBox = () => {
    const { data, setData } = useContext(DataContext);
    const [latitude, setLatitude] = useState(data.location.latitude);
    const [longitude, setLongitude] = useState(data.location.longitude);
    const mapRef = useRef(null);
    const markerRef = useRef(null);

    useEffect(() => {
        if (mapRef.current) {
            const map = new google.maps.Map(mapRef.current, {
                center: { lat: latitude, lng: longitude },
                zoom: 8
            });

            const marker = new google.maps.Marker({
                position: { lat: latitude, lng: longitude },
                map: map,
                draggable: true
            });

            markerRef.current = marker;

            google.maps.event.addListener(marker, 'dragend', (event) => {
                const newLat = event.latLng.lat();
                const newLng = event.latLng.lng();
                setLatitude(newLat);
                setLongitude(newLng);
                updateLocation(newLat, newLng);
            });
        }
    }, [mapRef.current]);

    const updateLocation = (lat, lng) => {
        const updatedData = {
            ...data,
            location: { latitude: lat, longitude: lng }
        };
        setData(updatedData);
    };

    const handleLatChange = (e) => {
        const newLat = parseFloat(e.target.value);
        setLatitude(newLat);
        updateLocation(newLat, longitude);
        if (markerRef.current) {
            markerRef.current.setPosition(new google.maps.LatLng(newLat, longitude));
        }
    };

    const handleLngChange = (e) => {
        const newLng = parseFloat(e.target.value);
        setLongitude(newLng);
        updateLocation(latitude, newLng);
        if (markerRef.current) {
            markerRef.current.setPosition(new google.maps.LatLng(latitude, newLng));
        }
    };

    const handleAddressChange = (address) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'address': address }, (results, status) => {
            if (status === 'OK') {
                const newLat = results[0].geometry.location.lat();
                const newLng = results[0].geometry.location.lng();
                setLatitude(newLat);
                setLongitude(newLng);
                updateLocation(newLat, newLng);
                if (markerRef.current) {
                    markerRef.current.setPosition(new google.maps.LatLng(newLat, newLng));
                    mapRef.current.setCenter(new google.maps.LatLng(newLat, newLng));
                }
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    };

    return html`
        <div>
            <h2>Location</h2>
            <div id="map" ref=${mapRef} style="height: 400px; width: 100%;"></div>
            <div>
                <label>
                    Latitude:
                    <input type="number" value=${latitude} onInput=${handleLatChange} step="0.0001" />
                </label>
                <label>
                    Longitude:
                    <input type="number" value=${longitude} onInput=${handleLngChange} step="0.0001" />
                </label>
                <label>
                    Address:
                    <input type="text" id="map_address_input"  placeholder="Enter address" />
                    <input type="button" onClick=${() => handleAddressChange(document.getElementById("map_address_input").value)} value="Ok" />
                </label>
            </div>
        </div>
    `;
};
