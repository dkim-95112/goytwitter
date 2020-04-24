export interface Tweet {
  body_text: string;
}

// for now https://mongodb.github.io/node-mongodb-native/3.6/api/ObjectID.html
interface ObjectId {
  _bsontype: string;
  id: string;
}

export interface CreateTweetResponse {
  // for now - https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#~insertWriteOpRes
  insertedCount: number;
  ops: object[];
  insertedIds: {
    [key: number]: number | ObjectId;
  };
  result: {
    ok: number;
    n: number;
  };
}
