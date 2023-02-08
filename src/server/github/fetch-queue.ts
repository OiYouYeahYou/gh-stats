import path from 'path'

enum QueueStatus {
	InQueue = 'in-queue',
}

interface QueueItem {
	status: QueueStatus
	owner: string
	repo: string
}

export class FetchQueue {
	async getQueue() {
		const key = (await path.join('fetch-queue')) || []
	}

	getStatus() {}
}
