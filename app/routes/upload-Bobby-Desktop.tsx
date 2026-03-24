'use client'

import {prepareInstructions, AIResponseFormat} from "../../constants";
import { usePuterStore } from 'lib/puter'
import React, { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import FileUploader from '~/components/FileUploader'
import Navbar from '~/components/navbar'
import { convertPdfToImage } from '~/lib/pdftoimg'
import { generateUUID } from '~/lib/utils'

const Upload = () => {
  const {auth, isLoading,fs,ai,kv } = usePuterStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false)
  const [statusText, setStatusText] = useState('Analyzing your resume...')

const handleAnalyze = async ({
  companyName,
  jobTitle,
  jobDescription,
  file,
}: {
  companyName: string
  jobTitle: string
  jobDescription: string
  file: File
}) => {
  setIsProcessing(true)

  const uuid = generateUUID()
  const data = {
    id: uuid,
    resumePath: '',
    imagePath: '',
    companyName,
    jobTitle,
    jobDescription,
    feedback: null as any,
  }

  try {
    // Upload original resume
    setStatusText('Uploading your resume...')
    const uploadedFile = await fs.upload([file])
    if (!uploadedFile) throw new Error('Error uploading resume')
    data.resumePath = uploadedFile.path

    // Convert PDF to image (browser-compatible)
    setStatusText('Converting to image...')
    let imageFile
    try {
      imageFile = await convertPdfToImage(file)
    } catch (err: any) {
      console.error('PDF conversion failed:', err)
      throw new Error('Error converting PDF to image: ' + err.message)
    }

    if (!imageFile?.file) {
      console.error('PDF conversion returned invalid object:', imageFile)
      throw new Error('Error converting PDF to image')
    }

    // Upload converted image
    setStatusText('Uploading image...')
    const uploadedImage = await fs.upload([imageFile.file])
    if (!uploadedImage) throw new Error('Failed to upload image')
    data.imagePath = uploadedImage.path

    // Save initial data to KV
    setStatusText('Preparing analysis...')
    await kv.set(`resume-${uuid}`, JSON.stringify(data))

    // AI feedback
    setStatusText('Analyzing resume...')
    const feedback = await ai.feedback(
      uploadedFile.path,
      prepareInstructions({ jobTitle, jobDescription, AIResponseFormat }),
    )

    // Safely handle AI response
    let rawFeedback = ''
    if (feedback?.message?.content) {
      rawFeedback =
        typeof feedback.message.content === 'string'
          ? feedback.message.content
          : feedback.message.content[0]?.text || ''
    }

    try {
      data.feedback = rawFeedback ? JSON.parse(rawFeedback) : rawFeedback
    } catch {
      console.warn('AI returned invalid JSON. Storing raw feedback as string.')
      data.feedback = rawFeedback
    }

    // Save final data to KV
    await kv.set(`resume-${uuid}`, JSON.stringify(data))

    // Complete
    setStatusText('Analysis complete. Redirecting...')
    navigate(`/results/${uuid}`)
  } catch (err: any) {
    console.error(err)
    setStatusText(err?.message || 'Something went wrong during analysis.')
  } finally {
    setIsProcessing(false)
  }
}


  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsProcessing(true)
    setStatusText('Analyzing your resume...')
    const form: any = e.currentTarget.closest('form');
    if (!form) return;
    const formData: any = new FormData(form);

    const companyName = formData.get('company-name') as string;
    const jobTitle = formData.get('job-title') as string;
    const jobDescription = formData.get('job-description') as string;


    if(!file) return;

    handleAnalyze({ companyName, jobTitle, jobDescription, file })
  }

  const [file,setFile] =useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  }

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
              <h2>Find out why your resume isn’t getting interviews — and how to fix it</h2>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
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
                  <FileUploader onFileSelect={handleFileSelect} />
                </div>

                <button className="primary-button" type="submit">Analyze Resume</button>

              </form>
            </>
          )}
        </div>
      </section>
    </main>
  )
}

export default Upload
