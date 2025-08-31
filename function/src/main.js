import Axios from "axios";

import { isReady, setupServer } from "./http.js";

setupServer();

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
