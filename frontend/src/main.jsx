import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'
import 'qtip2/dist/jquery.qtip.css';
import cytoscape from 'cytoscape';
import qtip from 'cytoscape-qtip';
qtip(cytoscape);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)