

// import the gql tagged template function
const {gql} = require('apollo-server-express');

// create typeDefs
const typeDefs = gql`
    type User {
        _id: ID!
        username: String!
        email: String
        bookcount: Int
        savedBooks: [Book]
    }

    type Book {
        bookId: ID!
        authors: [String]
        description: String
        image: String
        link: String
        title: String!
    }

    type Auth {
        token: ID!
        user: User
    }

    input BookInput {
        authors: [String]
        description: String!
        bookId: String
        image: String
        link: String
        title: String!
    }

    type Query {
        me: User
        users: [User]
        user(username: String!): User
        books(username: String): [Book]
        book(bookId: ID!): Book
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(bookData: BookInput!): User
        removeBook(bookId: ID!): User
    }
`;


// export the typeDefs
module.exports = typeDefs;
