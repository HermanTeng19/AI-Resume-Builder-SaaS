import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

interface TrustPageProps {
  title: string;
}

const PrivacyPolicyContent = () => (
  <div className="trust-document">
    <h2>1. Introduction</h2>
    <p>At Career Insight Labs, we take your privacy and the security of your professional data extremely seriously. This Privacy Policy outlines how we handle your data, with a strict emphasis on local processing and data minimization.</p>

    <h2>2. Data Collection and Usage</h2>
    <p><strong>Your Resume Data & API Keys:</strong> We operate on a "Bring Your Own Key" (BYOK) architecture. Your OpenAI API key, resume text, generated suggestions, and personal information are <strong>stored exclusively in your browser's local storage (localStorage)</strong>. We do not have servers that collect, store, or analyze your resume data.</p>
    <p><strong>Third-Party Processing (OpenAI):</strong> When you use the AI generation tools, your data is sent directly from your browser to OpenAI's API. Data processed via OpenAI's API is subject to OpenAI's Enterprise Privacy Policy, which explicitly states that API data is <strong>not</strong> used to train their models.</p>

    <h2>3. Cookies and Advertising (Google AdSense)</h2>
    <p>To support the free operation of this platform, we use Google AdSense to display advertisements. AdSense requires the following disclosures:</p>
    <ul>
      <li>Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website or other websites.</li>
      <li>Google's use of advertising cookies enables it and its partners to serve ads based on your visit to our site and/or other sites on the Internet.</li>
      <li>You may opt out of personalized advertising by visiting Google's <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer">Ads Settings</a>. Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info" target="_blank" rel="noreferrer">www.aboutads.info</a>.</li>
    </ul>

    <h2>4. Web Analytics</h2>
    <p>We may use anonymous, aggregated web analytics tools (such as Google Analytics) to understand general website traffic and usage patterns. This data does not contain personally identifiable information (PII) from your resumes.</p>

    <h2>5. Security</h2>
    <p>Because your data remains entirely in your browser, the security of your data relies heavily on the security of your personal device. We recommend using private/incognito browsing if you are using a public or shared computer, and manually clearing your browser's local storage after use.</p>

    <h2>6. Changes to this Policy</h2>
    <p>We may update this policy periodically to reflect changes in our practices or for other operational, legal, or regulatory reasons. Since we do not collect your email address, we cannot notify you directly of changes. Please check this page for the latest updates.</p>
  </div>
);

