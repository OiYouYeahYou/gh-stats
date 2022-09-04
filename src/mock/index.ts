import axios from 'axios'
import { MOCK_USERNAME, MOCK_PASSWORD, SERVER_PORT } from '../common/config'
import paths from '../common/paths'

const targets = {
	automuteus: [
		// 'automuteus',
		'deploy',
	],
	// microsoft: ['typescript'],
	// DefinitelyTyped: ['DefinitelyTyped'],
}

const baseUrl = `http://localhost:${SERVER_PORT}`

const entryLocaliser = ([key, value]: [string, any]) => [
	key,
	value.toLocaleString(),
]

const auth = {
	username: MOCK_USERNAME,
	password: MOCK_PASSWORD,
}

;(async function () {
	const rootUrl = baseUrl + paths.root({})
	const root = await axios.get(rootUrl, {
		validateStatus(status) {
			return true
		},
	})

	if (root.status !== 200) {
		return console.log('Root failed:', root.status)
	}

	for (const [org, repolist] of Object.entries(targets)) {
		for (const repo of repolist) {
			const { data, status } = await axios.get(
				baseUrl + '/api' + paths.stats({ org, repo }),
				{
					auth,
					validateStatus() {
						return true
					},
				}
			)

			if (status !== 200) {
				console.log(
					`Request for ${org}:${repo} failed. Status: ${status}`
				)
				continue
			}

			const localised = Object.fromEntries(
				Object.entries(data).map(entryLocaliser)
			)

			console.log(org, repo, localised)
		}
	}
})().catch((err) => console.error(err))
