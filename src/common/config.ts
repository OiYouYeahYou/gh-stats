require('dotenv').config()

export const GITHUB_USERNAME = process.env.GITHUB_PASSWORD!
export const GITHUB_PASSWORD = process.env.GITHUB_PASSWORD!

export const SERVER_PORT = process.env.SERVER_PORT
	? parseInt(process.env.SERVER_PORT)
	: 1515

// TODO: Remove me
export const MOCK_USERNAME = process.env.MOCK_USERNAME!
export const MOCK_PASSWORD = process.env.MOCK_PASSWORD!
export const users = new Map<string, string>([[MOCK_USERNAME, MOCK_PASSWORD]])
