import { API_URL } from "@/config";
import { resetSlicer } from "@/redux/reducers/AuthSlice";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Header = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const auth = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);

  const deleteAccount = async () => {
    try {
      let response = await axios.delete(
        `${API_URL}/auth/users/${auth.user?.id}`
      );
      if (response.status == 200) {
        signOut();
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  const signOut = () => {
    dispatch(resetSlicer());
    axios.defaults.headers.common["Authorization"] = false;
    router.push("/signIn");
  };

  return (
    <header className="bg-gray-900 text-white flex items-center justify-between px-4 py-3">
      <div className="flex items-center">
        <Link href="/" className="text-xl font-bold tracking-wide">
          Books
        </Link>
      </div>
      <div className="flex items-center gap-5">
        <Link
          href={"/addBook"}
          className="flex items-center justify-center bg-blue-900 rounded p-2"
        >
          Add Book
        </Link>
        <div className="relative inline-block text-left">
          <div>
            <button
              className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800"
              onClick={() => setIsOpen(!isOpen)}
            >
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
          </div>
          <div
            className={`dropdown-menu absolute right-0 z-10 w-56 mt-2 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${
              isOpen ? "block" : "hidden"
            }`}
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
            tabIndex="-1"
          >
            <div className="py-1" role="none">
              <button
                type="button"
                className="text-gray-700 block px-4 py-2 text-sm"
                role="menuitem"
                tabIndex="-1"
                id="menu-item-0"
                onClick={deleteAccount}
              >
                Account Delete
              </button>
              <button
                type="submit"
                className="text-gray-700 block w-full px-4 py-2 text-left text-sm"
                role="menuitem"
                tabIndex="-1"
                id="menu-item-3"
                onClick={signOut}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
