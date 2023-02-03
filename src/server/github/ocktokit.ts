import { Octokit } from 'octokit'
import { config } from '../config'

export const octokit = new Octokit({
	userAgent: config.userAgent,
	auth: config.githubPass,
})
