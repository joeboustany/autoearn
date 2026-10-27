'use client'

import { useState, useMemo, useEffect, useRef } from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Search, FileText, Package, ArrowRight } from "lucide-react";
import { articles, affiliateProducts, digitalProducts } from "@/lib/catalog";

type SearchResult = {
  id: string;
  type: "article" | "affiliate" | "digital";
  title: string;
  desc: string;
  emoji: string;
  href: string;
};

export function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const results = useMemo<SearchResult[]>(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const articleResults: SearchResult[] = articles
      .filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q)
      )
      .slice(0, 4)
      .map((a) => ({
        id: a.id,
        type: "article",
        title: a.title,
        desc: a.excerpt.slice(0, 100) + (a.excerpt.length > 100 ? "…" : ""),
        emoji: a.emoji,
        href: "#blog",
      }));

    const affiliateResults: SearchResult[] = affiliateProducts
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.blurb.toLowerCase().includes(q)
      )
      .slice(0, 3)
      .map((p) => ({
        id: p.id,
        type: "affiliate",
        title: p.name,
        desc: p.blurb.slice(0, 100) + (p.blurb.length > 100 ? "…" : ""),
        emoji: p.emoji,
        href: "#affiliate",
      }));

    const digitalResults: SearchResult[] = digitalProducts
      .filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.type.toLowerCase().includes(q)
      )
      .slice(0, 3)
      .map((p) => ({
        id: p.id,
        type: "digital",
        title: p.title,
        desc: p.description.slice(0, 100) + (p.description.length > 100 ? "…" : ""),
        emoji: p.emoji,
        href: "#products",
      }));

    return [...articleResults, ...affiliateResults, ...digitalResults];
  }, [query]);

  // Keyboard shortcut: cmd/ctrl + K to open
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const typeMeta = {
    article: { label: "Article", icon: <FileText className="h-3 w-3" /> },
    affiliate: { label: "Affiliate", icon: <ArrowRight className="h-3 w-3" /> },
    digital: { label: "Product", icon: <Package className="h-3 w-3" /> },
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="hidden w-56 justify-start gap-2 px-3 text-muted-foreground md:flex"
          aria-label="Search articles and products"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="text-xs">Search…</span>
          <kbd className="ml-auto rounded border border-border/60 bg-muted/40 px-1.5 py-0.5 text-[10px]">
            ⌘K
          </kbd>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[400px] p-0"
        align="end"
        sideOffset={8}
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search articles, products, offers…"
            value={query}
            onValueChange={setQuery}
          />
          <CommandList className="max-h-[360px]">
            <CommandEmpty>
              {query.length === 0
                ? "Start typing to search…"
                : "No results found."}
            </CommandEmpty>

            {results.filter((r) => r.type === "article").length > 0 && (
              <CommandGroup heading="Articles">
                {results
                  .filter((r) => r.type === "article")
                  .map((r) => (
                    <SearchResultItem
                      key={r.id}
                      result={r}
                      onSelect={() => setOpen(false)}
                      typeMeta={typeMeta.article}
                    />
                  ))}
              </CommandGroup>
            )}

            {results.filter((r) => r.type === "affiliate").length > 0 && (
              <CommandGroup heading="Affiliate offers">
                {results
                  .filter((r) => r.type === "affiliate")
                  .map((r) => (
                    <SearchResultItem
                      key={r.id}
                      result={r}
                      onSelect={() => setOpen(false)}
                      typeMeta={typeMeta.affiliate}
                    />
                  ))}
              </CommandGroup>
            )}

            {results.filter((r) => r.type === "digital").length > 0 && (
              <CommandGroup heading="Digital products">
                {results
                  .filter((r) => r.type === "digital")
                  .map((r) => (
                    <SearchResultItem
                      key={r.id}
                      result={r}
                      onSelect={() => setOpen(false)}
                      typeMeta={typeMeta.digital}
                    />
                  ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function SearchResultItem({
  result,
  onSelect,
  typeMeta,
}: {
  result: SearchResult;
  onSelect: () => void;
  typeMeta: { label: string; icon: React.ReactNode };
}) {
  return (
    <CommandItem
      value={result.id}
      onSelect={() => {
        window.location.hash = result.href.replace("#", "");
        onSelect();
      }}
      className="flex items-start gap-3 p-3"
    >
      <span className="text-xl">{result.emoji}</span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
          {typeMeta.icon}
          {typeMeta.label}
        </div>
        <div className="mt-0.5 line-clamp-1 font-medium">{result.title}</div>
        <div className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
          {result.desc}
        </div>
      </div>
      <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
    </CommandItem>
  );
}
