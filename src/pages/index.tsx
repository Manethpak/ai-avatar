import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import NavBar from "@/components/NavBar";
import { copyToClipboard } from "@/utils";
import { useRecoilState } from "recoil";
import { generatedAtom } from "@/atoms/generatedAtom";
import ClipboardIcon from "@/icons/ClipboardIcon";
import DownloadIcon from "@/icons/DownloadIcon";
import Card from "@/components/Card";

const Home = () => {
  const maxRetries = 20;

  const [prompt, setPrompt] = useState<string>("");
  const [retry, setRetry] = useState(0);
  const [retryCount, setRetryCount] = useState(maxRetries);
  const [isGenerating, setIsGenerating] = useState(false);

  const [generated, setGenerated] = useRecoilState(generatedAtom);

  const [loading, setLoading] = useState(false);
  const [countDown, setCountDown] = useState(30);

  useEffect(() => {
    // set up interval
    const interval = setInterval(() => {
      if (countDown > 0) {
        setCountDown(countDown - 1);
      } else {
        setLoading(false);
        setIsGenerating(false);
        setCountDown(30);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [countDown, loading]);

  useEffect(() => {
    const sleep = (ms: number) => {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    };

    const runRetry = async () => {
      if (retryCount === 0) {
        console.log(
          `Model still loading after ${maxRetries} retries. Try request again in 5 minutes.`
        );
        setRetryCount(maxRetries);
        return;
      }
      console.log(`Trying again in ${retry} seconds.`);
      await sleep(retry * 1000);
      await generateAction();
    };

    if (retry === 0) {
      return;
    }

    runRetry();
  }, [retry]);

  // Add generateAction
  const generateAction = async () => {
    console.log("Generating...");
    if (isGenerating && retry === 0) return;

    // Set loading has started
    setIsGenerating(true);

    if (retry > 0) {
      setRetryCount((prevState) => {
        if (prevState === 0) {
          return 0;
        } else {
          return prevState - 1;
        }
      });

      setRetry(0);
    }

    // Add the fetch request
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "image/jpeg",
      },
      body: JSON.stringify({ input: prompt }),
    });

    const data = await response.json();

    // If model still loading, drop that retry time
    if (response.status === 503) {
      console.log("Model is loading still :(");
      setLoading(true);
      setCountDown(data.estimated_time);
      return;
    }

    // If another error, drop error
    if (!response.ok) {
      console.log(`Error: ${data.error}`);
      return;
    }

    setGenerated({
      image: data.image,
      prompt: prompt,
    });
    setPrompt("");
    setIsGenerating(false);
  };

  return (
    <div className="root">
      <Head>
        <title>AI Avatar Generator | buildspace</title>
      </Head>
      <NavBar />
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Silly Maneth Generator</h1>
          </div>
          <div className="header-subtitle">
            <h2>
              Turn me into anything you want! Make sure you refer to me as
              &quot;maneth&quot; in the prompt
            </h2>
          </div>
          <div className="prompt-container">
            <input
              className="prompt-box"
              value={prompt}
              onChange={(e) => setPrompt(e.currentTarget.value)}
            />
            {loading && (
              <p className="text-orange-300">
                Loading model... Please try again in {countDown} seconds
              </p>
            )}
            <div className="prompt-buttons">
              <button
                className={
                  isGenerating
                    ? "generate-button loading"
                    : "generate-button up"
                }
                onClick={generateAction}
                disabled={isGenerating}
              >
                {/* Tweak to show a loading indicator */}
                <div className="generate">
                  {isGenerating ? (
                    <span className="loader"></span>
                  ) : (
                    <p>Generate</p>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
        {generated.image && (
          <div className="output-content">
            <Card img={generated.image} prompt={generated.prompt} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
