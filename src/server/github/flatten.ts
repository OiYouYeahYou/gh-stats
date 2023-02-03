import { Context } from './compression-context'
import { GitHubPull, RawBranch, RawPull, RawRepo, RawUser } from './types'

export function flattenIssue({ user, ...pull }, context: Context) {
	return {
		...pull,
		user: flattenUser(user, context),
	}
}

export function flattenPull(
	{ user, head, base, ...pull }: RawPull,
	context: Context
): GitHubPull {
	return {
		...pull,
		user: flattenUser(user, context),
		head: flattenBranch(head, context),
		base: flattenBranch(base, context),
	}
}

export function flattenBranch(
	{ user, repo, ...branch }: RawBranch,
	context: Context
): string | null {
	const { branches } = context
	const { label } = branch

	if (label && !branches[label]) {
		branches[label] = {
			...branch,
			user: user && flattenUser(user, context),
			repo: repo && flattenRepo(repo, context),
		}
	}

	return label
}

export function flattenUser(user: RawUser, context: Context): number {
	const { users } = context
	if (!users[user.id]) {
		users[user.id] = user
	}
	return user.id
}

export function flattenRepo(
	{ owner, ...repo }: RawRepo,
	context: Context
): number {
	const { repos } = context

	if (!repos[repo.id]) {
		repos[repo.id] = {
			...repo,
			owner: owner && flattenUser(owner, context),
		}
	}

	return repo.id
}
