# Kafka Architecture & Event Flow Guide

This document contains a visual diagram and explanation of the event-driven architecture using Kafka across your microservices.

> **Tip for Viewing**: If you are using VS Code, press `Ctrl + Shift + V` (or right-click the file tab and select **Open Preview**) to view the rendered flowchart.

---

## 1. Visual Architecture Flow

```mermaid
graph TD
    %% Define styles for components
    classDef client fill:#3498db,stroke:#2980b9,stroke-width:2px,color:#fff;
    classDef payment fill:#9b59b6,stroke:#8e44ad,stroke-width:2px,color:#fff;
    classDef order fill:#2ecc71,stroke:#27ae60,stroke-width:2px,color:#fff;
    classDef product fill:#e67e22,stroke:#d35400,stroke-width:2px,color:#fff;
    classDef kafka fill:#f1c40f,stroke:#f39c12,stroke-width:2px,color:#000;
    classDef db fill:#95a5a6,stroke:#7f8c8d,stroke-width:2px,color:#fff;

    %% Components
    User["Client / Frontend App"]:::client
    PAY["Payment Service - Hono (Port 8002)"]:::payment
    OS["Order Service - Fastify (Port 8001)"]:::order
    PS["Product Service - Express (Port 8000)"]:::product
    
    CF["Cashfree Gateway API"]:::db
    KB["Kafka Message Broker (Ports 9094-9096)"]:::kafka
    
    MongoDB[("MongoDB - Order DB")]:::db
    Postgres[("PostgreSQL - Product DB")]:::db

    %% Relationships
    %% Phase 1: Checkout Session
    User -->|1. POST /create-session| PAY
    PAY -->|2. Query Catalog Prices| Postgres
    PAY -->|3. POST /orders (Sync HTTP)| OS
    OS -->|4. Save Pending Order| MongoDB
    PAY -->|5. PGCreateOrder| CF
    PAY -.->|6. Return Session ID| User
    
    %% Phase 2: Payment Execution
    User -->|7. Pay on Gateway UI| CF
    CF -->|8. Callback webhook / verify| PAY
    PAY -->|9. PGFetchOrder verification| CF
    
    %% Phase 3: Kafka Event Broadcasting (Asynchronous)
    PAY -->|10. Publish payment.processed Event| KB
    
    KB -->|11a. Consume Message| OS
    OS -->|12a. Update order status to success/failed| MongoDB
    
    KB -->|11b. Consume Message| PS
    PS -->|12b. Future: deduct/restore stock| Postgres
```

---

## 2. Step-by-Step Flow Explanation

### Phase 1: Checkout Session Creation (Synchronous REST API)
1. **User clicks Checkout**: Client sends a request to **Payment Service** (`POST /payments/create-session`) with the item IDs and quantities.
2. **Catalog Lookup**: The **Payment Service** fetches current item prices directly from **PostgreSQL** to prevent client-side price tampering.
3. **Register Pending Order**: The **Payment Service** sends an internal HTTP `POST` to the **Order Service** to record the transaction.
4. **Order DB Save**: The **Order Service** saves the new order in **MongoDB** with a `pending` status.
5. **Session Generation**: The **Payment Service** registers the order with **Cashfree** and receives a payment session ID.
6. **Redirect**: The Payment Service returns the session ID and order ID back to the client, which redirects the user to the gateway.

### Phase 2: Gateway Payment & Verification
7. **User Pays**: The user completes the transaction on Cashfree's page.
8. **Gateway Notification**: Cashfree redirects the user or hits your **Payment Service** webhook (`/verify/:orderId`).
9. **Gateway Verification**: The **Payment Service** calls the Cashfree verification API. Cashfree responds with `"PAID"`.

### Phase 3: Event Broadcasting (Asynchronous Kafka)
10. **Publish to Kafka**: The **Payment Service** fires-and-forgets a message containing `{ orderId, status: "success" }` to the Kafka broker under the `payment.processed` topic. It immediately returns `HTTP 200` to Cashfree and redirects the user to the success screen.
11. **Asynchronous Consumption**: The **Kafka Broker** delivers the message to the registered consumers:
    * **Order Service**: Consumes the event and updates the order status to `"success"` in MongoDB.
    * **Product Service**: Consumes the event to log it (and in the future, automatically decrement stock levels in PostgreSQL).
