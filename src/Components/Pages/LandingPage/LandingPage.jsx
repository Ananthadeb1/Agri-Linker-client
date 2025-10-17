import React from 'react';

function LandingPage() {
    return (
        <div style={{ fontFamily: 'sans-serif', margin: 0, padding: 0 }}>
            {/* Hero Section */}
            <section style={{ background: '#e0f7fa', padding: '60px 20px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>
                    Welcome to Agri<span style={{ color: '#4BAF47' }}>Linker</span>
                </h1>
                <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
                    Sustainable agriculture for a greener future.
                </p>
                <button style={{ padding: '12px 32px', fontSize: '1rem', background: '#00796b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                    Get Started
                </button>
            </section>

            {/* Features Section */}
            <section style={{ display: 'flex', justifyContent: 'center', gap: '24px', padding: '40px 20px', background: '#fff' }}>
                <div style={{ flex: 1, maxWidth: '300px', background: '#f1f8e9', padding: '24px', borderRadius: '8px' }}>
                    <h2>Organic Crops</h2>
                    <p>Fresh, pesticide-free produce grown with care.</p>
                </div>
                <div style={{ flex: 1, maxWidth: '300px', background: '#f1f8e9', padding: '24px', borderRadius: '8px' }}>
                    <h2>Eco-Friendly Methods</h2>
                    <p>We use sustainable farming techniques to protect the earth.</p>
                </div>
                <div style={{ flex: 1, maxWidth: '300px', background: '#f1f8e9', padding: '24px', borderRadius: '8px' }}>
                    <h2>Community Support</h2>
                    <p>Partnering with local farmers and supporting our community.</p>
                </div>
            </section>

        </div>
    );
}

export default LandingPage;
