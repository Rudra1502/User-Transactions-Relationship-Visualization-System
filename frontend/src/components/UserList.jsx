import React, { useState } from 'react';

export default function UserList({ items = [], onSelect }) {
  const [field, setField] = useState('name');
  const [value, setValue] = useState('');

  const options = [
    { label: 'Name / ID', value: 'name' },
    { label: 'Email',      value: 'email' },
    { label: 'Phone',      value: 'phone' },
    { label: 'Address',    value: 'address' },
  ];

  const list = items.filter(u => {
    if (!value) return true;
    const v = u[field] ?? u.id;
    return v.toString().toLowerCase().includes(value.toLowerCase());
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
        placeholder="Search"
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <ul>
        {list.map(u => (
          <li key={u.id} onClick={() => onSelect(u.id)}>
            {u.name || u.id}
          </li>
        ))}
      </ul>
    </div>
  );
}
