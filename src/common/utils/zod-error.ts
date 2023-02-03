import { z } from 'zod'
import { generateErrorMessage } from 'zod-error'

export function formatZodError(err: z.ZodError) {
	return generateErrorMessage(err.errors, {
		delimiter: { error: '\n' },
	})
		.split('\n')
		.map((ln) => '\t' + ln)
		.join('\n')
}
