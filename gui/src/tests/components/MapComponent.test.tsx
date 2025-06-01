import { render } from "@testing-library/react";
import MapComponent from "../../../src/components/MapComponent";
import "@testing-library/jest-dom";
import { useMapLibre } from "../../../src/hooks/UseMapLibre";
import { StatsContainedResponse } from "../../hooks/UseFetchData";

jest.mock("../../../src/hooks/UseMapLibre", () => ({
  useMapLibre: jest.fn(),
}));
describe("MapComponent", () => {
  const dummySetIsSelecting = jest.fn();
  const dummySetFormPos = jest.fn();

  const dummyData: StatsContainedResponse = {
    table: {
      columnNames: ["time", "latitude", "longitude", "sea_surface_temperature"],
      columnTypes: ["String", "float", "float", "float"],
      columnUnits: ["UTC", "degrees_north", "degrees_east", "degree_C"],
      rows: [
        ["2024-01-01T00:00:00Z", 40, 160, 10],
        ["2024-01-01T00:00:00Z", 41, 161, 20],
        ["2024-01-01T00:00:00Z", 42, 162, 30],
      ],
    },
    stats: {
      minRow: ["time", 40, 160, 10],
      maxRow: ["time", 42, 162, 30],
      avg: 20,
      median: 20,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // useMapLibreのモックでmapContainerを返すだけにする
    (useMapLibre as jest.Mock).mockReturnValue({
      mapContainer: { current: document.createElement("div") },
    });
  });

  it("正常にコンポーネントを描画できている", () => {
    const { container } = render(
      <MapComponent
        data={null}
        isSelecting={false}
        isSelectingPoint={false}
        setIsSelecting={dummySetIsSelecting}
        setFormPos={dummySetFormPos}
      />,
    );
    expect(container.firstChild).toBeInTheDocument();
    expect(useMapLibre).toHaveBeenCalled();
  });

  it("データが渡されたとき、useMapLibreが正しいプロップスで呼び出される", () => {
    render(
      <MapComponent
        data={dummyData}
        isSelecting={false}
        isSelectingPoint={false}
        setIsSelecting={dummySetIsSelecting}
        setFormPos={dummySetFormPos}
      />,
    );

    expect(useMapLibre).toHaveBeenCalledWith({
      data: dummyData,
      isSelecting: false,
      isSelectingPoint: false,
      setIsSelecting: dummySetIsSelecting,
      setFormPos: dummySetFormPos,
    });
  });
});
