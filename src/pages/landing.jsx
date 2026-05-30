import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { DotPattern } from "@/components/ui/dot-pattern";
import { Globe } from "@/components/ui/globe";
import { RippleButton } from "@/components/ui/ripple-button";
import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import { SpinningText } from "@/components/ui/spinning-text";
import { Lens } from "@/components/ui/lens";
import { VelocityScroll } from "@/components/ui/scroll-based-velocity";
import { AnimatedCircularProgressBar } from "@/components/ui/animated-circular-progress-bar";
async function callAnalyze(url) {
    const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || 'Analyze failed');
    return data;
}

function toAnalysisResult(response, url) {
    const analysis = response?.analysis || response || {};
    return {
        ...analysis,
        url: analysis.url || url,
        scraped: response?.scraped,
    };
}

const LandingPage = () => {
    const navigate = useNavigate();
    const [checkUrl, setCheckUrl] = useState("");
    const [isChecking, setIsChecking] = useState(false);
    const [checkingProgress, setCheckingProgress] = useState(0);
    const [checkingStatus, setCheckingStatus] = useState("");
    const [checkingError, setCheckingError] = useState("");
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleCheckSubmit = async (e) => {
        e.preventDefault();
        if (!checkUrl.trim()) return;

        setIsChecking(true);
        setCheckingProgress(0);
        setCheckingError("");
        setCheckingStatus("Establishing secure connection...");

        try {
            let progress = 0;
            const progressInterval = setInterval(() => {
                progress += 2;
                if (progress <= 35) {
                    setCheckingProgress(progress);
                }
            }, 500);

            setCheckingStatus("Scraping content from URL (server)...");
            const response = await callAnalyze(checkUrl);
            setCheckingProgress(60);

            setCheckingStatus("Finalizing analysis...");
            const analysisResult = toAnalysisResult(response, checkUrl);
            analysisResult.source = analysisResult.source || response?.scraped?.items?.[0]?.siteName || "";
            setCheckingProgress(100);
            setCheckingStatus("Analysis complete! Loading dashboard...");

            clearInterval(progressInterval);

            setTimeout(() => {
                setIsChecking(false);
                navigate("/dashboard", { state: { result: analysisResult, url: checkUrl, scanned: true } });
            }, 800);
        } catch (error) {
            console.error("Failed to analyze:", error);
            setCheckingError(error?.message || "Error analyzing URL. Please try again.");
            setCheckingStatus("Error analyzing URL. Please try again.");
            setTimeout(() => setIsChecking(false), 3000);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) return;
        setIsSubmitted(true);
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => {
            setIsSubmitted(false);
        }, 2000);
    };

    return (
        <main className="relative overflow-hidden">
            <DotPattern className="text-[#669BBC]" glow />
            <section className="mx-auto max-w-6xl px-6 pt-10">
                <div className="relative overflow-hidden rounded-3xl bg-[#FDF0D5] px-8 py-12 md:px-12">
                    <DotPattern className="text-[#669BBC]" glow />
                    <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
                        <div className="space-y-5">
                            <h1 className="text-5xl font-semibold text-[#003049] md:text-6xl lg:text-7xl">
                                Detect misinformation in seconds.
                            </h1>
                            <p className="text-base text-[#003049]/80">
                                Real-time analysis, trusted sources, and clear scoring to keep
                                your newsroom and community informed.
                            </p>
                            <form className="flex w-full max-w-md items-center gap-3" onSubmit={handleCheckSubmit}>
                                <input
                                    className="h-12 flex-1 rounded-xl border border-[#003049]/30 bg-[#FDF0D5] px-4 text-sm text-[#003049] placeholder:text-[#003049]/50 focus:border-[#669BBC] focus:outline-none"
                                    placeholder="Paste a link to verify"
                                    type="url"
                                    required
                                    value={checkUrl}
                                    onChange={(e) => setCheckUrl(e.target.value)}
                                />
                                <RippleButton
                                    type="submit"
                                    className="h-12 rounded-xl border-2 border-[#780000] bg-[#C1121F] px-5 text-sm font-semibold text-[#FDF0D5] cursor-pointer"
                                    rippleColor="#669BBC"
                                >
                                    Check Now
                                </RippleButton>
                            </form>
                            {checkingError ? (
                                <p className="mt-3 max-w-md rounded-xl border border-[#C1121F]/30 bg-[#C1121F]/10 px-4 py-3 text-sm text-[#780000]">
                                    {checkingError}
                                </p>
                            ) : null}
                        </div>
                        <div className="relative h-[380px]">
                            <Globe
                                className="left-auto right-0 top-[-10%] max-w-[440px] opacity-90"
                                config={{
                                    baseColor: [102 / 255, 155 / 255, 188 / 255],
                                    glowColor: [253 / 255, 240 / 255, 213 / 255],
                                    markerColor: [193 / 255, 18 / 255, 31 / 255],
                                }}
                            />
                        </div>
                    </div>
                </div>
            </section>
            <section className="mx-auto max-w-6xl px-6 py-14">
                <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
                    <div className="relative mx-auto flex h-[320px] w-full max-w-[380px] items-center justify-center">
                        <OrbitingCircles
                            className="text-[#669BBC]"
                            iconSize={46}
                            radius={145}
                            duration={18}
                        >
                            <img src="/facebook-icon.svg" alt="Facebook" className="h-10 w-10" />
                            <img src="/instagram-icon.svg" alt="Instagram" className="h-10 w-10" />
                            <img src="/youtube.svg" alt="YouTube" className="h-10 w-10" />
                        </OrbitingCircles>
                        <OrbitingCircles
                            className="text-[#C1121F]"
                            iconSize={34}
                            radius={100}
                            duration={14}
                            reverse
                        >
                            <img src="/x_dark.svg" alt="X" className="h-8 w-8" />
                            <img src="/threads_dark.svg" alt="Threads" className="h-8 w-8" />
                            <img src="/bluesky.svg" alt="Bluesky" className="h-8 w-8" />
                            <img src="/reddit.svg" alt="Reddit" className="h-8 w-8" />
                        </OrbitingCircles>
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-4xl font-semibold text-[#003049] md:text-5xl lg:text-6xl">
                            Guarding across various platforms.
                        </h2>
                        <p className="text-lg text-[#003049]/80">
                            Guarding you from fake news across social feeds, headlines, and
                            breaking updates with always-on verification.
                        </p>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-6 pb-16">
                <div className="space-y-8">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-semibold text-[#003049] md:text-4xl">
                            Services we offer
                        </h2>
                        <p className="text-base text-[#780000]">
                            Instant clarity for every headline you read.
                        </p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <article className="rounded-2xl border-2 border-[#780000] bg-[#FDF0D5] p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-[#003049]">
                                Instant credibility verdict
                            </h3>
                            <p className="mt-2 text-sm text-[#003049]/80">
                                We scrape the full article, cross-check trusted sources, and
                                deliver a clear verdict in seconds.
                            </p>
                        </article>
                        <article className="rounded-2xl border-2 border-[#780000] bg-[#FDF0D5] p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-[#003049]">
                                Claim-by-claim scoring
                            </h3>
                            <p className="mt-2 text-sm text-[#003049]/80">
                                Each key claim is labeled verified, false, or unverified with
                                transparent evidence links.
                            </p>
                        </article>
                        <article className="rounded-2xl border-2 border-[#780000] bg-[#FDF0D5] p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-[#003049]">
                                Bias and sentiment analysis
                            </h3>
                            <p className="mt-2 text-sm text-[#003049]/80">
                                Measure political bias, emotional tone, and manipulation
                                tactics like fear-based language.
                            </p>
                        </article>
                        <article className="rounded-2xl border-2 border-[#780000] bg-[#FDF0D5] p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-[#003049]">
                                Trust and freshness signals
                            </h3>
                            <p className="mt-2 text-sm text-[#003049]/80">
                                See source credibility, article freshness, and reading-level
                                red flags in one view.
                            </p>
                        </article>
                    </div>
                </div>
            </section>


            <section className="mx-auto max-w-6xl px-6 py-16">
                <div className="grid gap-12 lg:grid-cols-2 items-center">
                    <div className="flex flex-col items-center justify-center text-center">
                        <h2 className="text-3xl font-semibold text-[#003049] md:text-4xl mb-8">Fake News under the Lens</h2>
                        <div className="relative flex items-center justify-center h-[360px] w-[360px] md:h-[400px] md:w-[400px] mx-auto rounded-full bg-[#FDF0D5]/50 border border-[#669BBC]/20">
                            <div className="absolute text-center z-10 max-w-[160px]">
                                <p className="text-2xl font-bold uppercase tracking-tight text-[#669BBC]">securing</p>
                                <p className="text-sm font-semibold uppercase tracking-widest text-[#003049] mt-1">the web</p>
                            </div>
                            <SpinningText
                                radius={10}
                                duration={16}
                                className="text-[#C1121F] font-semibold tracking-widest text-base md:text-lg select-none"
                            >
                                {"NEWS GUARD • NEWS GUARD • NEWS GUARD • NEWS GUARD • NEWS GUARD • "}
                            </SpinningText>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-2xl font-bold text-[#003049]">Interactive Verification</h3>
                            <p className="text-base text-[#003049]/80 mt-2">
                                Hover over the card below to experience how our advanced verification system inspects, dissects, and reveals the truth behind questionable headlines.
                            </p>
                        </div>
                        <div className="max-w-md mx-auto lg:mx-0">
                            <Lens zoomFactor={1.4} lensSize={160} lensColor="#003049">
                                <div className="relative rounded-3xl border-2 border-[#780000] bg-[#FDF0D5] p-6 shadow-sm overflow-hidden select-none">
                                    <div className="flex items-center justify-between border-b border-[#003049]/20 pb-3">
                                        <span className="text-xs font-bold uppercase tracking-wider text-[#C1121F]">Verification Scanner</span>
                                        <span className="rounded-full bg-[#C1121F] px-2.5 py-0.5 text-[10px] font-bold text-[#FDF0D5] uppercase tracking-wider">Fake News Detected</span>
                                    </div>
                                    <div className="mt-4 space-y-3">
                                        <h4 className="text-base font-bold text-[#669BBC] leading-snug">
                                            "Mysterious satellite signals detected from deep space are confirmed as alien communications."
                                        </h4>
                                        <p className="text-xs text-[#003049]/80 leading-relaxed">
                                            <span className="font-semibold text-[#780000]">Origin:</span> Satirical space blog masquerading as a scientific journal.
                                        </p>
                                        <div className="rounded-2xl bg-white/60 p-4 border border-[#003049]/10">
                                            <p className="text-[9px] text-[#C1121F] uppercase font-bold tracking-wider">Disproof Evidence</p>
                                            <p className="mt-1 text-[11px] text-[#003049] leading-relaxed">
                                                The signal was identified as standard radio interference from a nearby microwave oven at the observatory. The original study was a joke published by researchers in 1998, recirculated today as fake breaking news.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Lens>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-6 pb-20">
                <div className="space-y-8">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-semibold text-[#003049] md:text-4xl">
                            Simple, transparent pricing
                        </h2>
                        <p className="text-base text-[#780000]">
                            Choose the plan that fits your news guarding needs.
                        </p>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="flex flex-col justify-between rounded-3xl border-2 border-[#780000] bg-[#FDF0D5] p-6 shadow-sm hover:shadow-md transition-all duration-300">
                            <div>
                                <h3 className="text-xl font-bold text-[#003049]">Free</h3>
                                <div className="my-4">
                                    <span className="text-3xl font-extrabold text-[#003049]">$0</span>
                                    <span className="text-[#003049]/70 text-sm">/month</span>
                                </div>
                                <ul className="space-y-3 text-sm text-[#003049]/90 mb-6">
                                    <li className="flex items-center gap-2">
                                        <span className="text-[#C1121F] font-bold">✓</span>
                                        <span>5 article scans per day</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-[#C1121F] font-bold">✓</span>
                                        <span>Standard verification speed</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-[#C1121F] font-bold">✓</span>
                                        <span>Basic bias check & score</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-[#C1121F] font-bold">✓</span>
                                        <span>Ad-supported interface</span>
                                    </li>
                                </ul>
                            </div>
                            <button className="w-full py-2.5 px-4 rounded-xl bg-[#003049] hover:bg-[#003049]/90 text-white font-medium text-sm transition-colors cursor-pointer">
                                Get Started
                            </button>
                        </div>

                        <div className="flex flex-col justify-between rounded-3xl border-2 border-[#780000] bg-[#FDF0D5] p-6 shadow-sm hover:shadow-md transition-all duration-300">
                            <div>
                                <h3 className="text-xl font-bold text-[#003049]">Basic</h3>
                                <div className="my-4">
                                    <span className="text-3xl font-extrabold text-[#003049]">$9</span>
                                    <span className="text-[#003049]/70 text-sm">/month</span>
                                </div>
                                <ul className="space-y-3 text-sm text-[#003049]/90 mb-6">
                                    <li className="flex items-center gap-2">
                                        <span className="text-[#C1121F] font-bold">✓</span>
                                        <span>50 article scans per day</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-[#C1121F] font-bold">✓</span>
                                        <span>Faster analysis response</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-[#C1121F] font-bold">✓</span>
                                        <span>Claim-by-claim scoring</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-[#C1121F] font-bold">✓</span>
                                        <span>Email customer support</span>
                                    </li>
                                </ul>
                            </div>
                            <button className="w-full py-2.5 px-4 rounded-xl bg-[#003049] hover:bg-[#003049]/90 text-white font-medium text-sm transition-colors cursor-pointer">
                                Go Basic
                            </button>
                        </div>

                        <div className="relative flex flex-col justify-between rounded-3xl border-2 border-[#C1121F] bg-white p-6 shadow-md lg:scale-105 z-10 transition-all duration-300">
                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C1121F] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                Most Popular
                            </span>
                            <div>
                                <h3 className="text-xl font-bold text-[#003049]">Pro</h3>
                                <div className="my-4">
                                    <span className="text-3xl font-extrabold text-[#003049]">$29</span>
                                    <span className="text-[#003049]/70 text-sm">/month</span>
                                </div>
                                <ul className="space-y-3 text-sm text-[#003049]/90 mb-6">
                                    <li className="flex items-center gap-2">
                                        <span className="text-[#C1121F] font-bold">✓</span>
                                        <span>Unlimited article scans</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-[#C1121F] font-bold">✓</span>
                                        <span>Real-time API access</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-[#C1121F] font-bold">✓</span>
                                        <span>Advanced bias & sentiment</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-[#C1121F] font-bold">✓</span>
                                        <span>Priority 24/7 support</span>
                                    </li>
                                </ul>
                            </div>
                            <button className="w-full py-2.5 px-4 rounded-xl bg-[#C1121F] hover:bg-[#780000] text-white font-medium text-sm transition-colors cursor-pointer">
                                Upgrade to Pro
                            </button>
                        </div>

                        <div className="flex flex-col justify-between rounded-3xl border-2 border-[#780000] bg-[#FDF0D5] p-6 shadow-sm hover:shadow-md transition-all duration-300">
                            <div>
                                <h3 className="text-xl font-bold text-[#003049]">Enterprise</h3>
                                <div className="my-4">
                                    <span className="text-3xl font-extrabold text-[#003049]">Custom</span>
                                </div>
                                <ul className="space-y-3 text-sm text-[#003049]/90 mb-6">
                                    <li className="flex items-center gap-2">
                                        <span className="text-[#C1121F] font-bold">✓</span>
                                        <span>Custom API rate limits</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-[#C1121F] font-bold">✓</span>
                                        <span>Single Sign-On (SSO)</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-[#C1121F] font-bold">✓</span>
                                        <span>Dedicated account manager</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-[#C1121F] font-bold">✓</span>
                                        <span>Custom trust sources</span>
                                    </li>
                                </ul>
                            </div>
                            <button className="w-full py-2.5 px-4 rounded-xl bg-[#003049] hover:bg-[#003049]/90 text-white font-medium text-sm transition-colors cursor-pointer">
                                Contact Sales
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="w-full py-10 border-y-2 border-[#003049]/10 overflow-hidden bg-[#FDF0D5]/30 my-8">
                <VelocityScroll
                    text="News guard protecting from fake news • "
                    defaultVelocity={3}
                    className="font-sans text-center text-4xl font-extrabold tracking-tight text-[#669BBC] md:text-7xl md:leading-[5rem]"
                />
            </section>

            <section className="mx-auto max-w-3xl px-6 pb-20 pt-10">
                <div className="relative overflow-hidden rounded-3xl bg-[#FDF0D5] px-6 py-10 md:px-12 border-2 border-[#780000]/20 text-center">
                    <DotPattern className="text-[#669BBC] opacity-30" glow />
                    <div className="relative z-10 space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold text-[#003049] md:text-4xl">
                                Get in Touch with Us
                            </h2>
                            <p className="text-sm text-[#669BBC]/80 max-w-lg mx-auto leading-relaxed">
                                Have questions about source verification or custom plans? Drop us a line and we'll reply within 24 hours.
                            </p>
                        </div>

                        <div className="mx-auto max-w-xl rounded-2xl border border-[#003049]/10 bg-white/50 p-6 shadow-sm backdrop-blur-sm text-left">
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-1">
                                        <label htmlFor="name" className="text-xs font-semibold text-[#003049]">
                                            Full Name
                                        </label>
                                        <input
                                            id="name"
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="h-10 w-full rounded-xl border border-[#003049]/20 bg-white px-3.5 text-xs text-[#003049] placeholder:text-[#003049]/40 focus:border-[#C1121F] focus:outline-none transition-colors"
                                            placeholder="Your Full Name"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label htmlFor="email" className="text-xs font-semibold text-[#003049]">
                                            Email Address
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="h-10 w-full rounded-xl border border-[#003049]/20 bg-white px-3.5 text-xs text-[#003049] placeholder:text-[#003049]/40 focus:border-[#C1121F] focus:outline-none transition-colors"
                                            placeholder="Enter your email address"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label htmlFor="message" className="text-xs font-semibold text-[#003049]">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        rows={3}
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full rounded-xl border border-[#003049]/20 bg-white p-3 text-xs text-[#003049] placeholder:text-[#003049]/40 focus:border-[#C1121F] focus:outline-none transition-colors resize-none"
                                        placeholder="How can we help you?"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="flex w-fit px-10 mx-auto h-10 items-center justify-center gap-2 rounded-xl bg-[#C1121F] hover:bg-[#780000] text-[#FDF0D5] font-semibold text-xs transition-all duration-300 shadow-md cursor-pointer hover:shadow-lg active:scale-[0.98]"
                                >
                                    <Send className="h-3.5 w-3.5" />
                                    Send Message
                                </button>
                            </form>

                            {isSubmitted && (
                                <div className="mt-3 flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/10 p-2.5 text-xs font-semibold text-green-700">
                                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-white text-[9px]">✓</span>
                                    Your message has been sent successfully!
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {isChecking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#003049]/40 backdrop-blur-sm">
                    <div className="relative overflow-hidden rounded-3xl bg-[#FDF0D5] p-8 border-2 border-[#780000]/25 shadow-xl max-w-sm w-full text-center space-y-6 mx-4">
                        <DotPattern className="text-[#669BBC] opacity-35" glow />
                        <div className="relative z-10 flex flex-col items-center">
                            <h3 className="text-xl font-extrabold text-[#003049] mb-4">
                                Inspecting your link.....
                            </h3>

                            <AnimatedCircularProgressBar
                                max={100}
                                min={0}
                                value={checkingProgress}
                                gaugePrimaryColor="#C1121F"
                                gaugeSecondaryColor="rgba(0, 48, 73, 0.1)"
                                className="size-36 text-xl font-bold"
                            />

                            <p className="mt-4 text-xs font-mono text-[#003049]/70 h-5">
                                {checkingStatus}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default LandingPage;
