import { useState } from "react";
import { useQuery } from "@apollo/client";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { ALL_AUTHORS, ALL_BOOKS, CREATE_BOOK } from "./queries";

const App = () => {
  const [page, setPage] = useState("authors");

  const authors = useQuery(
    ALL_AUTHORS
    /*    , {
    pollInterval: 2000,
  }
*/
  );
  const books = useQuery(
    ALL_BOOKS
    /*    , {
    pollInterval: 2000,
  }
*/
  );

  if (authors.loading) {
    return <div>loading...</div>;
  }

  if (books.loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button>
      </div>

      <Authors show={page === "authors"} authors={authors.data.allAuthors} />

      <Books show={page === "books"} books={books.data.allBooks} />

      <NewBook show={page === "add"} create_book={CREATE_BOOK} />
    </div>
  );
};

export default App;
