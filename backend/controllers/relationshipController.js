const { getSession: getS } = require("../services/neo4jService");

function formatGraph(records) {
  const nodes = new Map();
  const edges = [];

  records.forEach(rec => {
    const root = rec.get(0);
    const rel  = rec.get(1);
    const nbr  = rec.get(2);

    [root, nbr].forEach(n => {
      const key = n.identity.toString();
      if (!nodes.has(key)) {
        nodes.set(key, {
          elementId: key,
          name: n.name,
          type: n.labels[0],
          ...n.properties
        });
      }
    });

    edges.push({
      elementId: rel.identity.toString(),
      type: rel.type,
      source: rel.startNodeElementId,
      target: rel.endNodeElementId,
      ...rel.properties
    });
  });

  return { nodes: Array.from(nodes.values()), edges };
}

async function ensureRootNode(session, graph, label, idProp, idValue) {
  const rootRes = await session.executeRead(tx =>
    tx.run(
      `MATCH (n:${label} {${idProp}: $val})
       RETURN n`,
      { val: idValue }
    )
  );

  if (rootRes.records.length) {
    const u = rootRes.records[0].get("n");
    const key = u.identity.toString();
    if (!graph.nodes.some(n => n.elementId === key)) {
      graph.nodes.unshift({
        elementId: key,
        type: u.labels[0],
        ...u.properties
      });
    }
  }
}

exports.userConnections = async (req, res) => {
  const { id } = req.params;
  const session = getS();

  try {
    const result = await session.executeRead(tx =>
      tx.run(
        `MATCH (u:User {id:$id})-[r]-(n)
         RETURN u, r, n`,
        { id }
      )
    );

    const graph = formatGraph(result.records);

    await ensureRootNode(session, graph, "User", "id", id);

    res.json(graph);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load user connections" });
  } finally {
    await session.close();
  }
};

exports.transactionConnections = async (req, res) => {
  const { id } = req.params;
  const session = getS();

  try {
    const result = await session.executeRead(tx =>
      tx.run(
        `MATCH (t:Transaction {id:$id})-[r]-(n)
         RETURN t, r, n`,
        { id }
      )
    );

    const graph = formatGraph(result.records);

    await ensureRootNode(session, graph, "Transaction", "id", id);

    res.json(graph);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load transaction connections" });
  } finally {
    await session.close();
  }
};
