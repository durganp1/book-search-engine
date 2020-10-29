const express = require('express');
// import ApolloServer
const {ApolloServer} = require('apollo-server-express');
// import typeDefs and resolvers
const {typeDefs, resolvers} = require('./schemas');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;
// create a new Apollo Server and pass in our schema data
const server = new ApolloServer({
  typeDefs,
  resolvers
});

// integrate our Apollo server with the Express application as middleware
server.applyMiddleware({app});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
