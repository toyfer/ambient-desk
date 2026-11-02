/* 設定はここだけ書き換える。壁紙ホストではクリックもキーも届かない。 */
window.AD_CONFIG = {
  /* グラス（ぼかし）。false でソリッド背景 */
  glass: true,
  /* 空の色変化とブロブのゆらぎ */
  motion: true,
  /* タスクバー分の下余白（px）。Windows 11 既定はだいたい 48 */
  taskbar: 56,
  /* 観測地点。日の出・月齢などに使う */
  lat: 35.6895,
  lon: 139.6917,
  /* 配色: "ayu-mirage" | "ayu-dark" | "ayu-light" */
  theme: "ayu-mirage",
  /* 上書きしたい色だけ書く。空ならテーマのまま
     使えるキー: bg fg fg2 muted line glassA glassB accent hol sun sat func str today todayInk bar bar2 */
  colors: {},
  /* 世界時計。空配列にすると欄ごと消える */
  cities: [
    ["ソウル", "Asia/Seoul"],
    ["上海", "Asia/Shanghai"],
    ["ドバイ", "Asia/Dubai"],
    ["ロンドン", "Europe/London"],
    ["ニューヨーク", "America/New_York"],
    ["ロサンゼルス", "America/Los_Angeles"]
  ]
};
