import Link from "next/link";
import { Moon, Github, Twitter, Youtube, Rss } from "lucide-react";

const footerLinks = [
  {
    title: "Income Streams",
    links: [
      { label: "Affiliate marketing", href: "#affiliate" },
      { label: "Digital products", href: "#products" },
      { label: "Display ads", href: "#streams" },
      { label: "Paid newsletter", href: "#subscribe" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Live dashboard", href: "#dashboard" },
      { label: "Blog", href: "#blog" },
      { label: "FAQ", href: "#faq" },
      { label: "Creator stories", href: "#streams" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#top" },
      { label: "Contact", href: "#subscribe" },
      { label: "Affiliate program", href: "#affiliate" },
      { label: "Press kit", href: "#top" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <Link href="#top" className="flex items-center gap-2 font-bold">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 text-white">
                <Moon className="h-5 w-5" />
              </span>
              <span className="text-lg">
                Auto<span className="text-emerald-500">Earn</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              A complete passive income platform. Build streams, automate
              payouts, and watch the dashboard tick while you sleep.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <SocialIcon href="#top" label="Twitter">
                <Twitter className="h-4 w-4" />
              </SocialIcon>
              <SocialIcon href="#top" label="YouTube">
                <Youtube className="h-4 w-4" />
              </SocialIcon>
              <SocialIcon href="#top" label="GitHub">
                <Github className="h-4 w-4" />
              </SocialIcon>
              <SocialIcon href="#top" label="RSS">
                <Rss className="h-4 w-4" />
              </SocialIcon>
            </div>
          </div>

          {footerLinks.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} AutoEarn. All revenue figures are
            illustrative. Real results require real work.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="#top" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="#top" className="hover:text-foreground">
              Terms
            </Link>
            <Link href="#top" className="hover:text-foreground">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-md border border-border/60 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      {children}
    </Link>
  );
}
