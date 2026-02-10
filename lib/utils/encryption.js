import { createCipheriv, createDecipheriv } from 'node:crypto'
import { join } from 'node:path'
// import { readFile, writeFile } from 'node:fs/promises'
import { accessSync, constants, readFileSync, writeFileSync } from 'node:fs'

import { getKeyIv } from './code.js'

const algo = 'aes-256-cbc'

/**
 * Encrypt a string
 * 
 * @param {string} str - The input string
 * @param {string?} envFile - The env file path (relative to the process.cwd() value)
 * @returns {string}
 */
export function encrypt(str, envFile = '') {
    const [ keyBuff, ivBuff ] = getKeyIv(envFile)

    if (!keyBuff || !ivBuff) throw new Error('Encryption code not set')

    const cipher = createCipheriv(algo, keyBuff, ivBuff)
    const encrypted = Buffer.concat([
        cipher.update(str, 'utf8'),
        cipher.final(),
    ])

    return encrypted.toString('base64')
}

/**
 * Encrypt a string and write it the the env file
 * 
 * @param {string} str - The input string
 * @param {string} field - The env variable name
 * @param {string?} envFile - The env file path (relative to the process.cwd() value)
 * @returns {void}
 */
export function encryptAndSet(str, field, envFile = '') {
    const encrypted = encrypt(str, envFile)
    const path = join(process.cwd(), envFile)
    let fileContent = readFileSync(path, 'utf-8')
    const regex = new RegExp(`^${field}=(.*)$`, 'm')
    const newLine = `${field}=${encrypted}`

    if (regex.test(fileContent)) fileContent = fileContent.replace(regex, newLine)
    else fileContent = fileContent + '\n' + newLine + '\n'

    try {
        writeFileSync(path, fileContent, 'utf-8')
        console.log('\x1b[32m%s\x1b[0m', `Encrypted value of ${str} (${encrypted}) set in ${envFile}`)
    } catch (err) {
        console.log('\x1b[31m%s\x1b[0m', `Failed to write to ${envFile}`)
        
        throw err
    }
}

/**
 * Decrypt a string
 * 
 * @param {string} str - The input string
 * @param {string} envFile - The env file path (relative to the process.cwd() value)
 * @returns {Promise<string>}
 */
export function decrypt(str, envFile = '') {
    const [ keyBuff, ivBuff ] = getKeyIv(envFile)

    if (!keyBuff || !ivBuff) throw new Error('Encryption code not set')
    
    const decipher = createDecipheriv(algo, keyBuff, ivBuff)
    const decrypted = Buffer.concat([
        decipher.update(Buffer.from(str, 'base64'), 'utf8'),
        decipher.final(),
    ])

    return decrypted.toString('base64')
}
