import Koa from 'koa';
import Axios from 'axios';
import { adapterMiddleware } from './middlewares';
import * as _ from 'koa-route';
import { getCryptographyCiphertext } from './modules/cryptography/ciphertexts/get';
import { createCryptographyCiphertext } from './modules/cryptography/ciphertexts/create';

// Koa.js setup
const app = new Koa();
app.use(adapterMiddleware);
app.use(_.post('/cryptography/ciphertexts', createCryptographyCiphertext));
app.use(_.get('/cryptography/ciphertexts/:id', getCryptographyCiphertext));

let isReady = false;
app.listen(4000, '0.0.0.0', undefined, () => {
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

  const res = await Axios({
    method: context.req.method,
    url: 'http://127.0.0.1:4000' + (context.req.path ? context.req.path : '/'),
    headers: context.req.headers
  });

  const body = typeof res.data === 'string' ? res.data : JSON.stringify(res.data);
  const headers = res.headers;
  const code = res.status;

  return context.res.send(body, code, headers);
};
