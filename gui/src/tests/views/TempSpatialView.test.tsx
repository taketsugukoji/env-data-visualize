import { render, screen, fireEvent } from "@testing-library/react";
import { useFetchData } from "../../hooks/UseFetchData";
import TempSpatialView from "../../views/TempSpatialView";

jest.mock("../../hooks/UseFetchData", () => ({
  useFetchData: jest.fn(),
}));

describe("TempSpatialView", () => {
  it("初期レンダリングでタイトルが表示される", () => {
    (useFetchData as any).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      execute: jest.fn(),
    });

    render(<TempSpatialView />);
    expect(screen.getByText("海面水温取得")).toBeInTheDocument();
  });

  it("緯度・経度の入力ができる", () => {
    (useFetchData as any).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      execute: jest.fn(),
    });

    render(<TempSpatialView />);
    const latInput = screen.getByLabelText("緯度開始") as HTMLInputElement;
    fireEvent.change(latInput, { target: { value: "10" } });
    expect(latInput.value).toBe("10");
  });

  it("データ取得ボタンでexecuteが呼ばれる", () => {
    const mockExecute = jest.fn();
    (useFetchData as any).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      execute: mockExecute,
    });

    render(<TempSpatialView />);
    const btn = screen.getByText("データ取得");
    fireEvent.click(btn);

    expect(mockExecute).toHaveBeenCalled();
  });
});
