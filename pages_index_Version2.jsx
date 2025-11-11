// pages/index.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';

const demoData = [
  { name: 'A', value: 30 },
  { name: 'B', value: 80 },
  { name: 'C', value: 45 },
  { name: 'D', value: 60 },
  { name: 'E', value: 20 },
  { name: 'F', value: 90 },
  { name: 'G', value: 55 }
];

export default function HomePage() {
  const [condition, setCondition] = useState('simple'); // 'static' | 'simple' | 'fancy'
  const [data, setData] = useState(demoData);
  const [participantId] = useState(() => uuidv4());
  const [reduced, setReduced] = useState(false);
  const [width, setWidth] = useState(800);

  useEffect(() => {
    // window幅に合わせる
    function onResize() {
      setWidth(Math.min(window.innerWidth - 40, 900));
    }
    onResize();
    window.addEventListener('resize', onResize);
    // prefers-reduced-motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateReduced = () => setReduced(mq.matches);
    updateReduced();
    if (mq.addEventListener) mq.addEventListener('change', updateReduced);
    else mq.addListener(updateReduced);
    return () => {
      window.removeEventListener('resize', onResize);
      if (mq.removeEventListener) mq.removeEventListener('change', updateReduced);
      else mq.removeListener(updateReduced);
    };
  }, []);

  useEffect(() => {
    // 将来的に /api/data から取得する場合の例
    async function load() {
      try {
        const res = await fetch('/api/data');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        // ローカルでは demoData を使う
        console.warn('fetch data failed, using demoData', e);
      }
    }
    load();
  }, []);

  const submitLog = async (payload) => {
    try {
      await fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.error('log error', e);
    }
  };

  const maxVal = Math.max(...data.map((d) => d.value), 100);
  const height = 320;
  const margin = { left: 40, top: 20, bottom: 40, right: 20 };
  const innerW = Math.max(200, width - margin.left - margin.right);
  const innerH = height - margin.top - margin.bottom;
  const band = data.length > 0 ? innerW / data.length : 0;

  // シンプルなタスク: 最大のバーを当てる（クリック）
  const handleBarClick = (d, i, t0) => {
    const rt = Math.round(performance.now() - t0);
    const correct = d.value === Math.max(...data.map((x) => x.value));
    const log = {
      sessionId: 'pilot',
      participantId,
      condition,
      trialIndex: i,
      stimulus: d,
      response: d.name,
      correct,
      rt,
      viewport: { w: window.innerWidth, h: window.innerHeight },
      reducedMotion: reduced,
      timestamp: new Date().toISOString()
    };
    submitLog(log);
    // 簡易フィードバック
    alert(correct ? '正解' : '不正解');
  };

  return (
    <main style={{ padding: 20, fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial' }}>
      <h1>Next.js 可視化アニメーション実験デモ</h1>

      <div style={{ marginBottom: 12 }}>
        <label style={{ marginRight: 8 }}>条件：</label>
        <select value={condition} onChange={(e) => setCondition(e.target.value)}>
          <option value="static">静的</option>
          <option value="simple">単純遷移</option>
          <option value="fancy">強い演出</option>
        </select>
        <span style={{ marginLeft: 12, color: '#6b7280' }}>
          prefers-reduced-motion: {reduced ? 'on' : 'off'}
        </span>
      </div>

      <svg width={width} height={height} role="img" aria-label="棒グラフ">
        <g transform={`translate(${margin.left},${margin.top})`}>
          {/* X軸ラベル */}
          <g transform={`translate(0, ${innerH})`}>
            {data.map((d, i) => (
              <text key={d.name} x={i * band + band / 2} y={20} textAnchor="middle" style={{ fontSize: 12 }}>
                {d.name}
              </text>
            ))}
          </g>

          {data.map((d, i) => {
            const x = i * band + band * 0.1;
            const w = Math.max(10, band * 0.8);
            const h = (d.value / maxVal) * innerH;
            const y = innerH - h;

            const baseTransition = reduced
              ? { duration: 0 }
              : condition === 'static'
              ? { duration: 0 }
              : condition === 'simple'
              ? { duration: 0.35, ease: 'easeOut' }
              : { duration: 0.8, type: 'spring', stiffness: 180, damping: 18 };

            const fill = condition === 'fancy' ? '#ef4444' : '#4f46e5';
            const t0 = performance.now();

            return (
              <motion.g key={d.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <motion.rect
                  x={x}
                  y={y}
                  width={w}
                  height={h}
                  fill={fill}
                  rx={4}
                  whileHover={reduced ? {} : { scale: 1.03 }}
                  transition={baseTransition}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleBarClick(d, i, t0)}
                />
                <motion.text
                  x={x + w / 2}
                  y={y - 6}
                  textAnchor="middle"
                  style={{ fontSize: 12, fill: '#111827', pointerEvents: 'none' }}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.02 }}
                >
                  {d.value}
                </motion.text>
              </motion.g>
            );
          })}
        </g>
      </svg>

      <p style={{ marginTop: 12, color: '#6b7280' }}>
        棒をクリックして「最大の値」を選んでください。ログはサーバーへ送信されます（ローカルでは data/logs.json に保存されます）。
      </p>
    </main>
  );
}