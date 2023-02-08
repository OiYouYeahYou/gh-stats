import { app } from './app'
import { config } from './config'

app.listen(config.serverPort, () => {
	console.log(`listening to the wind on ${config.serverPort}`)
})
