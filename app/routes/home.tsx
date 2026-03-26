import Navbar from "~/components/navbar";
import type { Route } from "./+types/home";
import { resumes } from "../../constants";
import ResumeCard from "~/components/resumeCard";
import type { Resume } from "types/index"; 
import { Typewriter } from "~/components/Typewriter";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "shortlist." },
    { name: "description", content: "Analyze your resume with AI-powered insights." },
  ];
}

export default function Home() {
  return (
    <main>
      {<Navbar />}

      <section className="main-section">
        <div className="page-heading py-16">
          <h1 className="">
            Make it to the shortlist <br/>

            <Typewriter
              text={["smoother.", "faster.", "smarter.", "quicker.", "today."]}
              loop
              className="text-blue-500"
              speed={80}
              pauseDuration={2000}
            />
          </h1>
        </div>
      </section>

{/* Resumes Section 
      {(resumes || []).length > 0 && (
        <div className="resumes-section">
          {(resumes || []).map((resume: Resume) => (
            <ResumeCard key={resume.id} resume={resume} />
          ))}
        </div>
        )}

*/}        
    </main>
  );
}
