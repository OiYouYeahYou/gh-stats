import { z } from 'zod'
import { formatZodError } from '../../common/utils/zod-error'

const json = require('../../.scratch/repo-strapi-strapi-pulls.json')

export const userSchema = z.object({
	login: z.string(),
	id: z.number(),
	node_id: z.string(),
	avatar_url: z.string().url(),
	gravatar_id: z.string().url().or(z.string().length(0)),
	url: z.string().url(),
	html_url: z.string().url(),
	followers_url: z.string().url(),
	following_url: z.string().url(),
	gists_url: z.string().url(),
	starred_url: z.string().url(),
	subscriptions_url: z.string().url(),
	organizations_url: z.string().url(),
	repos_url: z.string().url(),
	events_url: z.string().url(),
	received_events_url: z.string().url(),
	type: z.string(),
	site_admin: z.boolean(),
})

export const licenceSchema = z.object({
	key: z.string(),
	name: z.string(),
	spdx_id: z.string(),
	url: z.string().url().nullable(),
	node_id: z.string(),
})

export const organisationSchema = z.object({
	login: z.string(),
	id: z.number(),
	node_id: z.string(),
	avatar_url: z.string().url(),
	gravatar_id: z.string().url(),
	url: z.string().url(),
	html_url: z.string().url(),
	followers_url: z.string().url(),
	following_url: z.string().url(),
	gists_url: z.string().url(),
	starred_url: z.string().url(),
	subscriptions_url: z.string().url(),
	organizations_url: z.string().url(),
	repos_url: z.string().url(),
	events_url: z.string().url(),
	received_events_url: z.string().url(),
	type: z.string(),
	site_admin: z.boolean(),
})

export const repoSchema = z.object({
	id: z.number(),
	node_id: z.string(),
	name: z.string(),
	full_name: z.string(),
	private: z.boolean(),
	owner: userSchema,
	html_url: z.string().url(),
	description: z.string(),
	fork: z.boolean(),
	url: z.string().url(),
	forks_url: z.string().url(),
	keys_url: z.string().url(),
	collaborators_url: z.string().url(),
	teams_url: z.string().url(),
	hooks_url: z.string().url(),
	issue_events_url: z.string().url(),
	events_url: z.string().url(),
	assignees_url: z.string().url(),
	branches_url: z.string().url(),
	tags_url: z.string().url(),
	blobs_url: z.string().url(),
	git_tags_url: z.string().url(),
	git_refs_url: z.string().url(),
	trees_url: z.string().url(),
	statuses_url: z.string().url(),
	languages_url: z.string().url(),
	stargazers_url: z.string().url(),
	contributors_url: z.string().url(),
	subscribers_url: z.string().url(),
	subscription_url: z.string().url(),
	commits_url: z.string().url(),
	git_commits_url: z.string().url(),
	comments_url: z.string().url(),
	issue_comment_url: z.string().url(),
	contents_url: z.string().url(),
	compare_url: z.string().url(),
	merges_url: z.string().url(),
	archive_url: z.string().url(),
	downloads_url: z.string().url(),
	issues_url: z.string().url(),
	pulls_url: z.string().url(),
	milestones_url: z.string().url(),
	notifications_url: z.string().url(),
	labels_url: z.string().url(),
	releases_url: z.string().url(),
	deployments_url: z.string().url(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date(),
	pushed_at: z.coerce.date(),
	git_url: z.string().url(),
	ssh_url: z.string(),
	clone_url: z.string().url(),
	svn_url: z.string().url(),
	homepage: z.string().url(),
	size: z.number(),
	stargazers_count: z.number(),
	watchers_count: z.number(),
	language: z.string().nullable(),
	has_issues: z.boolean(),
	has_projects: z.boolean(),
	has_downloads: z.boolean(),
	has_wiki: z.boolean(),
	has_pages: z.boolean(),
	has_discussions: z.boolean(),
	forks_count: z.number(),
	// FIXME:
	mirror_url: z.any().nullable(),
	archived: z.boolean(),
	disabled: z.boolean(),
	open_issues_count: z.number(),
	license: licenceSchema,
	allow_forking: z.boolean(),
	is_template: z.boolean(),
	web_commit_signoff_required: z.boolean(),
	topics: z.array(z.string()),
	visibility: z.string(),
	forks: z.number(),
	open_issues: z.number(),
	watchers: z.number(),
	default_branch: z.string(),
	// FIXME:
	temp_clone_token: z.any().nullable(),
	organization: organisationSchema.optional(),
	// FIXME: present on repo endpoint, but not on other endpoints with this as child
	network_count: z.number().optional(),
	// FIXME: present on repo endpoint, but not on other endpoints with this as child
	subscribers_count: z.number().optional(),
})

export const branchSchema = z.object({
	label: z.string().nullable(),
	ref: z.string(),
	sha: z.string(),
	user: userSchema.nullable(),
	repo: repoSchema.nullable(),
})

export const hrefObject = z.object({ href: z.string().url() })

export const labelSchema = z.object({
	id: z.number(),
	node_id: z.string(),
	url: z.string().url(),
	name: z.string(),
	description: z.string(),
	color: z.string(),
	default: z.boolean(),
})

export const milestonSchema = z.object({
	url: z.string().url(),
	html_url: z.string().url(),
	labels_url: z.string().url(),
	id: z.number(),
	node_id: z.string(),
	number: z.number(),
	state: z.string(),
	title: z.string(),
	description: z.string(),
	creator: userSchema,
	open_issues: z.number(),
	closed_issues: z.number(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date(),
	closed_at: z.coerce.date(),
	due_on: z.coerce.date(),
})

export const teamSchema = z.object({
	id: z.number(),
	node_id: z.string(),
	url: z.string().url(),
	html_url: z.string().url(),
	name: z.string(),
	slug: z.string(),
	description: z.string(),
	privacy: z.string(),
	permission: z.string(),
	members_url: z.string().url(),
	repositories_url: z.string().url(),
	// FIXME:
	parent: z.any().nullable(),
})

export const pullSchema = z.object({
	url: z.string().url(),
	id: z.number(),
	node_id: z.string(),
	html_url: z.string().url(),
	diff_url: z.string().url(),
	patch_url: z.string().url(),
	issue_url: z.string().url(),
	number: z.number(),
	state: z.string(),
	locked: z.boolean(),
	title: z.string(),
	user: userSchema,
	body: z.string(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date(),
	closed_at: z.coerce.date().nullable(),
	merged_at: z.coerce.date().nullable(),
	merge_commit_sha: z.string(),
	assignee: userSchema.nullable(),
	assignees: z.array(userSchema),
	requested_reviewers: z.array(userSchema),
	requested_teams: z.array(teamSchema),
	labels: z.array(labelSchema),
	milestone: milestonSchema.nullable(),
	draft: z.boolean(),
	commits_url: z.string().url(),
	review_comments_url: z.string().url(),
	review_comment_url: z.string().url(),
	comments_url: z.string().url(),
	statuses_url: z.string().url(),
	head: branchSchema,
	base: branchSchema,
	_links: z.object({
		self: hrefObject,
		html: hrefObject,
		issue: hrefObject,
		comments: hrefObject,
		review_comments: hrefObject,
		review_comment: hrefObject,
		commits: hrefObject,
		statuses: hrefObject,
	}),
	author_association: z.string(),
	// FIXME:
	auto_merge: z.any().nullable(),
	// FIXME:
	active_lock_reason: z.any().nullable(),
})