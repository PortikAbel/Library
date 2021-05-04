import mongo from 'mongodb';

const url = 'mongodb://localhost:27017/';
const options = { useNewUrlParser: true, useUnifiedTopology: true };
const dbo = mongo.MongoClient(url, options);
let library;

export default async function connectDb() {
  try {
    library = await dbo.connect();
    library = library.db('library');
  } catch (err) {
    console.log('Could not connect to database.');
  }
}

export function findBooks() {
  return library.collection('books').find().toArray();
}

export function insertBook(newBook) {
  return library.collection('books').insertOne(newBook);
}

export function rentBook(rent) {
  const query = { _id: rent.isbn };
  const dec = { $inc: { copies: -1 } };

  return library.collection('books').findOne(query)
    .then((result) => {
      if (result === null || result.copies <= 0) {
        throw new Error(`Book with ISBN ${rent.isbn} not found in our library right now.`);
      }
    })
    .then(() => library.collection('books').updateOne(query, dec))
    .then(() => library.collection('users').findOne({ _id: rent.renter }))
    .then((result) => {
      if (!result) {
        library.collection('users').insertOne({ _id: rent.renter });
      }
    })
    .then(() => library.collection('rents').insertOne(rent));
}

export function returnBook(rent) {
  const bookQuerry = { _id: rent.isbn };
  const inc = { $inc: { copies: 1 } };

  return library.collection('rents').deleteOne(rent)
    .then((result) => {
      if (result.deletedCount < 1) {
        throw new Error(`User ${rent.renter} has not rented book wit ISBN ${rent.isbn}`);
      }
      library.collection('books').updateOne(bookQuerry, inc);
    });
}

export function findUsers() {
  return library.collection('users').find().toArray();
}

export function insertUser(username) {
  const query = { _id: username };
  return library.collection('users').findOne(query)
    .then((result) => {
      if (result === null) {
        return library.collection('users').insertOne(query);
      }
      throw new Error(`User ${username} already signed in.`);
    });
}

export function deleteUser(username) {
  const query = { _id: username };
  return library.collection('users').deleteOne(query);
}

export function findRentsOf(isbnToFind) {
  const query = { isbn: isbnToFind };
  return library.collection('rents').find(query).toArray();
}