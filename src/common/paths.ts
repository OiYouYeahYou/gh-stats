import { path } from 'static-path'

const repos = path('/v1/repos/:org/:repo')
const stats = path('/v1/repos/:org/:repo/stats')

const root = path('/')

export default { repos, stats, root }
