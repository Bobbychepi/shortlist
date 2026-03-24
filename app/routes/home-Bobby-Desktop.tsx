import Navbar from "~/components/navbar";
import type { Route } from "./+types/home";
import { resumes } from "constants";
import ResumeCard from "~/components/resumeCard";
import type { Resume } from "types/index"; // make sure this points to your type
import { usePuterStore } from "lib/puter";
import { useLocation, useNavigate } from "react-router";
import { useEffect } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Shortlist." },
    { name: "description", content: "Know if your CV will get shortlisted, before you apply." },
  ];
}

export default function Home() {
  const { auth } = usePuterStore()

  const navigate = useNavigate();

  useEffect(() => {
    if(!auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated])

  return (
    <main >
      <Navbar />
      
      <section className="main-section mt-10">
        <div className="text-center">
          <h1>Shortlist.</h1>
          <h2>Built for the shortlist.</h2>
        </div>
      </section>

      <section>
        <h3 className="mt-5 pt-2 text-[40px] text-center">Shortlist: Your AI-Powered Hiring Assistant</h3>

        <div className="flex flex-row ">

        </div>

      </section>

      


      {/*<div className="resumes-section">
        {(resumes || []).map((resume: Resume) => (
          <ResumeCard key={resume.id} resume={resume} />
        ))}
        </div>
      )}*/}
    </main>
  );
}
