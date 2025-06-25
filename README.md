# B2B Collaboration Platform

## 📝 Summary

A B2B Collaboration Platform that helps small businesses collaborate on bulk orders, coordinate deliveries, and cross-sell complementary products to reduce costs and improve efficiency.

---

## 🐳 Run with Docker

### 1. Prerequisites
- Docker and Docker Compose installed
- A `.env` file in the **root directory** with the following variables:

```env
BACKEND_PORT=8080
FRONTEND_PORT=5173
API_URL=http://localhost:8080

POSTGRES_USER=kai
POSTGRES_PASSWORD=password
POSTGRES_DB=gosharedb
POSTGRES_PORT=5432
POSTGRES_HOST=db
```

### 2. ▶️ Start the App

From the root directory, run:

```bash
docker-compose up --build
```

### 3. Next Steps

- Open [http://localhost:5173](http://localhost:5173) in your browser to view the frontend.
- The frontend will interact with the backend API at [http://localhost:8080](http://localhost:8080).

### 4. 🔁 Shut Down & Restart

### 🛑 To stop the app (safe shutdown):
```bash
docker-compose down
```

### 5. ▶️ To start the app again (after shutting down your laptop or stopping Docker):

```bash
docker-compose up
```
