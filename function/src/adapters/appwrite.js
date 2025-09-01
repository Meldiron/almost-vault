import { Client, TablesDB, ID, Health } from "node-appwrite";
import { Adapter } from "./adapter.js";

export class AppwriteAdapter extends Adapter {
	client;
	tables;
	health;

	constructor(apiKey) {
		super();

		this.client = new Client()
			.setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
			.setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
			.setKey(apiKey);
		this.tables = new TablesDB(this.client);
		this.health = new Health(this.client);
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

	async decreaseSecretReads(id) {
		return await this.tables.decrementRowColumn({
			databaseId: "main",
			tableId: "secrets",
			rowId: id,
			column: "reads",
			value: 1,
			min: 1,
		});
	}

	async ping() {
		try {
			const response = await this.health.get();
			return response.status;
		} catch (_err) {
			return "fail";
		}
	}
}
