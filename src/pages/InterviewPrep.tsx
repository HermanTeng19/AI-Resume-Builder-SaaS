import React, { useState } from 'react';
import { SEO } from '../components/SEO';

const InterviewPrep: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  return (
    <div className="page-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
      <SEO 
        title="AI Interview Prep Guide | Career Insight Labs"
        description="Generate a highly targeted interview preparation guide based on your resume and job description."
        url="https://careerinsightlabs.com/interview-prep"
      />
      
      {step === 1 && <h2>Step 1: Configuration</h2>}
      {step === 2 && <h2>Generating...</h2>}
      {step === 3 && <h2>Results</h2>}
    </div>
  );
};

export default InterviewPrep;
