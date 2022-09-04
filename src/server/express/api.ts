import { Router } from 'express'

import { users } from '../../common/config'
import paths from '../../common/paths'

import { getPullRequests, getRepoStats } from '../github'

export const api = Router()

const authError = { status: 401, message: 'Unauthorized' }

api.use((req, res, next) => {
	const {
		headers: { authorization },
	} = req

	if (!authorization) {
		return next(authError)
	}

	const [type, b64auth] = authorization.split(' ')

	if (type !== 'Basic') {
		return next(authError)
	}

	const [login, password] = Buffer.from(b64auth, 'base64')
		.toString()
		.split(':')

	if (!login || !password) {
		return next(authError)
	}

	const userPassword = users.get(login)
	if (!users.has(login) || userPassword !== password) {
		return next(authError)
	}

	next()
})

api.get(paths.repos.pattern, (req, res) => {
	const { org, repo } = req.params

	getPullRequests(org, repo).then((prs) => res.json(prs))
})

api.get(paths.stats.pattern, (req, res) => {
	const { org, repo } = req.params

	getRepoStats(org, repo).then((stats) => res.json(stats))
})

api.use((req, res, next) => {
	next({ status: 404, Message: 'Not Found' })
})

api.use((err, req, res, next) => {
	res.status(err.status).json(err)
})
