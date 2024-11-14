import { useAuth } from "../../context/authProvider";
import Header from "../../components/Header/Header";
import Content from "./Content";
import axiosInstance from "../../api/axios";
import { useRef, useState } from "react";

function Home() {
  const { accessToken } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 p-6">
        <Content />
      </main>

      <footer className="p-4 bg-gray-800 text-white text-center">
        {accessToken ? (
          <p className="text-green-400 font-semibold">Authenticated</p>
        ) : (
          <p className="text-red-400 font-semibold">Not Authenticated</p>
        )}
      </footer>
    </div>
  );
}

export default Home;
