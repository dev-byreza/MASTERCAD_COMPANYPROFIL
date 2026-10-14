"use client";
import { useEffect, useState } from "react";
type Media = { id: string; width: number; height: number };
export function MediaPicker({
  onSelect,
  disabled,
}: {
  onSelect: (url: string) => void;
  disabled: boolean;
}) {
  const [items, setItems] = useState<Media[]>([]),
    [selected, setSelected] = useState("");
  useEffect(() => {
    let alive = true;
    fetch("/api/v1/admin/media")
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((data) => {
        if (alive) setItems(data.items || []);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);
  return items.length ? (
    <div className="field">
      <label htmlFor="existing-media">Gunakan gambar dari Media studio</label>
      <div className="existing-media">
        <select
          id="existing-media"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          disabled={disabled}
        >
          <option value="">Pilih gambar tersimpan</option>
          {items.map((item) => (
            <option value={item.id} key={item.id}>
              {item.width} × {item.height} · {item.id.slice(0, 8)}
            </option>
          ))}
        </select>
        <button
          className="button secondary"
          disabled={!selected || disabled}
          type="button"
          onClick={() => {
            onSelect("/api/v1/media/" + selected);
            setSelected("");
          }}
        >
          Tambahkan
        </button>
      </div>
    </div>
  ) : null;
}
