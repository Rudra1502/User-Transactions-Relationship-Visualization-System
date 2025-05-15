const express = require("express");
const router = express.Router();

const { getShortestPath } = require('../controllers/analyticsController');
const userCtrl = require("../controllers/userController");
const txnCtrl = require("../controllers/transactionController");
const relCtrl = require("../controllers/relationshipController");


router.post("/users", userCtrl.upsertUser);
router.get("/users", userCtrl.listUsers);

router.post("/transactions", txnCtrl.upsertTransaction);
router.get("/transactions", txnCtrl.listTransactions);

router.get("/relationships/user/:id", relCtrl.userConnections);
router.get("/relationships/transaction/:id", relCtrl.transactionConnections);

router.get('/analytics/shortest-path', getShortestPath);

module.exports = router;
