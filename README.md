# Ambient Desk

時間とともに色が変わる、オフライン完結のデスクトップ背景。

CDN・外部 API・Web フォントは使いません。同梱の CSS / JS / サブセット済み WOFF2 だけで動きます。

1920×1080 を基準に、四隅へ散らして中央を空けてある。2560×1080 やそれ以上でもはみ出さない。

## デモ

[GitHub Pages](https://toyfer.github.io/ambient-desk/)

## 使い方

1. このリポジトリを clone するか、ZIP で落とす
2. `index.html` を壁紙ホストに指定する（フォルダごと渡す）

壁紙ホストではクリックもキーもマウスもページに届きません。見た目の切替は `js/config.js` をテキストエディタで直します。保存したあと、壁紙を読み直してください。

ブラウザで見るだけなら `index.html` を開くか、上の Pages を開いてください。

## 設定（`js/config.js`）

```js
window.AD_CONFIG = {
  glass: true,
  motion: true,
  taskbar: 56,
  lat: 35.6895,          // 観測地点（日の出など）
  lon: 139.6917,
  theme: "ayu-mirage",   // "ayu-mirage" | "ayu-dark" | "ayu-light"
  colors: {},            // 上書きしたい色だけ
  cities: [
    ["ソウル", "Asia/Seoul"],
    ["上海", "Asia/Shanghai"],
    ["ドバイ", "Asia/Dubai"],
    ["ロンドン", "Europe/London"],
    ["ニューヨーク", "America/New_York"],
    ["ロサンゼルス", "America/Los_Angeles"]
  ]
};
```

既定は Ayu Mirage。`theme` を `ayu-dark` / `ayu-light` にすると全体が切り替わる。
`colors` に書いたキーだけ上書きされる（`bg` `fg` `accent` `hol` `sun` `sat` など）。
`lat` / `lon` は自分の場所に合わせて変えてください。

## 構成

```
ambient-desk/
├── index.html
├── css/
├── js/         config / theme / sky / …
└── fonts/      PlemolJP サブセット
```

## ライセンス

コードはリポジトリのライセンスに従う。

同梱フォント:

- [PlemolJP](https://github.com/yuru7/PlemolJP) v3.1.0（SIL Open Font License 1.1）
  IBM Plex Mono + IBM Plex Sans JP の合成。画面に出る文字だけサブセットしてある。
