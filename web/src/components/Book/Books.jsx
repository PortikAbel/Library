import React from 'react';
import autoBind from 'auto-bind';
import { deleteBook, findAllBooks } from '../../service/book.js';
import Book from './Book';
import { Field, Formik } from 'formik';
import { Table, Form, Row, Col } from 'react-bootstrap';

export default class Books extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [],
      filters: {},
    };
    autoBind(this);
  }

  async componentDidMount() {
    const books = await findAllBooks();
    this.setState({ books });
  }

  async deleteBook(index) {
    let books = [...this.state.books];
    await deleteBook(books[index]._id)
    books.splice(index, 1);
    this.setState({ books });
  }

  compare(a, b) {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  }
  
  compareBy(key) {
    if (key === 'releasedate') {
      return ((a, b) => this.compare(new Date(a[key]), new Date(b[key])));
    }
    return (a, b) => this.compare(a[key], b[key]);
  }

  filterBy(key, filter) {
    switch(key) {
      case 'dateFrom':
        return ((book) => new Date(book['releasedate']) >= new Date(filter));
      case 'dateTo':
        return (book) => new Date(book['releasedate']) <= new Date(filter);
      case 'minCopies':
        return (book) => book['copies'] >= filter;
      case 'maxCopies':
        return (book) => book['copies'] <= filter;
      default: return (book) => book[key] == filter;
    }
  }
   
  sortBy(key) {
    let books = [...this.state.books];
    books.sort(this.compareBy(key));
    this.setState({ books });
  }

  changeFilters(values) {
    let filters = {...this.state.filters};
    for (const filterKey in values) {
      filters[filterKey] = values[filterKey]
        ? values[filterKey]
        : null;
    }
    this.setState({ filters })
  }

  render() {
    let { books } = this.state;
    const { filters } = this.state;
    const { user } = this.props;

    for (const filterKey in filters) {
      if (filters[filterKey]) {
        books = books.filter(this.filterBy(filterKey, filters[filterKey]));
      }
    }

    return (
      <Formik
        initialValues= {{
          _id: null, title: null, author: null,
          dateFrom: null, dateTo: null,
          minCopies: null, maxCopies: null,
        }}

        onSubmit={(values) => this.changeFilters(values)}
      >
        {({ handleSubmit }) => {
            return (
              <form onSubmit={handleSubmit}>
                <Table striped bordered responsive>
                  <thead>
                    <tr>
                      <th onClick={() => this.sortBy('_id')}>
                        <Form.Group as={Row}>
                          <Col>ISBN</Col>
                        </Form.Group>
                        <Field type="text" name="_id"/>
                      </th>
                      <th onClick={() => this.sortBy('title')}>
                        <Form.Group as={Row}>
                          <Col>Title</Col>
                        </Form.Group>
                        <Field type="text" name="title"/>
                      </th>
                      <th onClick={() => this.sortBy('author')}>
                        <Form.Group as={Row}>
                          <Col>Author</Col>
                        </Form.Group>
                        <Field type="text" name="author"/>
                      </th>
                      <th onClick={() => this.sortBy('releasedate')}>
                        <Form.Group as={Row}>
                          <Col>Release date</Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                          <Form.Label column sm={3}>from:&nbsp;</Form.Label>
                          <Col sm={9}><Field type="date" name="dateFrom"/></Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                          <Form.Label column sm={3}>to:&nbsp;</Form.Label>
                          <Col sm={9}><Field type="date" name="dateTo"/></Col>
                        </Form.Group>
                      </th>
                      <th onClick={() => this.sortBy('copies')}>
                        <Form.Group as={Row}>
                          <Col>Number of copies</Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                          <Form.Label column sm={2}>min:&nbsp;</Form.Label>
                          <Col sm={1}><Field type="number" name="minCopies"/></Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                          <Form.Label column sm={2}>min:&nbsp;</Form.Label>
                          <Col sm={1}><Field type="number" name="maxCopies"/></Col>
                        </Form.Group>
                      </th>
                      <th>
                        <Form.Group as={Row}>
                          <Col>Cover</Col>
                        </Form.Group></th>
                      <th>
                        <Form.Group as={Row}>
                          <Col>
                          <button type="submit" className="btn btn-primary">Search</button>
                          </Col>
                        </Form.Group>
                      </th>
                    </tr>
                  </thead>
                  {books.length === 0
                  ? <div>No books to show.</div>
                  : <tbody id="container">
                      {books.map((book, i) => (
                        <Book
                          key={book._id}
                          book={book}
                          user={user}
                          deleteBook={this.deleteBook}
                          index={i}
                        />
                      ))}
                    </tbody>
                  }
                </Table>
              </form>
          )}}
      </Formik>
    );
  }
}
