import { z } from 'zod'

import {
	branchSchema,
	hrefObject,
	labelSchema,
	licenceSchema,
	milestonSchema,
	organisationSchema,
	pullSchema,
	repoSchema,
	teamSchema,
	userSchema,
} from './validation'

export type RawBranch = z.infer<typeof branchSchema>
export type RawHref = z.infer<typeof hrefObject>
export type RawLabel = z.infer<typeof labelSchema>
export type RawLicence = z.infer<typeof licenceSchema>
export type RawMileston = z.infer<typeof milestonSchema>
export type RawOrganisation = z.infer<typeof organisationSchema>
export type RawPull = z.infer<typeof pullSchema>
export type RawRepo = z.infer<typeof repoSchema>
export type RawTeam = z.infer<typeof teamSchema>
export type RawUser = z.infer<typeof userSchema>

type _branch = {
	user: number | null
	repo: number | null
}
export type GitHubBranch = _branch & Omit<RawBranch, keyof _branch>
export type GitHubHref = RawHref
export type GitHubLabel = RawLabel
export type GitHubLicence = RawLicence
export type GitHubMileston = RawMileston
export type GitHubOrganisation = RawOrganisation
type _pull = {
	user: number
	head: string | null
	base: string | null
}
export type GitHubPull = _pull & Omit<RawPull, keyof _pull>
type _repo = {
	owner: number | null
}
export type GitHubRepo = _repo & Omit<RawRepo, keyof _repo>
export type GitHubTeam = RawTeam
export type GitHubUser = RawUser
