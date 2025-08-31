import Koa from "koa";
import Axios from "axios";
import Router from "@koa/router";
import { bodyParser } from "@koa/bodyparser";
import { getCryptographyCiphertext } from "./modules/cryptography/ciphertexts/get.js";
import { createCryptographyCiphertext } from "./modules/cryptography/ciphertexts/create.js";

// Koa.js setup
const app = new Koa();
app.use(bodyParser());

// Cryptography API
const router = new Router();
router.get("/cryptography/ciphertexts/:id", getCryptographyCiphertext);
router.post("/cryptography/ciphertexts", createCryptographyCiphertext);

app.use(router.routes()).use(router.allowedMethods());

app.use((ctx) => {
	ctx.status = 404;
	ctx.body = "404 Not found";
});

app.on("error", (err, ctx) => {
	console.log(err);
	ctx.status = 500;
	ctx.body = "Internal Server Error";
});

let isReady = false;
app.listen(4000, "0.0.0.0", undefined, () => {
	isReady = true;
});

async function onceReady() {
	if (isReady) return;
	await new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, 100);
	});

	return await onceReady();
}

// Appwrite Function proxy to Koa.js
export default async (context) => {
	await onceReady();

	try {
		const res = await Axios({
			method: context.req.method,
			url: `http://127.0.0.1:4000${context.req.path ? context.req.path : "/"}`,
			headers: context.req.headers,
			data: context.req.bodyText,
			validateStatus: (status) => {
				return status >= 200 && status < 500;
			},
		});

		const body =
			typeof res.data === "string" ? res.data : JSON.stringify(res.data);
		const headers = res.headers;
		const code = res.status;

		return context.res.send(body, code, headers);
	} catch (err) {
		return context.res.send(err.message, err.status, {});
	}
};
