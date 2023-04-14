import React, { useState } from "react";
import Image from "next/image";
import { classFilter, copyToClipboard, downloadImage } from "@/utils";
import ClipboardIcon from "@/icons/ClipboardIcon";
import DownloadIcon from "@/icons/DownloadIcon";

type Props = {
  by?: string | null;
  created_at?: string | null;
  id?: number;
  img: string;
  prompt: string;
};

const Card = ({ img, prompt, by }: Props) => {
  const [isLoading, setLoading] = useState(true);

  return (
    <div className="">
      <div className="rounded-xl overflow-hidden bg-gray-200 relative w-full max-w-[512px] group aspect-square">
        <Image
          alt={prompt}
          src={img}
          width={512}
          height={512}
          className={classFilter(
            "duration-700 ease-in-out group-hover:opacity-75",
            isLoading
              ? "scale-90 blur-2xl grayscale"
              : "scale-100 blur-0 grayscale-0"
          )}
          onLoadingComplete={() => setLoading(false)}
        />
        <button
          className="absolute right-4 top-2 opacity-60 hover:opacity-80 transition-opacity duration-300"
          onClick={() => downloadImage(img)}
        >
          <DownloadIcon className="w-10 h-10 bg-neutral-800 p-2 rounded-lg text-white" />
        </button>
      </div>

      <p className="mt-2 text-sm line-clamp-3 text-gray-50 max-w-[512px]">
        {prompt}
      </p>
      <button
        className="border flex gap-2 px-4 py-2 mt-2 rounded-lg text-white w-fit mx-auto hover:bg-neutral-800"
        onClick={() => copyToClipboard(prompt)}
      >
        <ClipboardIcon className="w-5 h-5" /> Copy Prompt
      </button>
      {by && <p className="mt-1 text-lg font-medium text-gray-50">By: {by}</p>}
    </div>
  );
};

export default Card;
