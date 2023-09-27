const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const Author = require("./models/author");
const Book = require("./models/book");

require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;

console.log(MONGODB_URI);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB", error.message);
  });

let authors = [
  {
    name: "Robert Martin",
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: "Martin Fowler",
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963,
  },
  {
    name: "Fyodor Dostoevsky",
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821,
  },
  {
    name: "Joshua Kerievsky", // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  {
    name: "Sandi Metz", // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
];

let books = [
  {
    title: "Clean Code",
    published: 2008,
    author: "Robert Martin",
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Agile software development",
    published: 2002,
    author: "Robert Martin",
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ["agile", "patterns", "design"],
  },
  {
    title: "Refactoring, edition 2",
    published: 2018,
    author: "Martin Fowler",
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Refactoring to patterns",
    published: 2008,
    author: "Joshua Kerievsky",
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "patterns"],
  },
  {
    title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
    published: 2012,
    author: "Sandi Metz",
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "design"],
  },
  {
    title: "Crime and punishment",
    published: 1866,
    author: "Fyodor Dostoevsky",
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "crime"],
  },
  {
    title: "The Demon ",
    published: 1872,
    author: "Fyodor Dostoevsky",
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "revolution"],
  },
];

const typeDefs = `

type Author {
  name: String
  id: ID!
  born: Int
  bookCount: Int
}

type Book {
  title: String!
  author: Author!
  published: Int!
  id: String!
  genres: [String!]!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book

    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }
`;

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),

    allBooks: async (root, args) => {
      if (args.author) {
        const author = await Author.find({ name: args.author });

        return Book.find({ author: author._id });
      } else {
        return Book.find({});
      }
    },
    allAuthors: async (root, args) => {
      return Author.find({});
    },
  },
  /*
  Book: {
    author: ({ name, born }) => {
      return {
        title,
        author: { name, born },
        published,
        id,
        genres,
      };
    },
  },
*/
  Author: {
    bookCount: async (root) => {
      const countedBooks = await Book.find({ author: root._id });
      return countedBooks.length;
    },
  },

  Mutation: {
    addBook: async (root, args) => {
      const author = await Author.findOne({ name: args.author });
      if (!author) {
        const author = new Author({ name: args.author });
        author.save();
      }
      const book = new Book({
        ...args,
        author: author,
      });
      console.log(book);
      return book.save();
    },

    /*
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allBooks: (root, args) => {
      if (args.author) {
        return books.filter((b) => b.author === args.author);
      }
      if (args.genre) {
        return books.filter((b) => b.genres.includes(args.genre));
      } else {
        return books;
      }
    },
    allAuthors: () => authors,
  },
  /*
  Book: {
    author: (root) => {
      return authors.find(author => book.author === root.name)
      }
    },

  Author: {
    bookCount: (root) => {
      const countedBooks = books.filter((book) => book.author === root.name);
      return countedBooks.length;
    },
  },
*/
    /*
  Mutation: {
    addBook: (root, args) => {
      const book = { ...args };
      books = books.concat(book);

      if (!authors.includes(args.author)) {
        const newAuthor = { name: args.author };
        authors = authors.concat(newAuthor);
      }
      return book;
    },
    */
    editAuthor: (root, args) => {
      const updatedAuthor = authors.find((author) => author.name === args.name);
      updatedAuthor.born = args.setBornTo;
      authors = authors.map((author) =>
        author.name !== updatedAuthor.name ? author : updatedAuthor
      );

      return updatedAuthor;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
