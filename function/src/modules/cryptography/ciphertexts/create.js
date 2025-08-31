import * as z from "zod";
import { createAdapter } from "../../../middlewares.js";

const Body = z.object({
	secret: z.string().min(1).max(2048),
	reads: z.number().min(1).max(1000),
	ttl: z.enum(["hour", "day", "week", "month", "year"]),
});

export const createCryptographyCiphertext = async (ctx) => {
	let body;

	try {
		body = Body.parse(ctx.request.body);
	} catch (err) {
		ctx.status = 400;
		ctx.body = err.message;
		return;
	}

	const adapter = createAdapter(ctx);

	try {
		const row = await adapter.createSecret(body.secret, body.ttl, body.reads);
		ctx.status = 201;
		ctx.body = row;
		return;
	} catch (err) {
		ctx.status = 400;
		ctx.body = err.message;
		return;
	}
};
