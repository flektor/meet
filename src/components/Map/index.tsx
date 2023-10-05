import React, { useCallback, useState } from "react";
import ReactMapGL, { GeolocateControl, Marker } from "react-map-gl";
import { env } from "~/env.mjs";
import MarkerIcon from "~/components/icons/Marker";
import { MarkerDragEvent } from "react-map-gl/dist/esm/types";

export type LngLat = [number, number];

type ViewState = {
  lng: number;
  lat: number;
  zoom: number;
};

type MapProps = {
  onMarkerMoved?: (lngLat: LngLat) => void;
  showMarker?: boolean;
  markerClassName?: string;
  initMarkerLngLat?: LngLat;
  initViewLngLat?: LngLat;
  width?: string | number;
  height?: string | number;
};

const Map = ({
  onMarkerMoved,
  markerClassName = "",
  showMarker,
  initMarkerLngLat,
  initViewLngLat = [13.404954, 52.520008], // Berlin long-lat
  width = "100%",
  height = "50vh",
}: MapProps) => {
  const [viewport, setViewport] = useState<ViewState>({
    lng: initViewLngLat[0],
    lat: initViewLngLat[1],
    zoom: 12,
  });

  const handleViewportChange = (newViewport: ViewState) => {
    console.log(newViewport);
    setViewport(newViewport);
  };

  const [marker, setMarker] = useState<LngLat>(
    initMarkerLngLat || initViewLngLat,
  );

  const onMarkerDrag = (e: MarkerDragEvent<mapboxgl.Marker>) => {
    setMarker([e.lngLat.lng, e.lngLat.lat]);
  };

  const onMarkerDragEnd = useCallback((event: any) => {
    if (!onMarkerMoved) return;
    onMarkerMoved([event.lng, event.lat]);
  }, []);

  const markerLngLat = marker || initMarkerLngLat || initViewLngLat;

  return (
    <>
      <div className="border border-[#7f409eb7]">
        <ReactMapGL
          {...viewport}
          // width={width}
          // height={height}
          // onViewportChange={handleViewportChange}
          interactive
          mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_KEY}
          style={{ width, height }}
          viewState={{
            longitude: initViewLngLat[0],
            latitude: initViewLngLat[1],
            zoom: 12,
            width: 100,
            height: 100,
            bearing: 0,
            padding: { bottom: 0, left: 0, top: 0, right: 0 },
            pitch: 0,
          }}
          mapStyle="mapbox://styles/mapbox/dark-v10" // style={{
          //   color: "#cc66ff",
          // }}
        >
          {showMarker &&
            (
              <>
                <Marker
                  longitude={markerLngLat[0]}
                  latitude={markerLngLat[1]}
                  draggable
                  onDrag={onMarkerDrag}
                  onDragEnd={onMarkerDragEnd}
                >
                  <MarkerIcon
                    className={`fill-primary stroke-primary ${markerClassName}`}
                  />
                  <input
                    className="invisible"
                    name="marker"
                    value={JSON.stringify(marker)}
                  />
                </Marker>
              </>
            )}

          <GeolocateControl
            positionOptions={{ enableHighAccuracy: true }}
            trackUserLocation={true}
          />
        </ReactMapGL>
      </div>
    </>
  );
};

export default Map;
