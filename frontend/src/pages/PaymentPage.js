import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const PLAN_INFO = {
  starter:      { name: 'Starter',      monthly: 9,   yearly: 7,   color: '#60a5fa' },
  professional: { name: 'Professional', monthly: 29,  yearly: 23,  color: '#818cf8' },
  business:     { name: 'Business',     monthly: 79,  yearly: 63,  color: '#a78bfa' },
  enterprise:   { name: 'Enterprise',   monthly: 199, yearly: 159, color: '#f472b6' },
};

const METHODS = [
  { id: 'card',    label: 'Credit Card', icon: '💳' },
  { id: 'paypal',  label: 'PayPal',      icon: null  },
  { id: 'gpay',    label: 'Google Pay',  icon: null  },
  { id: 'applepay',label: 'Apple Pay',   icon: null  },
];

function formatCardNumber(v) {
  return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}
function formatExpiry(v) {
  const d = v.replace(/\D/g, '').slice(0, 4);
  return d.length >= 3 ? d.slice(0, 2) + '/' + d.slice(2) : d;
}

export default function PaymentPage() {
  const [params]       = useSearchParams();
  const navigate       = useNavigate();
  const { loginWithToken } = useAuth();

  const planId  = params.get('plan') || 'starter';
  const billing = params.get('billing') || 'monthly';
  const plan    = PLAN_INFO[planId] || PLAN_INFO.starter;
  const price   = billing === 'yearly' ? plan.yearly : plan.monthly;

  const [method,      setMethod]     = useState('card');
  const [cardNum,     setCardNum]    = useState('');
  const [cardName,    setCardName]   = useState('');
  const [expiry,      setExpiry]     = useState('');
  const [cvv,         setCvv]        = useState('');
  const [processing,  setProcessing] = useState(false);
  const [success,     setSuccess]    = useState(false);
  const [error,       setError]      = useState('');

  const handlePay = async () => {
    if (method === 'card') {
      const raw = cardNum.replace(/\s/g, '');
      if (raw.length < 16) { setError('Please enter a valid 16-digit card number.'); return; }
      if (!cardName.trim())  { setError('Please enter the cardholder name.'); return; }
      if (expiry.length < 5) { setError('Please enter a valid expiry date (MM/YY).'); return; }
      if (cvv.length < 3)    { setError('Please enter a valid CVV.'); return; }
    }
    setError('');
    setProcessing(true);
    try {
      await API.post('/subscriptions/upgrade', { plan: planId, paymentMethod: method });
      setSuccess(true);
      // Refresh user token data
      const token = localStorage.getItem('authToken');
      if (token) await loginWithToken(token);
      setTimeout(() => navigate('/dashboard'), 2800);
    } catch (err) {
      setError(err.response?.data?.error || 'Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-dark-base flex items-center justify-center px-4">
        <div className="text-center animate-scale-in">
          <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(74,222,128,0.2), rgba(34,197,94,0.2))', border: '2px solid rgba(74,222,128,0.5)', boxShadow: '0 0 40px rgba(74,222,128,0.3)' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Payment Successful!</h2>
          <p className="mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Welcome to <span style={{ color: plan.color, fontWeight: 600 }}>TickLogix {plan.name}</span>
          </p>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>Redirecting to your dashboard...</p>
          <div className="flex justify-center mt-6">
            <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin-slow"></div>
          </div>
        </div>
      </div>
    );
  }

  if (processing) {
    return (
      <div className="min-h-screen bg-dark-base flex items-center justify-center px-4">
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ background: 'rgba(99,102,241,0.15)', border: '2px solid rgba(99,102,241,0.4)' }}>
            <div className="w-10 h-10 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin-slow"></div>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Processing Payment...</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem' }}>Please wait, do not close this page.</p>
          <div className="flex justify-center gap-2 mt-6">
            {['Stripe', 'PayPal', 'Secured'].map((s, i) => (
              <span key={i} className="text-xs px-3 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.08)' }}>{s}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-base relative overflow-hidden flex items-center justify-center px-4 py-12">

      {/* Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] rounded-full animate-blob-1"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)', top: '-100px', left: '-100px' }} />
        <div className="absolute w-[400px] h-[400px] rounded-full animate-blob-2"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.14) 0%, transparent 70%)', bottom: '-100px', right: '-100px' }} />
      </div>

      <div className="relative w-full max-w-4xl">

        {/* Back */}
        <div className="mb-6 animate-fade-up">
          <Link to="/pricing" className="inline-flex items-center gap-2 text-sm transition-colors"
            style={{ color: 'rgba(255,255,255,0.4)' }}
            onMouseEnter={e => e.currentTarget.style.color='rgba(255,255,255,0.7)'}
            onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.4)'}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Back to plans
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* ── Left: Order Summary ── */}
          <div className="lg:col-span-2 animate-slide-left">
            <div className="glass rounded-2xl p-6" style={{ boxShadow: '0 24px 48px rgba(0,0,0,0.4)' }}>
              <h2 className="text-white font-bold text-lg mb-6">Order Summary</h2>

              {/* Plan badge */}
              <div className="rounded-xl p-4 mb-6" style={{ background: `${plan.color}12`, border: `1px solid ${plan.color}30` }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${plan.color}20` }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={plan.color} strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">TickLogix {plan.name}</div>
                    <div className="text-xs capitalize" style={{ color: plan.color }}>{billing} billing</div>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-3" style={{ borderTop: `1px solid ${plan.color}20` }}>
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Subtotal</span>
                  <span className="font-semibold text-white">${price}/mo</span>
                </div>
                {billing === 'yearly' && (
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Yearly savings</span>
                    <span className="text-sm font-medium text-green-400">-${(plan.monthly - plan.yearly) * 12}/yr</span>
                  </div>
                )}
              </div>

              {/* Trial note */}
              <div className="rounded-xl p-4 mb-4" style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)' }}>
                <div className="flex items-start gap-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" className="mt-0.5 flex-shrink-0"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <div>
                    <div className="text-sm font-medium text-green-400 mb-0.5">7-Day Free Trial</div>
                    <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      You won't be charged until your trial ends. Cancel anytime before.
                    </div>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <span className="font-semibold text-white">Due today</span>
                <span className="text-xl font-bold text-green-400">$0.00</span>
              </div>

              {/* Security badges */}
              <div className="flex items-center gap-4 mt-6 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                {[
                  { icon: '🔒', label: 'SSL Secured' },
                  { icon: '🛡️', label: 'PCI DSS' },
                  { icon: '✅', label: 'Cancel anytime' },
                ].map((b, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span style={{ fontSize: '12px' }}>{b.icon}</span>
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem' }}>{b.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Payment Form ── */}
          <div className="lg:col-span-3 animate-slide-right">
            <div className="glass rounded-2xl p-7" style={{ boxShadow: '0 24px 48px rgba(0,0,0,0.4)' }}>
              <h2 className="text-white font-bold text-lg mb-6">Payment Method</h2>

              {/* Method tabs */}
              <div className="flex gap-2 mb-7 flex-wrap">
                {METHODS.map(m => (
                  <button key={m.id} onClick={() => setMethod(m.id)}
                    className={`pay-tab ${method === m.id ? 'active' : ''}`}>
                    {m.id === 'paypal' && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="inline mr-1">
                        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z"/>
                      </svg>
                    )}
                    {m.id === 'gpay' && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="inline mr-1" style={{ color: '#4285F4' }}>
                        <path d="M12 11.484V14.4h3.918c-.168.9-.648 1.68-1.404 2.196l2.268 1.764c1.32-1.224 2.088-3.024 2.088-5.16 0-.504-.048-.996-.132-1.716H12z" fill="#4285F4"/>
                        <path d="M5.844 14.292l-.516.396-1.824 1.428C4.716 18.156 8.1 20 12 20c2.664 0 4.908-.876 6.54-2.376l-2.268-1.764c-.876.588-2.004.936-3.276.936-2.592 0-4.788-1.752-5.58-4.116l-.572.612z" fill="#34A853"/>
                        <path d="M3.504 8.58C3.18 9.396 3 10.284 3 11.196c0 .912.18 1.8.504 2.616l2.34-1.824a5.09 5.09 0 0 1 0-1.584L3.504 8.58z" fill="#FBBC05"/>
                        <path d="M12 7.2c1.464 0 2.772.504 3.804 1.488l2.268-2.268C16.5 4.8 14.4 4 12 4 8.1 4 4.716 5.844 3.504 8.58l2.34 1.824C6.636 8.448 9.072 7.2 12 7.2z" fill="#EA4335"/>
                      </svg>
                    )}
                    {m.id === 'applepay' && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="inline mr-1">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                    )}
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Error */}
              {error && (
                <div className="animate-fade-in mb-5 p-3 rounded-xl text-sm flex items-center gap-2"
                  style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                  {error}
                </div>
              )}

              {/* ── Card Form ── */}
              {method === 'card' && (
                <div className="space-y-4 animate-fade-in">
                  {/* Card preview strip */}
                  <div className="rounded-xl p-4 mb-2 flex items-center justify-between"
                    style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3))', border: '1px solid rgba(99,102,241,0.3)' }}>
                    <div>
                      <div className="text-white font-mono text-sm tracking-wider">
                        {cardNum || '•••• •••• •••• ••••'}
                      </div>
                      <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        {cardName || 'CARDHOLDER NAME'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>EXPIRES</div>
                      <div className="text-white font-mono text-sm">{expiry || 'MM/YY'}</div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>Card Number</label>
                    <input className="dark-input font-mono" placeholder="1234 5678 9012 3456"
                      value={cardNum} onChange={e => setCardNum(formatCardNumber(e.target.value))} maxLength={19} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>Cardholder Name</label>
                    <input className="dark-input" placeholder="John Doe"
                      value={cardName} onChange={e => setCardName(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>Expiry Date</label>
                      <input className="dark-input" placeholder="MM/YY"
                        value={expiry} onChange={e => setExpiry(formatExpiry(e.target.value))} maxLength={5} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>CVV</label>
                      <input className="dark-input" placeholder="•••" type="password"
                        value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g,'').slice(0,4))} maxLength={4} />
                    </div>
                  </div>

                  {/* Accepted cards */}
                  <div className="flex items-center gap-3 pt-1">
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>Accepted:</span>
                    {['VISA', 'MC', 'AMEX', 'DISC'].map(c => (
                      <span key={c} className="text-xs px-2 py-0.5 rounded"
                        style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}>{c}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* ── PayPal ── */}
              {method === 'paypal' && (
                <div className="animate-fade-in text-center py-8">
                  <div className="w-20 h-20 rounded-2xl mx-auto mb-5 flex items-center justify-center"
                    style={{ background: '#003087', boxShadow: '0 12px 28px rgba(0,48,135,0.5)' }}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="white">
                      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z"/>
                    </svg>
                  </div>
                  <h3 className="text-white font-semibold mb-2">Pay with PayPal</h3>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem' }}>
                    You'll be redirected to PayPal to complete your purchase securely.
                  </p>
                  <div className="mt-4 px-4 py-2 rounded-lg inline-block"
                    style={{ background: 'rgba(255,196,57,0.1)', border: '1px solid rgba(255,196,57,0.2)' }}>
                    <span style={{ color: '#ffc439', fontSize: '0.8rem' }}>Fast. Secure. Easy. — PayPal</span>
                  </div>
                </div>
              )}

              {/* ── Google Pay ── */}
              {method === 'gpay' && (
                <div className="animate-fade-in text-center py-8">
                  <div className="w-20 h-20 rounded-2xl mx-auto mb-5 flex items-center justify-center"
                    style={{ background: '#fff', boxShadow: '0 12px 28px rgba(0,0,0,0.3)' }}>
                    <svg width="40" height="40" viewBox="0 0 24 24">
                      <path d="M12 11.484V14.4h3.918c-.168.9-.648 1.68-1.404 2.196l2.268 1.764c1.32-1.224 2.088-3.024 2.088-5.16 0-.504-.048-.996-.132-1.716H12z" fill="#4285F4"/>
                      <path d="M5.844 14.292l-2.34 1.824C4.716 18.156 8.1 20 12 20c2.664 0 4.908-.876 6.54-2.376l-2.268-1.764c-.876.588-2.004.936-3.276.936-2.592 0-4.788-1.752-5.58-4.116l-.572.388z" fill="#34A853"/>
                      <path d="M3.504 8.58C3.18 9.396 3 10.284 3 11.196c0 .912.18 1.8.504 2.616l2.34-1.824a5.09 5.09 0 0 1 0-1.584L3.504 8.58z" fill="#FBBC05"/>
                      <path d="M12 7.2c1.464 0 2.772.504 3.804 1.488l2.268-2.268C16.5 4.8 14.4 4 12 4 8.1 4 4.716 5.844 3.504 8.58l2.34 1.824C6.636 8.448 9.072 7.2 12 7.2z" fill="#EA4335"/>
                    </svg>
                  </div>
                  <h3 className="text-white font-semibold mb-2">Pay with Google Pay</h3>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem' }}>
                    Checkout instantly using your Google Pay account.
                  </p>
                  <div className="mt-4 px-4 py-2 rounded-lg inline-block"
                    style={{ background: 'rgba(66,133,244,0.1)', border: '1px solid rgba(66,133,244,0.2)' }}>
                    <span style={{ color: '#60a5fa', fontSize: '0.8rem' }}>Secured by Google Pay</span>
                  </div>
                </div>
              )}

              {/* ── Apple Pay ── */}
              {method === 'applepay' && (
                <div className="animate-fade-in text-center py-8">
                  <div className="w-20 h-20 rounded-2xl mx-auto mb-5 flex items-center justify-center"
                    style={{ background: '#000', boxShadow: '0 12px 28px rgba(0,0,0,0.5)' }}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="white">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                  </div>
                  <h3 className="text-white font-semibold mb-2">Pay with Apple Pay</h3>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem' }}>
                    Complete checkout with Face ID or Touch ID.
                  </p>
                  <div className="mt-4 px-4 py-2 rounded-lg inline-block"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>Available on Safari / Apple devices</span>
                  </div>
                </div>
              )}

              {/* Pay button */}
              <button onClick={handlePay} className="btn-gradient w-full mt-7" style={{ padding: '15px' }}>
                <span className="flex items-center justify-center gap-2 font-semibold">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  {method === 'card'    ? `Start Free Trial — Pay $0 Today` : null}
                  {method === 'paypal'  ? 'Continue with PayPal'  : null}
                  {method === 'gpay'    ? 'Continue with Google Pay' : null}
                  {method === 'applepay'? 'Continue with Apple Pay' : null}
                </span>
              </button>

              <p className="text-center mt-4" style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem' }}>
                By continuing, you agree to our Terms of Service and Privacy Policy.
                Your trial is free for 7 days — you will only be billed after that.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
