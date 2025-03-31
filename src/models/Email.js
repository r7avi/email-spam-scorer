const clientPromise = require('../lib/mongodb');

const COLLECTION_NAME = 'emails';

class Email {
  constructor(data) {
    this.id = data.id;
    this.address = data.address;
    this.from = data.from;
    this.subject = data.subject;
    this.content = data.content;
    this.headers = data.headers;
    this.score = data.score;
    this.analysis = data.analysis;
    this.createdAt = new Date();
  }

  static async create(data) {
    const client = await clientPromise;
    const collection = client.db().collection(COLLECTION_NAME);
    const email = new Email(data);
    await collection.insertOne(email);
    return email;
  }

  static async findByAddress(address) {
    const client = await clientPromise;
    const collection = client.db().collection(COLLECTION_NAME);
    return collection.find({ address }).toArray();
  }

  static async findById(id) {
    const client = await clientPromise;
    const collection = client.db().collection(COLLECTION_NAME);
    return collection.findOne({ id });
  }
}

module.exports = { Email }; 