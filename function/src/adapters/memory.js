import { Adapter } from "./adapter.js";

export class MemoryAdapter extends Adapter {
	store = {
		rows: [],
	};
	sequence = 0;

	async createSecret(secret, ttl, reads) {
		this.sequence++;

		const row = {
			$id: `sec_${Math.random().toString(16).substring(2, 15)}`,
			$sequence: this.sequence,
			$permissions: [],
			$databaseId: "main",
			$tableId: "secrets",
			$createdAt: new Date().toISOString(),
			$updatedAt: new Date().toISOString(),
			secret,
			ttl,
			reads,
		};

		this.store.rows.push(row);

		return row;
	}
}
