import { useEffect, useRef, useState } from "react";
import maplibregl, { Map, MapMouseEvent } from "maplibre-gl";
import {
  Feature,
  FeatureCollection,
  Point,
  Polygon,
  GeoJsonProperties,
} from "geojson";
import { StatsContainedResponse } from "./UseFetchData";
import {
  maxSeaTemperature,
  minSeaTemperature,
} from "../constants/temperature.ts";

export type UseMapLibreProps = {
  data: StatsContainedResponse | null;
  isSelecting: boolean;
  isSelectingPoint: boolean;
  setIsSelecting: (state: boolean) => void;
  setFormPos: (
    lng: { start: number; end: number },
    lat: { start: number; end: number },
  ) => void;
};

export const useMapLibre = ({
  data,
  isSelecting,
  isSelectingPoint,
  setIsSelecting,
  setFormPos,
}: UseMapLibreProps) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<Map | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startLngLat, setStartLngLat] = useState<{
    lng: number;
    lat: number;
  } | null>(null);
  const [endLngLat, setEndLngLat] = useState<{
    lng: number;
    lat: number;
  } | null>(null);

  const selectionSourceId = "selection";
  const selectionLayerId = "selection-layer";
  const sstSourceId = "sst";
  const sstLayerId = "sst-layer";

  // 地図初期化
  useEffect(() => {
    if (!mapContainer.current) return;
    const mapInstance = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [139.6917, 35.6895],
      zoom: 2,
    });
    setMap(mapInstance);
    return () => mapInstance.remove();
  }, []);

  // ドラッグ範囲選択用イベント
  useEffect(() => {
    if (!map || !isSelecting) return;

    const handleMouseDown = (e: MapMouseEvent) => {
      setIsDragging(true);
      setStartLngLat(e.lngLat);
      map.dragPan.disable();
      map.scrollZoom.disable();
    };

    const handleMouseMove = (e: MapMouseEvent) => {
      if (!isDragging || !startLngLat) return;
      setEndLngLat(e.lngLat);
    };

    const handleMouseUp = (e: MapMouseEvent) => {
      if (!isDragging || !startLngLat) return;
      setFormPos(
        { start: startLngLat.lng, end: e.lngLat.lng },
        { start: startLngLat.lat, end: e.lngLat.lat },
      );
      setEndLngLat(e.lngLat);
      setIsDragging(false);
      setIsSelecting(false);
      map.dragPan.enable();
      map.scrollZoom.enable();
      if (map.getLayer(selectionLayerId)) map.removeLayer(selectionLayerId);
      if (map.getSource(selectionSourceId)) map.removeSource(selectionSourceId);
      setStartLngLat(null);
      setEndLngLat(null);
    };

    map.on("mousedown", handleMouseDown);
    map.on("mousemove", handleMouseMove);
    map.on("mouseup", handleMouseUp);

    return () => {
      map.off("mousedown", handleMouseDown);
      map.off("mousemove", handleMouseMove);
      map.off("mouseup", handleMouseUp);
    };
  }, [map, isSelecting, isDragging, startLngLat, setFormPos, setIsSelecting]);

  // ドラッグ範囲の描画
  useEffect(() => {
    if (!startLngLat || !endLngLat || !map) return;

    const polygon: Feature<Polygon, GeoJsonProperties> = {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [startLngLat.lng, startLngLat.lat],
            [endLngLat.lng, startLngLat.lat],
            [endLngLat.lng, endLngLat.lat],
            [startLngLat.lng, endLngLat.lat],
            [startLngLat.lng, startLngLat.lat],
          ],
        ],
      },
      properties: {},
    };

    if (!map.getSource(selectionSourceId)) {
      map.addSource(selectionSourceId, {
        type: "geojson",
        data: { type: "FeatureCollection", features: [polygon] },
      });
      map.addLayer({
        id: selectionLayerId,
        type: "line",
        source: selectionSourceId,
        paint: {
          "line-color": "#ff0000",
          "line-width": 2,
          "line-dasharray": [2, 2],
        },
      });
    } else {
      const source = map.getSource(
        selectionSourceId,
      ) as maplibregl.GeoJSONSource;
      source.setData({ type: "FeatureCollection", features: [polygon] });
    }

    return () => {
      if (map.getLayer(selectionLayerId)) map.removeLayer(selectionLayerId);
      if (map.getSource(selectionSourceId)) map.removeSource(selectionSourceId);
    };
  }, [startLngLat, endLngLat, map]);

  // 地点選択イベント
  useEffect(() => {
    if (!map || !isSelectingPoint) return;

    const handleClick = (e: MapMouseEvent) => {
      const { lng, lat } = e.lngLat;
      setFormPos({ start: lng, end: lng }, { start: lat, end: lat });
      setIsSelecting(false);
    };

    map.on("click", handleClick);
    return () => {
      map.off("click", handleClick);
    };
  }, [map, isSelectingPoint, setFormPos, setIsSelecting]);

  // データ描画
  useEffect(() => {
    if (!data || !map) return;

    const geojsonData: FeatureCollection<
      Point,
      { temperature: number; time: string }
    > = {
      type: "FeatureCollection",
      features: data.table.rows.map(
        ([time, lat, lon, temp]: [string, number, number, number]) => ({
          type: "Feature",
          geometry: { type: "Point", coordinates: [lon, lat] },
          properties: { temperature: temp, time },
        }),
      ),
    };

    if (!map.getSource(sstSourceId)) {
      map.addSource(sstSourceId, { type: "geojson", data: geojsonData });
      map.addLayer({
        id: sstLayerId,
        type: "circle",
        source: sstSourceId,
        paint: {
          "circle-radius": 5,
          "circle-color": [
            "interpolate",
            ["linear"],
            ["get", "temperature"],
            minSeaTemperature,
            "rgba(0, 0, 255, 0)",
            minSeaTemperature + (maxSeaTemperature - minSeaTemperature) * 0.2,
            "blue",
            minSeaTemperature + (maxSeaTemperature - minSeaTemperature) * 0.4,
            "lime",
            minSeaTemperature + (maxSeaTemperature - minSeaTemperature) * 0.6,
            "yellow",
            minSeaTemperature + (maxSeaTemperature - minSeaTemperature) * 0.8,
            "orange",
            maxSeaTemperature,
            "red",
          ],
          "circle-opacity": 0.8,
        },
      });
    } else {
      const source = map.getSource(sstSourceId) as maplibregl.GeoJSONSource;
      source.setData(geojsonData);
    }
  }, [data, map]);

  return { mapContainer };
};
