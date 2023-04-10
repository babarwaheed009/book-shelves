import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";
import axios from "axios";
import { API_URL } from "@/config";
import toastr from 'toastr';

export default function addBook() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.auth.user);

  const genres = useQuery("genre", fetchGenres, {
    enabled: !!axios.defaults.headers.common["Authorization"],
    refetchOnWindowFocus: false,
  });

  async function fetchGenres() {
    try {
      let response = await axios.get(`${API_URL}/api/genres`);
      return response.data.data;
    } catch (error) {}
  }

  const onSubmit = async (data) => {
    let {book_img} = data;
    data = {...data, book_img: book_img[0]};
    console.log(data);
    try {
      setIsLoading(true);
      const response = await axios.post(`${API_URL}/api/book`, {
        ...data,
        user_id: user?.id,
      }, {headers: { 'Content-Type': 'multipart/form-data' }});
      if(response.status == 201){
        toastr.success("Book Created Successfully");
        reset();
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      toastr.error(error.response.data.message)
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-5">
      <h1 className="text-2xl font-bold mb-4 text-black">Add Book</h1>
      <form className="max-w-md w-full" onSubmit={handleSubmit(onSubmit)}  encType="multipart/form-data">
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
            Title
          </label>
          <input
            id="title"
            type="text"
            name="title"
            placeholder="Enter Title"
            className={`w-full p-2 border rounded-md text-black ${
              errors?.title ? "border-red-500" : "border-gray-300"
            }`}
            {...register("title", {
              required: {
                value: true,
                message: "Required",
              },
            })}
          />
          {errors?.title && (
            <span className="text-red-500 text-sm">
              {errors?.title.message}
            </span>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
            Author
          </label>
          <input
            id="author"
            type="text"
            name="author"
            placeholder="Enter Author"
            className={`w-full p-2 border rounded-md text-black ${
              errors?.author ? "border-red-500" : "border-gray-300"
            }`}
            {...register("author", {
              required: {
                value: true,
                message: "Required",
              },
            })}
          />
          {errors?.author && (
            <span className="text-red-500 text-sm">
              {errors?.author.message}
            </span>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
            Publication House
          </label>
          <input
            id="pub_house"
            type="text"
            name="pub_house"
            placeholder="Enter Publication House"
            className={`w-full p-2 border rounded-md text-black ${
              errors?.pub_house ? "border-red-500" : "border-gray-300"
            }`}
            {...register("pub_house", {
              required: {
                value: true,
                message: "Required",
              },
            })}
          />
          {errors?.pub_house && (
            <span className="text-red-500 text-sm">
              {errors?.pub_house.message}
            </span>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
            Publication Date
          </label>
          <input
            id="pub_date"
            type="date"
            name="pub_date"
            className={`w-full p-2 border rounded-md text-black ${
              errors?.pub_date ? "border-red-500" : "border-gray-300"
            }`}
            {...register("pub_date", {
              required: {
                value: true,
                message: "Required",
              },
            })}
          />
          {errors?.pub_date && (
            <span className="text-red-500 text-sm">
              {errors?.pub_date.message}
            </span>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
            Publication Date
          </label>
          <input
            id="book_img"
            type="file"
            name="book_img"
            accept="image/png, image/jpeg"
            className={`w-full p-2 border rounded-md text-black ${
              errors?.book_img ? "border-red-500" : "border-gray-300"
            }`}
            {...register("book_img", {
              required: {
                value: true,
                message: "Required",
              },
            })}
          />
          {errors?.book_img && (
            <span className="text-red-500 text-sm">
              {errors?.book_img.message}
            </span>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
            Genre
          </label>
          <select
            className={`w-full p-2 border rounded-md text-black ${
              errors?.genre ? "border-red-500" : "border-gray-300"
            }`}
            name="genre_id"
            id="genre_id"
            {...register("genre_id", {
              required: {
                value: true,
                message: "Required",
              },
            })}
          >
            <option value="">Select Genre</option>
            {genres.isFetched &&
              genres.data &&
              genres.data.map((genre, index) => {
                return (
                  <option value={genre.id} key={index}>
                    {genre.name}
                  </option>
                );
              })}
          </select>
          {errors?.genre_id && (
            <span className="text-red-500 text-sm">
              {errors?.genre_id.message}
            </span>
          )}
        </div>
        <button
          type="submit"
          className={`w-full p-2 mt-4 text-white font-bold rounded-md ${
            isLoading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-700"
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Save"}
        </button>
      </form>
    </div>
  );
}
