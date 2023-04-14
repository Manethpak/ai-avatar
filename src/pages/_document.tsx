import { Html, Head, Main, NextScript } from "next/document";
import Image from "next/image";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
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
        <NextScript />
      </body>
    </Html>
  );
}
