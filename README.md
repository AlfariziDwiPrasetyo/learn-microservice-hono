# Simple Microservices Authentication System with Hono & Bun

## 📌 Overview
This project implements a simple authentication system using **Hono** and **Bun** in a microservices architecture. It consists of two services:

- **service-auth**: Handles user authentication (register, login, validate token).
- **service-user**: Manages user profile information.

## 📂 Project Structure
```
├── service-auth/   # Authentication service
│   ├── src/
│   ├── Dockerfile
│   ├── .env
│   ├── package.json
│   └── ...
├── service-user/   # User profile service
│   ├── src/
│   ├── Dockerfile
│   ├── .env
│   ├── package.json
│   └── ...
├── docker-compose.yml
└── README.md
```

## 🚀 Getting Started

### 1️⃣ Prerequisites
Ensure you have the following installed:
- **Docker** & **Docker Compose**
- **Bun** (if running locally)

### 2️⃣ Environment Variables
Create a `.env` file in each service directory and define the required variables:

#### service-auth/.env
```
PORT=4000
SECRET_KEY=your_jwt_secret
```

#### service-user/.env
```
PORT=5000
```

### 3️⃣ Running with Docker Compose
To start all services:
```sh
docker-compose up --build
```

### 5️⃣ API Endpoints
#### 🔐 Authentication Service (service-auth)
| Method | Endpoint          | Description            |
|--------|------------------|------------------------|
| POST   | /auth/register   | Register new user     |
| POST   | /auth/login      | Authenticate user     |
| GET    | /auth/validate   | Validate JWT token    |

#### 👤 User Service (service-user)
| Method | Endpoint      | Description            |
|--------|--------------|------------------------|
| GET    | /user/me     | Get authenticated user |
| POST  | /user/create | create user   |

### 6️⃣ Testing API
Use **Postman** or similar tools to test the API.

#### Register
**Request Body:**
```json
{
    "name": "John Doe",
    "email": "user@example.com",
    "password": "password123"
}
```
**Response:**
```json
{
    "message": "User registered successfully"
}
```

#### Login
**Request Body:**
```json
{
    "email": "user@example.com",
    "password": "password123"
}
```
**Response:**
```json
{
    "token": "eyJhbGciO....."
}
```

#### Validate Token
**Headers:**
```
Authorization: Bearer eyJhbGciO.....
```
**Response:**
```json
{
    "user": {
        "id": "uuid",
        "email": "user@example.com"
    }
}
```

#### Get User
**Headers:**
```
Authorization: Bearer eyJhbGciO.....
```
**Response:**
```json
{
    "id": "488d8e4f-564c-45e2-a304-99cdc4926ffe",
    "email": "dwi@gmail.com",
    "name": "dwi",
    "bio": ""
}
```



### 7️⃣ Stopping Services
To stop all running containers:
```sh
docker-compose down
```

