import mongo from 'mongodb';
import { url, options } from '../config/dbConfig.js';

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

export async function returnBook(rent, returnDate) {
  const bookQuerry = { _id: rent.isbn };
  const updateRent = { $set: { returnDate } };
  const incCopies = { $inc: { copies: 1 } };

  const result = library.collection('rents').findOne(rent);
  if (!result) {
    throw new Error(`You have not rented book wit ISBN ${rent.isbn}`);
  }
  await library.collection('rents').updateOne(rent, updateRent);
  await library.collection('books').updateOne(bookQuerry, incCopies);
}

export function findUsers(username) {
  const filter = { _id: { $ne: username } };
  const projection = { admin: 1 };
  return library.collection('users').find(filter).project(projection).toArray();
}

export function findUser(username) {
  const query = { _id: username };
  return library.collection('users').findOne(query);
}

export function insertUser(user) {
  const query = { _id: user.username };
  const data = {
    _id: user._id,
    hashWithSalt: user.hashWithSalt,
    admin: user.admin ? user.admin : false,
  };
  return library.collection('users').findOne(query)
    .then((result) => {
      if (result === null) {
        return library.collection('users').insertOne(data);
      }
      throw new Error(`Username ${user.username} already exists.`);
    });
}

export async function updateUser(user, toUpdate) {
  const update = { $set: toUpdate };
  await library.collection('users').updateOne(user, update);
}

export function deleteUser(username) {
  const query = { _id: username };
  return library.collection('users').deleteOne(query);
}

export function findRentsOfBook(isbnToFind) {
  const query = { isbn: isbnToFind };
  return library.collection('rents').find(query).toArray();
}

export function findRentsOfUser(usernameToFind) {
  const query = {
    renter: usernameToFind,
    returnDate: { $eq: null },
  };
  return library.collection('rents').find(query).toArray();
}

export function findHistoryOfUser(usernameToFind) {
  const query = {
    renter: usernameToFind,
    returnDate: { $ne: null },
  };
  return library.collection('rents').find(query).toArray();
}

export async function updateRenter(oldUsername, newUsername) {
  const query = { renter: oldUsername };
  const update = { $set: { renter: newUsername } };
  await library.collection('rents').updateMany(query, update);
}

export function findSummary(isbn) {
  const query = { _id: isbn };
  const projection = {
    _id: 0,
    summary: 1,
  };
  return library.collection('books').find(query).project(projection).toArray();
}

export async function deleteBook(isbn) {
  const bookQuery = { _id: isbn };
  const rentQuery = { isbn };
  try {
    const bookToDelete = await library.collection('books').findOne(bookQuery);
    const [res1, res2] = await Promise.all([
      library.collection('books').deleteOne(bookQuery),
      library.collection('rents').deleteMany(rentQuery),
    ]);
    if (res1.result.ok && res2.result.ok) {
      return {
        success: true,
        message: `book with ISBN ${isbn} succesfully deleted`,
        imageName: bookToDelete.imageName,
      };
    } if (!res1.result.ok) {
      return {
        success: false,
        message: `could not delete book with ISBN ${isbn}`,
      };
    }
    return {
      success: false,
      message: `could not delete rents of book with ISBN ${isbn}`,
    };
  } catch (err) {
    return ({
      success: false,
      message: err.message,
    });
  }
}
