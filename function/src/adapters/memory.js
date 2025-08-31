import { Adapter } from "./adapter.js";

// Global objects, persists between requests
let sequence = 0;
const store = { rows: [] };

export class MemoryAdapter extends Adapter {
	async createSecret(secret, ttl, reads) {
		sequence++;

		const row = {
			$id: `sec_${Math.random().toString(16).substring(2, 15)}`,
			$sequence: sequence,
			$permissions: [],
			$databaseId: "main",
			$tableId: "secrets",
			$createdAt: new Date().toISOString(),
			$updatedAt: new Date().toISOString(),
			secret,
			ttl,
			reads,
		};

		store.rows.push(row);

		return row;
	}
	
	async getSecret(id) {
    const row = store.rows.find((row) => row.$id === id);
    
    if(!row) {
      throw new Error("Secret not found");
    }
    
    return row;
	}
}
