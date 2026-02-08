import { join } from 'node:path'
import { access, constants, readFile, writeFile } from 'node:fs/promises'
import { randomBytes } from 'node:crypto'

const codeName = 'ENC_CODE'
const regex = new RegExp(`^${codeName}=(.*)$`, 'm')
const keyLen = 32
const ivLen = 16

/**
 * Check whether NodeJS process can access the env file
 * 
 * @param {string} envFile - The env file path (relative to the process.cwd() value)
 * @returns {Promise<void>}
 */
const checkEnvFile = async (envFile) => {
    if (!envFile) throw new Error(`File ${envFile} not specified`)

    const path = join(process.cwd(), envFile)

    try {
        await access(path, constants.F_OK)
    } catch (err) {
        console.log('\x1b[31m%s\x1b[0m', `Failed to read ${envFile}`)

        throw err
    }
}

/**
 * Set the encryption code to the env file
 * 
 * @param {string} envFile - The env file path (relative to the process.cwd() value)
 * @returns {Promise<void>}
 */
export const setCode = async (envFile = '.env') => {
    await checkEnvFile(envFile)
    const key = randomBytes(keyLen)
    const iv = randomBytes(ivLen)
    const code = Buffer.concat([ key, iv ]).toString('base64')
    const path = join(process.cwd(), envFile)
    let fileContent = await readFile(path, 'utf-8')

    if (regex.test(fileContent)) fileContent = fileContent.replace(regex, '')

    fileContent = fileContent.replace(/^[\n\r]+/, '')
    fileContent = `${codeName}=${code}` + '\n\n' + fileContent
    
    try {
        await writeFile(path, fileContent, 'utf-8')
        console.log('\x1b[32m%s\x1b[0m', `Encryption code set in ${envFile}`)
    } catch (err) {
        console.log('\x1b[31m%s\x1b[0m', `Failed to write to ${envFile}`)
        
        throw err
    }
}

/**
 * Get the encryption code from the env file
 * 
 * @param {string} envFile - The env file path (relative to the process.cwd() value)
 * @returns {Promise<string>}
 */
export const getCode = async (envFile = '.env') => {
    await checkEnvFile(envFile)
    const path = join(process.cwd(), envFile)
    const fileContent = await readFile(path, 'utf-8')
    const search = fileContent.match(regex)
    const code = search && search[1]

    if (!code) throw new Error(`Encryption code not set in ${envFile}`)

    return code
}

/**
 * Get the encryption key and iv from the env file
 * 
 * @param {string} envFile - The env file path (relative to the process.cwd() value)
 * @returns {Promise<string[]>}
 */
export const getKeyIv = async (envFile = '.env') => {
    const code = await getCode(envFile)
    const buff = Buffer.from(code, 'base64')

    return [
        buff.subarray(0, keyLen),
        buff.subarray(keyLen),
    ]
}
