require('dotenv').config()

import { existsSync, readFileSync } from 'fs'

import { z } from 'zod'

import { formatZodError } from '../common/utils/zod-error'

const configPath = './config.json'

let jsonConfig = {}
if (existsSync(configPath)) {
	try {
		jsonConfig = JSON.parse(readFileSync(configPath, 'utf8'))
	} catch (e) {
		console.error(`Error reading ${configPath}:`, e)
	}
}

const rawConfig = Object.assign({}, process.env, jsonConfig)

const configSchema = z.object({
	githubUser: z.string(),
	githubPass: z.string().regex(/^ghp_/),

	userAgent: z
		.string()
		.default(
			`Project: OiYouYeahYou/gh-stats | User: ${rawConfig.githubUser}`
		),

	cachePath: z.string().default('.cache'),

	serverPort: z.number().default(3434),
})

const parsed = configSchema.safeParse(rawConfig)
if (!parsed.success) {
	console.error('Error with configuration\n', formatZodError(parsed.error))
	process.exit(2)
}

export const { data: config } = parsed
