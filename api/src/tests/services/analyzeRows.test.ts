import { analyzeRows } from "../../services/analyzeRows";
import { Row } from "../../constants/temperature";

describe("analyzeRows", () => {
  const rows: Row[] = [
    ["2024-01-01T00:00:00Z", 0, 0, 10],
    ["2024-01-01T01:00:00Z", 0, 0, 20],
    ["2024-01-01T02:00:00Z", 0, 0, 0],
    ["2024-01-01T03:00:00Z", 0, 0, 30],
  ];

  it("統計値を正しく計算する", () => {
    const result = analyzeRows(rows);
    expect(result.minRow[3]).toBe(0);
    expect(result.maxRow[3]).toBe(30);
    expect(result.avg).toBe(15);
    expect(result.median).toBe(15);
  });
});
