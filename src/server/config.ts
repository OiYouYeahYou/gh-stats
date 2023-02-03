require('dotenv').config()

import { existsSync, readFileSync } from 'fs'

import { z } from 'zod'

import { formatZodError } from '../common/utils/zod-error'

const configPath = './config.json'

let jsonConfig
if (existsSync(configPath)) {
	try {
		jsonConfig = JSON.parse(readFileSync(configPath, 'utf8'))
	} catch (e) {
		jsonConfig = {}
		console.error(`Error reading ${configPath}:`, e)
	}
}

const _config = Object.assign({}, process.env, jsonConfig)

const configSchema = z.object({
	githubUser: z.string(),
	githubPass: z.string().regex(/^ghp_/),

	userAgent: z
		.string()
		.default(`Project: OiYouYeahYou/gh-stats | User: ${_config.githubUser}`),

	cachePath: z.string().default('.cache'),
})

export const parsed = configSchema.safeParse(_config)
if (!parsed.success) {
	console.error('Error with configuration\n', formatZodError(parsed.error))
	process.exit(2)
}

export const { data: config } = parsed
console.log(parsed)
