const { ApolloServer, gql, UserInputError } = require('apollo-server')
const { v1: uuid } = require('uuid')
require('dotenv/config')
const mongoose = require('mongoose')
const Author = require('./models/Author')
const Book = require('./models/Book')
const User = require('./models/User')

mongoose.set('useCreateIndex', true);

mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = gql`
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Book {
      title: String!
      author: Author!
      published: Int!
      id: ID!
      genres: [String!]!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
      addBook(
          title: String!
          name: String!
          born: Int
          published: Int!
          genres: [String!]!
      ): Book
      editAuthor(
          name: String!
          setBornTo: Int!
      ): Author
      createUser(
        username: String!
        favoriteGenre: String!
      ): User
      login(
        username: String!
        password: String!
      ): Token
  }
`

const resolvers = {
  Query: {
      bookCount: () => Book.collection.countDocuments(),
      authorCount: () => Author.collection.countDocuments(),
      allBooks: async (root, args) => {
          if (!args.author && !args.genre) {
              return Book.find({})
          } else if (!args.genre) {
            const searchedAuthor = await Author.findOne({ name: args.author })
            return Book.find({ author: searchedAuthor._id })
          } else if (!args.author) {
              const books = await Book.find({ genres: { $in: args.genre } })
              return books
          } else {
              const author = await Author.findOne({ name: args.author })
              const books = await Book.find({ genres: { $in: args.genre }, author: author._id })
              return books
          }
          
      },
      allAuthors: () => Author.find({})
  },
  Author: {
      bookCount: (root) => {
        const books = Book.find({ author: root._id })
        return books.countDocuments()
      }
  },
  Book: {
    author: (root) => {
      return {
        name: root.author.name,
        born: root.author.born
      }
    }
  },
  Mutation: {
      addBook: async (root, args) => {
        let author = await Author.findOne({ name: args.name })
        if(!author) {
          author = new Author({name: args.name, born: args.born})
          const book = new Book({...args, author: author})
          try {
            await book.save()
            await author.save()
          } catch (error) {
            throw new UserInputError(error.message, {
              invalidArgs: args
            })
          }
          
          return book
        }
        const book = new Book({...args, author: author})
        try{
          await book.save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args
          })
        }
        return book
      },
      editAuthor: async (root, args) => {
          const authorToEdit = await Author.findOne({ name: args.name })
          if(!authorToEdit) {
              return null
          } 
          authorToEdit.born = args.setBornTo
          try {
            await authorToEdit.save()
          } catch (e) {
            throw new UserInputError(error.message, {
              invalidArgs: args
            })
          }
          return authorToEdit
      }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})