const neo4j = require('neo4j-driver');

const uri      = process.env.NEO4J_URI;
const user     = process.env.NEO4J_USER;
const password = process.env.NEO4J_PASS;

if (!uri || !user || !password) {
  throw new Error('Missing NEO4J_URI, NEO4J_USER, or NEO4J_PASS in env');
}

const driver = neo4j.driver(
  uri,
  neo4j.auth.basic(user, password),
  {
    encrypted: 'ENCRYPTION_OFF',           
    trust:     'TRUST_ALL_CERTIFICATES',   
  }
);

module.exports.getSession = () => driver.session();