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
		ctx.status = err.code ? err.code : 404;
		ctx.body = err.message;
		return;
	}

	// Ensure TTL is in future
	const ttl = row.ttl;
	let ttlInSeconds;
	switch (ttl) {
		case "mock":
			ttlInSeconds = 5;
			break;
		case "hour":
			ttlInSeconds = 3600;
			break;
		case "day":
			ttlInSeconds = 86400;
			break;
		case "week":
			ttlInSeconds = 604800;
			break;
		case "month":
			ttlInSeconds = 2592000;
			break;
		case "year":
			ttlInSeconds = 31536000;
			break;
		default:
			ctx.status = 400;
			ctx.body =
				"Invalid time-to-live configured on a secret. You will need to generate a new one.";
			return;
	}

	const timeNow = new Date();
	const timeCreatedAt = new Date(row.$createdAt);
	const timeOnTtl = new Date(timeCreatedAt.getTime() + ttlInSeconds * 1000);

	const isExpired = timeNow > timeOnTtl;
	if (isExpired) {
		ctx.status = 400;
		ctx.body = `This secret has expired on ${timeOnTtl.toLocaleString()}`;
		return;
	}

	// Ensure read is allowed
	const reads = row.reads;
	if (reads <= 0) {
		ctx.status = 400;
		ctx.body = "This secret has been read too many times.";
		return;
	}

	// Lower allowed reads by 1
	await adapter.decreaseSecretReads(row.$id);

	ctx.status = 200;
	ctx.body = row;
	return;
};
