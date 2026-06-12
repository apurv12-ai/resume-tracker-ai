'use client';

import { useState } from 'react';
import { getToken } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AITailorPage() {
  const router = useRouter();
  const [jobDesc, setJobDesc] = useState('');
  const [resume, setResume] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!getToken()) router.push('/login');
  }, []);

  const analyze = async () => {
    if (!jobDesc || !resume) return alert('Fill both fields!');
    setLoading(true);
    setResult('');
    try {
      const res = await fetch('http://localhost:5000/api/ai/tailor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ jobDescription: jobDesc, resumeText: resume }),
      });
      const data = await res.json();
      setResult(data.suggestion || data.error);
    } catch {
      setResult('Error connecting to server.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <span className="font-bold text-indigo-600 text-xl">💼 ResumeAI</span>
        <div className="flex gap-4 text-sm">
          <a href="/dashboard" className="text-gray-500 hover:text-indigo-600">Dashboard</a>
          <a href="/applications" className="text-gray-500 hover:text-indigo-600">Applications</a>
          <a href="/ai-tailor" className="text-indigo-600 font-semibold">AI Tailor</a>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">AI Resume Tailor</h1>
        <p className="text-gray-500 mb-6 text-sm">Paste a job description and your resume — AI will suggest improvements.</p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Job Description</label>
            <textarea
              className="w-full border rounded-lg p-3 text-sm h-48 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
              placeholder="Paste the job description here..."
              value={jobDesc}
              onChange={e => setJobDesc(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Your Resume</label>
            <textarea
              className="w-full border rounded-lg p-3 text-sm h-48 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
              placeholder="Paste your current resume text here..."
              value={resume}
              onChange={e => setResume(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={analyze}
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 text-sm font-semibold"
        >
          {loading ? '✨ Analyzing...' : '✨ Tailor My Resume'}
        </button>

        {result && (
          <div className="mt-6 bg-white border rounded-xl p-5 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-3">AI Suggestions</h2>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
}