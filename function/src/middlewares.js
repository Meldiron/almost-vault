import { MemoryAdapter } from "./adapters/memory.js";
import { AppwriteAdapter } from "./adapters/appwrite.js";

export const createAdapter = (ctx) => {
	const adapter = process.env.ADAPTER || "memory";

	switch (adapter) {
		case "memory":
			return new MemoryAdapter();
		case "appwrite":
			return new AppwriteAdapter(ctx.request.header["x-appwrite-key"] ?? "");
		default:
			throw new Error(`Unsupported adapter: ${adapter}`);
	}
};
