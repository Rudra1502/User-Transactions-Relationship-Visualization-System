import React, { useState } from 'react';
import { createTransaction } from '../api';

export default function AddTransactionForm({ users = [], onCreated }) {
  const [form, setForm] = useState({
    id: '',
    payerId: '',
    payeeId: '',
    amount: '',
    currency: '',
    date: '',
    description: '',
    deviceId: '',
    paymentMethod: ''
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const {
      payerId,
      payeeId,
      amount,
      currency,
      date,
      description,
      deviceId,
      paymentMethod
    } = form;

    if (!payerId || !payeeId || !amount || !currency || !date) return;

    const timestamp = new Date(date).getTime();

    await createTransaction({
      payerId,
      payeeId,
      amount: parseFloat(amount),
      currency,
      timestamp,
      description,
      deviceId,
      paymentMethod
    });

    setForm({
      id: '',
      payerId: '',
      payeeId: '',
      amount: '',
      currency: '',
      date: '',
      description: '',
      deviceId: '',
      paymentMethod: ''
    });
    onCreated();
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h3>Add Transaction</h3>

      <select
        name="payerId"
        value={form.payerId}
        onChange={handleChange}
        required
      >
        <option value="">Select payer</option>
        {users.map(u => (
          <option key={u.id} value={u.id}>
            {u.name} ({u.id})
          </option>
        ))}
      </select>

      <select
        name="payeeId"
        value={form.payeeId}
        onChange={handleChange}
        required
      >
        <option value="">Select payee</option>
        {users.map(u => (
          <option key={u.id} value={u.id}>
            {u.name} ({u.id})
          </option>
        ))}
      </select>

      <input
        name="amount"
        type="number"
        placeholder="Amount"
        value={form.amount}
        onChange={handleChange}
        required
      />

      <input
        name="currency"
        placeholder="Currency (e.g. USD)"
        value={form.currency}
        onChange={handleChange}
        required
      />

      <input
        name="date"
        type="date"
        value={form.date}
        onChange={handleChange}
        required
      />

      <input
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
      />

      <input
        name="deviceId"
        placeholder="Device ID"
        value={form.deviceId}
        onChange={handleChange}
      />

      <input
        name="paymentMethod"
        placeholder="Payment Method"
        value={form.paymentMethod}
        onChange={handleChange}
      />

      <button type="submit">Add Transaction</button>
    </form>
  );
}
