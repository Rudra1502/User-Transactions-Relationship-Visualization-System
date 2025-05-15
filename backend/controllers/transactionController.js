const { getSession: getNeo4jSession } = require("../services/neo4jService");
const { nextId }   = require('../services/idService');

exports.upsertTransaction = async (req, res) => {
  const idEl = "T" + await nextId('Transaction');
    const id = req.body.id || idEl;
  const {
    amount,
    currency,
    timestamp,
    description,
    deviceId,
    paymentMethod,
    payerId,
    payeeId
  } = req.body;
  if (!id || !payerId || !payeeId) {
    return res.status(400).json({ error: "id, payerId, payeeId are required" });
  }

  const session = getNeo4jSession();
  try {
    await session.executeWrite(tx =>
      tx.run(
        `MERGE (t:Transaction {id:$id})
         ON CREATE SET t.amount=$amount, t.currency=$currency, t.timestamp=$timestamp,
                       t.description=$description, t.deviceId=$deviceId, t.paymentMethod=$paymentMethod
         ON MATCH  SET t.amount=$amount, t.currency=$currency, t.timestamp=$timestamp,
                       t.description=$description, t.deviceId=$deviceId, t.paymentMethod=$paymentMethod`,
        { id, amount, currency, timestamp, description, deviceId, paymentMethod }
      )
    );

    await session.executeWrite(tx =>
      tx.run(
        `MATCH (payer:User {id:$payerId}), (payee:User {id:$payeeId}), (t:Transaction {id:$id})
         MERGE (payer)-[:SENT]->(t)
         MERGE (t)-[:TO]->(payee)`,
        { payerId, payeeId, id }
      )
    );

    if (deviceId) {
      await session.executeWrite(tx =>
        tx.run(
          `MATCH (t:Transaction {id:$id}), (o:Transaction)
           WHERE o.id <> $id AND o.deviceId = $deviceId
           MERGE (t)-[:SAME_DEVICE]-(o)`,
          { id, deviceId }
        )
      );
    }
    if (paymentMethod) {
      await session.executeWrite(tx =>
        tx.run(
          `MATCH (t:Transaction {id:$id}), (o:Transaction)
           WHERE o.id <> $id AND o.paymentMethod = $paymentMethod
           MERGE (t)-[:SAME_PAYMENT_METHOD]-(o)`,
          { id, paymentMethod }
        )
      );
    }

    res.status(201).json({ status: "transaction saved" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Neo4j error" });
  } finally {
    await session.close();
  }
};

exports.listTransactions = async (_req, res) => {
  const session = getNeo4jSession();
  try {
    const result = await session.readTransaction(tx =>
      tx.run(`MATCH (t:Transaction) RETURN t`)
    );
    const txns = result.records.map(r => r.get("t").properties);
    res.json(txns);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Neo4j error" });
  } finally {
    await session.close();
  }
};
