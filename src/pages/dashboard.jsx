import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Globe,
  Copy,
  Download,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { DotPattern } from "@/components/ui/dot-pattern";

async function callAnalyze(url) {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Analyze failed");
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

const CIRCUMFERENCE = 2 * Math.PI * 22;

const getRingColor = (score) => {
  if (score >= 70) return "#16a34a";
  if (score >= 40) return "#d97706";
  return "#C1121F";
};

const getVerdictStyle = (score) => {
  if (score >= 80)
    return {
      bg: "bg-green-600/10",
      border: "border-green-600/25",
      text: "text-green-700",
      iconBg: "bg-green-600",
      icon: "✓",
      pillBg: "bg-green-600",
    };
  if (score >= 50)
    return {
      bg: "bg-amber-500/10",
      border: "border-amber-500/25",
      text: "text-amber-700",
      iconBg: "bg-amber-600",
      icon: "⚠",
      pillBg: "bg-amber-600",
    };
  return {
    bg: "bg-[#C1121F]/10",
    border: "border-[#C1121F]/25",
    text: "text-[#C1121F]",
    iconBg: "bg-[#C1121F]",
    icon: "✗",
    pillBg: "bg-[#C1121F]",
  };
};

const getClaimDot = (status) => {
  if (status === "Verified") return { icon: "✓", bg: "bg-green-600" };
  if (status === "False") return { icon: "✗", bg: "bg-[#C1121F]" };
  return { icon: "⚠", bg: "bg-amber-500" };
};

const getSourceTagStyle = (status) => {
  if (status === "Contradicts" || status === "Confirms")
    return { dot: "bg-green-500", tagBg: "bg-green-500/10", tagText: "text-green-700" };
  if (status === "Partial")
    return { dot: "bg-amber-500", tagBg: "bg-amber-500/10", tagText: "text-amber-700" };
  return { dot: "bg-[#C1121F]", tagBg: "bg-[#C1121F]/10", tagText: "text-[#C1121F]" };
};

const getReadingLevelStyle = (label) => {
  if (label === "Sensational")
    return { bg: "bg-[#C1121F]/10", text: "text-[#C1121F]", barColor: "#C1121F" };
  if (label === "Academic")
    return { bg: "bg-green-600/10", text: "text-green-700", barColor: "#16a34a" };
  return { bg: "bg-amber-500/10", text: "text-amber-700", barColor: "#d97706" };
};

const ScoreRing = ({ animatedValue, label, sublabel, color }) => (
  <div className="rounded-2xl border-2 border-[#669BBC] bg-transparent p-4 sm:p-5">
    <div className="text-[11px] font-bold uppercase tracking-wider text-[#003049] mb-3 text-center sm:text-left">
      {label}
    </div>
    <div className="flex justify-center py-1">
      <svg width="76" height="76" viewBox="0 0 56 56">
        <circle
          cx="28"
          cy="28"
          r="22"
          fill="none"
          stroke="#003049"
          strokeOpacity="0.07"
          strokeWidth="5"
        />
        <circle
          cx="28"
          cy="28"
          r="22"
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE - (CIRCUMFERENCE * animatedValue) / 100}
          strokeLinecap="round"
          transform="rotate(-90 28 28)"
          className="transition-all duration-500 ease-out"
        />
        <text
          x="28"
          y="32"
          textAnchor="middle"
          fontSize="14"
          fontWeight="600"
          fill={color}
          fontFamily="var(--font-sans)"
        >
          {animatedValue}
        </text>
      </svg>
    </div>
    <div className="text-[11px] text-[#003049]/80 text-center mt-1 truncate">{sublabel}</div>
  </div>
);

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const queryUrl = queryParams.get("url") || "";
  const initialUrl = queryUrl || location.state?.url || "";

  const [activeUrl, setActiveUrl] = useState(initialUrl);
  const [searchVal, setSearchVal] = useState("");
  const [expandedClaim, setExpandedClaim] = useState(null);
  const [animProgress, setAnimProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [liveData, setLiveData] = useState(location.state?.result || null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState("");

  const analyzeUrl = async (urlToAnalyze) => {
    if (!urlToAnalyze?.trim()) return;
    setIsAnalyzing(true);
    setAnalysisError("");
    try {
      const response = await callAnalyze(urlToAnalyze);
      const result = toAnalysisResult(response, urlToAnalyze);
      setLiveData(result);
      setActiveUrl(urlToAnalyze);
    } catch (error) {
      console.error("Analysis failed:", error);
      setAnalysisError(error?.message || "Failed to analyze this URL.");
      setLiveData(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (queryUrl && !liveData && !isAnalyzing) {
      analyzeUrl(queryUrl);
    }
  }, [queryUrl]);

  useEffect(() => {
    if (!liveData) return;
    setAnimProgress(0);
    setExpandedClaim(null);
    let current = 0;
    const interval = setInterval(() => {
      current += 0.04;
      if (current >= 1) {
        setAnimProgress(1);
        clearInterval(interval);
      } else {
        setAnimProgress(current);
      }
    }, 16);
    return () => clearInterval(interval);
  }, [liveData]);

  const handleNewCheck = async (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      const target = searchVal.trim();
      setSearchVal("");
      navigate(`?url=${encodeURIComponent(target)}`, { replace: true });
      await analyzeUrl(target);
    }
  };

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?url=${encodeURIComponent(activeUrl)}`;
    navigator.clipboard?.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveCard = () => {
    if (!liveData) return;
    const canvas = document.createElement("canvas");
    canvas.width = 680;
    canvas.height = 360;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#FDF0D5";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#669BBC";
    ctx.lineWidth = 10;
    ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);

    ctx.fillStyle = "#003049";
    ctx.font = "bold 11px system-ui, -apple-system, sans-serif";
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    ctx.fillText("NEWS GUARD", 40, 40);

    ctx.strokeStyle = "rgba(0, 48, 73, 0.1)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, 65);
    ctx.lineTo(canvas.width - 40, 65);
    ctx.stroke();

    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillStyle = "#003049";
    ctx.font = "bold 20px system-ui, -apple-system, sans-serif";

    const wrapText = (context, text, x, y, maxWidth, lineHeight) => {
      const words = String(text || "").split(" ");
      let line = "";
      let currentY = y;
      for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + " ";
        let metrics = context.measureText(testLine);
        let testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          context.fillText(line, x, currentY);
          line = words[n] + " ";
          currentY += lineHeight;
        } else {
          line = testLine;
        }
      }
      context.fillText(line, x, currentY);
    };

    wrapText(ctx, liveData.title || activeUrl, 40, 90, 420, 28);

    ctx.fillStyle = "rgba(0, 48, 73, 0.6)";
    ctx.font = "13px system-ui, -apple-system, sans-serif";
    ctx.fillText(`Source: ${liveData.source || "Web"}  •  ${liveData.date || "Recent"}`, 40, 210);

    const verdictText = (liveData.verdict || "Unverified").toUpperCase();
    const score = Number.isFinite(liveData.trustScore) ? liveData.trustScore : 0;
    let verdictColor = "#C1121F";
    let verdictIcon = "✗";
    if (score >= 70) {
      verdictColor = "#16a34a";
      verdictIcon = "✓";
    } else if (score >= 40) {
      verdictColor = "#d97706";
      verdictIcon = "⚠";
    }

    const drawRoundRect = (c, x, y, w, h, r) => {
      c.beginPath();
      c.moveTo(x + r, y);
      c.arcTo(x + w, y, x + w, y + h, r);
      c.arcTo(x + w, y + h, x, y + h, r);
      c.arcTo(x, y + h, x, y, r);
      c.arcTo(x, y, x + w, y, r);
      c.closePath();
      c.fill();
    };

    ctx.fillStyle = verdictColor;
    const pillText = `${verdictIcon} ${verdictText}`;
    ctx.font = "bold 12px system-ui, -apple-system, sans-serif";
    const pillWidth = ctx.measureText(pillText).width + 24;
    const pillHeight = 30;
    const pillX = 40;
    const pillY = 255;
    drawRoundRect(ctx, pillX, pillY, pillWidth, pillHeight, 15);

    ctx.fillStyle = "#FDF0D5";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(pillText, pillX + pillWidth / 2, pillY + pillHeight / 2);

    const ringCenterX = 540;
    const ringCenterY = 185;
    const ringRadius = 50;
    const strokeWidth = 10;

    ctx.strokeStyle = "rgba(0, 48, 73, 0.07)";
    ctx.lineWidth = strokeWidth;
    ctx.beginPath();
    ctx.arc(ringCenterX, ringCenterY, ringRadius, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.strokeStyle = verdictColor;
    ctx.lineWidth = strokeWidth + 2;
    ctx.lineCap = "round";
    ctx.beginPath();
    const endAngle = -Math.PI / 2 + (2 * Math.PI * score) / 100;
    ctx.arc(ringCenterX, ringCenterY, ringRadius, -Math.PI / 2, endAngle);
    ctx.stroke();

    ctx.fillStyle = verdictColor;
    ctx.font = "bold 30px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(score.toString(), ringCenterX, ringCenterY - 2);

    ctx.fillStyle = "rgba(0, 48, 73, 0.6)";
    ctx.font = "bold 11px system-ui, -apple-system, sans-serif";
    ctx.fillText("CREDIBILITY", ringCenterX, ringCenterY + ringRadius + 22);

    const link = document.createElement("a");
    link.download = `newsguard-verdict-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const trustScore = Number.isFinite(liveData?.trustScore) ? liveData.trustScore : 0;
  const freshnessScore = Number.isFinite(liveData?.freshnessScore) ? liveData.freshnessScore : 0;
  const sourceTrust = Number.isFinite(liveData?.sourceTrust) ? liveData.sourceTrust : 0;
  const confidence = Number.isFinite(liveData?.confidence) ? liveData.confidence : 0;
  const biasValue = Number.isFinite(liveData?.biasValue) ? liveData.biasValue : 50;

  const aCredibility = Math.round(trustScore * animProgress);
  const aFreshness = Math.round(freshnessScore * animProgress);
  const aSourceTrust = Math.round(sourceTrust * animProgress);
  const aConfidence = Math.round(confidence * animProgress);

  const verdictStyle = getVerdictStyle(trustScore);
  const readingLevel = liveData?.readingLevel || {
    grade: "N/A",
    label: "Moderate",
    wordComplexity: 50,
  };
  const rlStyle = getReadingLevelStyle(readingLevel.label);

  const claims = Array.isArray(liveData?.claims) ? liveData.claims : [];
  const redFlags = Array.isArray(liveData?.redFlags) ? liveData.redFlags : [];
  const sourceComparison = Array.isArray(liveData?.sourceComparison)
    ? liveData.sourceComparison
    : [];
  const sentiment = Array.isArray(liveData?.sentiment) && liveData.sentiment.length > 0
    ? liveData.sentiment
    : [
        { label: "Fear", value: 10, color: "#C1121F" },
        { label: "Anger", value: 10, color: "#d97706" },
        { label: "Neutral", value: 70, color: "#669BBC" },
        { label: "Positive", value: 10, color: "#16a34a" },
      ];

  return (
    <main className="min-h-screen bg-[#FDF0D5] relative overflow-hidden pb-16">
      <DotPattern className="text-[#669BBC] opacity-30" glow />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-6 relative z-10">
        <button
          onClick={() => navigate("/")}
          className="group flex items-center gap-2 text-sm font-semibold text-[#003049] hover:text-[#C1121F] mb-5 transition-colors duration-200 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to home
        </button>

        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#003049] mb-1">
            Is this news real?
          </h1>
          <p className="text-xs sm:text-sm text-[#003049]/80 mb-4">
            Paste any article, blog, or video link
          </p>
          <form
            onSubmit={handleNewCheck}
            className="mx-auto max-w-xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2 rounded-xl border-2 border-[#669BBC] bg-transparent p-2"
          >
            <input
              type="url"
              required
              placeholder="https://example.com/article..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="flex-1 h-10 rounded-lg bg-transparent px-3 text-xs sm:text-sm text-[#003049] placeholder:text-[#003049]/40 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isAnalyzing}
              className="flex items-center justify-center gap-1.5 h-10 px-5 rounded-lg bg-[#C1121F] hover:bg-[#780000] disabled:bg-[#780000]/50 text-[#FDF0D5] text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              {isAnalyzing ? "Analyzing..." : "Check"} <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>

          {analysisError ? (
            <div className="mt-4 mx-auto max-w-xl flex items-center gap-2 rounded-2xl border border-[#C1121F]/30 bg-[#C1121F]/10 px-4 py-3 text-xs sm:text-sm text-[#780000]">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{analysisError}</span>
            </div>
          ) : null}
        </div>

        {isAnalyzing && (
          <div className="my-10 flex flex-col items-center justify-center space-y-4 py-12 rounded-3xl border border-[#669BBC]/30 bg-white/40 backdrop-blur-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C1121F]"></div>
            <p className="text-[#003049] font-semibold text-sm sm:text-base">
              Analyzing URL with News Guard...
            </p>
          </div>
        )}

        {!isAnalyzing && !liveData && !analysisError && (
          <div className="my-12 text-center p-8 rounded-3xl border-2 border-dashed border-[#669BBC]/40 bg-white/30 max-w-md mx-auto space-y-3">
            <ShieldCheck className="h-10 w-10 text-[#669BBC] mx-auto opacity-70" />
            <h2 className="text-lg font-bold text-[#003049]">No Analysis Yet</h2>
            <p className="text-xs text-[#003049]/70 leading-relaxed">
              Enter any news article, social media post, or headline link above to generate an instant credibility report.
            </p>
          </div>
        )}

        {!isAnalyzing && liveData && (
          <>
            <div
              className={`rounded-2xl border ${verdictStyle.border} ${verdictStyle.bg} p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4`}
            >
              <div
                className={`w-10 h-10 rounded-full ${verdictStyle.iconBg} text-white flex items-center justify-center text-lg font-bold shrink-0`}
              >
                {verdictStyle.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-base sm:text-lg font-bold ${verdictStyle.text}`}>
                  {liveData.verdict || "Analysis Complete"}
                </div>
                <div className="text-xs sm:text-sm text-[#003049]/85 mt-0.5 break-words">
                  {liveData.verdictShort || liveData.title}
                </div>
                <div className="text-[10px] sm:text-xs text-[#003049]/70 mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <span className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    {liveData.source || "Web"}
                  </span>
                  {liveData.date && (
                    <>
                      <span>·</span>
                      <span>{liveData.date}</span>
                    </>
                  )}
                </div>
              </div>
              <div
                className={`${verdictStyle.pillBg} text-white text-xs font-bold px-3 py-1.5 rounded-full shrink-0 whitespace-nowrap self-start sm:self-auto`}
              >
                {aConfidence}% confident
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <ScoreRing
                animatedValue={aCredibility}
                label="Credibility"
                sublabel="out of 100"
                color={getRingColor(trustScore)}
              />
              <ScoreRing
                animatedValue={aFreshness}
                label="Freshness"
                sublabel={liveData.freshnessAge || "Recently checked"}
                color={getRingColor(freshnessScore)}
              />
              <ScoreRing
                animatedValue={aSourceTrust}
                label="Source Trust"
                sublabel={liveData.sourceTrustLabel || "Evaluated"}
                color={getRingColor(sourceTrust)}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-3 mb-4">
              <div className="rounded-2xl border-2 border-[#669BBC] bg-transparent p-4 sm:p-5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#003049] mb-3">
                  Key Claims
                </div>
                {claims.length === 0 ? (
                  <p className="text-xs text-[#003049]/70 italic">No specific individual claims extracted.</p>
                ) : (
                  <div>
                    {claims.map((claim, idx) => {
                      const claimId = claim.id || idx + 1;
                      const cs = getClaimDot(claim.status);
                      const isOpen = expandedClaim === claimId;
                      return (
                        <div key={claimId}>
                          <button
                            onClick={() => setExpandedClaim(isOpen ? null : claimId)}
                            className="w-full flex items-start gap-2.5 py-2.5 border-b border-[#003049]/8 text-left cursor-pointer last:border-b-0"
                          >
                            <div
                              className={`w-5 h-5 rounded-full ${cs.bg} text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5`}
                            >
                              {cs.icon}
                            </div>
                            <span className="text-xs text-[#003049] flex-1 leading-relaxed">
                              {claim.title}
                            </span>
                            {isOpen ? (
                              <ChevronUp className="h-3.5 w-3.5 text-[#003049]/75 shrink-0 mt-0.5" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5 text-[#003049]/75 shrink-0 mt-0.5" />
                            )}
                          </button>
                          {isOpen && (
                            <div className="pl-7 pb-3 space-y-2">
                              {claim.evidence && (
                                <div>
                                  <div className="text-[9px] font-bold uppercase tracking-wider text-[#C1121F]">
                                    Verdict
                                  </div>
                                  <p className="text-[11px] text-[#003049] mt-0.5 leading-relaxed">
                                    {claim.evidence}
                                  </p>
                                </div>
                              )}
                              {claim.details && (
                                <div className="rounded-lg bg-[#FDF0D5]/60 p-2.5 border border-[#003049]/5">
                                  <div className="text-[9px] font-bold uppercase tracking-wider text-[#003049]/80">
                                    Evidence Details
                                  </div>
                                  <p className="text-[11px] text-[#003049]/95 mt-0.5 leading-relaxed">
                                    {claim.details}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="rounded-2xl border-2 border-[#669BBC] bg-transparent p-4 sm:p-5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#003049] mb-4">
                  Political Bias
                </div>
                <div className="flex justify-between text-[9px] text-[#003049]/70 font-medium mb-1">
                  <span>Far left</span>
                  <span>Center</span>
                  <span>Far right</span>
                </div>
                <div className="relative h-[6px] rounded-full bg-[#003049]">
                  <div
                    className="absolute w-3.5 h-3.5 rounded-full bg-[#669BBC] border-2 border-white shadow-md top-1/2 -translate-y-1/2 transition-all duration-1000 ease-out -translate-x-1/2"
                    style={{ left: `${animProgress > 0 ? biasValue : 50}%` }}
                  />
                </div>
                <div
                  className={`text-xs font-bold mt-3 ${
                    biasValue > 65
                      ? "text-[#C1121F] text-right"
                      : biasValue < 35
                      ? "text-[#669BBC] text-left"
                      : "text-[#003049] text-center"
                  }`}
                >
                  {liveData.biasLabel || "Balanced / Unbiased"}
                </div>
                <p className="text-[11px] text-[#003049]/85 mt-3 leading-relaxed">
                  {liveData.biasDescription || "Language and framing assessed against standard journalistic bias indicators."}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3 mb-4">
              <div className="rounded-2xl border-2 border-[#669BBC] bg-transparent p-4 sm:p-5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#003049] mb-3">
                  Red Flags
                </div>
                {redFlags.length === 0 ? (
                  <div className="flex items-center gap-2 rounded-xl bg-green-500/10 border border-green-500/15 p-3">
                    <div className="w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                      ✓
                    </div>
                    <span className="text-xs text-green-700 font-medium">
                      No red flags detected — this source appears clean.
                    </span>
                  </div>
                ) : (
                  <div>
                    {redFlags.map((flag, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2.5 py-2 border-b border-[#003049]/6 last:border-b-0"
                      >
                        <div className="w-[6px] h-[6px] rounded-full bg-[#d97706] shrink-0 mt-1.5" />
                        <span className="text-xs text-[#003049] leading-relaxed">{flag}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-2xl border-2 border-[#669BBC] bg-transparent p-4 sm:p-5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#003049] mb-3">
                  Freshness Score
                </div>
                <div
                  className="text-2xl font-bold mb-1"
                  style={{ color: getRingColor(freshnessScore) }}
                >
                  {aFreshness} <span className="text-sm font-medium text-[#003049]/70">/ 100</span>
                </div>
                <div className="h-2 rounded-full bg-[#003049]/8 overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${aFreshness}%`,
                      backgroundColor: getRingColor(freshnessScore),
                    }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-[#003049]/80">
                  <span>Published {liveData.publishDate || "Recently"}</span>
                  <span>{liveData.freshnessAge || "Current"}</span>
                </div>
                <p className="text-[11px] text-[#003049]/80 mt-3 leading-relaxed">
                  Recent news is actively circulating. Older stories score lower as they become stale or outdated.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3 mb-4">
              <div className="rounded-2xl border-2 border-[#669BBC] bg-transparent p-4 sm:p-5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#003049] mb-3">
                  Source Comparison
                </div>
                {sourceComparison.length === 0 ? (
                  <p className="text-xs text-[#003049]/70 italic">
                    Cross-referencing against primary wire reports.
                  </p>
                ) : (
                  <div>
                    {sourceComparison.map((src, i) => {
                      const s = getSourceTagStyle(src.status);
                      return (
                        <div
                          key={i}
                          className="flex items-center gap-2.5 py-2 border-b border-[#003049]/6 last:border-b-0"
                        >
                          <div className={`w-2 h-2 rounded-full ${s.dot} shrink-0`} />
                          <span className="text-xs text-[#003049] flex-1 font-medium truncate">
                            {src.name}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${s.tagBg} ${s.tagText}`}
                          >
                            {src.status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="rounded-2xl border-2 border-[#669BBC] bg-transparent p-4 sm:p-5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#003049] mb-3">
                  Sentiment Analysis
                </div>
                <div className="space-y-3">
                  {sentiment.map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-[11px] text-[#003049]/85 w-14 shrink-0 font-medium">
                        {s.label}
                      </span>
                      <div className="flex-1 h-[5px] bg-[#003049]/6 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700 ease-out"
                          style={{
                            width: `${Math.round(s.value * animProgress)}%`,
                            backgroundColor: s.color,
                          }}
                        />
                      </div>
                      <span className="text-[11px] text-[#003049]/80 w-8 text-right font-medium">
                        {Math.round(s.value * animProgress)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div className="rounded-2xl border-2 border-[#669BBC] bg-transparent p-4 sm:p-5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#003049] mb-3">
                  Reading Level
                </div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${rlStyle.bg} ${rlStyle.text}`}
                >
                  {readingLevel.grade} — {readingLevel.label}
                </span>
                <p className="text-[11px] text-[#003049]/85 mt-3 leading-relaxed">
                  {readingLevel.label === "Sensational"
                    ? "Written at a low reading level with sensational language — common in clickbait and misleading posts."
                    : readingLevel.label === "Academic"
                    ? "Written at an advanced reading level with formal, precise language consistent with credible reporting."
                    : "Written at a balanced reading level with standard journalistic sentence structure."}
                </p>
                <div className="mt-4">
                  <div className="text-[10px] text-[#003049]/80 font-medium mb-1.5">
                    Word complexity
                  </div>
                  <div className="h-2 rounded-full bg-[#003049]/6 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${Math.round(
                          (readingLevel.wordComplexity || 50) * animProgress
                        )}%`,
                        backgroundColor: rlStyle.barColor,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border-2 border-[#669BBC] bg-transparent p-4 sm:p-5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#003049] mb-3">
                  Share Verdict
                </div>

                <div
                  onClick={handleSaveCard}
                  className="rounded-xl bg-[#FDF0D5]/60 border border-[#003049]/8 p-4 text-center mb-4 cursor-pointer hover:bg-[#003049]/5 transition-all duration-200 group/preview hover:scale-[1.01]"
                  title="Click to download PNG card"
                >
                  <div className="text-[9px] font-bold uppercase tracking-wider text-[#003049]/40 mb-1 group-hover/preview:text-[#C1121F] transition-colors">
                    NEWS GUARD
                  </div>
                  <div className={`text-sm font-bold ${verdictStyle.text}`}>
                    {verdictStyle.icon === "✓" ? "✓" : "⚠"} {liveData.verdict} · {confidence}% confident
                  </div>
                  <div className="text-[10px] text-[#003049]/60 mt-1 line-clamp-1 group-hover/preview:text-[#003049]/80">
                    {liveData.title || activeUrl}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleCopyLink}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[#003049]/25 text-xs text-[#003049]/90 font-medium hover:bg-[#003049]/5 transition-colors cursor-pointer"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    {copied ? "Copied!" : "Copy link"}
                  </button>
                  <button
                    onClick={handleSaveCard}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[#003049]/25 text-xs text-[#003049]/90 font-medium hover:bg-[#003049]/5 transition-colors cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Save card
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default Dashboard;
