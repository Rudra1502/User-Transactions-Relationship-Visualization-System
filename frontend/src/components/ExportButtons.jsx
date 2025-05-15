import React from 'react'

export default function ExportButtons({ data }) {
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'graph-data.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  const exportCSV = () => {
    const rows = [];
    rows.push(['elementId','elementType','label','type','source','target']);
    data.nodes.forEach(n => {
      rows.push([n.elementId,'node',n.name || n.id,n.type,'','']);
    });
    data.edges.forEach(e => {
      rows.push([e.elementId,'edge','',e.type,e.source,e.target]);
    });
    const csvContent = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'graph-data.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="export-buttons">
      <button onClick={exportJSON}>Export JSON</button>
      <button onClick={exportCSV}>Export CSV</button>
    </div>
  )
}