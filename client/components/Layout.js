import Head from "next/head";
import React from "react";
import Header from "./Header";
import { useSelector } from "react-redux";

function Layout({ children }) {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  return (
    <>
      <Head>
        <title>Book Shelves</title>
      </Head>
      {isAuthenticated && <Header />}
      {children}
    </>
  );
}

export default Layout;
