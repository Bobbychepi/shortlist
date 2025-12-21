import Navbar from "~/components/navbar";
import type { Route } from "./+types/home";
import { resumes } from "constants";
import ResumeCard from "~/components/resumeCard";
import type { Resume } from "types/index"; // make sure this points to your type

export function meta({}: Route.MetaArgs) {
  return [
    { title: "SkillSwift - AI Resume Analyzer" },
    { name: "description", content: "Analyze your resume with AI-powered insights." },
  ];
}

export default function Home() {
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />

      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Track Your Applications. Fix Your Resume. Get Interviews. Today!</h1>
          <h2>AI Feedback That Tells You Exactly What to Fix.</h2>
        </div>
      </section>

      {(resumes || []).length > 0 && (
        <div className="resumes-section">
          {(resumes || []).map((resume: Resume) => (
            <ResumeCard key={resume.id} resume={resume} />
          ))}
        </div>
      )}
    </main>
  );
}
