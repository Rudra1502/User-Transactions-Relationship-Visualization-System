const { getSession } = require("../services/neo4jService");
const { nextId }   = require('../services/idService');

exports.upsertUser = async (req, res) => {
  const idEl= "U" + await nextId('User');
  const id = req.body.id || idEl;
  const {  name, email, phone, address } = req.body;
  if (!id) return res.status(400).json({ error: "id is required" });

  const session = getSession();
  try {
    const userResult = await session.executeWrite(tx =>
      tx.run(
        `MERGE (u:User {id: $id})
         ON CREATE SET u.name=$name, u.email=$email, u.phone=$phone, u.address=$address
         ON MATCH  SET u.name=$name, u.email=$email, u.phone=$phone, u.address=$address
         RETURN u`,
        { id, name, email, phone, address }
      )
    );

    if (email) {
      await session.executeWrite(tx =>
        tx.run(
          `MATCH (u:User {id:$id}), (o:User)
           WHERE o.id <> $id AND o.email = $email
           MERGE (u)-[:SHARED_EMAIL]-(o)`,
          { id, email }
       )
      );
    }
    if (phone) {
      await session.executeWrite(tx =>
        tx.run(
          `MATCH (u:User {id:$id}), (o:User)
           WHERE o.id <> $id AND o.phone = $phone
           MERGE (u)-[:SHARED_PHONE]-(o)`,
          { id, phone }
        )
      );
    }
    if (address) {
      await session.executeWrite(tx =>
        tx.run(
          `MATCH (u:User {id:$id}), (o:User)
           WHERE o.id <> $id AND o.address = $address
           MERGE (u)-[:SHARED_ADDRESS]-(o)`,
          { id, address }
        )
      );
    }
    const savedUser = userResult.records[0].get("u").properties;
    res.status(201).json(savedUser);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Neo4j error" });
  } finally {
    await session.close();
  }
};

exports.listUsers = async (_req, res) => {
  const session = getSession();
  try {
    const result = await session.readTransaction(tx =>
      tx.run(`MATCH (u:User) RETURN u`)
    );
    const users = result.records.map(r => r.get("u").properties);
    res.json(users);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Neo4j error" });
  } finally {
    await session.close();
  }
};
