import { useMapLibre, UseMapLibreProps } from "../hooks/UseMapLibre";

type Props = UseMapLibreProps;

const MapComponent = ({
  data,
  isSelecting,
  isSelectingPoint,
  setIsSelecting,
  setFormPos,
}: Props) => {
  const { mapContainer } = useMapLibre({
    data,
    isSelecting,
    isSelectingPoint,
    setIsSelecting,
    setFormPos,
  });

  return (
    <div
      ref={mapContainer}
      style={{ width: "100%", height: "500px", position: "relative" }}
    />
  );
};
export default MapComponent;
