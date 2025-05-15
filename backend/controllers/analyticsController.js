const { getSession } = require("../services/neo4jService");

exports.getShortestPath = async (req, res) => {
  const { source, target } = req.query;
  if (!source || !target) {
    return res.status(400).json({ error: 'Both source and target user IDs are required' });
  }

  const session = getSession();
  try {
    const result = await session.run(
      `MATCH (u1:User {id:$source}), (u2:User {id:$target})
       MATCH p=shortestPath((u1)-[*]-(u2))
       RETURN p`,
      { source, target }
    );

    if (result.records.length === 0) {
      return res.status(404).json({ error: 'No path found between those users' });
    }

    const path = result.records[0].get('p');
    const nodes = [];
    const seen = new Set();

    const start = path.start;
    nodes.push({
      elementId: start.elementId,
      type: start.labels[0],
      ...start.properties
    });
    seen.add(start.elementId);

    for (const seg of path.segments) {
      const node = seg.end;
      if (!seen.has(node.elementId)) {
        nodes.push({
          elementId: node.elementId,
          type: node.labels[0],
          ...node.properties
        });
        seen.add(node.elementId);
      }
    }

    const edges = path.segments.map(seg => {
      const r = seg.relationship;
      return {
        elementId: r.elementId,
        type: r.type,
        source: r.startNodeElementId,
        target: r.endNodeElementId
      };
    });

    res.json({ nodes, edges });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to compute shortest path" });
  } finally {
    await session.close();
  }
};
