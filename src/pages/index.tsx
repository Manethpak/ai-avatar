import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";

const Home = () => {
  const maxRetries = 20;

  const [prompt, setPrompt] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [retry, setRetry] = useState(0);
  const [retryCount, setRetryCount] = useState(maxRetries);
  const [isGenerating, setIsGenerating] = useState(false);
  const [finalPrompt, setFinalPrompt] = useState("");

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
      console.log("Model is loading still :(.");
      return;
    }

    // If another error, drop error
    if (!response.ok) {
      console.log(`Error: ${data.error}`);
      return;
    }

    setFinalPrompt(prompt);
    setPrompt("");
    setImage(data.image);
    setIsGenerating(false);
  };

  return (
    <div className="root">
      <Head>
        <title>AI Avatar Generator | buildspace</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Silly Avatar Generator</h1>
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
            <div
              className={isGenerating ? "prompt-buttons" : "prompt-buttons up"}
            >
              <button
                className={
                  isGenerating ? "generate-button loading" : "generate-button"
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
        {image && (
          <div className="output-content">
            <Image src={image} width={512} height={512} alt={prompt} />
            <p className="mt-2">{finalPrompt}</p>
          </div>
        )}
      </div>
      <div className="badge-container grow">
        <a
          href="https://buildspace.so/builds/ai-avatar"
          target="_blank"
          rel="noreferrer"
        >
          <div className="badge">
            <Image
              src="/buildspace-logo.png"
              alt="buildspace logo"
              width={25}
              height={25}
            />
            <p>build with buildspace</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Home;
