import { SERVER_PORT } from '../common/config'
import { app } from './express/app'

app.listen(SERVER_PORT, () => {
	console.log(`Listening to localhost:${SERVER_PORT}`)
})
