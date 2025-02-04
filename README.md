# 🎬 Golden Raspberry Awards API

This RESTful API allows for managing movies nominated for the Golden Raspberry Awards, including full CRUD operations and analysis of award winners intervals for producers.

## 🚀 **How to Run the Project**

1. **Clone the repository:**

```bash
git clone git@github.com:thiagocavaloti/golden-raspberry-awards-api.git
cd golden-raspberry-awards-api
```

2. **Install dependencies:**

```bash
npm install
```

3. **Create the `.env` file:**

```env
PORT=3000
NODE_ENV=production
```

4. **Run the server:**

```bash
npm run dev  # For development environment
# or
npm start    # For production environment
```

The API will be available at `http://localhost:3000/api/movies`

---

## 📦 **API Routes**

### 🎥 **Movies**

- **List all movies (optional pagination):**

  ```http
  GET /api/movies?limit=10&offset=0
  ```
  **Query Parameters:**
  - `limit` (optional): Number of movies per page (default: 10)
  - `offset` (optional): Offset for pagination (default: 0)

---

- **Get a specific movie:**

  ```http
  GET /api/movies/:id
  ```

---

- **Create a new movie:**

  ```http
  POST /api/movies
  ```
  **Request Body (JSON):**
  ```json
  {
    "title": "The Room",
    "year": 2003,
    "studios": "Wiseau-Films",
    "producers": "Tommy Wiseau",
    "winner": true
  }
  ```

---

- **Fully update a movie:**

  ```http
  PUT /api/movies/:id
  ```
  **Request Body (JSON):**
  ```json
  {
    "title": "The Room - Updated",
    "year": 2003,
    "studios": "Wiseau-Films",
    "producers": "Tommy Wiseau",
    "winner": false
  }
  ```

---

- **Partially update a movie:**

  ```http
  PATCH /api/movies/:id
  ```
  **Request Body (JSON):**
  ```json
  {
    "winner": true
  }
  ```

---

- **Delete a movie:**

  ```http
  DELETE /api/movies/:id
  ```

---

### 🏆 **Producers**

- **Get producers award intervals:**

  ```http
  GET /api/movies/producers/intervals
  ```

  **Example Response:**
  ```json
  {
    "min": [
      {
        "producer": "Producer 1",
        "interval": 1,
        "previousWin": 2008,
        "followingWin": 2009
      }
    ],
    "max": [
      {
        "producer": "Producer 2",
        "interval": 10,
        "previousWin": 1999,
        "followingWin": 2009
      }
    ]
  }
  ```

---

## ✅ **Integration Tests**

To run the tests:

```bash
npm run test
```

---

## 👨‍💻 **Technologies Used**

- Node.js
- Express.js
- TypeScript
- SQLite
- Jest (for testing)
- dotenv
- chatGPT


