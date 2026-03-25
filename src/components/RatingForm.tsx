'use client';

import { useState, useEffect } from 'react';
import { Rating } from '@/types/catalog';
import { saveRating, getRating } from '@/lib/storage';

interface Props {
  contentId: string;
}

const axes = [
  { key: 'clarity' as const, label: '理解しやすさ' },
  { key: 'depth' as const, label: '情報の細かさ' },
  { key: 'interest' as const, label: '面白さ' },
  { key: 'practicality' as const, label: '実用性' },
];

export default function RatingForm({ contentId }: Props) {
  const [scores, setScores] = useState({ clarity: 0, depth: 0, interest: 0, practicality: 0 });
  const [memo, setMemo] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getRating(contentId).then((r) => {
      if (r) {
        setScores({ clarity: r.clarity, depth: r.depth, interest: r.interest, practicality: r.practicality });
        setMemo(r.memo);
      }
    });
  }, [contentId]);

  const handleSubmit = async () => {
    const rating: Rating = {
      contentId,
      ...scores,
      memo,
      ratedAt: new Date().toISOString(),
    };
    await saveRating(rating);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="card rating-form">
      <h3>📝 評価</h3>
      {axes.map(({ key, label }) => (
        <div key={key} className="rating-row">
          <span className="rating-label">{label}</span>
          <div className="stars">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                className={`star tap-target ${n <= scores[key] ? 'star-filled' : ''}`}
                onClick={() => setScores((s) => ({ ...s, [key]: n }))}
                aria-label={`${label} ${n}点`}
              >
                {n <= scores[key] ? '★' : '☆'}
              </button>
            ))}
          </div>
        </div>
      ))}
      <textarea
        className="rating-memo"
        placeholder="メモ（任意）"
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        rows={3}
      />
      <button onClick={handleSubmit} className="btn-primary tap-target">
        {saved ? '✅ 保存しました' : '保存'}
      </button>
    </div>
  );
}
