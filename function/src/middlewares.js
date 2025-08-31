import {MemoryAdapter} from "./adapters/memory.js";
import {AppwriteAdapter} from "./adapters/appwrite.js";

export const createAdapterContext = (app) => {
	const adapter = process.env.ADAPTER || "memory";

	switch (adapter) {
		case "memory":
			app.context.adapter = new MemoryAdapter();
			break;
		case "appwrite":
			app.context.adapter = new AppwriteAdapter();
			break;
		default:
			throw new Error(`Unsupported adapter: ${adapter}`);
	}
};
