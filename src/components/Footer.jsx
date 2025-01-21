import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-6">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-lg font-semibold">Smart Shop</p>
        <p className="text-sm mt-2">© 2025 Smart Shop. All Rights Reserved.</p>
        <div className="flex justify-center gap-4 mt-4">
          <a
            href="#"
            className="text-gray-400 hover:text-white transition"
            aria-label="Facebook"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.99 3.657 9.128 8.438 9.878v-6.99h-2.54v-2.889h2.54V9.797c0-2.523 1.492-3.911 3.777-3.911 1.094 0 2.238.195 2.238.195v2.46h-1.261c-1.242 0-1.63.771-1.63 1.562v1.854h2.773l-.443 2.889h-2.33V22C18.343 21.128 22 16.99 22 12z" />
            </svg>
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-white transition"
            aria-label="Twitter"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775a4.933 4.933 0 0 0 2.163-2.723 9.864 9.864 0 0 1-3.127 1.195 4.916 4.916 0 0 0-8.379 4.482c-4.084-.2-7.689-2.161-10.103-5.134a4.822 4.822 0 0 0-.666 2.475 4.92 4.92 0 0 0 2.188 4.1 4.897 4.897 0 0 1-2.228-.616c-.054 2.281 1.581 4.415 3.949 4.892a4.935 4.935 0 0 1-2.224.084 4.926 4.926 0 0 0 4.604 3.419 9.866 9.866 0 0 1-6.102 2.105c-.396 0-.787-.023-1.174-.068a13.953 13.953 0 0 0 7.548 2.212c9.142 0 14.307-7.721 14.307-14.422 0-.22-.005-.439-.014-.657A10.27 10.27 0 0 0 24 4.59z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
