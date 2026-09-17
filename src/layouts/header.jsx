import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    if (location.pathname !== "/") {
      navigate(`/#${id}`);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 150);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="w-full border-b-2 border-[#669BBC] bg-[#FDF0D5] sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 py-3 sm:py-4">
        <Link className="flex items-center gap-3 cursor-pointer" to="/">
          <img
            src="/logo.svg"
            alt="News Guard logo"
            className="h-10 sm:h-12 w-auto"
          />
          <span className="text-lg sm:text-xl font-bold tracking-tight text-[#C1121F]">
            NEWS GUARD
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-semibold uppercase tracking-wider text-[#003049] md:flex">
          <button
            onClick={() => scrollToSection("services")}
            className="cursor-pointer transition-colors hover:text-[#669BBC]"
            type="button"
          >
            Services
          </button>
          <button
            onClick={() => scrollToSection("about")}
            className="cursor-pointer transition-colors hover:text-[#669BBC]"
            type="button"
          >
            About
          </button>
          <button
            onClick={() => scrollToSection("pricing")}
            className="cursor-pointer transition-colors hover:text-[#669BBC]"
            type="button"
          >
            Pricing
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className="cursor-pointer transition-colors hover:text-[#669BBC]"
            type="button"
          >
            Contact
          </button>
        </nav>

        <div className="hidden sm:flex items-center">
          <div onClick={() => scrollToSection("scanner")}>
            <InteractiveHoverButton className="bg-[#003049] text-[#FDF0D5] border-[#669BBC] [&_.bg-primary]:bg-[#669BBC] [&_.text-primary-foreground]:text-[#FDF0D5]">
              Guard me
            </InteractiveHoverButton>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#003049] hover:text-[#C1121F] transition-colors cursor-pointer"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#669BBC]/30 bg-[#FDF0D5] px-6 py-4 space-y-3">
          <button
            onClick={() => scrollToSection("services")}
            className="block w-full text-left text-sm font-semibold uppercase tracking-wider text-[#003049] py-1 hover:text-[#669BBC]"
          >
            Services
          </button>
          <button
            onClick={() => scrollToSection("about")}
            className="block w-full text-left text-sm font-semibold uppercase tracking-wider text-[#003049] py-1 hover:text-[#669BBC]"
          >
            About
          </button>
          <button
            onClick={() => scrollToSection("pricing")}
            className="block w-full text-left text-sm font-semibold uppercase tracking-wider text-[#003049] py-1 hover:text-[#669BBC]"
          >
            Pricing
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className="block w-full text-left text-sm font-semibold uppercase tracking-wider text-[#003049] py-1 hover:text-[#669BBC]"
          >
            Contact
          </button>
          <div className="pt-2">
            <button
              onClick={() => scrollToSection("scanner")}
              className="w-full py-2.5 rounded-xl bg-[#003049] text-white text-xs font-semibold uppercase tracking-wider cursor-pointer"
            >
              Guard me
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
