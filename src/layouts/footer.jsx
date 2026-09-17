const Footer = () => {
  return (
    <footer className="w-full border-t-2 border-[#669BBC] bg-[#FDF0D5] text-[#003049]">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-[1.2fr_2fr_1.1fr]">
          <div className="flex flex-col items-start">
            <img
              src="/logo.svg"
              alt="News Guard logo"
              className="h-10 w-auto"
            />
            <span className="mt-2 text-sm font-semibold text-[#C1121F]">
              NEWS GUARD
            </span>
            <div className="mt-4 space-y-1 text-sm text-[#003049]/80">
              <p>Phone: +91 8910165131</p>
              <p>Email: info@newsguard.com</p>
              <p>Address: Zeta II, Greater Noida, India</p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">
                Legal
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-[#003049]/80">
                <li>
                  <a className="hover:text-[#669BBC] transition-colors" href="#">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a className="hover:text-[#669BBC] transition-colors" href="#">
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a className="hover:text-[#669BBC] transition-colors" href="#">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a className="hover:text-[#669BBC] transition-colors" href="#">
                    Disclaimer
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">
                Help
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-[#003049]/80">
                <li>
                  <a className="hover:text-[#669BBC] transition-colors" href="#">
                    FAQs
                  </a>
                </li>
                <li>
                  <a className="hover:text-[#669BBC] transition-colors" href="#">
                    Guides
                  </a>
                </li>
                <li>
                  <a className="hover:text-[#669BBC] transition-colors" href="#">
                    Community
                  </a>
                </li>
                <li>
                  <a className="hover:text-[#669BBC] transition-colors" href="#">
                    Status
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">
                Support
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-[#003049]/80">
                <li>
                  <a className="hover:text-[#669BBC] transition-colors" href="#">
                    Contact Support
                  </a>
                </li>
                <li>
                  <a className="hover:text-[#669BBC] transition-colors" href="#">
                    Tickets
                  </a>
                </li>
                <li>
                  <a className="hover:text-[#669BBC] transition-colors" href="#">
                    Security
                  </a>
                </li>
                <li>
                  <a className="hover:text-[#669BBC] transition-colors" href="#">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Follow us on socials
            </h3>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <a href="#" className="p-2 rounded-xl bg-white/40 hover:bg-white/70 transition-colors flex items-center justify-center">
                <img src="/facebook-icon.svg" alt="Facebook" className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-xl bg-white/40 hover:bg-white/70 transition-colors flex items-center justify-center">
                <img src="/instagram-icon.svg" alt="Instagram" className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-xl bg-white/40 hover:bg-white/70 transition-colors flex items-center justify-center">
                <img src="/youtube.svg" alt="YouTube" className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-xl bg-white/40 hover:bg-white/70 transition-colors flex items-center justify-center">
                <img src="/github_dark.svg" alt="GitHub" className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-xl bg-white/40 hover:bg-white/70 transition-colors flex items-center justify-center">
                <img src="/x_dark.svg" alt="X" className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-xl bg-white/40 hover:bg-white/70 transition-colors flex items-center justify-center">
                <img src="/bluesky.svg" alt="Bluesky" className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <hr className="my-8 border-[#669BBC]/30" />
        <p className="text-center text-xs text-[#003049]/70">
          All rights reserved News Guard 2026
        </p>
      </div>
    </footer>
  );
};

export default Footer;
