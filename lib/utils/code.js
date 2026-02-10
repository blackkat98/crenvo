import { join } from 'node:path'
// import { access, constants, readFile, writeFile } from 'node:fs/promises'
import { accessSync, constants, readFileSync, writeFileSync } from 'node:fs'
import { randomBytes } from 'node:crypto'

const codeName = 'ENC_CODE'
const regex = new RegExp(`^${codeName}=(.*)$`, 'm')
const keyLen = 32
const ivLen = 16

/**
 * Check whether NodeJS process can access the env file
 * 
 * @param {string} envFile - The env file path (relative to the process.cwd() value)
 * @returns {void}
 */
export function checkEnvFile(envFile) {
    if (!envFile) throw new Error(`File ${envFile} not specified`)

    const path = join(process.cwd(), envFile)

    try {
        accessSync(path, constants.F_OK)
    } catch (err) {
        console.log('\x1b[31m%s\x1b[0m', `Failed to read ${envFile}`)

        throw err
    }
}

/**
 * Set the encryption code to the env file
 * 
 * @param {string?} envFile - The env file path (relative to the process.cwd() value)
 * @returns {void}
 */
export function setCode(envFile = '.env') {
    checkEnvFile(envFile)
    const key = randomBytes(keyLen)
    const iv = randomBytes(ivLen)
    const code = Buffer.concat([ key, iv ]).toString('base64')
    const path = join(process.cwd(), envFile)
    let fileContent = readFileSync(path, 'utf-8')

    if (regex.test(fileContent)) fileContent = fileContent.replace(regex, '')

    fileContent = fileContent.replace(/^[\n\r]+/, '')
    fileContent = `${codeName}=${code}` + '\n\n' + fileContent
    
    try {
        writeFileSync(path, fileContent, 'utf-8')
        console.log('\x1b[32m%s\x1b[0m', `Encryption code set in ${envFile}`)
    } catch (err) {
        console.log('\x1b[31m%s\x1b[0m', `Failed to write to ${envFile}`)
        
        throw err
    }
}

/**
 * Get the encryption code from the process variables or env file
 * 
 * @param {string?} envFile - The env file path (relative to the process.cwd() value)
 * @returns {string}
 */
export function getCode(envFile = '') {
    if (!envFile) return process.env[codeName] || ''

    const path = join(process.cwd(), envFile)
    const fileContent = readFileSync(path, 'utf-8')
    const search = fileContent.match(regex)
    const code = search && search[1] || ''

    return code
}

/**
 * Get the encryption Key and IV from the process variables or env file
 * 
 * @param {string?} envFile - The env file path (relative to the process.cwd() value)
 * @returns {Buffer[]}
 */
export function getKeyIv(envFile = '') {
    const code = getCode(envFile)
    const buff = Buffer.from(code, 'base64')

    return [
        buff.subarray(0, keyLen),
        buff.subarray(keyLen),
    ]
}
