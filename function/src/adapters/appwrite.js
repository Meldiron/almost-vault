import { Client, TablesDB, ID } from "node-appwrite";
import { Adapter } from "./adapter.js";

export class AppwriteAdapter extends Adapter {
	client;
	tables;

	constructor(apiKey) {
		super();

		this.client = new Client()
			.setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
			.setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
			.setKey(apiKey);
		this.tables = new TablesDB(this.client);
	}

	async createSecret(secret, ttl, reads) {
		return await this.tables.createRow({
			databaseId: "main",
			tableId: "secrets",
			rowId: `sec_${ID.unique()}`,
			data: {
				secret,
				ttl,
				reads,
			},
		});
	}
	
	async getSecret(id) {
		return await this.tables.getRow({
			databaseId: "main",
			tableId: "secrets",
			rowId: id,
		});
	}
}
