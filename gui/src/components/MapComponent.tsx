import { useEffect, useRef, useState } from "react";
import maplibregl, { MapMouseEvent, Map } from "maplibre-gl";
import { StatsContainedResponse } from "../hooks/UseFetchData.tsx";

type Props = {
  data: StatsContainedResponse | null;
  isSelecting: boolean;
  isSelectingPoint: boolean;
  setIsSelecting: (state: boolean) => void;
  setFormPos: (
    lng: { start: number; end: number },
    lat: { start: number; end: number },
  ) => void;
};

const MapComponent = ({
  data,
  isSelecting,
  isSelectingPoint,
  setIsSelecting,
  setFormPos,
}: Props) => {
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

  // 矩形選択用イベント
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

      if (map.getLayer("selection-layer")) map.removeLayer("selection-layer");
      if (map.getSource("selection")) map.removeSource("selection");

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
  }, [map, isSelecting, isDragging, startLngLat]);

  // 矩形の描画
  useEffect(() => {
    if (!startLngLat || !endLngLat || !map) return;

    const polygon = {
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

    if (!map.getSource("selection")) {
      map.addSource("selection", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [polygon] },
      });
      map.addLayer({
        id: "selection-layer",
        type: "line",
        source: "selection",
        paint: {
          "line-color": "#ff0000",
          "line-width": 2,
          "line-dasharray": [2, 2],
        },
      });
    } else {
      const source = map.getSource("selection") as maplibregl.GeoJSONSource;
      source.setData({ type: "FeatureCollection", features: [polygon] });
    }
  }, [startLngLat, endLngLat, map]);

  // 一点選択イベント
  useEffect(() => {
    if (!map || !isSelectingPoint) return;

    const handleClick = (e: MapMouseEvent) => {
      const { lng, lat } = e.lngLat;
      setFormPos({ start: lng, end: lng }, { start: lat, end: lat });
      setIsSelecting(false);
    };

    map.on("click", handleClick);
    return () => map.off("click", handleClick);
  }, [map, isSelectingPoint]);

  // データ描画（ヒートマップ）
  useEffect(() => {
    if (!data || !map) return;

    const geojsonData = {
      type: "FeatureCollection",
      features: data.table.rows.map(([time, lat, lon, temp]) => ({
        type: "Feature",
        geometry: { type: "Point", coordinates: [lon, lat] },
        properties: { temperature: temp, time },
      })),
    };

    const min = -2; //TODO:何かいいソースあれば代替
    const max = 35;

    if (!map.getSource("sst-heatmap")) {
      map.addSource("sst-heatmap", { type: "geojson", data: geojsonData });
      map.addLayer({
        id: "sst-heatmap-layer",
        type: "circle",
        source: "sst-heatmap",
        paint: {
          "circle-radius": 5,
          "circle-color": [
            "interpolate",
            ["linear"],
            ["get", "temperature"],
            min,
            "rgba(0, 0, 255, 0)",
            min + (max - min) * 0.2,
            "blue",
            min + (max - min) * 0.4,
            "lime",
            min + (max - min) * 0.6,
            "yellow",
            min + (max - min) * 0.8,
            "orange",
            max,
            "red",
          ],
          "circle-opacity": 0.8,
        },
      });
    } else {
      const source = map.getSource("sst-heatmap") as maplibregl.GeoJSONSource;
      source.setData(geojsonData);
    }
  }, [data, map]);

  return (
    <div
      ref={mapContainer}
      style={{ width: "100%", height: "500px", position: "relative" }}
    />
  );
};

export default MapComponent;
