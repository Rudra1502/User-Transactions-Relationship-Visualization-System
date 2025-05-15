
# User & Transaction Dashboard

A web app for managing users and transactions via Neo4j graph relationships. Register users, log transactions, explore connections, calculate shortest paths, and export the entire graph.
## Architecture

-   **Backend**: Node.js with Express and the Neo4j JavaScript driver, exposing REST endpoints under `/api/*`.
    
-   **Frontend**: React with React Router, Cytoscape.js for graph rendering, styled using CSS.
    
-   **Database**: Neo4j graph database.
    
## Features

-   **User Registration**  
    Add users (name, email, phone) and automatically create links for shared emails or phone numbers.
    
-   **Transaction Logging**  
    Record transactions between users—including amount, currency, timestamp, description, and device ID—and auto-link transactions from the same device.
    
-   **List Views**  
    View all users and transactions in searchable, filterable tables.
    
-   **Graph Visualization**  
    Interactive network display of users and their relationships (shared attributes, sent/received transactions).
    
-   **Shortest-Path Analysis**  
    Compute and display the minimal connection route between any two users, with relationship types labeled on edges.
    
-   **Export Options**  
    Download the full graph (nodes and relationships) in JSON or CSV formats.

## Quick Start

### Prerequisites

-   Docker & Docker Compose
    
-   Node.js 16+ 
    
-   Neo4j 4.x+ 
    

### Environment Variables

Create a `.env` file in the `backend/` folder:

#### Docker Setup

```dotenv
NEO4J_URI=bolt://localhost:7687
NNEO4J_USER=neo4j
NEO4J_PASS=changeme
PORT=8080
SEED_DATA=true
```


## Running with Standalone Docker

Create a Docker network:

```bash
docker network create user-transaction-net
```

1.  **Neo4j**
    
    ```bash
    docker run -d \
      --name neo4j \
      --network user-transaction-net \
      -p7474:7474 -p7687:7687 \
      -e NEO4J_AUTH=neo4j/password123 \
      -v neo4j-data:/data \
      neo4j:5.7.0
    ```
    
2.  **Node.js Backend**
    
    ```bash
    docker build -t backend:latest ./backend
    docker run -d \
      --name backend \
      --network user-transaction-net \
      --env-file backend/.env \
      -p 8080:8080 \
      backend:latest
    ```
    
3.  **React Frontend**
    
    ```bash
    docker build -t frontend:latest ./frontend
    docker run -d \
      --name frontend \
      --network user-transaction-net \
      -p 3000:80 \
      frontend:latest
    ```
    
4.  **Verify**
     
    -   API: [http://localhost:8080/api/users](http://localhost:8080/api/users)
        
    -   UI: [http://localhost:](http://localhost:)
        

----------

## Running with Docker Compose

Compose will handle networking and startup order:

```bash
docker compose down -v
docker compose up --build -d
```

1.  Check services:
    
    ```bash
    docker compose ps
    ```
    
    You should see `neo4j`, `backend`, and `frontend` all **Up**.
    
2.  View logs (optional):
    
    ```bash
    docker compose logs -f neo4j
    docker compose logs -f backend
    docker compose logs -f frontend
    ```
    
3.  Verify in your browser:
        
    -   API: [http://localhost:8080/api/users](http://localhost:8080/api/users)
        
    -   UI: [http://localhost:](http://localhost:)
        

### Stopping & Cleaning

```bash
docker compose down -v
docker network rm user-tx-net

```

----------

## API Endpoints

|     Method    |                    Endpoint                    |              Description              |   
|---------------|------------------------------------------------|---------------------------------------|
| POST          | /api/users                                     | Create a new user                     |   
| GET           | /api/users                                     | List all users                        |   
| POST          | /api/transactions                              | Create a new transaction              |   
| GET           | /api/transactions                              | List all transactions                 |   
| GET           | /api/relationships/user/{id}                   | Fetch user’s relationships|   
| GET           | /api/relationships/transaction/{id}            | Fetch transaction’s relationships        |   
| GET           | /api/analytics/shortest-path?source={from}&target={to} | Compute shortest path between users       |   
| GET           | /api/export/json                               | Export entire graph as JSON           |   
| GET           | /api/export/csv                                | Export entire graph as CSV            |   
