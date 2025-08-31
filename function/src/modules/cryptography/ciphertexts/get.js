import * as z from "zod";
import { createAdapter } from "../../../middlewares.js";

const Payload = z.object({
	cipherTextId: z.string().min(1).max(255),
});

export const getCryptographyCiphertext = async (ctx) => {
	let payload;

	try {
		payload = Payload.parse({
			cipherTextId: ctx.params.id,
		});
	} catch (err) {
		ctx.status = 400;
		ctx.body = err.message;
		return;
	}

	const adapter = createAdapter(ctx);

	let row;
	try {
		row = await adapter.getSecret(payload.cipherTextId);
	} catch (err) {
		ctx.status = 400;
		ctx.body = err.message;
		return;
	}

	// TODO: Validate TTL, reads
	// TODO: Lower reads (atomic)

	ctx.status = 200;
	ctx.body = row;
	return;
};
