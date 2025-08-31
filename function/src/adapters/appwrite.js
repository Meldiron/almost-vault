import { Client, Database } from 'node-appwrite';
import { Adapter } from './adapter';

export class AppwriteAdapter extends Adapter {
  client;
  database;
  
  constructor() {
    this.client = new Client()
      .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
      .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
      .setKey(req.headers['x-appwrite-key'] ?? '');
    this.database = new Database(this.client);
    
    super();
  }
}