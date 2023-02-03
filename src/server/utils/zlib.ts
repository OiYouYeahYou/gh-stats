import { unzip as _unzip, deflate as _deflate } from 'node:zlib'
import { promisify } from 'node:util'

export const unzip = promisify(_unzip)
export const deflate = promisify(_deflate)
