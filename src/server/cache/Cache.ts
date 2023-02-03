import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname as pathDirname, join as pathJoin } from 'node:path'

import { config } from '../config'
import { deflate, unzip } from '../utils/zlib'

interface SetOptions {}

interface CacheWrap<T> {
	meta: {}
	data: T
}

export class CustomCache {
	path(key) {
		return pathJoin(config.cachePath, `${key}.json.gz`)
	}

	async get<T extends {}>(key: string): Promise<T | void> {
		const filePath = this.path(key)

		if (!existsSync(filePath)) {
			return
		}

		const { meta, data } = JSON.parse(
			await (await unzip(await readFile(filePath))).toString()
		) as CacheWrap<T>

		return data
	}

	async set<T extends {}>(key: string, data: T, options?: SetOptions) {
		const filePath = this.path(key)

		const dir = pathDirname(filePath)
		if (!(await existsSync(dir))) {
			await mkdir(dir, { recursive: true })
		}

		const cacheWrap = { meta: {}, data }
		const json = JSON.stringify(cacheWrap)
		const commpressed = await deflate(json)

		await writeFile(filePath, commpressed)
	}
}
