import React, { useState } from 'react'
import { createUser } from '../api'

export default function AddUserForm({ onCreated }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  })

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    await createUser({
      name: form.name,
      email: form.email,
      phone: form.phone,
      address: form.address,
    })
    setForm({ name: '', email: '', phone: '', address: '', paymentMethod: '' })
    onCreated()
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h3>Add User</h3>
      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        required
      />
      <input
        name="email"
        placeholder="Email"
        type="email"
        value={form.email}
        onChange={handleChange}
      />
      <input
        name="phone"
        placeholder="Phone"
        value={form.phone}
        onChange={handleChange}
      />
      <input
        name="address"
        placeholder="Address"
        value={form.address}
        onChange={handleChange}
      />
      <button type="submit">Add User</button>
    </form>
  )
}
