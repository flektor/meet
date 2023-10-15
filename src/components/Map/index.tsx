import React, { useCallback, useEffect, useState } from "react";
import ReactMapGL, { Marker, ViewStateChangeEvent } from "react-map-gl";
import { env } from "~/env.mjs";
import MarkerIcon from "~/components/icons/Marker";
import { MarkerDragEvent } from "react-map-gl/dist/esm/types";

export type LngLat = [number, number];

type ViewState = {
  longitude: number;
  latitude: number;
  width: number;
  height: number;
  pitch: number;
  zoom: number;
  bearing: number;
  padding: { bottom: number; left: number; top: number; right: number };
};

type MapProps = {
  draggableMarker?: boolean;
  onMarkerMoved?: (lngLat: LngLat) => void;
  showMarker?: boolean;
  markerClassName?: string;
  markerLngLat?: LngLat;
  initViewLngLat?: LngLat;
  width?: string | number;
  height?: string | number;
};

const Map = ({
  onMarkerMoved,
  draggableMarker,
  markerClassName = "",
  showMarker,
  markerLngLat,
  initViewLngLat = [13.404954, 52.520008], // Berlin long-lat
  width = "100%",
  height = "50vh",
}: MapProps) => {
  //
  const [viewport, setViewport] = useState<ViewState>({
    longitude: markerLngLat && markerLngLat[0] || initViewLngLat[0],
    latitude: markerLngLat && markerLngLat[1] || initViewLngLat[1],
    width: 200,
    height: 200,
    zoom: 12,
    pitch: 0,
    bearing: 0,
    padding: { bottom: 0, left: 0, top: 0, right: 0 },
  });

  const handleViewportChange = (event: ViewStateChangeEvent) => {
    setViewport({ ...event.viewState, width: 100, height: 100 });
  };

  const [marker, setMarker] = useState<LngLat>(
    initViewLngLat,
  );

  const onMarkerDrag = (e: MarkerDragEvent<mapboxgl.Marker>) => {
    setMarker([e.lngLat.lng, e.lngLat.lat]);
  };

  const onMarkerDragEnd = useCallback(
    (event: MarkerDragEvent<mapboxgl.Marker>) => {
      if (!onMarkerMoved) {
        return;
      }
      onMarkerMoved([event.lngLat.lng, event.lngLat.lat]);
      setViewport({
        ...viewport,
        longitude: event.lngLat.lng,
        latitude: event.lngLat.lat,
      });
    },
    [],
  );

  useEffect(() => {
    if (markerLngLat) {
      setMarker(markerLngLat);
      setViewport({
        ...viewport,
        longitude: markerLngLat[0],
        latitude: markerLngLat[1],
      });
    }
  }, [markerLngLat]);

  useEffect(() => {
    if (showMarker) {
      setMarker([viewport.longitude, viewport.latitude]);
    }
  }, [showMarker]);
  return (
    <div className="border border-[#7f409eb7]">
      <ReactMapGL
        onLoad={(e) => e.target.resize()}
        onMoveEnd={handleViewportChange}
        interactive
        mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_KEY}
        style={{ width, height }}
        initialViewState={viewport}
        scrollZoom
        mapStyle="mapbox://styles/mapbox/dark-v10"
      >
        {showMarker &&
          (
            <Marker
              longitude={marker[0]}
              latitude={marker[1]}
              draggable={draggableMarker}
              onDrag={onMarkerDrag}
              onDragEnd={onMarkerDragEnd}
            >
              <MarkerIcon
                className={`fill-primary stroke-primary ${markerClassName}`}
              />
              <input
                className="invisible"
                name="marker"
                value={marker.toString()}
                onChange={() => {}}
              />
            </Marker>
          )}

        {
          /* <GeolocateControl
            positionOptions={{ enableHighAccuracy: true }}
            trackUserLocation={true}
          />   */
        }
      </ReactMapGL>
    </div>
  );
};

export default Map;
