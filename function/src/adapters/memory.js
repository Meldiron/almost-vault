import { Adapter } from "./adapter.js";

export class MemoryAdapter extends Adapter {
	store;

	constructor() {
		super();

		this.store = {
			rows: [],
		};
	}
}
