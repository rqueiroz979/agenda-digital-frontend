import React from "react";

function AccessList({ label, items, onAdd, onChange, onRemove }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{label}</h3>
        <button
          onClick={onAdd}
          className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm disabled:opacity-50"
          disabled={items.length >= 6}
        >
          + Adicionar ({items.length}/6)
        </button>
      </div>

      <div className="space-y-2">
        {items.map((it, idx) => (
          <div key={idx} className="flex gap-2">
            <input
              placeholder={`${label} ID`}
              value={it.id}
              onChange={(e) => onChange(idx, { ...it, id: e.target.value })}
              className="flex-1 px-3 py-2 rounded-md border"
            />
            <input
              placeholder="Senha"
              value={it.password}
              onChange={(e) => onChange(idx, { ...it, password: e.target.value })}
              className="w-36 px-3 py-2 rounded-md border"
            />
            <button
              onClick={() => onRemove(idx)}
              className="bg-red-500 text-white px-3 rounded-md"
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RemoteAccess({ tv, ad, setTv, setAd }) {
  const add = (setter, arr) => setter([...arr, { id: "", password: "" }]);
  const remove = (setter, arr, idx) => setter(arr.filter((_, i) => i !== idx));
  const change = (setter, arr, idx, value) => {
    const copy = [...arr];
    copy[idx] = value;
    setter(copy);
  };

  return (
    <div className="space-y-4">
      <AccessList
        label="TeamViewer"
        items={tv}
        onAdd={() => add(setTv, tv)}
        onChange={(i, val) => change(setTv, tv, i, val)}
        onRemove={(i) => remove(setTv, tv, i)}
      />

      <AccessList
        label="AnyDesk"
        items={ad}
        onAdd={() => add(setAd, ad)}
        onChange={(i, val) => change(setAd, ad, i, val)}
        onRemove={(i) => remove(setAd, ad, i)}
      />
    </div>
  );
}
