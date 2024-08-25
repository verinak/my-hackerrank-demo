import { MongoClient, Db } from 'mongodb';

let db: Db;

export const connectToDatabase = async (uri: string): Promise<Db> => {
    if (db) {
        return db;
    }
    const client = new MongoClient(uri);
    await client.connect();
    db = client.db();
    return db;
};

export const getDb = (): Db => {
    if (!db) {
        throw new Error('Database not connected. Please call connectToDatabase first.');
    }
    return db;
};
