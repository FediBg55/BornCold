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
  const [step, setStep] = useState(0); // 0: Email, 1: Color, 2: Size, 3: Details, 4: Success
  const [formData, setFormData] = useState({
    email: '',
    color: '',
    size: '',
    name: '',
    phone: '',
    address: ''
  });

  const MODELS = [
    { id: 'black', name: 'VOID BLACK', img: '/assets/model_black.jpg' },
    { id: 'blue', name: 'ABYSS BLUE', img: '/assets/model_blue.jpg' },
    { id: 'purple', name: 'NEON PURPLE', img: '/assets/model_purple.jpg' },
  ];

  const SIZES = ['S', 'M', 'L', 'XL'];

  const validateStep = () => {
    if (step === 0) return formData.email.includes('@');
    if (step === 1) return formData.color !== '';
    if (step === 2) return formData.size !== '';
    if (step === 3) return formData.name && formData.phone && formData.address;
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (step === 3) {
        handleSubmit();
      } else {
        setStep(p => p + 1);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStep(4);
        console.log('Order registered:', formData);
      } else {
        const data = await response.json();
        alert('Error: ' + (data.error || response.statusText));
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error. Check console.');
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

        {step < 4 && (
          <h1 className="hero-title animate-fade-in delay-100">
            <span className="text-gradient drop-shadow-primary">Born</span>
            <span className="text-white drop-shadow-white">Cold</span>
          </h1>
        )}

        <div className="wizard-container animate-fade-in delay-200">

          {/* STEP 0: EMAIL */}
          {step === 0 && (
            <>
              <p className="hero-subtitle">
                The temperature drops when we arrive. <br />
                Enter the freeze.
              </p>
              <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="signup-form">
                <input
                  type="email"
                  placeholder="ENTER YOUR ICE MAIL"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="email-input glass-panel"
                  autoFocus
                />
                <button type="submit" className="submit-btn" disabled={!formData.email}>
                  ENTER
                </button>
              </form>
            </>
          )}

          {/* STEP 1: COLOR SELECTION */}
          {step === 1 && (
            <>
              <h3>CHOOSE YOUR ELEMENT</h3>
              <div className="models-grid">
                {MODELS.map((m) => (
                  <div
                    key={m.id}
                    className={`model-card ${formData.color === m.name ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, color: m.name })}
                  >
                    <img src={m.img} alt={m.name} className="model-img" />
                    <div className="model-name">{m.name}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* STEP 2: SIZE SELECTION */}
          {step === 2 && (
            <>
              <h3>CONFIRM YOUR FIT</h3>
              <div className="size-grid">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    className={`size-btn ${formData.size === s ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, size: s })}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* STEP 3: DETAILS */}
          {step === 3 && (
            <>
              <h3>FINAL DETAILS</h3>
              <div className="input-stack">
                <input
                  type="text"
                  placeholder="FULL NAME"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <input
                  type="tel"
                  placeholder="PHONE NUMBER"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="SHIPPING ADDRESS"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
            </>
          )}

          {/* NAVIGATION BUTTONS (For Steps 1, 2, 3) */}
          {step > 0 && step < 4 && (
            <div className="nav-buttons">
              <button className="submit-btn back-btn" onClick={() => setStep(step - 1)}>
                BACK
              </button>
              <button className="submit-btn next-btn" onClick={handleNext} disabled={!validateStep()}>
                {step === 3 ? 'CONFIRM ORDER' : 'NEXT'}
              </button>
            </div>
          )}

          {/* STEP 4: SUCCESS ANIMATION */}
          {step === 4 && (
            <div className="success-container glass-panel animate-fade-in">
              <div className="final-display">
                {MODELS.map((m) => (
                  <div key={m.id} className="final-card">
                    <img src={m.img} alt="Collection" />
                  </div>
                ))}
              </div>
              <h2 className="success-text">ORDER CONFIRMED</h2>
              <p>Welcome to the cold, {formData.name}.</p>
            </div>
          )}

        </div>

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
