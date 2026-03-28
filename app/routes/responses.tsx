import { useEffect, useMemo, useState } from "react";
import type { Route } from "../+types/root";
import Navbar from "~/components/navbar";
import { usePuterStore } from "lib/puter";

type StoredResume = {
  id: string;
  companyName?: string;
  jobTitle?: string;
  jobDescription?: string;
  feedback?: unknown;
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Responses | shortlist." },
    {
      name: "description",
      content: "View complete AI resume analysis responses across all your uploads.",
    },
  ];
}

const Responses = () => {
  const { kv, puterReady, error: puterError } = usePuterStore();
  const [responses, setResponses] = useState<StoredResume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  useEffect(() => {
    const loadResponses = async () => {
      if (!puterReady) return;

      setIsLoading(true);
      setPageError(null);

      try {
        const items = await kv.list("resume-*", true);

        if (!Array.isArray(items) || items.length === 0) {
          setResponses([]);
          return;
        }

        const parsedItems = (items as KVItem[])
          .map((item) => {
            try {
              return JSON.parse(item.value) as StoredResume;
            } catch {
              return null;
            }
          })
          .filter((item): item is StoredResume => Boolean(item))
          .reverse();

        setResponses(parsedItems);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Unable to load your AI responses right now.";
        setPageError(message);
      } finally {
        setIsLoading(false);
      }
    };

    loadResponses();
  }, [kv, puterReady]);

  const hasError = useMemo(() => pageError ?? puterError, [pageError, puterError]);

  return (
    <main>
      <Navbar />

      <section className="responses-wrapper">
        <header className="responses-header">
          <h1>Full AI Responses</h1>
          <p className="responses-subtitle">
            Review the complete response generated for each uploaded resume.
          </p>
        </header>

        {isLoading ? (
          <p className="responses-state">Loading responses...</p>
        ) : hasError ? (
          <p className="responses-error">{hasError}</p>
        ) : responses.length === 0 ? (
          <p className="responses-state">No resume analyses found yet. Upload a resume to get started.</p>
        ) : (
          <div className="responses-grid">
            {responses.map((response) => {
              const fullFeedback =
                typeof response.feedback === "string"
                  ? response.feedback
                  : JSON.stringify(response.feedback ?? {}, null, 2);

              return (
                <article key={response.id} className="response-card">
                  <div className="response-card-header">
                    <h2>{response.jobTitle || "Untitled Role"}</h2>
                    <p>
                      <span className="font-semibold">Company:</span>{" "}
                      {response.companyName || "Unknown Company"}
                    </p>
                  </div>

                  {response.jobDescription ? (
                    <section className="response-section">
                      <h3>Job Description</h3>
                      <p>{response.jobDescription}</p>
                    </section>
                  ) : null}

                  <section className="response-section">
                    <h3>AI Resume Response</h3>
                    <pre className="response-pre">{fullFeedback}</pre>
                  </section>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
};

export default Responses;
