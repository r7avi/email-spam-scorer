const { initConnection } = require('../lib/mongodb');

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

  static async create(emailData) {
    try {
      const { db } = await initConnection();
      const result = await db.collection(COLLECTION_NAME).insertOne(emailData);
      return result;
    } catch (error) {
      console.error('Error creating email:', error);
      throw error;
    }
  }

  static async find(query = {}) {
    try {
      const { db } = await initConnection();
      return await db.collection(COLLECTION_NAME).find(query).toArray();
    } catch (error) {
      console.error('Error finding emails:', error);
      throw error;
    }
  }

  static async findOne(query) {
    try {
      const { db } = await initConnection();
      return await db.collection(COLLECTION_NAME).findOne(query);
    } catch (error) {
      console.error('Error finding email:', error);
      throw error;
    }
  }
}

module.exports = { Email }; 