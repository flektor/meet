import React, { useCallback, useState } from "react";
import ReactMapGL, { GeolocateControl, Marker } from "react-map-gl";
import { env } from "~/env.mjs";

type ViewState = {
  longitude: number;
  latitude: number;
  zoom: number;
};

type MapProps = {
  onPinMoved?: (latitude: number, longitude: number) => void;
  draggable?: boolean;
  initPinPosition?: { latitude: number; longitude: number };
  width?: string | number;
  height?: string | number;
};

const Map = (
  { onPinMoved, draggable, initPinPosition, width = "100%", height = "50vh" }:
    MapProps,
) => {
  const initLngLat = {
    longitude: 13.4050, // Berlin longitude
    latitude: 52.5200, // Berlin latitude
  };

  const [viewport, setViewport] = useState<ViewState>({
    ...initLngLat,
    zoom: 12,
  });
  const handleViewportChange = (newViewport: ViewState) => {
    setViewport(newViewport);
  };

  const [marker, setMarker] = useState(initLngLat);
  const [showMarker, setShowMarker] = useState(!!initPinPosition || false);

  const onMarkerDrag = useCallback((event: any) => {
    setMarker({
      longitude: event.lngLat[0],
      latitude: event.lngLat[1],
    });
  }, []);

  const onMarkerDragEnd = useCallback((event: any) => {
    if (!onPinMoved) return;
    //@ts-ignore
    onPinMoved(event.lngLat[0], event.lngLat[1]);
  }, []);

  function toggleMarker() {
    setMarker({ longitude: viewport.longitude, latitude: viewport.latitude });
    setShowMarker((prevhowMarker) => !prevhowMarker);
  }

  return (
    <>
      <div className="border border-[#cc66ff]">
        <ReactMapGL
          {...viewport}
          width={width}
          height={height}
          mapboxApiAccessToken={env.NEXT_PUBLIC_MAPBOX_KEY}
          //   onViewportChange={(newViewport: ViewState) => setViewport(newViewport)}
          onViewportChange={handleViewportChange}
          mapStyle="mapbox://styles/mapbox/dark-v10" // Set the map style to dark theme
          // You can customize the map's theme by specifying additional style properties below
          style={{
            color: "#cc66ff",
            // Add more style customizations as needed
          }}
        >
          {showMarker &&
            (
              <Marker
                longitude={marker.longitude}
                latitude={marker.latitude}
                draggable
                onDrag={onMarkerDrag}
                onDragEnd={onMarkerDragEnd}
              >
                <MarkerIcon />
              </Marker>
            )}

          <GeolocateControl
            positionOptions={{ enableHighAccuracy: true }}
            trackUserLocation={true}
          />
        </ReactMapGL>
      </div>
      {draggable &&
        (
          <button
            onClick={toggleMarker}
            type="button"
            className="flex justify-between items-center gap-2 rounded-full pl-6 pr-4 py-3 font-semibold text-white no-underline transition border-2 border-[#cc66ff] bg-black/20 hover:bg-white/10 hover:border-white [&>svg]:hover:fill-white [&>svg]:hover:stroke-white"
          >
            Pin location <MarkerIcon />
          </button>
        )}
    </>
  );
};

export default Map;

const MarkerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-8 h-8"
    viewBox="0 0 24 24"
    fill="#cc66ff"
    stroke="#cc66ff"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19ZM12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
    />
    <path
      d="M12 5V3"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M19 12L21 12"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M12 21L12 19"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M3 12H5"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
