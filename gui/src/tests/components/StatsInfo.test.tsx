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

  it("renders stats correctly", () => {
    render(<StatsComponent stats={mockStats} />);
    expect(screen.getByText("統計情報")).toBeInTheDocument();
    expect(screen.getByText(/最低水温: 15.2℃/)).toBeInTheDocument();
    expect(screen.getByText(/最高水温: 28.7℃/)).toBeInTheDocument();
    expect(screen.getByText(/平均値: 21.5℃/)).toBeInTheDocument();
    expect(screen.getByText(/中央値: 20.1℃/)).toBeInTheDocument();
  });
});
