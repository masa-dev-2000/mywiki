'use client';

interface Props {
  tags: string[];
  selected: string | null;
  onSelect: (tag: string | null) => void;
}

export default function TagFilter({ tags, selected, onSelect }: Props) {
  return (
    <div className="tag-filter">
      <button
        className={`tag tap-target ${!selected ? 'tag-active' : ''}`}
        onClick={() => onSelect(null)}
      >
        すべて
      </button>
      {tags.map((t) => (
        <button
          key={t}
          className={`tag tap-target ${selected === t ? 'tag-active' : ''}`}
          onClick={() => onSelect(selected === t ? null : t)}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
