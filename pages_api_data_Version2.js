// pages/api/data.js
export default function handler(req, res) {
  // モックデータ（必要に応じて外部API/DBに差し替え）
  const data = [
    { name: 'A', value: 30 },
    { name: 'B', value: 80 },
    { name: 'C', value: 45 },
    { name: 'D', value: 60 },
    { name: 'E', value: 20 },
    { name: 'F', value: 90 },
    { name: 'G', value: 55 }
  ];
  res.status(200).json(data);
}