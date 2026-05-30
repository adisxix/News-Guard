import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { Link } from "react-router-dom";

const Header = () => {
return (
<header className="w-full border-b-2 border-[#669BBC] bg-[#FDF0D5]">
<div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-5">
<div className="flex items-center gap-4">
<Link className="flex flex-col items-center text-center cursor-pointer" to="/">
    <img
        src="/logo.svg"
        alt="News Guard logo"
        className="h-16 w-auto"
    />
    <span className="mt-2 text-xl font-bold text-[#C1121F]">
        NEWS GUARD
    </span>
</Link>
</div>

<nav className="hidden items-center gap-8 text-lg font-semibold uppercase tracking-wider text-[#003049] md:flex">
<button className="cursor-pointer transition-colors hover:text-[#669BBC]" type="button">
    SERVICES
</button>
<button className="cursor-pointer transition-colors hover:text-[#669BBC]" type="button">
    ABOUT
</button>
<button className="cursor-pointer transition-colors hover:text-[#669BBC]" type="button">
    PRICING
</button>
<button className="cursor-pointer transition-colors hover:text-[#669BBC]" type="button">
    CONTACT
</button>
</nav>

<div className="flex items-center">
<InteractiveHoverButton className="bg-[#003049] text-[#FDF0D5] border-[#669BBC]  [&_.bg-primary]:bg-[#669BBC] [&_.text-primary-foreground]:text-[#FDF0D5]">
    Guard me
</InteractiveHoverButton>
</div>
</div>
</header>
);
};

export default Header;

