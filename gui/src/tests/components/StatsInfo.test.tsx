import { render, screen } from "@testing-library/react";
import StatsComponent from "../../components/StatsInfo";
import "@testing-library/jest-dom";
import { Stats } from "../../hooks/UseFetchData";

describe("StatsComponent", () => {
  const mockStats: Stats = {
    minRow: ["time", 35.0, 139.0, 15.2],
    maxRow: ["time", 36.0, 140.0, 28.7],
    avg: 21.5,
    median: 20.1,
  };

  it("統計情報が正しく表示される", () => {
    render(<StatsComponent stats={mockStats} />);
    expect(screen.getByText("統計情報")).toBeInTheDocument();
    expect(screen.getByText(/最低水温/)).toBeInTheDocument();
    expect(screen.getByText(/15.2℃/)).toBeInTheDocument();
    expect(screen.getByText(/(緯度: 35、経度: 139)/)).toBeInTheDocument();
    expect(screen.getByText(/最高水温/)).toBeInTheDocument();
    expect(screen.getByText(/28.7℃/)).toBeInTheDocument();
    expect(screen.getByText(/(緯度: 36、経度: 140)/)).toBeInTheDocument();
    expect(screen.getByText(/平均値/)).toBeInTheDocument();
    expect(screen.getByText(/21.5℃/)).toBeInTheDocument();
    expect(screen.getByText(/中央値/)).toBeInTheDocument();
    expect(screen.getByText(/20.1℃/)).toBeInTheDocument();
  });
});