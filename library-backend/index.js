const { ApolloServer, gql, UserInputError } = require('apollo-server')
const { v1: uuid } = require('uuid')
require('dotenv/config')
const mongoose = require('mongoose')
const Author = require('./models/Author')
const Book = require('./models/Book')
const User = require('./models/User')
const jwt = require('jsonwebtoken')

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
    findUser(token: String!): User
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
        password: String!
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
              return Book.find({}).populate('author')
          } else if (!args.genre) {
            const searchedAuthor = await Author.findOne({ name: args.author })
            return Book.find({ author: searchedAuthor._id }).populate('author')
          } else if (!args.author) {
              const books = await Book.find({ genres: { $in: args.genre } }).populate('author')
              return books
          } else {
              const author = await Author.findOne({ name: args.author })
              const books = await Book.find({ genres: { $in: args.genre }, author: author._id }) .populate('author')
              return books
          }
          
      },
      allAuthors: () => Author.find({}),
      findUser: async (root, args) => {
        const decodedToken = jwt.verify(args.token, process.env.JWT_SECRET)
        const user = await User.findById(decodedToken.id)
        if (!user) {
          throw new UserInputError("User not found")
        }
        return user
      },
      me: (root, args, context) => {
        return context.user
      },
  },
  Author: {
      bookCount: (root) => {
        const books = Book.find({ author: root._id })
        return books.countDocuments()
      }
  },
  Book: {
    author:  (root) => {
      if(!root.author.born){
        return {
          name: root.author.name,
          born: null
        }
      } else {
        return {
          name: root.author.name,
          born: root.author.born
        }
      }
        
      
    }
  },
  Mutation: {
      addBook: async (root, args, { user }) => {
        let author = await Author.findOne({ name: args.name })
        if(!user) {
          throw new UserInputError("Not logged in!")
        }
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
      editAuthor: async (root, args, { user }) => {
          if (!user) {
            throw new UserInputError("Not logged in!")
          }
          const authorToEdit = await Author.findOne({ name: args.name })
          if(!authorToEdit) {
              return null
          } 
          authorToEdit.born = args.setBornTo
          try {
            await authorToEdit.save()
          } catch (e) {
            throw new UserInputError(e.message, {
              invalidArgs: args
            })
          }
          return authorToEdit
      },
      createUser: async (root, args) => {
        const newUser = new User({ username: args.username, favoriteGenre: "sci-fi", password: "12345678"})
        try {
          await newUser.save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args
          })
        }
        return newUser
      },
      login: async (root, args) => {
        const user = await User.findOne({ username: args.username})

        if(!user || args.password !== "12345678"){
          throw new UserInputError("Invalid credentials")
        }

        const userForToken = {
          username: user.username,
          id: user._id,
          favoriteGenre: user.favoriteGenre
        }

        return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
      }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null 
    if ( auth && auth.toLowerCase().startsWith('bearer ')){
      const decodedToken = jwt.verify(
        auth.substring(7), process.env.JWT_SECRET
      )
      const user = await User.findById(decodedToken.id)
      return { user }
    }
  }
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})