import { Client, TablesDB } from "node-appwrite";
import { Adapter } from "./adapter.js";

export class AppwriteAdapter extends Adapter {
	client;
	tables;

	constructor() {
		super();

		this.client = new Client()
			.setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
			.setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
			.setKey(req.headers["x-appwrite-key"] ?? "");
		this.tables = new TablesDB(this.client);
	}
}
