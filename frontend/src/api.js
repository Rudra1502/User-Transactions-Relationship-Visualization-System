const API_BASE = '/api'

export async function fetchUsers() {
  const res = await fetch(`${API_BASE}/users`)
  return res.json()
}

export async function fetchTransactions() {
  const res = await fetch(`${API_BASE}/transactions`)
  return res.json()
}

export async function fetchUserGraph(id) {
  const res = await fetch(`${API_BASE}/relationships/user/${id}`)
  return res.json()
}

export async function fetchTxGraph(id) {
  const res = await fetch(`${API_BASE}/relationships/transaction/${id}`)
  return res.json()
}

export async function createUser(user) {
  const res = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create user');
  }
  return res.json()
}

export async function createTransaction(tx) {
  const res = await fetch(`${API_BASE}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tx)
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create transaction');
  }
  return res.json();
}


export async function fetchShortestPath(source, target) {
  const params = new URLSearchParams({ source, target }).toString();
  const res = await fetch(`/api/analytics/shortest-path?${params}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to fetch shortest path');
  }
  return res.json();
}
