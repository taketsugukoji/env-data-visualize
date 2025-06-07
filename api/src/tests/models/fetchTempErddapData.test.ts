import fetchTempErddapData from "../../models/fetchTempErddapData";
import { StatsContainedResponse } from "../../constants/temperature";
import axios, { AxiosError } from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const lat = { start: 40, end: 42 };
const lon = { start: 160, end: 162 };
const date = { start: new Date(), end: new Date() };

describe("fetchTempErddapData", () => {
  it("ERDDAPデータを取得し、統計値を返す", async () => {
    const mockRows = [
      ["2024-01-01T00:00:00Z", 40, 160, 10],
      ["2024-01-01T00:00:00Z", 41, 161, 20],
      ["2024-01-01T00:00:00Z", 42, 162, 30],
    ];
    mockedAxios.get.mockResolvedValue({
      data: {
        table: { rows: mockRows },
      },
    });

    const result: StatsContainedResponse = await fetchTempErddapData.fetchData(
      lat,
      lon,
      date,
    );

    expect(result.table.rows).toEqual(mockRows);
    expect(result.stats.avg).toBe(20);
    expect(result.stats.median).toBe(20);
  });

  it("ERDDAPデータに欠損値が含まれている場合、除外している)", async () => {
    const mockRows = [
      ["2024-01-01T00:00:00Z", 40, 160, 10],
      ["2024-01-01T00:00:00Z", 41, 161, 20],
      ["2024-01-01T00:00:00Z", 41, 162, null],
      ["2024-01-01T00:00:00Z", 42, 162, 30],
    ];
    mockedAxios.get.mockResolvedValue({
      data: {
        table: { rows: mockRows },
      },
    });

    const result: StatsContainedResponse = await fetchTempErddapData.fetchData(
      lat,
      lon,
      date,
    );

    expect(result.table.rows).toHaveLength(mockRows.length - 1);
  });

  it("ERDDAPが404を返したらHttpError(404)を投げる", async () => {
    (axios.isAxiosError as unknown as jest.Mock).mockImplementation(
      (e) => e.isAxiosError === true,
    );
    const error = {
      isAxiosError: true,
      response: {
        status: 404,
        data: {
          message: "Not Found",
        },
      },
      message: "Not Found",
    } as AxiosError;

    mockedAxios.get.mockRejectedValue(error);

    await expect(
      fetchTempErddapData.fetchData(lat, lon, date),
    ).rejects.toThrowError("Not Found");
  });

  it("Axiosがレスポンスを持たない場合、HttpError(502)を投げる", async () => {
    mockedAxios.get.mockRejectedValue({
      isAxiosError: true,
      message: "Network Error",
    });

    await expect(
      fetchTempErddapData.fetchData(lat, lon, date),
    ).rejects.toThrowError(/ERDDAPにアクセスできませんでした/);
  });

  it("AxiosErrorでない場合、HttpError(502)を投げる", async () => {
    mockedAxios.get.mockRejectedValue(new Error("Unknown error"));

    await expect(
      fetchTempErddapData.fetchData(lat, lon, date),
    ).rejects.toThrowError(/ERDDAPにアクセスできませんでした/);
  });
});
