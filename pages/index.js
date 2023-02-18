import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [careerInput, setCareerInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ professional: careerInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      console.log("data is", data)
      setResult(data.result);
      setCareerInput("");
    } catch(error) {
      // error handling logic 
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>LearnMaster</title>
        <link rel="icon" href="/title.JPG" />
      </Head>

      <main className={styles.main}>
        <img src="/professional.JPG" className={styles.icon} />
        <h3>See the Journey !</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="professional"
            placeholder="How to become a ..."
            value={careerInput}
            onChange={(e) => setCareerInput(e.target.value)}
          />
          <input type="submit" value="Start your journey" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
