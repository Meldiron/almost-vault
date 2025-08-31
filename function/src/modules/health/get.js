import { createAdapter } from "../../middlewares.js";

export const getHealth = async (ctx) => {
	const adapter = createAdapter(ctx);

	ctx.status = 200;
	ctx.body = {
		status: "pass",
		version: "1",
		releaseId: "0.1.0",
		checks: {
			appwrite: {
				status: await adapter.ping(),
				version: "1.8.0", // Update when upgrading node-appwrite SDK
			},
		},
	};
	return;
};
