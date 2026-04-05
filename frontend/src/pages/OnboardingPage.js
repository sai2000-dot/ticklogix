import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const STEPS = ['Company Size', 'Industry', 'Use Case', 'How did you hear?'];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    companySize:    '',
    teamSize:       '',
    industry:       '',
    industryOther:  '',
    useCases:       [],
    heardFrom:      '',
  });

  const next = () => {
    if (step < 3) setStep(step + 1);
    else {
      localStorage.setItem('onboardingDone', 'true');
      navigate('/dashboard');
    }
  };

  const back = () => setStep(step - 1);

  const toggleUseCase = (val) => {
    setData(prev => ({
      ...prev,
      useCases: prev.useCases.includes(val)
        ? prev.useCases.filter(u => u !== val)
        : [...prev.useCases, val],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
          <span className="text-white font-bold text-lg">TL</span>
        </div>
        <span className="font-bold text-gray-800 text-2xl">TickLogix</span>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <React.Fragment key={i}>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                i < step  ? 'bg-indigo-600 text-white' :
                i === step ? 'bg-indigo-600 text-white' :
                'bg-gray-200 text-gray-500'
              }`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className="text-xs text-gray-500 mt-1 hidden md:block">{s}</span>
            </div>
            {i < 3 && <div className={`w-12 h-0.5 mb-4 ${i < step ? 'bg-indigo-600' : 'bg-gray-200'}`} />}
          </React.Fragment>
        ))}
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-2xl">

        {/* Step 1 — Company Size */}
        {step === 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">How large is your company?</h2>
            <div className="grid grid-cols-3 gap-3 mb-8">
              {['Self-employed', '2–10', '11–50', '51–200', '201–500', '501–1000', '1001–5000', '5000–10000', '10000+'].map(size => (
                <button
                  key={size}
                  onClick={() => setData({ ...data, companySize: size })}
                  className={`py-3 px-4 rounded-lg border text-sm font-medium transition-colors ${
                    data.companySize === size
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                      : 'border-gray-200 text-gray-700 hover:border-indigo-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-6">How many people will be working with you?</h2>
            <div className="grid grid-cols-3 gap-3">
              {['Only me', '2–5', '6–10', '11–20', '21–50', '51–100', '101–250', '251–500', '500+'].map(size => (
                <button
                  key={size}
                  onClick={() => setData({ ...data, teamSize: size })}
                  className={`py-3 px-4 rounded-lg border text-sm font-medium transition-colors ${
                    data.teamSize === size
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                      : 'border-gray-200 text-gray-700 hover:border-indigo-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 — Industry */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">The industry your company operates in:</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                'Accounting & Finance',
                'Design & Architecture',
                'Education & Training',
                'Engineering & Construction',
                'Healthcare & Medical',
                'Human Resources & Recruitment',
                'Information Technology & Services',
                'Legal Services',
                'Management & Consulting',
                'Marketing & Advertising',
                'Media & Entertainment',
                'Non-Profit Organizations',
                'Real Estate',
                'Retail & E-Commerce',
                'Transportation & Logistics',
                'Other',
              ].map(industry => (
                <label key={industry} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-indigo-300 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="industry"
                    value={industry}
                    checked={data.industry === industry}
                    onChange={() => setData({ ...data, industry, industryOther: '' })}
                    className="text-indigo-600"
                  />
                  <span className="text-sm text-gray-700">{industry}</span>
                </label>
              ))}
            </div>
            {data.industry === 'Other' && (
              <input
                type="text"
                value={data.industryOther}
                onChange={e => setData({ ...data, industryOther: e.target.value })}
                placeholder="Please specify your industry"
                className="mt-4 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            )}
          </div>
        )}

        {/* Step 3 — Use Case */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">What would you like to use TickLogix for?</h2>
            <div className="space-y-3">
              {[
                'Analyze which tasks take most time',
                'Keep track of project progress and budget',
                'Plan projects and team\'s capacity',
                'Track time to bill your clients',
                'Clock in/Clock out via Kiosk on a single device',
                'Track team activities in real-time',
                'Cost control & payroll',
                'Achieve and maintain compliance',
              ].map(useCase => (
                <label key={useCase} className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-indigo-300 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={data.useCases.includes(useCase)}
                    onChange={() => toggleUseCase(useCase)}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <span className="text-sm text-gray-700">{useCase}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Step 4 — How did you hear */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">How did you hear about us?</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                'Search Engine (Google, Bing, etc.)',
                'Software Review Sites (Capterra, GetApp, etc.)',
                'Video Ad (YouTube, TV, etc.)',
                'Audio Ad (Podcast, Spotify, etc.)',
                'LinkedIn',
                'Reddit / X (Twitter)',
                'Facebook / Instagram',
                'TikTok',
                'Friend / Colleague',
              ].map(source => (
                <label key={source} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-indigo-300 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="heardFrom"
                    value={source}
                    checked={data.heardFrom === source}
                    onChange={() => setData({ ...data, heardFrom: source })}
                    className="text-indigo-600"
                  />
                  <span className="text-sm text-gray-700">{source}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          {step > 0 ? (
            <button
              onClick={back}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          ) : <div />}
          <button
            onClick={next}
            className="px-8 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            {step === 3 ? 'Done' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}