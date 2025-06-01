import request from "supertest";
import express from "express";
import getTemperature from "../../controllers/getTemperature";
import fetchTempErddapData from "../../models/fetchTempErddapData";
import { HttpError } from "../../errors/HttpError";

jest.mock("../../models/fetchTempErddapData");
const mockedFetch = fetchTempErddapData.fetchData as jest.Mock;

const app = express();
app.get("/", getTemperature.getTemperature);

describe("getTemperature controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("正常にデータを返す", async () => {
    mockedFetch.mockResolvedValue({ foo: "bar" });
    const res = await request(app).get("/").query({
      latStart: 1,
      latEnd: 2,
      lonStart: 3,
      lonEnd: 4,
      dateStart: "2024-01-01T00:00:00Z",
      dateEnd: "2024-01-01T01:00:00Z",
    });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ foo: "bar" });
    expect(mockedFetch).toHaveBeenCalled();
  });

  it("dateStart/dateEndがstringでない場合はエラー", async () => {
    const res = await request(app).get("/").query({
      latStart: 1,
      latEnd: 2,
      lonStart: 3,
      lonEnd: 4,
      // dateStart,dateEndはなし
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toBe(
      "リクエストパラメータdateStartとdateEndは文字列である必要があります",
    );
  });

  it("fetchDataがエラーを投げた場合は500", async () => {
    mockedFetch.mockRejectedValue(
      new HttpError("ERDDAPにアクセスできませんでした", 502),
    );
    const res = await request(app).get("/").query({
      latStart: 1,
      latEnd: 2,
      lonStart: 3,
      lonEnd: 4,
      dateStart: "2024-01-01T00:00:00Z",
      dateEnd: "2024-01-01T01:00:00Z",
    });
    expect(res.status).toBe(502);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toBe("ERDDAPにアクセスできませんでした");
  });
});
