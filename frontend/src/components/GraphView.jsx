import React, { useEffect, useRef, useState } from 'react'
import cytoscape from 'cytoscape'

export default function GraphView({ data }) {
  const containerRef = useRef(null)
  const cyRef = useRef(null)
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: '' })

  useEffect(() => {
    if (!cyRef.current) {
      cyRef.current = cytoscape({
        container: containerRef.current,
        elements: [],
        style: [
          {
            selector: 'node[type="User"]',
            style: {
              shape: 'ellipse',
              'background-color': '#3498db',
             content: 'data(name)',
              'text-valign': 'center',
              'text-halign': 'center',
              'text-wrap': 'wrap',
              'text-max-width': 80,
              'font-size': 12,
              color: '#fff',
              'text-outline-color': '#2c3e50',
              'text-outline-width': 2
            }
          },
          {
            selector: 'node[type="Transaction"]',
            style: {
              shape: 'round-rectangle',
              'background-color': '#e74c3c',
              content: 'data(name)',
              'text-valign': 'center',
              'text-halign': 'center',
              'text-wrap': 'wrap',
              'text-max-width': 80,
              'font-size': 12,
              color: '#fff',
              'text-outline-color': '#c0392b',
              'text-outline-width': 2
            }
          },
          {
            selector: 'edge[type="SENT"]',
            style: {
              'line-color': '#2ecc71',
              'curve-style': 'bezier',
              'target-arrow-shape': 'triangle',
              'target-arrow-color': '#2ecc71',
              'arrow-scale': 1.2
            }
          },
          {
            selector: 'edge[type="TO"]',
            style: {
              'line-color': '#f1c40f',
              'curve-style': 'bezier',
              'target-arrow-shape': 'triangle',
              'target-arrow-color': '#f1c40f',
              'arrow-scale': 1.2
            }
          },
          {
            selector: 'edge[type^="SHARED"]',
            style: {
              'line-color': '#9b59b6',
              'line-style': 'dashed',
              'source-arrow-shape': 'none',
              'target-arrow-shape': 'none'
            }
          }
        ],
        layout: { name: 'cose', padding: 20, animate: true },
        wheelSensitivity: 0.2
      })

      const cy = cyRef.current

      cy.on('mouseover', 'node, edge', e => {
        const ele = e.target
        let content = ''
        if (ele.isNode()) {
           content = `label: ${ele.data('name')}\nType: ${ele.data('type')}`
        } else {
           content = `Type: ${ele.data('type')}`
        }
        const pos = e.renderedPosition || { x: 0, y: 0 }
        setTooltip({ visible: true, x: pos.x, y: pos.y, content })
      })
      cy.on('mouseout', 'node, edge', () => {
        setTooltip(t => ({ ...t, visible: false }))
      })
    }
  }, [])

    useEffect(() => {
    const cy = cyRef.current
    cy.elements().remove()

    const normalize = raw => String(raw).split(':').pop()

    data.nodes.forEach(n => {
      const id = normalize(n.elementId)
      if (cy.$id(id).empty()) {
        cy.add({
          group: 'nodes',
          data: {
            id,
            name: n.type === 'User' ? n.name : n.id,
            type: n.type
          }
        })
      }
    })

    const seenShared = new Set()

    data.edges.forEach(e => {
      let src = normalize(e.source)
      let tgt = normalize(e.target)
      let type = e.type === 'RECEIVED' ? 'TO' : e.type

      if (type.startsWith('SHARED_')) {
        const [a, b] = [src, tgt].sort()
        const key = `${type}-${a}-${b}`
        if (seenShared.has(key)) return
        seenShared.add(key)
        src = a; tgt = b
      }

      const eid = `${type}-${normalize(e.id || e.elementId)}`
      if (cy.$id(src).length && cy.$id(tgt).length && cy.$id(eid).empty()) {
        cy.add({
          group: 'edges',
          data: { id: eid, source: src, target: tgt, type }
        })
      }
    })

    cy.layout({ name: 'cose', animate: true }).run()
    cy.fit()
    cy.center()
  }, [data])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      {tooltip.visible && (
        <div
          style={{
            position: 'absolute',
            left: tooltip.x + 10,
            top: tooltip.y + 10,
            background: 'rgba(255,255,255,0.9)',
            padding: '6px',
            border: '1px solid #333',
            borderRadius: '4px',
            whiteSpace: 'pre',
            fontSize: '0.85rem',
            pointerEvents: 'none'
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  )
}