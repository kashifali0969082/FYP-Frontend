import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import "./Landing";


  const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const savedToken = Cookies.get("access_token");
        
        if (savedToken) {
          try {
            const decoded = jwtDecode(savedToken);
            console.log("User is already authenticated, redirecting to dashboard...");
            // User is already logged in, redirect to dashboard
            navigate("/");
            return;
          } catch (err) {
            console.error("Invalid token, removing from cookies:", err);
            Cookies.remove("access_token");
          }
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthStatus();
  }, [navigate]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Intersection Observer for animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = "running";
        }
      });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll(
      ".feature-card, .stat-item"
    );
    animatedElements.forEach((el) => {
      el.style.animationPlayState = "paused";
      observer.observe(el);
    });

    // Stats counter animation
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const number = entry.target.querySelector(".stat-number");
            const text = number.textContent;
            if (text.includes("100K+")) animateCounter(number, 100000);
            else if (text.includes("50K+")) animateCounter(number, 50000);
            else if (text.includes("98%")) animateCounter(number, 98);
            else if (text.includes("24/7")) number.textContent = "24/7";
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    const statItems = document.querySelectorAll(".stat-item");
    statItems.forEach((item) => {
      statsObserver.observe(item);
    });

    return () => {
      observer.disconnect();
      statsObserver.disconnect();
    };
  }, []);

  const animateCounter = (element, target) => {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent =
        current < 1000
          ? Math.ceil(current) +
            (target >= 1000 ? "K+" : target === 98 ? "%" : "")
          : target === 24
          ? "24/7"
          : Math.ceil(current / 1000) + "K+";
    }, 20);
  };
 

  function SignInGoogle() {
    setIsSigningIn(true);
    
    // Add a small delay to show the loading state
    setTimeout(() => {
      window.location.href = "https://api.adaptivelearnai.xyz/google/login?redirect_origin=http://localhost:3000 ";
    }, 500);
  }

  const handleSignInWithGoogle = () => {
    if (!isSigningIn) {
      SignInGoogle();
    }
  };

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const features = [
    {
      icon: "fas fa-user-cog",
      title: "Personalized Learning",
      description:
        "Advanced AI algorithms analyze your learning patterns and adapt content to match your unique style and pace.",
    },
    {
      icon: "fas fa-brain",
      title: "AI Assistance",
      description:
        "Get instant help, explanations, and guidance from our intelligent AI tutors available 24/7.",
    },
    {
      icon: "fas fa-gamepad",
      title: "Interactive Learning",
      description:
        "Engage with dynamic, gamified content that makes learning enjoyable and memorable.",
    },
    {
      icon: "fas fa-universal-access",
      title: "Accessibility",
      description:
        "Inclusive design ensures learning materials are accessible to everyone, regardless of abilities.",
    },
    {
      icon: "fas fa-chart-line",
      title: "Progress Tracking",
      description:
        "Monitor your learning journey with detailed analytics and personalized insights.",
    },
    {
      icon: "fas fa-users",
      title: "Collaborative Learning",
      description:
        "Connect with peers, join study groups, and learn together in our vibrant community.",
    },
    {
      icon: "fas fa-users",
      title: "Collaborative Learning",
      description:
        "Connect with peers, join study groups, and learn together in our vibrant community.",
    },
    {
      icon: "fas fa-users",
      title: "Collaborative Learning",
      description:
        "Connect with peers, join study groups, and learn together in our vibrant community.",
    },
  ];
  const GoogleIcon = () => (
    <svg
      className="google-icon"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
  const stats = [
    { number: "100K+", label: "Active Learners" },
    { number: "50K+", label: "Courses Available" },
    { number: "98%", label: "Success Rate" },
    { number: "24/7", label: "AI Support" },
  ];

  const footerSections = [
    {
      title: "Platform",
      links: ["Features", "Courses", "AI Tutors", "Mobile App"],
    },
    {
      title: "Company",
      links: ["About Us", "Careers", "Press", "Blog"],
    },
    {
      title: "Support",
      links: [
        "Help Center",
        "Contact Us",
        "Privacy Policy",
        "Terms of Service",
      ],
    },
  ];

  return (
    <div className="landing-page">
      {isCheckingAuth ? (
        <div className="auth-loading-overlay">
          <div className="auth-loading-content">
            <div className="auth-loading-spinner"></div>
            <p>Checking authentication...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-animation"></div>

          {/* Header */}
          <header className={`header ${isScrolled ? "scrolled" : ""}`}>
        <nav className="nav-container">
          <div className="nav-logo">
            <i className="fas fa-brain"></i>
            LearnAI
          </div>
          <ul className={`nav-menu ${isMobileMenuOpen ? "mobile-open" : ""}`}>
            <li>
              <a href="#home" onClick={(e) => handleSmoothScroll(e, "#home")}>
                Home
              </a>
            </li>
            <li>
              <a
                href="#features"
                onClick={(e) => handleSmoothScroll(e, "#features")}
              >
                Features
              </a>
            </li>
            <li>
              <a href="#about" onClick={(e) => handleSmoothScroll(e, "#about")}>
                About
              </a>
            </li>
            <li>
              <a
                href="#contact"
                onClick={(e) => handleSmoothScroll(e, "#contact")}
              >
                Contact
              </a>
            </li>
          </ul>
          <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
            <i className="fas fa-bars">bars</i>
          </button>
        </nav>
      </header>

      {/* Main Container */}
      <div className="landing-container">
        {/* Hero Section */}
        <section className="hero-section" id="home">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">Transform Your Learning with AI</h1>
              <p className="hero-subtitle">
                Experience the Future of Education
              </p>
              <p className="hero-description">
                An innovative AI-driven educational platform designed to
                revolutionize your learning journey. Our advanced algorithms
                personalize content to match your unique learning style,
                ensuring optimal knowledge retention and accelerated skill
                development.
              </p>
              <button
                className={`google-signin-btn ${isSigningIn ? 'signing-in' : ''}`}
                onClick={handleSignInWithGoogle}
                disabled={isSigningIn}
              >
                {isSigningIn ? (
                  <>
                    <div className="loading-spinner"></div>
                    <span>Connecting to Google...</span>
                  </>
                ) : (
                  <>
                    <GoogleIcon />
                    <i className="fab fa-google"></i>
                    Continue with Google
                  </>
                )}
              </button>
            </div>
            <div className="hero-visual">
              <div className="ai-logo">
                <i className="fas fa-robot"></i>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section" id="features">
          <div className="features-container">
            <h2 className="features-title">Powerful Features</h2>
            <div className="features-grid">
              {features.map((feature, index) => (
                <div key={index} className="feature-card">
                  <div className="feature-icon">
                    <i className={feature.icon}></i>
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="stats-container">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <h3>LearnAI</h3>
            <p>
              Transforming education through artificial intelligence and
              personalized learning experiences.
            </p>
            <div className="social-icons">
              <a href="#" aria-label="Facebook">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" aria-label="LinkedIn">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
          {footerSections.map((section, index) => (
            <div key={index} className="footer-section">
              <h3>{section.title}</h3>
              <ul>
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href="#">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <p>
            &copy; 2025 LearnAI. All rights reserved. Powered by Advanced AI
            Technology.
          </p>
        </div>
      </footer>
        </>
      )}
    </div>
  );
};

export default LandingPage;