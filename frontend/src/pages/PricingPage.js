import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    monthly: 9,
    yearly: 7,
    description: 'Perfect for small teams getting started with time tracking.',
    color: '#60a5fa',
    features: [
      'Up to 5 team members',
      'Timesheet tracking',
      'Submit & approval workflow',
      'PDF export',
      'Email support',
      '7-day free trial',
    ],
    notIncluded: ['Invoice management', 'Advanced analytics', 'Priority support'],
  },
  {
    id: 'professional',
    name: 'Professional',
    monthly: 29,
    yearly: 23,
    description: 'For growing businesses that need invoicing and team management.',
    color: '#818cf8',
    popular: true,
    features: [
      'Up to 20 team members',
      'Everything in Starter',
      'Invoice generation',
      'Client management',
      'Advanced dashboard',
      'Priority email support',
      '7-day free trial',
    ],
    notIncluded: ['Dedicated account manager', 'Custom integrations'],
  },
  {
    id: 'business',
    name: 'Business',
    monthly: 79,
    yearly: 63,
    description: 'Full-featured ERP for established organizations.',
    color: '#a78bfa',
    features: [
      'Up to 100 team members',
      'Everything in Professional',
      'Advanced role permissions',
      'Custom reporting',
      'API access',
      'Phone & chat support',
      '7-day free trial',
    ],
    notIncluded: ['Dedicated account manager'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthly: 199,
    yearly: 159,
    description: 'Unlimited scale with dedicated support and custom integrations.',
    color: '#f472b6',
    features: [
      'Unlimited team members',
      'Everything in Business',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantee (99.99%)',
      'On-premise deployment option',
      'White-label option',
      '7-day free trial',
    ],
    notIncluded: [],
  },
];

const CheckIcon = ({ color = '#4ade80' }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);
  const navigate = useNavigate();

  const handleSelect = (planId) => {
    navigate(`/payment?plan=${planId}&billing=${yearly ? 'yearly' : 'monthly'}`);
  };

  return (
    <div className="min-h-screen bg-dark-base relative overflow-hidden">

      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[700px] h-[700px] rounded-full animate-blob-1"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)', top: '-200px', left: '-200px' }} />
        <div className="absolute w-[500px] h-[500px] rounded-full animate-blob-2"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)', bottom: '-100px', right: '-150px' }} />
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-16">

        {/* Back to login */}
        <div className="mb-8 animate-fade-up">
          <Link to="/" className="inline-flex items-center gap-2 text-sm transition-colors"
            style={{ color: 'rgba(255,255,255,0.4)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Back to login
          </Link>
        </div>

        {/* Hero */}
        <div className="text-center mb-14 animate-fade-up-delay1">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 0 24px rgba(99,102,241,0.4)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <span className="text-white font-bold text-xl">TickLogix</span>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)' }}>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-trial-pulse inline-block"></span>
            <span style={{ color: '#a5b4fc', fontSize: '0.82rem', fontWeight: 500 }}>7-day free trial on all plans — no credit card required</span>
          </div>

          <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
            Simple, transparent<br />
            <span className="gradient-text">pricing</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto' }}>
            Start free for 7 days. No hidden fees. Cancel anytime.
          </p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className="text-sm font-medium" style={{ color: yearly ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.8)' }}>Monthly</span>
            <button onClick={() => setYearly(!yearly)}
              className="relative w-12 h-6 rounded-full transition-all duration-300"
              style={{ background: yearly ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.15)' }}>
              <div className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300"
                style={{ left: yearly ? '28px' : '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }} />
            </button>
            <span className="text-sm font-medium" style={{ color: yearly ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)' }}>
              Yearly
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(74,222,128,0.15)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.3)' }}>
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 animate-fade-up-delay2">
          {PLANS.map((plan, i) => (
            <div key={plan.id}
              className={`pricing-card relative flex flex-col p-7 ${plan.popular ? 'pricing-card-popular' : ''}`}
              style={{ animationDelay: `${i * 0.08}s` }}>

              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="text-xs font-semibold px-4 py-1 rounded-full"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(99,102,241,0.5)' }}>
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan header */}
              <div className="mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${plan.color}20`, border: `1px solid ${plan.color}40` }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={plan.color} strokeWidth="2" strokeLinecap="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold text-white">${yearly ? plan.yearly : plan.monthly}</span>
                  <span className="text-sm mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>/mo</span>
                </div>
                {yearly && (
                  <p className="text-xs mt-1" style={{ color: '#4ade80' }}>
                    Billed yearly · Save ${(plan.monthly - plan.yearly) * 12}/year
                  </p>
                )}
              </div>

              {/* CTA */}
              <button onClick={() => handleSelect(plan.id)}
                className="w-full py-3 rounded-xl font-semibold text-sm mb-6 transition-all duration-200"
                style={plan.popular
                  ? { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', boxShadow: '0 8px 20px rgba(99,102,241,0.4)' }
                  : { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.12)' }}
                onMouseEnter={e => { if (!plan.popular) e.currentTarget.style.background = 'rgba(255,255,255,0.13)'; }}
                onMouseLeave={e => { if (!plan.popular) e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}>
                Start 7-Day Free Trial
              </button>

              {/* Features */}
              <div className="space-y-3 flex-1">
                {plan.features.map((f, j) => (
                  <div key={j} className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0"><CheckIcon color={plan.color} /></div>
                    <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{f}</span>
                  </div>
                ))}
                {plan.notIncluded.map((f, j) => (
                  <div key={j} className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0"><XIcon /></div>
                    <span className="text-sm line-through" style={{ color: 'rgba(255,255,255,0.2)' }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="text-center mt-14 animate-fade-up-delay3">
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>
            All plans include 7-day free trial. No credit card required to start.
            After trial, you'll be prompted to choose a plan.
          </p>
          <div className="flex items-center justify-center gap-8 mt-6">
            {['256-bit SSL encryption', 'GDPR compliant', 'Cancel anytime', '99.9% uptime SLA'].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
