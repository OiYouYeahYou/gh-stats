import { GitHubBranch, GitHubRepo, GitHubUser } from './types'

export interface Context {
	users: Record<string, GitHubUser>
	branches: Record<string, GitHubBranch>
	repos: Record<string, GitHubRepo>
}

export function compressionContext(): Context {
	return {
		users: {},
		branches: {},
		repos: {},
	}
}
