const { getSession } = require("../services/neo4jService");
const userCtrl = require("../controllers/userController");
const txnCtrl = require("../controllers/transactionController");

const users = [
  { id: "U1", name: "Alice",   email: "alice@example.com",   phone: "12345", address: "123 Elm St" },
  { id: "U2", name: "Bob",     email: "bob@example.com",     phone: "67890", address: "999 Maple Ave" },
  { id: "U3", name: "Charlie", email: "charlie@example.com", phone: "55555", address: "123 Elm St" },
  { id: "U4", name: "Dave",    email: "dave@example.com",    phone: "12345", address: "500 Oak St" },
  { id: "U5", name: "Erin",    email: "erin@another.com",    phone: "99999", address: "500 Oak St" }
];

const transactions = [
  { id: "TX1", amount: 100, currency: "USD", timestamp: Date.now(), description: "U1→U2", deviceId: "deviceA", paymentMethod: "card123", payerId: "U1", payeeId: "U2" },
  { id: "TX2", amount: 200, currency: "USD", timestamp: Date.now(), description: "U3→U4", deviceId: "deviceA", paymentMethod: "card999", payerId: "U3", payeeId: "U4" },
  { id: "TX3", amount: 50,  currency: "USD", timestamp: Date.now(), description: "U5→U3", deviceId: "deviceB", paymentMethod: "card999", payerId: "U5", payeeId: "U3" },
  { id: "TX4", amount: 75,  currency: "USD", timestamp: Date.now(), description: "U1→U5", deviceId: "deviceC", paymentMethod: "card555", payerId: "U1", payeeId: "U5" }
];

exports.seed = async () => {
  const session = getSession();
  try {
    await session.executeWrite(tx => tx.run("MATCH (n) DETACH DELETE n"));

    for (const u of users) {
      await userCtrl.upsertUser({ body: u }, { status: () => ({ json: () => {} }) });
    }
    for (const t of transactions) {
      await txnCtrl.upsertTransaction({ body: t }, { status: () => ({ json: () => {} }) });
    }
  } catch (e) {
    console.error("Seed error", e);
  } finally {
    await session.close();
  }
};
