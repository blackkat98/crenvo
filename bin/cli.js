#!/usr/bin/env node

import { parseArgs } from 'node:util'

import { setCode, encrypt, encryptAndSet, decrypt } from '../lib/index.js'

const { values: args, positionals } = parseArgs({
    allowPositionals: true,
    options: {
        envFile: {
            type: 'string',
            short: 'e',
        },
        writeAs: {
            type: 'string',
            short: 'w',
        },
    },
})
const command = positionals[0]
const srcStr = positionals[1]

const execute = async () => {
    switch (command) {
        case 'code:generate':
            return setCode(args.envFile)

        case 'encrypt':
            if (args.writeAs) {
                encryptAndSet(srcStr, args.writeAs, args.envFile)
            } else {
                const encrypted = encrypt(srcStr, args.envFile)
                console.log('\x1b[32m%s\x1b[0m', `Encryption done: ${srcStr} => ${encrypted}`)
            }

            break

        case 'decrypt':
            const decrypted = decrypt(srcStr, args.envFile)
            console.log('\x1b[32m%s\x1b[0m', `Encryption done: ${srcStr} => ${decrypted}`)
            break

        default:
            console.log('\x1b[93m%s\x1b[0m', `Undefined command ${command}`)
    }
}

execute()
