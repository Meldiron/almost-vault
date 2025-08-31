import * as z from "zod";

const Body = z.object({
  secret: z.string().min(1).max(2048),
  reads: z.number().min(1).max(1000),
  ttl: z.enum(["hour", "day", "week", "month", "year"])
});

export const createCryptographyCiphertext = async (ctx) => {
  let body;
  
  try {
    body = Body.parse(ctx.request.body);
  } catch (err) {
    ctx.res.statusCode = 400;
    ctx.res.body = err.message;
    return;
  }
  
  ctx.response.body = {
    secret: body.secret,
    reads: body.reads,
    ttl: body.ttl
  }
};
