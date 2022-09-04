import Express from 'express'

import paths from '../../common/paths'
import { api } from './api'

export const app = Express()

app.use('/api', api)

app.use(paths.root.pattern, (req, res) => {
	res.send('hello world')
})

// TODo: Add 404 and error handler
