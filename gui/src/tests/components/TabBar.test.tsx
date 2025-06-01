import { render, screen } from "@testing-library/react";
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

  it("/temperature/spatial のとき空間タブがデフォルトで選択される", () => {
    renderWithRouter("/temperature/spatial");
    expect(screen.getByRole("tab", { selected: true })).toHaveTextContent(
      "温度マップ",
    );
  });

  it("/temperature/temporal のとき時間タブが選択される", () => {
    renderWithRouter("/temperature/temporal");
    expect(screen.getByRole("tab", { selected: true })).toHaveTextContent(
      "時系列グラフ",
    );
  });
});
