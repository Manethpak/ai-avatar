import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const NavBar = () => {
  const router = useRouter();
  return (
    <div className="text-white py-10 flex gap-4 text-xl">
      <Link
        href={"/"}
        className={
          router.pathname == "/" ? "underline-active" : "underline-animation"
        }
      >
        Home
      </Link>
      <span className="text-gray-400">|</span>
      <Link
        href={"/gallery"}
        className={
          router.pathname == "/gallery"
            ? "underline-active"
            : "underline-animation"
        }
      >
        Gallery
      </Link>
    </div>
  );
};

export default NavBar;
