export class Adapter {
	async createSecret(_secret, _ttl, _reads) {}
	async getSecret(_id) {}
	async decreaseSecretReads(_id) {}
	async ping() {}
}
