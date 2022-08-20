require('dotenv').config()

import fs from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

import axios from 'axios'
import linkParser from 'parse-link-header'
import { client, octokit } from './ocktokit'

const apiurl = (org, repo) =>
	`https://api.github.com/repos/${org}/${repo}/pulls?state=all&per_page=100`

async function get(org, repo) {
	const orgCache = path.join('.cache', org)
	const repoCache = path.join(orgCache, repo)

	if (!(await existsSync(orgCache))) {
		await fs.mkdir(orgCache, { recursive: true })
	} else if (await existsSync(repoCache)) {
		return JSON.parse(await fs.readFile(repoCache, 'utf8'))
	}

	let whole: any[] = []
	let endpoint = apiurl(org, repo)
	let page = 1

	while (endpoint) {
		const { data, status, headers } = await axios.get(endpoint, {
			auth: {
				username: process.env.GITHUB_PASSWORD!,
				password: process.env.GITHUB_PASSWORD!,
			},
		})

		if (status !== 200) {
			throw new Error('Non-200 response')
		}

		await fs.writeFile(
			`${repoCache}.page-${page}.json`,
			JSON.stringify(data)
		)
		whole = [...whole, ...data]

		const { next } = linkParser(headers.link)
		if (!next) {
			break
		}

		endpoint = next.url
		page = next.page

		const remaining = parseInt(headers['x-ratelimit-remaining'], 10)
		if (remaining < 10) {
			await new Promise<void>((resolve) =>
				setTimeout(() => resolve(), 5 * 1000)
			)
		}
	}

	await fs.writeFile(`${repoCache}`, JSON.stringify(whole))

	return whole
}

async function getRepoStats(org, repo) {
	const data = await get(org, repo)
	const stats = {
		open: 0,
		closed: 0,
		locked: 0,
		merged: 0,
		not_merged: 0,
		count: data.length,
	}

	for (const { state, merged_at, locked } of data) {
		if (state === 'open') {
			stats.open++
		} else {
			stats.closed++
		}

		if (merged_at) {
			stats.merged++
		} else {
			stats.not_merged++
		}

		if (locked) {
			stats.locked++
		}
	}

	const mapped = data.map((pr) => {
		//
	})

	return stats
}

const targets = {
	automuteus: ['automuteus'],
	// microsoft: ['typescript'],
	// DefinitelyTyped: ['DefinitelyTyped'],
}

;(async function () {
	// const { data, status, headers } = await axios.get(
	// 	'https://api.github.com/rate_limit',
	// 	{
	// 		auth: { username, password },
	// 	}
	// )
	// console.log({ status, headers, data })

	for (const [org, repos] of Object.entries(targets)) {
		for (const repo of repos) {
			console.log(
				org,
				repo,
				Object.fromEntries(
					Object.entries(await getRepoStats(org, repo)).map(
						([key, value]) => [key, value.toLocaleString()]
					)
				)
			)
		}
	}

	setTimeout(() => client.disconnect(), 5000)
})()
