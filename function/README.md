# Almost Vault API

The Almost Vault API provides secure, ephemeral secret storage with time-to-live and read limits. This API enables clients to encrypt secrets for temporary sharing and decrypt them with proper authentication.

## 🧰 Usage

### GET /v1/health

Health check endpoint that returns the API status and dependency health.

**Response**

Sample `200` Response:

```json
{
  "status": "pass",
  "version": "1",
  "releaseId": "0.1.0",
  "checks": {
    "appwrite": {
      "status": "pass",
      "version": "1.8.0"
    }
  }
}
```

### POST /v1/cryptography/ciphertexts

Creates a new encrypted secret with specified time-to-live and read limits.

**Request Body**

| Field  | Type   | Required | Description                                    |
|--------|--------|----------|------------------------------------------------|
| secret | string | Yes      | The secret to encrypt (1-2048 characters)     |
| reads  | number | Yes      | Maximum read count (1-1000)                   |
| ttl    | string | Yes      | Time-to-live: hour, day, week, month, year, mock |

**Request Example**

```json
{
  "secret": "My secret message",
  "reads": 1,
  "ttl": "hour"
}
```

**Response**

Sample `201` Response:

```json
{
  "$id": "unique_secret_id",
  "$createdAt": "2024-01-01T12:00:00.000Z",
  "ttl": "hour",
  "reads": 1
}
```

**Error Responses**

- `400` - Invalid request body or validation error

### GET /v1/cryptography/ciphertexts/{id}

Retrieves and decrypts a secret by its ID. This endpoint automatically decrements the read count and validates TTL.

**Parameters**

| Parameter | Type   | Required | Description           |
|-----------|--------|----------|-----------------------|
| id        | string | Yes      | The secret identifier |

**Response**

Sample `200` Response:

```json
{
  "$id": "unique_secret_id",
  "$createdAt": "2024-01-01T12:00:00.000Z",
  "secret": "My secret message",
  "ttl": "hour",
  "reads": 0
}
```

**Error Responses**

- `400` - Secret expired, read limit exceeded, or invalid TTL
- `404` - Secret not found

**Error Examples**

```json
{
  "message": "This secret has expired on 1/1/2024, 1:00:00 PM"
}
```

```json
{
  "message": "This secret has been read too many times."
}
```

## 🔐 Security Features

- **Automatic Expiration**: Secrets are validated against their TTL on each access
- **Read Limits**: Each secret access decrements the remaining read count
- **CORS Protection**: API access is restricted to authorized origins
- **Input Validation**: All inputs are validated using Zod schemas
- **Encryption at Rest**: Secrets are encrypted using Appwrite's built-in encryption

## 🕐 Time-to-Live Options

| TTL    | Duration  | Use Case                    |
|--------|-----------|----------------------------|
| mock   | 5 seconds | Testing purposes           |
| hour   | 1 hour    | Quick temporary sharing    |
| day    | 24 hours  | Daily operations           |
| week   | 7 days    | Weekly processes           |
| month  | 30 days   | Monthly workflows          |
| year   | 365 days  | Long-term secure storage   |

## ⚙️ Configuration

| Setting           | Value         |
| ----------------- | ------------- |
| Runtime           | Node (22.0)   |
| Entrypoint        | `src/main.js` |
| Build Commands    | `npm install` |
| Permissions       | `any`         |
| Timeout (Seconds) | 15            |

## 🔒 Environment Variables

The API requires Appwrite configuration through environment variables (managed by Appwrite runtime):

- Appwrite endpoint and credentials are automatically provided
- Database and collection IDs are configured in the Appwrite project settings

## 📝 Notes

- Secrets have a maximum size of 2048 characters
- Read limits range from 1 to 1000 accesses
- Once a secret expires or reaches its read limit, it cannot be recovered
- The `mock` TTL option is available in production for testing but expires in 5 seconds