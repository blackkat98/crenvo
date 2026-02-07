# crenvo

A Laravel-inspired, zero-dependency, TypeScript-ready CLI and library for env file encryption.

`crenvo = crypto + env`

---

## 1. Introduction

Inspired by Laravel's `php artisan key:generate`, **crenvo** brings secure environment variable encryption to the Node.js ecosystem. By utilizing native Node.js crypto capabilities, this package allows you to manage sensitive secrets without external dependencies.

---

## 2. CLI Commands

### `npx crenvo code:generate --envFile <path>`
Run this command to create an `ENC_CODE` in your env file.
* **--envFile / -e**: Specify file path (Default: `.env` in project root).

### `npx crenvo encrypt <input> --envFile <path> --writeAs <field>`
Encrypt a string value using the code in the env file.
* **--envFile / -e**: Specify file path.
* **--writeAs / -w**: Write the result into the env file under the given variable name.

### `npx crenvo decrypt <input> --envFile <path>`
Decrypt a string value using the code in the env file.
* **--envFile / -e**: Specify file path.

---

## 3. Utility Functions

| Function | Signature | Description |
| :--- | :--- | :--- |
| `setCode` | `(envFile?: string) => void` | Create an `ENC_CODE` in your env file. |
| `getCode` | `(envFile?: string) => Promise<string>` | Retrieve the value of `ENC_CODE`. |
| `getKeyIv` | `(envFile?: string) => Promise<string[]>` | Retrieve the Encryption KEY and IV. |
| `encrypt` | `(str: string, envFile?: string) => Promise<string>` | Encrypt a string value. |
| `encryptAndSet` | `(str: string, field: string, envFile?: string) => Promise<string>` | Encrypt and write to a specific field. |
| `decrypt` | `(str: string, envFile?: string) => Promise<string>` | Decrypt a string value. |

### Code Implementation Example

```typescript
import { encrypt, decrypt, setCode } from 'crenvo';

async function example() {
  // Initialize key if not present
  await setCode('.env');

  // Encrypt a value
  const encrypted = await encrypt("my_secret_key");
  console.log(`Encrypted: ${encrypted}`);

  // Decrypt the value
  const original = await decrypt(encrypted);
  console.log(`Original: ${original}`);
}
