import { useState, useEffect } from 'react';
import './index.css';

const SnowParticles = () => {
  const [flakes, setFlakes] = useState([]);

  useEffect(() => {
    const createFlake = () => ({
      id: Math.random(),
      left: Math.random() * 100 + 'vw',
      size: Math.random() * 4 + 2 + 'px',
      duration: Math.random() * 5 + 5 + 's',
      delay: Math.random() * 5 + 's',
      opacity: Math.random() * 0.5 + 0.3
    });

    const initialFlakes = Array.from({ length: 50 }).map(createFlake);
    setFlakes(initialFlakes);
  }, []);

  return (
    <>
      {flakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake"
          style={{
            left: flake.left,
            width: flake.size,
            height: flake.size,
            animationDuration: flake.duration,
            animationDelay: flake.delay,
            opacity: flake.opacity
          }}
        />
      ))}
    </>
  );
};

function App() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email) {
      try {
        const response = await fetch('http://localhost:3001/api/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        if (response.ok) {
          setSubmitted(true);
          console.log('Registered:', email);
        } else {
          // Handle specific errors like duplicates
          console.error('Subscription failed:', response.statusText);
        }
      } catch (error) {
        console.error('Network error:', error);
      }
    }
  };

  return (
    <div className="app-container">
      {/* Background Image with Overlay */}
      <div
        className="bg-image"
        style={{
          backgroundImage: 'url(/assets/background_v2.jpg)',
        }}
      />

      {/* Overlays */}
      <div className="bg-overlay" />
      <div className="bg-radial-overlay" />

      {/* Top Left Logo */}
      <div className="logo-corner animate-fade-in">
        <div className="logo-wrapper glass-panel">
          <img
            src="/assets/image2.png"
            alt="BORNCOLD Logo"
            className="logo-img"
            onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.classList.add('logo-text-fallback'); e.target.parentElement.innerText = 'BC' }}
          />
        </div>
      </div>

      <SnowParticles />

      {/* Main Content */}
      <main className="main-content">



        <h1 className="hero-title animate-fade-in delay-100">
          <span className="text-gradient drop-shadow-primary">Born</span>
          <span className="text-white drop-shadow-white">Cold</span>
        </h1>

        <p className="hero-subtitle animate-fade-in delay-200">
          The temperature drops when we arrive. <br />
          Streetwear forged in zero degrees.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="signup-form animate-fade-in delay-300">
            <input
              type="email"
              placeholder="ENTER YOUR ICE MAIL"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="email-input glass-panel"
            />
            <button
              type="submit"
              className="submit-btn"
            >
              Get Notified
            </button>
          </form>
        ) : (
          <div className="success-message glass-panel animate-fade-in">
            <h3>You are on the list.</h3>
            <p>Prepare for the drop. Stay cold.</p>
          </div>
        )}

        <div className="social-links animate-fade-in delay-300">
          <div className="social-icon">IG</div>
          <div className="social-icon">TT</div>
          <div className="social-icon">X</div>
        </div>

      </main>

      {/* Decorative Bottom Fade */}
      <div className="bottom-fade"></div>
    </div>
  );
}

export default App;
