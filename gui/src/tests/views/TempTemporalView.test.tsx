import { render, screen, fireEvent } from "@testing-library/react";
import TempTemporalView from "../../views/TempTemporalView";

jest.mock("../../hooks/UseFetchData", () => ({
  useFetchData: jest.fn().mockReturnValue({
    data: null,
    isLoading: false,
    error: null,
    execute: jest.fn(),
  }),
}));

describe("TempTemporalView", () => {
  it("タイトルが表示される", () => {
    render(<TempTemporalView />);
    expect(screen.getByText("海面水温取得（時系列）")).toBeInTheDocument();
  });

  it("地点選択ボタンを押すとインフォメーションが表示される", () => {
    render(<TempTemporalView />);
    const selectBtn = screen.getByText("地点選択する");
    fireEvent.click(selectBtn);

    expect(
      screen.getByText(
        "地図上をクリックして地点選択すると緯度経度が反映されます。",
      ),
    ).toBeInTheDocument();
  });
});
