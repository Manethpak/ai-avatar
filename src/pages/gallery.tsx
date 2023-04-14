import React from "react";
import Head from "next/head";
import NavBar from "@/components/NavBar";
import { createClient } from "@supabase/supabase-js";
import Card from "@/components/Card";

type Props = {
  data: {
    by: string | null;
    created_at: string | null;
    id: number;
    img: string;
    prompt: string;
  }[];
};

const Gallery = ({ data }: Props) => {
  return (
    <div className="root">
      <Head>
        <title>AI Avatar Generator | buildspace</title>
      </Head>
      <NavBar />
      <div className="grid md:grid-cols-2 gap-6 place-content-center mt-10 px-8 shrink">
        {data?.map((item) => (
          <Card key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
};

export async function getStaticProps() {
  const client = createClient(
    process.env.NEXT_PUBLIC_SB || "https://vwywagsxksrtxrpahoxa.supabase.co",
    process.env.SB_KEY || ""
  );

  let { data, error } = await client.from("gallery").select("*");

  return {
    props: {
      data: data,
    },
  };
}

export default Gallery;
