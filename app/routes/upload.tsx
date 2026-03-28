import { AIResponseFormat, prepareInstructions } from "../../constants";
import { usePuterStore } from "lib/puter";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/navbar";
import { convertPdfToImage } from "~/lib/pdftoimg";
import { generateUUID } from "~/lib/utils";
import type { Route } from "../+types/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "shortlist." },
    { name: "description", content: "Analyze your resume with AI-powered insights." },
  ];
}

type AnalyzePayload = {
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  file: File;
};

const Upload = () => {
  const { fs, ai, kv, error: puterError, puterReady } = usePuterStore();
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("Analyzing your resume...");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: AnalyzePayload) => {
    setIsProcessing(true);
    setSubmitError(null);

    const uuid = generateUUID();
    const data = {
      id: uuid,
      resumePath: "",
      imagePath: "",
      companyName,
      jobTitle,
      jobDescription,
      feedback: null as unknown,
    };

    try {
      setStatusText("Uploading your resume...");
      const uploadedFile = await fs.upload([file]);
      if (!uploadedFile) throw new Error("Unable to upload the resume file.");
      data.resumePath = uploadedFile.path;

      setStatusText("Converting PDF to image...");
      const imageResult = await convertPdfToImage(file);
      if (imageResult.error || !imageResult.file) {
        throw new Error(imageResult.error ?? "Unable to convert PDF to image.");
      }

      setStatusText("Uploading preview image...");
      const uploadedImage = await fs.upload([imageResult.file]);
      if (!uploadedImage) throw new Error("Unable to upload preview image.");
      data.imagePath = uploadedImage.path;

      setStatusText("Saving draft analysis...");
      await kv.set(`resume-${uuid}`, JSON.stringify(data));

      setStatusText("Analyzing resume with AI...");
      const feedbackResponse = await ai.feedback(
        uploadedFile.path,
        prepareInstructions({
          jobTitle,
          jobDescription,
          AIResponseFormat,
        })
      );

      let rawFeedback = "";
      const content = feedbackResponse?.message?.content;
      if (typeof content === "string") {
        rawFeedback = content;
      } else if (Array.isArray(content) && content.length > 0) {
        rawFeedback = content[0]?.text || "";
      }

      if (!rawFeedback) {
        throw new Error("AI did not return feedback for this resume.");
      }

      try {
        data.feedback = JSON.parse(rawFeedback);
      } catch {
        data.feedback = rawFeedback;
      }

      await kv.set(`resume-${uuid}`, JSON.stringify(data));

      setStatusText("Analysis complete. Redirecting...");
      navigate("/responses");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected upload error.";
      setSubmitError(message);
      setStatusText("Analysis failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!puterReady) {
      setSubmitError("Cloud services are still loading. Please wait and try again.");
      return;
    }

    if (!file) {
      setSubmitError("Please upload a PDF resume before analyzing.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const companyName = String(formData.get("company-name") ?? "").trim();
    const jobTitle = String(formData.get("job-title") ?? "").trim();
    const jobDescription = String(formData.get("job-description") ?? "").trim();

    await handleAnalyze({ companyName, jobTitle, jobDescription, file });
  };

  return (
    <main>
      <Navbar />

      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Smarter feedback for applications that get interviews.</h1>

          {isProcessing ? (
            <>
              <h2>{statusText}</h2>
              <img
                src="/images/resume-scan.gif"
                alt="Resume scanning animation"
                className="w-full"
              />
            </>
          ) : (
            <>
              <h2>Find out why your resume isn’t getting interviews — and how to fix it.</h2>

              <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
                <div className="form-div">
                  <label htmlFor="company-name">Company Name</label>
                  <input
                    type="text"
                    id="company-name"
                    name="company-name"
                    placeholder="Company Name"
                    required
                  />
                </div>

                <div className="form-div">
                  <label htmlFor="job-title">Job Title</label>
                  <input
                    type="text"
                    id="job-title"
                    name="job-title"
                    placeholder="Job Title"
                    required
                  />
                </div>

                <div className="form-div">
                  <label htmlFor="job-description">Job Description</label>
                  <textarea
                    rows={5}
                    id="job-description"
                    name="job-description"
                    placeholder="Job Description"
                    required
                  />
                </div>

                <div className="form-div">
                  <label htmlFor="uploader">Upload Resume</label>
                  <FileUploader onFileSelect={setFile} />
                </div>

                {(submitError || puterError) && (
                  <p className="text-red-600 text-sm">{submitError ?? puterError}</p>
                )}

                <button className="primary-button" type="submit" disabled={isProcessing}>
                  Analyze Resume
                </button>
              </form>
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default Upload;
