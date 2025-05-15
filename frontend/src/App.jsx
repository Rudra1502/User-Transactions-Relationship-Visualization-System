import React, { useState, useEffect } from 'react'
import UserList from './components/UserList'
import TransactionList from './components/TransactionList'
import AddUserForm from './components/AddUserForm'
import AddTransactionForm from './components/AddTransactionForm'
import ExportButtons from './components/ExportButtons'
import GraphView from './components/GraphView'
import ShortestPathForm from './components/ShortestPathForm'

import {
  fetchUsers, fetchTransactions,
  fetchUserGraph, fetchTxGraph
} from './api'

export default function App() {
  const [users, setUsers] = useState([])
  const [txns, setTxns] = useState([])
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] })

  const loadUsers = () => fetchUsers().then(setUsers)
  const loadTxns  = () => fetchTransactions().then(setTxns)

  useEffect(() => {
    loadUsers()
    loadTxns()
  }, [])

  const onSelectUser = id => fetchUserGraph(id).then(setGraphData)
  const onSelectTxn  = id => fetchTxGraph(id).then(setGraphData)

  return (
    <div className="container">
      <aside className="sidebar-left">
        <h2>Users</h2>
        <UserList items={users} onSelect={onSelectUser} />

        <h2>Transactions</h2>
        <TransactionList items={txns} onSelect={onSelectTxn} />
      </aside>

      <main className="main">
        <GraphView data={graphData} />

         <div className="export-overlay">
          <ExportButtons data={graphData} />
        </div>
      </main>

      <aside className="sidebar-right">
        <h3>Shortest Path</h3>
        <ShortestPathForm users={users} onFind={setGraphData} />
        
        <h3>Add User</h3>
        <AddUserForm onCreated={loadUsers} />

        <h3>Add Transaction</h3>
        <AddTransactionForm users={users} onCreated={loadTxns} />
      </aside>
    </div>
  )
}
