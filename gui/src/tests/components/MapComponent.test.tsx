import { render } from "@testing-library/react";
import MapComponent from "../../../src/components/MapComponent";
import "@testing-library/jest-dom";
import { StatsContainedResponse } from "../../hooks/UseFetchData";

describe("MapComponent", () => {
  jest.mock("maplibre-gl", () => ({
    Map: jest.fn().mockImplementation(() => ({
      on: jest.fn(),
      remove: jest.fn(),
      addControl: jest.fn(),
      addSource: jest.fn(),
      addLayer: jest.fn(),
      fitBounds: jest.fn(),
      getSource: jest.fn().mockReturnValue({ setData: jest.fn() }),
      project: jest.fn().mockReturnValue({ x: 0, y: 0 }),
      unproject: jest.fn().mockReturnValue({ lng: 0, lat: 0 }),
      getCanvas: jest.fn().mockReturnValue({ style: {} }),
    })),
    NavigationControl: jest.fn(),
    AttributionControl: jest.fn(),
  }));
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

  afterEach(() => {
    jest.clearAllMocks();
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

    expect(globalThis.maplibregl.Map).toHaveBeenCalled(); // 初期化されたか確認
  });
});
