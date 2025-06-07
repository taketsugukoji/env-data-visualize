import { render, screen, fireEvent } from "@testing-library/react";
import TempSpatialView from "../../views/TempSpatialView";
import { useFetchData } from "../../hooks/UseFetchData";

jest.mock("../../hooks/UseFetchData");

const mockExecute = jest.fn();
const mockedUseFetchData = useFetchData as jest.MockedFunction<
  typeof useFetchData
>;

describe("TempSpatialView", () => {
  beforeEach(() => {
    mockExecute.mockClear();

    mockedUseFetchData.mockImplementation(() => ({
      data: null,
      isLoading: false,
      error: null,
      execute: mockExecute,
    }));
  });

  it("初期レンダリングでタイトルが表示される", () => {
    render(<TempSpatialView />);
    expect(screen.getByText("海面水温取得")).toBeInTheDocument();
  });

  it("緯度・経度の入力ができる", () => {
    render(<TempSpatialView />);
    const latInput = screen.getByLabelText("緯度開始") as HTMLInputElement;
    fireEvent.change(latInput, { target: { value: "10" } });
    expect(latInput.value).toBe("10");
  });

  it("データ取得ボタンでexecuteが呼ばれる", () => {
    render(<TempSpatialView />);
    const btn = screen.getByText("データ取得");
    fireEvent.click(btn);

    expect(mockExecute).toHaveBeenCalled();
  });
});
