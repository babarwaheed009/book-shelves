import Image from "next/image";
import { Inter } from "next/font/google";
import { useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { API_URL } from "@/config";
import axios from "axios";

async function fetchBooks({ queryKey }) {
  let [key, user_id] = queryKey;
  try {
    let response = await axios.get(`${API_URL}/api/books/${user_id}`);
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
}

async function updateBook({ book_id, status, user_id, queryClient }) {
  try {
    let response = await axios.post(`${API_URL}/api/book/change-status`, {
      book_id,
      status,
      user_id,
    });
    if (response.status == 200) {
      queryClient.refetchQueries("books");
    }
    return response;
  } catch (error) {
    console.log(error);
  }
}

async function fetchGenres() {
  try {
    let response = await axios.get(`${API_URL}/api/genres`);
    return response.data.data;
  } catch (error) {}
}

export default function Home() {
  const auth = useSelector((state) => state.auth);
  const queryClient = useQueryClient();
  const [books, setBooks] = useState({
    planToRead: [],
    reading: [],
    completed: [],
  });
  const [fetchData, setFetchData] = useState(false);
  const { data } = useQuery(["books", auth.user?.id], fetchBooks, {
    enabled: fetchData,
    refetchOnWindowFocus: false,
  });

  const genres = useQuery("genre", fetchGenres, {
    enabled: fetchData,
    refetchOnWindowFocus: false,
  });

  const updateBookStatus = useMutation(updateBook);

  useEffect(() => {
    if (axios.defaults.headers.common["Authorization"]) {
      setFetchData(true);
    }
  }, [axios.defaults.headers.common["Authorization"]]);

  const setBookList = (books_array) => {
    let planToRead = books_array.filter((book) => book.status == 0);
    let reading = books_array.filter((book) => book.status == 1);
    let completed = books_array.filter((book) => book.status == 2);
    setBooks({ planToRead, reading, completed });
  };

  useEffect(() => {
    if (data) {
      setBookList(data);
    }
  }, [data]);

  const changeStatus = useCallback(
    async (book_id, status) => {
      updateBookStatus.mutate({
        book_id,
        status,
        user_id: auth.user?.id,
        queryClient,
      });
    },
    [updateBookStatus, auth.user?.id, queryClient]
  );

  const filterBooks = useCallback(
    (e) => {
      const value = e.target.value.toLowerCase();

      const filteredBooks = data.reduce((acc, book) => {
        const genreName =
          genres.data.find((genre) => genre.id === book.genre_id)?.name || "";
        const bookData = { ...book, genre: genreName };
        const { title, author, genre } = bookData;
        if (
          title.toLowerCase().includes(value) ||
          author.toLowerCase().includes(value) ||
          genre.toLowerCase().includes(value)
        ) {
          acc.push(bookData);
        }
        return acc;
      }, []);

      setBookList(filteredBooks);
    },
    [data, genres]
  );

  const sortBooks = useCallback(
    (e) => {
      const value = e.target.value;
      setBooks((prevBooks) => {
        const newObject = {};
        for (const key in prevBooks) {
          newObject[key] = prevBooks[key].sort((a, b) =>
            a[value] > b[value] ? 1 : -1
          );
        }
        return newObject;
      });
    },
    [setBooks]
  );

  return (
    <main className="flex flex-col items-center justify-between p-16">
      <div className="w-1/3 ml-auto flex gap-6">
        <input
          type="text"
          placeholder="Search"
          className="w-full p-2 border rounded-md text-black"
          onChange={filterBooks}
        />
        <select
          className={`w-full p-2 border rounded-md text-black `}
          name="sorting"
          onChange={sortBooks}
          id="sorting"
        >
          <option value="">Sort By</option>
          <option value="title">Title</option>
          <option value="author">Author</option>
        </select>
      </div>
      <div className="w-full">
        <h1 className="text-lg text-black">Plan to Read</h1>
        <div className="grid grid-cols-3 gap-4 w-full mt-3">
          {books.planToRead.map((book, index) => {
            return (
              <div key={index}>
                <div className="bg-white shadow-md rounded-md overflow-hidden relative">
                  <img
                    src={`/images/${book.image}`}
                    alt="Example Image"
                    className="w-full h-40 object-cover"
                  />
                  <div className="flex justify-end absolute right-3 top-3">
                    <div className="relative action-btn">
                      <button
                        className="bg-gray-100 text-gray-600 rounded-md py-2 px-4 hover:bg-gray-200 transition duration-150 ease-in-out"
                        aria-label="Action"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 6c0-.6.4-1 1-1h12c.6 0 1 .4 1 1s-.4 1-1 1H4c-.6 0-1-.4-1-1zM4 11c-.6 0-1-.4-1-1s.4-1 1-1h12c.6 0 1 .4 1 1s-.4 1-1 1H4zm1 4c0-.6.4-1 1-1h8c.6 0 1 .4 1 1s-.4 1-1 1H6c-.6 0-1-.4-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      <div className="absolute right-0 top-6 w-48 mt-2 py-2 bg-white rounded-md shadow-lg z-10 action-dropdown">
                        <button
                          type="button"
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                          onClick={() => changeStatus(book.id, 1)}
                        >
                          Reading
                        </button>
                        <button
                          type="button"
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                          onClick={() => changeStatus(book.id, 2)}
                        >
                          Completed
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <h2 className="text-black">Title: {book.title}</h2>
                <h2 className="text-black">Author: {book.author}</h2>
                {genres.data && (
                  <h2 className="text-black">
                    Genre:{" "}
                    {
                      genres.data.find((genre) => genre.id == book.genre_id)
                        ?.name
                    }
                  </h2>
                )}
              </div>
            );
          })}
        </div>
        {books.planToRead.length < 1 && (
          <div className="bg-gray-100 rounded-lg p-4 m-2">
            <h2 className="text-lg font-semibold mb-2 text-black capitalize text-center">
              No Record Found
            </h2>
          </div>
        )}
      </div>
      <div className="w-full mt-5">
        <h1 className="text-lg text-black">Reading</h1>
        <div className="grid grid-cols-3 gap-4 w-full mt-3">
          {books.reading.map((book, index) => {
            return (
              <div key={index}>
                <div className="bg-white shadow-md rounded-md overflow-hidden relative">
                  <img
                    src={`/images/${book.image}`}
                    alt="Example Image"
                    className="w-full h-40 object-cover"
                  />
                  <div className="flex justify-end absolute right-3 top-3">
                    <div className="relative action-btn">
                      <button
                        className="bg-gray-100 text-gray-600 rounded-md py-2 px-4 hover:bg-gray-200 transition duration-150 ease-in-out"
                        aria-label="Action"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 6c0-.6.4-1 1-1h12c.6 0 1 .4 1 1s-.4 1-1 1H4c-.6 0-1-.4-1-1zM4 11c-.6 0-1-.4-1-1s.4-1 1-1h12c.6 0 1 .4 1 1s-.4 1-1 1H4zm1 4c0-.6.4-1 1-1h8c.6 0 1 .4 1 1s-.4 1-1 1H6c-.6 0-1-.4-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      <div className="absolute right-0 top-6 w-48 mt-2 py-2 bg-white rounded-md shadow-lg z-10 action-dropdown">
                        <button
                          type="button"
                          onClick={() => changeStatus(book.id, 0)}
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                        >
                          Plan to read
                        </button>
                        <button
                          type="button"
                          onClick={() => changeStatus(book.id, 2)}
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                        >
                          Completed
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <h2 className="text-black">Title: {book.title}</h2>
                <h2 className="text-black">Author: {book.author}</h2>
                {genres.data && (
                  <h2 className="text-black">
                    Genre:{" "}
                    {
                      genres.data.find((genre) => genre.id == book.genre_id)
                        ?.name
                    }
                  </h2>
                )}
              </div>
            );
          })}
        </div>
        {books.reading.length < 1 && (
          <div className="bg-gray-100 rounded-lg p-4 m-2">
            <h2 className="text-lg font-semibold mb-2 text-black capitalize text-center">
              No Record Found
            </h2>
          </div>
        )}
      </div>
      <div className="w-full mt-5">
        <h1 className="text-lg text-black">Completed</h1>
        <div className="grid grid-cols-3 gap-4 w-full mt-3">
          {books.completed.map((book, index) => {
            return (
              <div key={index}>
                <div className="bg-white shadow-md rounded-md overflow-hidden relative">
                  <img
                    src={`/images/${book.image}`}
                    alt="Example Image"
                    className="w-full h-40 object-cover"
                  />
                  <div className="flex justify-end absolute right-3 top-3">
                    <div className="relative action-btn">
                      <button
                        className="bg-gray-100 text-gray-600 rounded-md py-2 px-4 hover:bg-gray-200 transition duration-150 ease-in-out"
                        aria-label="Action"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 6c0-.6.4-1 1-1h12c.6 0 1 .4 1 1s-.4 1-1 1H4c-.6 0-1-.4-1-1zM4 11c-.6 0-1-.4-1-1s.4-1 1-1h12c.6 0 1 .4 1 1s-.4 1-1 1H4zm1 4c0-.6.4-1 1-1h8c.6 0 1 .4 1 1s-.4 1-1 1H6c-.6 0-1-.4-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      <div className="absolute right-0 top-6 w-48 mt-2 py-2 bg-white rounded-md shadow-lg z-10 action-dropdown">
                        <button
                          type="button"
                          onClick={() => changeStatus(book.id, 0)}
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                        >
                          Plan to read
                        </button>
                        <button
                          type="button"
                          onClick={() => changeStatus(book.id, 1)}
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                        >
                          Reading
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <h2 className="text-black">Title: {book.title}</h2>
                <h2 className="text-black">Author: {book.author}</h2>
                {genres.data && (
                  <h2 className="text-black">
                    Genre:{" "}
                    {
                      genres.data.find((genre) => genre.id == book.genre_id)
                        ?.name
                    }
                  </h2>
                )}
              </div>
            );
          })}
        </div>
        {books.completed.length < 1 && (
          <div className="bg-gray-100 rounded-lg p-4 m-2">
            <h2 className="text-lg font-semibold mb-2 text-black capitalize text-center">
              No Record Found
            </h2>
          </div>
        )}
      </div>
    </main>
  );
}
