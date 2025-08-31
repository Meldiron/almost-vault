import { Adapter } from "./adapter";

export class AppwriteAdapter extends Adapter {
	store;

	constructor() {
		super();

		this.store = {
			rows: [],
		};
	}
}
