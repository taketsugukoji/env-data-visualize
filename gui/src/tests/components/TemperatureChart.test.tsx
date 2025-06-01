import { render, screen } from "@testing-library/react";
import TemperatureChart from "../../components/TemperatureChart";
import "@testing-library/jest-dom";

jest.mock("recharts", () => {
  const actual = jest.requireActual("recharts");

  // ダミーコンポーネント作成
  const Dummy = ({ children }: any) => <div>{children}</div>;

  return {
    __esModule: true,
    ...actual, // 型を壊さないために本物をベースに
    LineChart: Dummy,
    Line: Dummy,
    XAxis: Dummy,
    YAxis: Dummy,
    CartesianGrid: Dummy,
    Tooltip: Dummy,
    Legend: Dummy,
    ResponsiveContainer: Dummy,
  };
});

describe("TemperatureChart", () => {
  const sampleData = [
    { month: "Jan", temperature: 12 },
    { month: "Feb", temperature: 14 },
    { month: "Mar", temperature: 16 },
  ];

  it("renders title and chart", () => {
    render(<TemperatureChart chartData={sampleData} />);
    expect(screen.getByText("水温の時系列グラフ")).toBeInTheDocument();
    expect(screen.getByText("Jan")).toBeInTheDocument();
    expect(screen.getByText("Feb")).toBeInTheDocument();
    expect(screen.getByText("Mar")).toBeInTheDocument();
  });
});
