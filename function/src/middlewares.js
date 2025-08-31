export const adapterMiddleware = (app) => {
  const adapter = process.env.ADAPTER || 'memory';

  switch (adapter) {
    case 'memory':
      app.context.adapter = new MemoryAdapter();
      break;
    case 'appwrite':
      app.context.adapter = new AppwriteAdapter();
      break;
    default:
      throw new Error(`Unsupported adapter: ${adapter}`);
  }
};
