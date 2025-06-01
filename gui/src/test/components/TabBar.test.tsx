import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import TabBar from "../../components/TabBar";
import "@testing-library/jest-dom";

describe("TabBar", () => {
  const renderWithRouter = (initialRoute: string) => {
    window.history.pushState({}, "Test page", initialRoute);

    render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="*" element={<TabBar />} />
        </Routes>
      </MemoryRouter>,
    );
  };

  it("selects spatial tab by default on /temperature/spatial", () => {
    renderWithRouter("/temperature/spatial");
    expect(screen.getByRole("tab", { selected: true })).toHaveTextContent(
      "温度マップ",
    );
  });

  it("selects temporal tab on /temperature/temporal", () => {
    renderWithRouter("/temperature/temporal");
    expect(screen.getByRole("tab", { selected: true })).toHaveTextContent(
      "時系列グラフ",
    );
  });

  it("navigates to spatial tab on click", () => {
    renderWithRouter("/temperature/temporal");

    const spatialTab = screen.getByText("温度マップ");
    fireEvent.click(spatialTab);
    expect(spatialTab).toBeInTheDocument();
  });
});
