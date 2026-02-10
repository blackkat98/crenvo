declare const setCode: (envFile?: string) => void
declare const getCode: (envFile?: string) => string
declare const getKeyIv: (envFile?: string) => string[]

declare const encrypt: (str: string, envFile?: string) => string
declare const encryptAndSet: (str: string, field: string, envFile?: string) => void
declare const decrypt: (str: string, envFile?: string) => string

export { setCode, getCode, getKeyIv, encrypt, encryptAndSet, decrypt }
