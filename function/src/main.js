import Koa from 'koa';
import Axios from 'axios';

const app = new Koa();

app.use(async ctx => {
  ctx.body = 'Hello World';
});

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
