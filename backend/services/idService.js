const { getSession } = require('./neo4jService');

exports.nextId = async label => {
  const session = getSession();
  try {
    const res = await session.executeWrite(tx =>
      tx.run(
        `
        MERGE (c:Counter {entity:$label})
        ON CREATE SET c.value = 1
        ON MATCH  SET c.value = c.value + 1
        RETURN c.value AS id
        `,
        { label }
      )
    );
    return res.records[0].get('id').toNumber();   
  } finally {
    await session.close();
  }
};