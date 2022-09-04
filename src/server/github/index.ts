import fs from 'fs/promises'
// import { existsSync } from 'fs'
import path from 'path'

import axios from 'axios'
import linkParser from 'parse-link-header'
import { GITHUB_PASSWORD, GITHUB_USERNAME } from '../../common/config'

const apiurl = (org, repo) =>
	`https://api.github.com/repos/${org}/${repo}/pulls?state=all&per_page=100`

const auth = {
	username: GITHUB_USERNAME,
	password: GITHUB_PASSWORD,
}

export async function getPullRequests(org, repo) {
	const orgCache = path.join('.cache', org)
	const repoCache = path.join(orgCache, repo)

	// if (!(await existsSync(orgCache))) {
	// 	await fs.mkdir(orgCache, { recursive: true })
	// } else if (await existsSync(repoCache)) {
	// 	return JSON.parse(await fs.readFile(repoCache, 'utf8'))
	// }

	let whole: any[] = []
	let endpoint = apiurl(org, repo)
	let page = 1

	while (endpoint) {
		const { data, status, headers } = await axios.get(endpoint, { auth })

		if (status !== 200) {
			throw new Error('Non-200 response')
		}

		await fs.writeFile(
			`${repoCache}.page-${page}.json`,
			JSON.stringify(data)
		)
		whole = [...whole, ...data]

		const parsedLink = linkParser(headers.link)
		if (!parsedLink?.next) {
			break
		}

		const { next } = parsedLink

		endpoint = next.url
		page = next.page

		const remaining = parseInt(headers['x-ratelimit-remaining'], 10)
		if (remaining < 10) {
			await new Promise<void>((resolve) =>
				setTimeout(() => resolve(), 5 * 1000)
			)
		}
	}

	const users = new Map<number, any>()

	whole = whole.map(({ user, head, base, _links, ...pr }) => {
		if (!users.has(user.id)) {
			users.set(user.id, user)
		}

		return { user: `cache://user/${user.id}`, ...pr }
	})

	await fs.writeFile(`${repoCache}`, JSON.stringify(whole))

	return whole
}

export async function getRepoStats(org, repo) {
	const data = await getPullRequests(org, repo)
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
