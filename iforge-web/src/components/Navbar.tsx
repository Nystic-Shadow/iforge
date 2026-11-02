"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { Menu, X, ArrowUpRight, ArrowRight } from "reicon-react";
import { useSiteContent } from "@/components/SiteContentProvider";
import ThemeToggle from "./ThemeToggle";
import { getLenis } from "@/lib/lenis";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/community", label: "Community" },
  { href: "/team", label: "Team" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";
const SCROLLED_AT = 24; // px before the bar becomes the floating pill
const HIDE_AFTER = 260; // px before scrolling down tucks the pill away

export default function Navbar() {
  const { siteConfig, services: servicesData } = useSiteContent();
  const [isOpen, setIsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const pathname = usePathname();
  const reduce = useReducedMotion();

  // Read inside the scroll handler, which would otherwise see stale state.
  const menusOpen = useRef(false);
  menusOpen.current = isOpen || servicesOpen;

  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 32, restDelta: 0.001 });

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? y;
    setScrolled(y > SCROLLED_AT);
    if (menusOpen.current) {
      setHidden(false);
      return;
    }
    // Down past the hero tucks it away; any upward nudge brings it back.
    if (y > prev + 2 && y > HIDE_AFTER) setHidden(true);
    else if (y < prev - 2 || y <= HIDE_AFTER) setHidden(false);
  });

  useEffect(() => {
    setIsOpen(false);
    setServicesOpen(false);
    setHidden(false);
  }, [pathname]);

  // Lock body scroll while the mobile drawer is open (and pause Lenis, which
  // would otherwise keep scrolling the page underneath it)
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    const lenis = getLenis();
    if (isOpen) lenis?.stop();
    else lenis?.start();
    return () => {
      document.body.style.overflow = "";
      getLenis()?.start();
    };
  }, [isOpen]);

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  const linkClass = (active: boolean) =>
    `relative z-10 px-3 py-1.5 tracking-wide transition-colors hover:text-foreground ${
      active ? "text-foreground" : "text-muted-foreground"
    }`;

  // The glass highlight that glides between links on hover.
  const HoverPill = ({ id }: { id: string }) =>
    hovered === id ? (
      <motion.span
        layoutId="nav-hover"
        className="absolute inset-0 -z-10 rounded-full bg-foreground/[0.07]"
        transition={{ type: "spring", stiffness: 420, damping: 34 }}
      />
    ) : null;

  const ActiveDot = () => (
    <motion.span
      layoutId="nav-active"
      className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#E61E32]"
      transition={{ type: "spring", stiffness: 420, damping: 34 }}
    />
  );

  return (
    <>
      <motion.header
        className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 sm:px-4"
        animate={{ y: hidden ? "-140%" : "0%" }}
        transition={{ duration: reduce ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className={`pointer-events-auto relative w-full transition-[max-width,margin,border-radius,background-color,border-color,box-shadow] duration-500 ${EASE} ${
            scrolled
              ? "mt-3 max-w-[1040px] rounded-full border border-hairline bg-background/70 shadow-lg shadow-black/5 backdrop-blur-xl backdrop-saturate-150 dark:bg-[#0b0b0b]/70 dark:shadow-black/40"
              : "mt-0 max-w-[1200px] rounded-none border border-transparent bg-transparent"
          }`}
        >
          <div
            className={`flex items-center justify-between gap-6 transition-[height,padding] duration-500 ${EASE} ${
              scrolled ? "h-14 px-4 sm:px-5" : "h-16 px-[clamp(1.25rem,4vw,2.5rem)]"
            }`}
          >
            {/* Brand */}
            <Link href="/" className="group flex items-center gap-2.5 shrink-0">
              <div className="relative h-7 w-7">
                <Image
                  src="/images/iforge-logo2.png"
                  alt={siteConfig.name}
                  fill
                  sizes="28px"
                  className="object-contain transition-transform duration-300 group-hover:rotate-[-8deg]"
                  priority
                />
              </div>
              <span className="text-lg font-black tracking-tight text-foreground lowercase">
                iforge
              </span>
            </Link>

            {/* Desktop nav */}
            <nav
              className="hidden lg:flex items-center gap-1 text-[0.8125rem] font-medium"
              onMouseLeave={() => setHovered(null)}
            >
              <Link href="/" className={linkClass(isActive("/"))} onMouseEnter={() => setHovered("/")}>
                <HoverPill id="/" />
                Home
                {isActive("/") && <ActiveDot />}
              </Link>

              {/* Services dropdown */}
              <div
                className="relative"
                onMouseEnter={() => {
                  setServicesOpen(true);
                  setHovered("/services");
                }}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <button
                  type="button"
                  className={`${linkClass(pathname.startsWith("/services"))} inline-flex items-center gap-1`}
                  aria-expanded={servicesOpen}
                >
                  <HoverPill id="/services" />
                  Services
                  <span className={`text-[0.6rem] transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}>
                    ▾
                  </span>
                  {pathname.startsWith("/services") && <ActiveDot />}
                </button>

                <AnimatePresence>
                  {servicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute left-1/2 top-full -translate-x-1/2 pt-4"
                    >
                      <div className="w-[460px] overflow-hidden rounded-2xl border border-hairline bg-card/90 p-2 shadow-xl shadow-black/5 backdrop-blur-xl dark:shadow-black/40">
                        {servicesData.map((s, i) => (
                          <Link
                            key={s.id}
                            href={`/services/${s.slug}`}
                            className="group flex items-start gap-4 rounded-xl p-3.5 transition-colors hover:bg-muted"
                          >
                            <span className="mt-0.5 font-mono text-[0.65rem] tabular-nums text-[#E61E32]">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <span className="flex-1 min-w-0">
                              <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                {s.title}
                                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                              </span>
                              <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground line-clamp-1">
                                {s.shortDesc}
                              </span>
                            </span>
                          </Link>
                        ))}
                        <Link
                          href="/quote"
                          className="mt-1 flex items-center justify-between border-t border-hairline px-3.5 pt-3 pb-2 text-xs font-medium text-muted-foreground hover:text-[#E61E32]"
                        >
                          <span>Need a tailored estimate?</span>
                          <span className="inline-flex items-center gap-1 font-semibold text-[#E61E32]">
                            Get a quote <ArrowRight className="h-3 w-3" />
                          </span>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {NAV_LINKS.filter((l) => l.href !== "/").map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={linkClass(isActive(l.href))}
                  onMouseEnter={() => setHovered(l.href)}
                >
                  <HoverPill id={l.href} />
                  {l.label}
                  {isActive(l.href) && <ActiveDot />}
                </Link>
              ))}
            </nav>

            {/* Desktop actions */}
            <div className="hidden lg:flex items-center gap-3">
              <ThemeToggle />
              <Link
                href="/quote"
                className={`group inline-flex items-center gap-2 bg-foreground px-5 py-2.5 text-[0.8125rem] font-semibold text-background transition-[background-color,border-radius] duration-500 ${EASE} hover:bg-[#E61E32] ${
                  scrolled ? "rounded-full" : "rounded-none"
                }`}
              >
                Get a Quote
                <ArrowRight className="h-3.5 w-3.5 arrow-nudge" />
              </Link>
            </div>

            {/* Mobile actions */}
            <div className="flex items-center gap-2 lg:hidden">
              <ThemeToggle />
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-foreground"
                aria-label="Toggle navigation menu"
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Reading progress along the pill's lower edge */}
          <motion.span
            aria-hidden
            style={{ scaleX: progress }}
            className={`pointer-events-none absolute inset-x-8 bottom-0 h-px origin-left bg-[#E61E32] transition-opacity duration-300 ${
              scrolled ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-background lg:hidden"
          >
            <div className="container-page flex h-full flex-col pt-24 pb-10">
              <nav className="flex flex-col divide-y divide-hairline border-y border-hairline">
                {[{ href: "/", label: "Home" }, ...servicesData.map((s) => ({ href: `/services/${s.slug}`, label: s.title })), ...NAV_LINKS.filter((l) => l.href !== "/")].map(
                  (l, i) => (
                    <motion.div
                      key={l.href + l.label}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.04, duration: 0.3 }}
                    >
                      <Link
                        href={l.href}
                        className="flex items-center justify-between py-4 text-xl font-semibold tracking-tight text-foreground"
                      >
                        {l.label}
                        <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
                      </Link>
                    </motion.div>
                  )
                )}
              </nav>

              <div className="mt-auto space-y-3">
                <a
                  href={`tel:${siteConfig.phone.replace(/[^0-9+]/g, "")}`}
                  className="flex items-center justify-center gap-2 border border-hairline py-3.5 text-sm font-semibold text-foreground"
                >
                  Call {siteConfig.phone}
                </a>
                <Link
                  href="/quote"
                  className="flex items-center justify-center gap-2 bg-[#E61E32] py-3.5 text-sm font-semibold text-white"
                >
                  Request a Proposal <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for the fixed header */}
      <div className="h-16" aria-hidden="true" />
    </>
  );
}
