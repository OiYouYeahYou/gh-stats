import { writeFile } from 'fs/promises'
import path from 'path'

import { octokit } from './ocktokit'
import { compressionContext, Context } from './compression-context'
import { flattenIssue, flattenPull } from './flatten'
import { cache } from '../cache'
import { pullSchema } from './validation'

async function getPulls(context: Context, owner: string, repo: string) {
	const pulls: any[] = []

	for await (const {
		url,
		status,
		data,
		headers,
	} of octokit.paginate.iterator(octokit.rest.pulls.list, {
		owner,
		repo,
		state: 'all',
	})) {
		console.log(url)
		if (status !== 200) {
			console.log('non-200 response', 200)
			break
		}

		for (const pull of data) {
			try {
				const x = pullSchema.parse(pull)
				pulls.push(flattenPull(x, context))
			} catch {
				console.log('Broken flatten on pull', owner, repo, pull.id)
				await writeFile(
					`.scratch/broken/${owner}-${repo}-pull-${pull.id}.json`,
					JSON.stringify(pull)
				)
			}
		}
	}

	return pulls
}

async function getIssues(context: Context, owner: string, repo: string) {
	const issues: any[] = []

	for await (const {
		url,
		status,
		data,
		headers,
	} of octokit.paginate.iterator(octokit.rest.issues.list, {
		owner,
		repo,
		state: 'all',
	})) {
		console.log(url)
		if (status !== 200) {
			console.log('non-200 response', 200)
			break
		}

		for (const issue of data) {
			try {
				issues.push(flattenIssue(issue, context))
			} catch {
				console.log('Broken flatten on issue', owner, repo, issue.id)
				await writeFile(
					`.scratch/broken/${owner}-${repo}-issue-${issue.id}.json`,
					JSON.stringify(issue)
				)
			}
		}
	}

	return issues
}

export async function getRepoStats(owner: string, repo: string) {
	const baseKey = path.join(owner, repo)
	const repokey = path.join(baseKey, 'repo')
	const pullsKey = path.join(baseKey, 'pulls')
	const issuesKey = path.join(baseKey, 'issues')

	// Initial check to ensure repository exists
	const repoResponse = await octokit.rest.repos.get({ owner, repo })
	if (repoResponse.status !== 200) {
		throw new Error('Non-200 response')
	}

	const context = compressionContext()
	const [pulls, issues] = await Promise.all([
		getPulls(context, owner, repo),
		getIssues(context, owner, repo),
	])

	await Promise.all(
		[cache.set(pullsKey, pulls), cache.set(issuesKey, issues)].map((prom) =>
			prom.catch((err) => {
				throw err
			})
		)
	)

	const pullStats = {
		open: 0,
		closed: 0,
		locked: 0,
		merged: 0,
		not_merged: 0,
		count: pulls.length,
	}

	for (const { state, merged_at, locked } of pulls) {
		if (state === 'open') {
			pullStats.open++
		} else {
			pullStats.closed++
		}

		if (merged_at) {
			pullStats.merged++
		} else {
			pullStats.not_merged++
		}

		if (locked) {
			pullStats.locked++
		}
	}

	const issueStats = {
		open: 0,
		closed: 0,
		locked: 0,
		merged: 0,
		not_merged: 0,
		count: issues.length,
	}

	for (const { state, merged_at, locked } of issues) {
		if (state === 'open') {
			issueStats.open++
		} else {
			issueStats.closed++
		}

		if (merged_at) {
			issueStats.merged++
		} else {
			issueStats.not_merged++
		}

		if (locked) {
			issueStats.locked++
		}
	}

	return { pullStats, issueStats }
}
