import express from 'express'

// import { getAll } from '.'

import { index, pulls } from '../common/paths'
import { parcel } from './parcel'

export const app = express()

app.use(pulls.pattern, (req, res) => {
	const { owner, repo } = req.params

	/**
	 * Check if repo exists
	 * 		If not: return 404
	 * Check if in queue
	 * 		If yes: retrun 102
	 *
	 */

	// getAll(org, repo)
	// 	.then((blah) => res.json(blah))
	// 	.catch((err) => res.json({ error: err }))

	// res.json({ org, repo })
})

app.use(index.pattern, parcel.middleware)
