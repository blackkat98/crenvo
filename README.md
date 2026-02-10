# crenvo

A Laravel-inspired, zero-dependency, TypeScript-ready CLI and library for env file encryption.

`crenvo = crypto + env`

---

## 1. Introduction

Inspired by Laravel's `php artisan key:generate`, **crenvo** brings secure environment variable encryption to the Node.js ecosystem. By utilizing native Node.js crypto capabilities, this package allows you to manage sensitive secrets without external dependencies.

---

***In version 2.0.0, functions are no longer async, eliminating the pain of unpacking Promises all the time.***

---

## 2. CLI Commands

### `npx crenvo code:generate --envFile <path>`
Run this command to create an `ENC_CODE` in your env file.
* **--envFile / -e**: Specify file path (Default: `.env` in project root).

### `npx crenvo encrypt <input> --writeAs <field> --envFile <path>`
Encrypt a string value using the code in the env file.
* **--writeAs / -w**: Write the result into the env file under the given variable name.
* **--envFile / -e**: Specify file path. If not specified, the function tries to get the code value from ```process.env```.

### `npx crenvo decrypt <input> --envFile <path>`
Decrypt a string value using the code in the env file.
* **--envFile / -e**: Specify file path. If not specified, the function tries to get the code value from ```process.env```.

---

## 3. Utility Functions

| Function | Signature | Description |
| :--- | :--- | :--- |
| `setCode` | `(envFile?: string) => void` | Create an `ENC_CODE` in your env file. |
| `getCode` | `(envFile?: string) => string` | Retrieve the value of `ENC_CODE`. |
| `getKeyIv` | `(envFile?: string) => Buffer[]` | Retrieve the Encryption KEY and IV. |
| `encrypt` | `(str: string, envFile?: string) => string` | Encrypt a string value. |
| `encryptAndSet` | `(str: string, field: string, envFile?: string) => string` | Encrypt and write to a specific field. |
| `decrypt` | `(str: string, envFile?: string) => string` | Decrypt a string value. |

### Code Implementation Example

```typescript
import { encrypt, decrypt, setCode } from 'crenvo'

function example() {
  // Initialize key if not present
  setCode('.env')

  // Encrypt a value
  const encrypted = encrypt("my_secret_key")
  console.log(`Encrypted: ${encrypted}`)

  // Decrypt the value
  const original = decrypt(encrypted)
  console.log(`Original: ${original}`)
}
```
