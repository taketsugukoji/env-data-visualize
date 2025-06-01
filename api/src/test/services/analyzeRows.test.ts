import { Row } from "../constants/temperature";

export const analyzeRows = (rows: Row[]) => {
  // 水温のみ取り出す。欠損値 が含まれていることがあるため null を除外
  const tempList = rows
    .filter(([, , , temp]) => temp != null)
    .map(([, , , temp]) => temp);

  const minTemp = Math.min(...tempList);
  const maxTemp = Math.max(...tempList);
  const minRow = rows.find(([, , , temp]) => temp === minTemp)!;
  const maxRow = rows.find(([, , , temp]) => temp === maxTemp)!;

  const avg = tempList.reduce((sum, val) => sum + val, 0) / tempList.length;

  const sortedTempList = [...tempList].sort((a, b) => a - b);
  const median =
    tempList.length % 2 === 0
      ? (sortedTempList[tempList.length / 2 - 1] +
          sortedTempList[tempList.length / 2]) /
        2
      : sortedTempList[Math.floor(tempList.length / 2)];

  return {
    minRow,
    maxRow,
    avg,
    median,
  };
};
