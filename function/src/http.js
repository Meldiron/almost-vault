import Koa from "koa";
import Router from "@koa/router";
import { bodyParser } from "@koa/bodyparser";
import { getCryptographyCiphertext } from "./modules/cryptography/ciphertexts/get.js";
import { createCryptographyCiphertext } from "./modules/cryptography/ciphertexts/create.js";
import { getHealth } from "./modules/health/get.js";

export let isReady = false;

export function setupServer() {
    // Koa.js setup
    const app = new Koa();
    app.use(bodyParser());
    
    const router = new Router();
    
    // Health API
    router.get("/v1/health", getHealth);
    
    // Cryptography API
    router.get("/v1/cryptography/ciphertexts/:id", getCryptographyCiphertext);
    router.post("/v1/cryptography/ciphertexts", createCryptographyCiphertext);
    
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
    
    app.listen(4000, "0.0.0.0", undefined, () => {
      isReady = true;
    });
}

if(process.env.CI) {
  setupServer();
}