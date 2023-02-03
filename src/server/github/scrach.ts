import { getRepoStats } from './repo-stats'

const targets: Record<string, string[]> = {
	// strapi: ['strapi'],
	// automuteus: ['automuteus', 'galactus'],
	// microsoft: ['typescript'],
	DefinitelyTyped: ['DefinitelyTyped'],
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
			const stats = await getRepoStats(org, repo)
			console.log(org, repo, stats)
		}
	}
})()
