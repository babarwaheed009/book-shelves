import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { registerAction } from "@/redux/actions/RegisterAction";

export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const {
        type,
        payload: { status },
      } = await dispatch(registerAction(data));
      if (type === "auth/signup/fulfilled") {
        if (status == 201) {
          router.push("/signIn");
        }
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      setError("password", {
        type: "server",
        message: error.response.data.message,
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4 text-black">Sign Up</h1>
      <form className="max-w-md w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
            Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Enter your Name"
            className={`w-full p-2 border rounded-md text-black ${
              errors?.name ? "border-red-500" : "border-gray-300"
            }`}
            {...register("name", {
              required: {
                value: true,
                message: "Required",
              },
            })}
          />
          {errors?.name && (
            <span className="text-red-500 text-sm">{errors?.name.message}</span>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Enter your email"
            className={`w-full p-2 border rounded-md text-black ${
              errors?.email ? "border-red-500" : "border-gray-300"
            }`}
            {...register("email", {
              required: {
                value: true,
                message: "Required",
              },
              pattern: { value: /^\S+@\S+$/i, message: "Invalid Email" },
            })}
          />
          {errors?.email && (
            <span className="text-red-500 text-sm">
              {errors?.email.message}
            </span>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 font-bold mb-2"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Enter your password"
            className={`w-full p-2 border rounded-md text-black ${
              errors?.password ? "border-red-500" : "border-gray-300"
            }`}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          {errors?.password && (
            <span className="text-red-500 text-sm">
              {errors?.password.message}
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
          {isLoading ? "Loading..." : "Sign Up"}
        </button>
      </form>
      <p className="mt-4 text-black">
        I have already account.{" "}
        <Link href={"/signIn"} className="text-blue-500">
          Login
        </Link>
      </p>
    </div>
  );
}
