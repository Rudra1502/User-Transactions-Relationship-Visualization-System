import React, { useState } from 'react';

export default function TransactionList({ items = [], onSelect }) {
  const [field, setField] = useState('id');
  const [value, setValue] = useState('');

  const options = [
    { label: 'Transaction ID', value: 'id' },
    { label: 'Amount',         value: 'amount' },
    { label: 'Transaction Date',     value: 'date' },
    { label: 'Device ID',      value: 'deviceId' }
  ];

  const list = items.filter(t => {
    if (!value) return true;
    const v = t[field];
    return v != null && v.toString().toLowerCase().includes(value.toLowerCase());
  });

  return (
    <div className="list">
      <select
        value={field}
        onChange={e => setField(e.target.value)}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <input
        placeholder="Filter value..."
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <ul>
        {list.map(t => (
          <li key={t.id} onClick={() => onSelect(t.id)}>
            {t.id} {t.amount != null ? `($${t.amount})` : ''}
          </li>
        ))}
      </ul>
    </div>
  );
}