const TermsOfServiceContent = () => (
  <div className="trust-document">
    <h2>1. Acceptance of Terms</h2>
    <p>By accessing and using Career Insight Labs (the "Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use this Service.</p>

    <h2>2. Description of Service & API Usage</h2>
    <p>Career Insight Labs provides a browser-based interface to format and optimize resumes using artificial intelligence. Our Service operates on a "Bring Your Own Key" (BYOK) model.</p>
    <ul>
      <li><strong>API Keys:</strong> You must provide your own OpenAI API key to use the generative features of the Service.</li>
      <li><strong>API Costs:</strong> You are strictly responsible for any and all costs, charges, or fees incurred on your OpenAI account as a result of using your API key with our Service.</li>
      <li><strong>Key Security:</strong> Your API key is stored locally in your browser. We do not transmit it to our servers. However, you are responsible for maintaining the security of your browser and local environment.</li>
    </ul>

    <h2>3. Disclaimer of Accuracy and Results</h2>
    <p>The Service uses artificial intelligence to analyze and generate text. While we strive to provide high-quality suggestions based on modern Applicant Tracking System (ATS) trends, we make no guarantees regarding:</p>
    <ul>
      <li>The factual accuracy of the AI-generated text. You must independently review and verify all content before submitting your resume.</li>
      <li>Your likelihood of securing an interview, job offer, or bypassing any specific company's ATS algorithm.</li>
    </ul>
    <p>You agree that Career Insight Labs is not liable for any misrepresentations, factual errors, or negative outcomes resulting from the use of the generated resumes.</p>

    <h2>4. Data Storage and Recovery</h2>
    <p>Because the Service is designed to prioritize your privacy, all resume data and settings are stored locally on your device (in your browser's localStorage). <strong>We do not maintain backups.</strong> If you clear your browser cache, change devices, or use incognito mode, your data will be permanently lost. We are not responsible for any loss of data.</p>

    <h2>5. Acceptable Use</h2>
    <p>You agree not to use the Service to generate resumes that contain deliberately false, misleading, or fraudulent information. You must not use the Service for any illegal or unauthorized purpose.</p>

    <h2>6. Limitation of Liability</h2>
    <p>In no event shall Career Insight Labs, nor its developers or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>

    <h2>7. Modifications to Terms</h2>
    <p>We reserve the right to modify these Terms at any time. We will do our best to provide notice of significant changes, but it is your responsibility to review these Terms periodically. Your continued use of the Service following the posting of any changes constitutes acceptance of those changes.</p>
  </div>
);

const AboutUsContent = () => (
  <div className="trust-document">
    <h2>1. The Hiring System is Broken</h2>
    <p>Every year, millions of highly qualified candidates are automatically rejected by Applicant Tracking Systems (ATS) simply because they don't know the precise semantic keywords the algorithm is looking for. The modern job hunt is no longer just about your skills; it's about reverse-engineering the machine that reads your resume.</p>
    
    <h2>2. Who We Are</h2>
    <p>We are a collective of former FAANG recruiters, hiring managers, and software engineers who have spent years operating the very ATS platforms that filter candidates out. We've seen behind the curtain, and we decided it was time to level the playing field.</p>
    <p>We created Career Insight Labs as a dual-purpose platform: a definitive knowledge base for understanding how modern hiring algorithms work, and an advanced tool to help you craft a resume that speaks their language.</p>

    <h2>3. Our Philosophy: Extreme Privacy</h2>
    <p>When we set out to build our AI optimization tool, we noticed a disturbing trend: almost every other "free" resume builder on the internet secretly harvests your resume data, contact info, and work history to sell to data brokers or train proprietary models.</p>
    <p><strong>We refused to do that.</strong></p>
    <p>That's why we engineered our tool on a strictly local, "Bring Your Own Key" (BYOK) architecture. Your data never touches a database we own. Everything happens locally in your browser. We believe your professional history is yours, and yours alone.</p>

    <h2>4. Our Mission</h2>
    <p>Our goal is simple: to ensure that the best candidate gets the interview, regardless of their resume-writing skills. By combining our insider knowledge of ATS mechanics with cutting-edge AI, we're giving you the ultimate unfair advantage.</p>
  </div>
);

const DisclaimerContent = () => (
  <div className="trust-document">
    <h2>1. General Information</h2>
    <p>The information, tools, and services provided by Career Insight Labs, including but not limited to our AI Resume Builder and Career Guides, are intended for educational and informational purposes only. We provide insights based on industry experience, but hiring practices vary significantly across companies and industries.</p>

    <h2>2. No Guarantee of Employment</h2>
    <p>Using our AI tools or following our resume optimization strategies <strong>does not guarantee</strong> that you will secure an interview, a job offer, or any specific career outcome. The final hiring decision rests entirely with the employers and human recruiters reviewing your application.</p>

    <h2>3. Accuracy of ATS Strategies</h2>
    <p>Our insights on Applicant Tracking Systems (ATS) and hiring algorithms are based on extensive research and the past experiences of our team. However, ATS algorithms, filtering logic, and platform capabilities are proprietary and constantly evolving. We cannot guarantee that our keyword optimization strategies will accurately bypass every iteration of every ATS on the market.</p>

    <h2>4. User Responsibility</h2>
    <p>You are solely responsible for the accuracy and truthfulness of the content in your resume. The AI-generated suggestions provided by our tool are exactly that—suggestions. It is your responsibility to review, edit, and verify that any generated content truthfully reflects your actual skills, experience, and qualifications before submitting it to an employer.</p>

    <h2>5. Third-Party Integrations</h2>
    <p>Our tool relies on the OpenAI API to generate suggestions. We do not control OpenAI's uptime, availability, or the underlying behavior of their models. Additionally, we are not responsible for how third-party platforms (such as LinkedIn or job boards) interpret or parse the resume files exported from our tool.</p>
  </div>
);

const TrustPage: React.FC<TrustPageProps> = ({ title }) => {
  return (
    <>
      <SEO 
        title={`${title} | Career Insight Labs`}
        description={`Read our ${title} to learn more about our commitment to your privacy and success.`}
        url={`https://careerinsightlabs.com/${title.toLowerCase().replace(/ /g, '-')}`}
      />
      <div className="page-container" style={{ maxWidth: '800px', margin: '4rem auto', backgroundColor: 'white', padding: '4rem 5rem', borderRadius: '20px', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)', border: '1px solid var(--border-color)', animation: 'fadeInUp 0.5s ease-out' }}>
      <Link to="/" className="back-link" style={{ marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600 }}>
        <ArrowLeft size={16} className="back-icon" style={{ marginRight: '0.5rem' }} /> Back to Home
      </Link>
      
      <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', color: '#0f172a', letterSpacing: '-1.5px', fontWeight: 800 }}>{title}</h1>
      <p style={{ color: '#64748b', marginBottom: '3rem', fontSize: '0.95rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>Last updated: June 2026</p>
      
      <div className="blog-markdown" style={{ fontSize: '1.15rem', lineHeight: '1.85' }}>
        {title === 'Privacy Policy' && <PrivacyPolicyContent />}
        {title === 'Terms of Service' && <TermsOfServiceContent />}
        {title === 'About Us' && <AboutUsContent />}
        {title === 'Disclaimer' && <DisclaimerContent />}
        {title === 'Contact Us' && <p>Contact Us content coming soon.</p>}
      </div>
    </div>
    </>
  );
};

export default TrustPage;
