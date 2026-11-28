import LandingNavbar from "../components/LandingNavbar";
import LandingShowcaseBottom from "../components/LandingShowcaseBottom";
import LandingShowcaseTop from "../components/LandingShowcaseTop";
import "../assets/styles/global.css";

export function LandingHome({ onOpenLogin, onOpenSignup, onTryDemo }) {
  return (
    <div className="landing-page">
      <LandingNavbar onOpenLogin={onOpenLogin} onOpenSignup={onOpenSignup} />
      <main>
        <LandingShowcaseTop onOpenSignup={onOpenSignup} onTryDemo={onTryDemo} />
        <LandingShowcaseBottom
          onOpenLogin={onOpenLogin}
          onOpenSignup={onOpenSignup}
          onTryDemo={onTryDemo}
        />
      </main>
    </div>
  );
}
