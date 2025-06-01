# GIS を用いた海面水温データの可視化アプリ

## 概要
本アプリは、緯度経度ごとに取得されたイメージの掴みにくい海面水温データを、GIS を用いて分かりやすく可視化することを目的として作成しました。

### 背景
元々大学時代の研究で海洋データを扱っていました。その際、Python や Excel、PowerPoint などを用いて研究成果をまとめていましたが、データ取得・加工・可視化に多くの手間と技術が必要だったため、より研究に専念できるように、プログラムの知識があまりない人でも直感的にデータの取得から表示までを補助してくれるツールがあれば便利だと考えていました。当時は技術があまり身についていなかったため実現しませんでしたがそちらを思い出し、実現しようと思い作成しました。
直感的なUIを持つ

### 使用データ
本アプリでは NOAA（National Oceanic and Atmospheric Administration）が提供する海洋環境データAPIである ERDDAP を使用。
- [ERDDAP公式サイト](https://coastwatch.pfeg.noaa.gov/erddap)
- 教育・研究目的で幅広く活用。データはオープンソース。
- 提供形式は `griddap` と `tabledap` の2種類。
  - `griddap`: グリッド単位のデータ（例：海水温の時系列）
  - `tabledap`: 地点ベースのデータ（例：観測地点の生物情報）

今回はその中で、`griddap` を使用し、**NOAAが提供する海水温の月平均データ**を使用。
- 使用データ：[NOAA_DHW_monthly](https://coastwatch.pfeg.noaa.gov/erddap/info/NOAA_DHW_monthly/index.html)

---

## 技術構成

### フロントエンド（`gui` ディレクトリ）
- React（UI構築）
  - 普段は Vue.js を使用しているが、React の学習も兼ねて選定
- TypeScript
- Vite（ビルドツール）
- MapLibre GL JS（地図描画）
- @testing-library/react（UIテスト）
- Jest（ユニットテスト）
- ESLint（リンター）
- Prettier（コードフォーマッタ）
- Material-UI（UIコンポーネントライブラリ）

### バックエンド（`api` ディレクトリ）

- Node.js + Express
  - API 側はシンプルな CRUD 操作のみの実装のため、軽量な Express を選定
- TypeScript
- ts-node（開発用）
- axios（API通信）
- Jest（ユニットテスト）
- supertest（APIテスト）

---

## 機能一覧

### 海面水温マップ表示

- 日付を入力し、指定した月の海水温データを取得
- 緯度・経度の範囲は以下の2通りで指定可能：
  - 入力フォームによる手動入力
  - 地図上のドラッグによる選択
- データ取得後、地図上に水温のカラーマップを表示
- 表示範囲内の平均・最大・最小温度の統計情報を同時に表示

### 時系列グラフ表示

- 日付を指定
- 座標（緯度・経度）を指定
  - フォーム入力
  - 地図上をクリックして選択
- 指定地点の月別の海水温データを取得
- 折れ線グラフで視覚的に推移を表示

---

## 起動方法

npm worktree を使用しているため、プロジェクトルートで以下のコマンドを実行することで起動が可能です。

```bash
npm install
npm run dev
```
また、個別で立ち上げたい場合は以下のように実行してください。

### バックエンド（APIサーバー）の起動

```bash
cd api
npm install
npx ts-node server.ts
```
### フロントエンド（GUI）の起動
```bash
cd gui
npm install
npm run dev
```
### デモ
実際にローカルで起動した際の動作をこちらに添付いたします。