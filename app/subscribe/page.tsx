'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const states = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

export default function SubscribePage() {
  const [email, setEmail] = useState('');
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleStateToggle = (state: string) => {
    setSelectedStates(prev =>
      prev.includes(state)
        ? prev.filter(s => s !== state)
        : [...prev, state]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setShowPopup(false);

    if (!email || selectedStates.length === 0) {
      setPopupMessage('Please enter an email and select at least one state');
      setShowPopup(true);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          states: selectedStates,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to subscribe');
      }

      setPopupMessage('Successfully subscribed to alerts! You will receive a confirmation email shortly.');
      setShowPopup(true);
      setEmail('');
      setSelectedStates([]);
    } catch (error) {
      setPopupMessage('Failed to subscribe. Please try again.');
      setShowPopup(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Hero Section */}
      <section style={{ position: 'relative', padding: '5rem 0', backgroundColor: '#1e40af', color: 'white' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.2 }}>
          <Image 
            src="https://images.unsplash.com/photo-1561484930-998b6a7b22e8" 
            alt="Weather map background" 
            fill
            sizes="100vw"
            priority
            style={{ 
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
        </div>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Subscribe to Weather Alerts</h1>
          <p style={{ fontSize: '1.25rem', maxWidth: '48rem', margin: '0 auto' }}>
            Select the states you want to monitor and receive instant email notifications when severe weather events occur.
          </p>
        </div>
      </section>

      {/* Subscription Form Section */}
      <section style={{ padding: '4rem 0', backgroundColor: '#f9fafb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '0.75rem', 
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)', 
            overflow: 'hidden' 
          }}>
            <div className="flex flex-col md:flex-row">
              <div className="bg-blue-700 p-8 text-white md:w-1/3">
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>Why Subscribe?</h2>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <li style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.5rem', width: '1.5rem', marginRight: '0.5rem', color: '#facc15', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Immediate notifications about severe weather</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.5rem', width: '1.5rem', marginRight: '0.5rem', color: '#facc15', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Customized by state to reduce alert fatigue</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.5rem', width: '1.5rem', marginRight: '0.5rem', color: '#facc15', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Detailed information about each event</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.5rem', width: '1.5rem', marginRight: '0.5rem', color: '#facc15', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Free service with no obligations</span>
                  </li>
                </ul>
              </div>
              
              <div className="p-8 md:w-2/3">
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <label htmlFor="email" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ 
                        width: '100%', 
                        padding: '0.75rem', 
                        border: '1px solid #d1d5db', 
                        borderRadius: '0.375rem',
                        transition: 'all 0.2s' 
                      }}
                      placeholder="Enter your email address"
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      Select States <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>({selectedStates.length} selected)</span>
                    </label>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
                      gap: '0.5rem', 
                      maxHeight: '20rem', 
                      overflowY: 'auto', 
                      padding: '0.5rem', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '0.375rem' 
                    }}>
                      {states.map((state) => (
                        <label
                          key={state}
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            padding: '0.5rem', 
                            border: '1px solid', 
                            borderColor: selectedStates.includes(state) ? '#3b82f6' : '#e5e7eb',
                            borderRadius: '0.375rem', 
                            cursor: 'pointer',
                            backgroundColor: selectedStates.includes(state) ? '#eff6ff' : 'transparent',
                            color: selectedStates.includes(state) ? '#1d4ed8' : 'inherit',
                            transition: 'all 0.2s'
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={selectedStates.includes(state)}
                            onChange={() => handleStateToggle(state)}
                            style={{ marginRight: '0.5rem' }}
                          />
                          {state}
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{ 
                      width: '100%', 
                      padding: '0.75rem 1rem', 
                      borderRadius: '0.375rem', 
                      color: 'white', 
                      fontSize: '1.125rem', 
                      fontWeight: '500',
                      backgroundColor: isLoading ? '#60a5fa' : '#2563eb',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    {isLoading ? 'Processing...' : 'Subscribe to Alerts'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ padding: '4rem 0', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '3rem' }}>How It Works</h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '2rem', 
            textAlign: 'center' 
          }}>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ 
                width: '4rem', 
                height: '4rem', 
                backgroundColor: '#dbeafe', 
                color: '#2563eb', 
                borderRadius: '9999px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                margin: '0 auto 1rem' 
              }}>1</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>Subscribe</h3>
              <p style={{ color: '#4b5563' }}>Enter your email and select the states you want to monitor for weather alerts.</p>
            </div>
            
            <div style={{ padding: '1.5rem' }}>
              <div style={{ 
                width: '4rem', 
                height: '4rem', 
                backgroundColor: '#dbeafe', 
                color: '#2563eb', 
                borderRadius: '9999px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                margin: '0 auto 1rem' 
              }}>2</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>We Monitor</h3>
              <p style={{ color: '#4b5563' }}>Our system constantly checks for severe weather events from official sources.</p>
            </div>
            
            <div style={{ padding: '1.5rem' }}>
              <div style={{ 
                width: '4rem', 
                height: '4rem', 
                backgroundColor: '#dbeafe', 
                color: '#2563eb', 
                borderRadius: '9999px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                margin: '0 auto 1rem' 
              }}>3</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>Get Notified</h3>
              <p style={{ color: '#4b5563' }}>When we detect severe weather in your selected states, you'll receive an email alert.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popup Notification */}
      {showPopup && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          backgroundColor: 'rgba(0, 0, 0, 0.5)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '1rem', 
          zIndex: 50 
        }}>
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '0.5rem', 
            padding: '1.5rem', 
            maxWidth: '28rem', 
            width: '100%', 
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              {popupMessage.includes('Successfully') ? (
                <div style={{ 
                  width: '4rem', 
                  height: '4rem', 
                  backgroundColor: '#d1fae5', 
                  borderRadius: '9999px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '2rem', width: '2rem', color: '#10b981' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : (
                <div style={{ 
                  width: '4rem', 
                  height: '4rem', 
                  backgroundColor: '#fee2e2', 
                  borderRadius: '9999px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '2rem', width: '2rem', color: '#ef4444' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              )}
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', textAlign: 'center' }}>
              {popupMessage.includes('Successfully') ? 'Success!' : 'Error'}
            </h3>
            <p style={{ marginBottom: '1.5rem', textAlign: 'center' }}>{popupMessage}</p>
            <button
              onClick={() => setShowPopup(false)}
              style={{ 
                width: '100%', 
                backgroundColor: '#2563eb', 
                color: 'white', 
                padding: '0.5rem 1rem', 
                borderRadius: '0.375rem', 
                transition: 'background-color 0.2s' 
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 