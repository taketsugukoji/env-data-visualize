import { render, screen } from "@testing-library/react";
import TemperatureChart from "../../../src/components/TemperatureChart";

const mockData = [
  { month: "Jan", temperature: 18.5 },
  { month: "Feb", temperature: 19.2 },
  { month: "Mar", temperature: 20.1 },
];

describe("TemperatureChart", () => {
  test("タイトルが表示される", () => {
    render(<TemperatureChart chartData={mockData} />);
    expect(screen.getByText("水温の時系列グラフ")).toBeInTheDocument();
  });
  test("グラフが描画されている", () => {
    render(<TemperatureChart chartData={mockData} />);
    const svg = document.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
  test("データが渡されたときにXAxisのラベルが含まれている", () => {
    render(<TemperatureChart chartData={mockData} />);
    expect(screen.getByText("Jan")).toBeInTheDocument();
    expect(screen.getByText("Feb")).toBeInTheDocument();
    expect(screen.getByText("Mar")).toBeInTheDocument();
  });
});
