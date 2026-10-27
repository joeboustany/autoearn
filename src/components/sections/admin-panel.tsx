'use client'

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Lock,
  Unlock,
  Users,
  DollarSign,
  Eye,
  Handshake,
  Banknote,
  Download,
  Loader2,
  TrendingUp,
  Target,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type AdminData = {
  ok: boolean;
  counts: {
    subscribers: number;
    revenue: number;
    pageViews: number;
    clicks: number;
    payouts: number;
  };
  recent: {
    subscribers: any[];
    revenue: any[];
    views: any[];
    clicks: any[];
    payouts: any[];
  };
  goal: {
    month: string;
    target: number;
    current: number;
    progress: number;
  } | null;
};

export function AdminPanel() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AdminData | null>(null);

  // Auto-restore token from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("autoearn_admin_token");
    if (saved) {
      setPassword(saved);
      setAuthed(true);
    }
  }, []);

  const fetchData = async (token: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin?token=${encodeURIComponent(token)}`);
      const json = await res.json();
      if (json.ok) {
        setData(json);
        setAuthed(true);
        localStorage.setItem("autoearn_admin_token", token);
      } else {
        toast.error(json.error || "Authentication failed");
        setAuthed(false);
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    if (!password.trim()) {
      toast.error("Enter the admin password");
      return;
    }
    fetchData(password);
  };

  const handleLogout = () => {
    localStorage.removeItem("autoearn_admin_token");
    setAuthed(false);
    setData(null);
    setPassword("");
    toast.info("Logged out of admin");
  };

  const exportCsv = (type: string) => {
    const url = `/api/export?type=${type}&token=${encodeURIComponent(password)}`;
    window.open(url, "_blank");
    toast.success(`Exporting ${type} as CSV`);
  };

  return (
    <section id="admin" className="scroll-mt-16 border-t border-border/40 bg-muted/20 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge variant="secondary" className="mb-3">
              Creator dashboard
            </Badge>
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              The control room
            </h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              View every subscriber, sale, click, and payout. Export to CSV.
              Set monthly revenue goals. All in one place.
            </p>
          </div>
          <Button
            onClick={() => setOpen(true)}
            variant={authed ? "outline" : "default"}
          >
            {authed ? (
              <>
                <Unlock className="mr-2 h-4 w-4" />
                Admin panel
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                Unlock admin
              </>
            )}
          </Button>
        </div>

        {/* Quick stats preview when locked */}
        {!authed && (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
            <PreviewStat icon={<Users />} label="Subscribers" value="hidden" />
            <PreviewStat icon={<DollarSign />} label="Revenue events" value="hidden" />
            <PreviewStat icon={<Eye />} label="Page views" value="hidden" />
            <PreviewStat icon={<Handshake />} label="Affiliate clicks" value="hidden" />
            <PreviewStat icon={<Banknote />} label="Payouts" value="hidden" />
          </div>
        )}

        {/* Live admin view when authed */}
        {authed && data && (
          <div className="mt-10 space-y-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
              <StatCard
                icon={<Users className="h-4 w-4" />}
                label="Subscribers"
                value={data.counts.subscribers}
                color="#10b981"
              />
              <StatCard
                icon={<DollarSign className="h-4 w-4" />}
                label="Revenue events"
                value={data.counts.revenue}
                color="#f59e0b"
              />
              <StatCard
                icon={<Eye className="h-4 w-4" />}
                label="Page views"
                value={data.counts.pageViews}
                color="#8b5cf6"
              />
              <StatCard
                icon={<Handshake className="h-4 w-4" />}
                label="Affiliate clicks"
                value={data.counts.clicks}
                color="#ec4899"
              />
              <StatCard
                icon={<Banknote className="h-4 w-4" />}
                label="Payouts"
                value={data.counts.payouts}
                color="#06b6d4"
              />
            </div>

            <Tabs defaultValue="subscribers" className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5">
                <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
                <TabsTrigger value="revenue">Revenue</TabsTrigger>
                <TabsTrigger value="clicks">Clicks</TabsTrigger>
                <TabsTrigger value="pageviews">Views</TabsTrigger>
                <TabsTrigger value="payouts">Payouts</TabsTrigger>
              </TabsList>

              <TabsContent value="subscribers" className="mt-4">
                <DataTable
                  title="Recent subscribers"
                  rows={data.recent.subscribers}
                  columns={[
                    { key: "email", label: "Email" },
                    { key: "source", label: "Source" },
                    { key: "createdAt", label: "Joined", type: "date" },
                  ]}
                  onExport={() => exportCsv("subscribers")}
                />
              </TabsContent>

              <TabsContent value="revenue" className="mt-4">
                <DataTable
                  title="Recent revenue events"
                  rows={data.recent.revenue}
                  columns={[
                    { key: "stream", label: "Stream" },
                    { key: "amount", label: "Amount", type: "money" },
                    { key: "description", label: "Description" },
                    { key: "createdAt", label: "Time", type: "date" },
                  ]}
                  onExport={() => exportCsv("revenue")}
                />
              </TabsContent>

              <TabsContent value="clicks" className="mt-4">
                <DataTable
                  title="Recent affiliate clicks"
                  rows={data.recent.clicks}
                  columns={[
                    { key: "productName", label: "Product" },
                    { key: "vendor", label: "Vendor" },
                    { key: "source", label: "Source" },
                    { key: "createdAt", label: "Time", type: "date" },
                  ]}
                  onExport={() => exportCsv("clicks")}
                />
              </TabsContent>

              <TabsContent value="pageviews" className="mt-4">
                <DataTable
                  title="Recent page views"
                  rows={data.recent.views}
                  columns={[
                    { key: "path", label: "Path" },
                    { key: "source", label: "Source" },
                    { key: "createdAt", label: "Time", type: "date" },
                  ]}
                  onExport={() => exportCsv("pageviews")}
                />
              </TabsContent>

              <TabsContent value="payouts" className="mt-4">
                <DataTable
                  title="Payout history"
                  rows={data.recent.payouts}
                  columns={[
                    { key: "amount", label: "Amount", type: "money" },
                    { key: "status", label: "Status", type: "badge" },
                    { key: "method", label: "Method" },
                    { key: "scheduledAt", label: "Scheduled", type: "date" },
                  ]}
                  onExport={() => exportCsv("payouts")}
                />
              </TabsContent>
            </Tabs>

            <div className="flex justify-end">
              <Button variant="ghost" onClick={handleLogout}>
                <Lock className="mr-2 h-4 w-4" />
                Lock admin
              </Button>
            </div>
          </div>
        )}

        {/* Goal tracker (always visible when authed) */}
        {authed && <GoalTracker adminData={data} />}
      </div>

      {/* Login dialog */}
      <Dialog open={open && !authed} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Unlock admin panel
            </DialogTitle>
            <DialogDescription>
              Enter your admin password to view subscribers, revenue, clicks, and
              payouts. The token is stored in your browser only.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Input
              type="password"
              placeholder="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            <p className="text-xs text-muted-foreground">
              Default password: <code className="rounded bg-muted px-1.5 py-0.5">autoearn-admin</code>{" "}
              (change via <code className="rounded bg-muted px-1.5 py-0.5">ADMIN_PASSWORD</code> env var)
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleLogin} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Unlocking…
                </>
              ) : (
                <>
                  <Unlock className="mr-2 h-4 w-4" />
                  Unlock
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

function PreviewStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card className="border-border/60 opacity-60">
      <CardContent className="p-4">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-medium">{label}</span>
          <span className="opacity-60">{icon}</span>
        </div>
        <div className="mt-2 text-2xl font-bold tabular-nums">{value}</div>
        <div className="mt-1 text-[10px] text-muted-foreground">Login to view</div>
      </CardContent>
    </Card>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <Card className="border-border/60">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">{label}</span>
          <span style={{ color }}>{icon}</span>
        </div>
        <div className="mt-2 text-2xl font-bold tabular-nums">{value.toLocaleString()}</div>
      </CardContent>
    </Card>
  );
}

type Column = {
  key: string;
  label: string;
  type?: "date" | "money" | "badge";
};

function DataTable({
  title,
  rows,
  columns,
  onExport,
}: {
  title: string;
  rows: any[];
  columns: Column[];
  onExport: () => void;
}) {
  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
        <Button size="sm" variant="outline" onClick={onExport}>
          <Download className="mr-1.5 h-3.5 w-3.5" />
          Export CSV
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {rows.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-muted-foreground">
            No data yet. Try generating some activity above.
          </div>
        ) : (
          <ScrollArea className="h-[360px]">
            <div className="divide-y divide-border/40">
              {rows.map((row, i) => (
                <div key={row.id || i} className="grid grid-cols-2 gap-2 px-6 py-3 text-xs hover:bg-muted/30 sm:grid-cols-4">
                  {columns.map((col) => (
                    <div key={col.key} className="min-w-0">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {col.label}
                      </div>
                      <div className="mt-0.5 truncate font-medium">
                        {formatCell(row[col.key], col.type)}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

function formatCell(value: any, type?: Column["type"]): string {
  if (value === null || value === undefined) return "—";
  if (type === "money") return `$${Number(value).toFixed(2)}`;
  if (type === "date") {
    try {
      return new Date(value).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return String(value);
    }
  }
  return String(value);
}

// ===== Goal Tracker sub-component =====
function GoalTracker({ adminData }: { adminData: AdminData | null }) {
  const [target, setTarget] = useState("");
  const [saving, setSaving] = useState(false);
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const currentMonth = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  })();

  useEffect(() => {
    if (adminData?.goal) {
      setTarget(adminData.goal.target.toString());
    }
  }, [adminData?.goal]);

  const fetchGoals = async () => {
    try {
      const res = await fetch("/api/goals");
      const json = await res.json();
      if (json.ok) setGoals(json.goals);
    } catch (err) {
      console.error("[goals] failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const saveGoal = async () => {
    const num = parseFloat(target);
    if (isNaN(num) || num < 0) {
      toast.error("Enter a valid target amount");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month: currentMonth, target: num }),
      });
      const json = await res.json();
      if (json.ok) {
        toast.success(`Monthly goal set to $${num.toLocaleString()}`);
        fetchGoals();
      } else {
        toast.error(json.error || "Failed to save");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  };

  const goal = adminData?.goal;
  const progress = goal?.progress || 0;
  const circumference = 2 * Math.PI * 52;

  return (
    <Card className="mt-6 border-emerald-500/30 bg-emerald-500/[0.04]">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Target className="h-4 w-4 text-emerald-500" />
          Monthly revenue goal · {currentMonth}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Progress ring */}
        <div className="flex items-center justify-center">
          <div className="relative h-32 w-32">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="10"
              />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="#10b981"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (circumference * progress) / 100}
                style={{ transition: "stroke-dashoffset 0.6s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold text-emerald-500">
                {progress.toFixed(0)}%
              </div>
              <div className="text-[10px] text-muted-foreground">of goal</div>
            </div>
          </div>
        </div>

        {/* Goal input + summary */}
        <div className="space-y-3">
          <div>
            <div className="text-xs text-muted-foreground">Current month revenue</div>
            <div className="text-2xl font-bold tabular-nums">
              ${(goal?.current || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Monthly target</div>
            <div className="text-2xl font-bold tabular-nums text-emerald-500">
              ${(goal?.target || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          </div>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Set new target ($)"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="flex-1"
            />
            <Button onClick={saveGoal} disabled={saving}>
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
          </div>
          {!loading && goals.length > 0 && (
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="font-medium text-foreground">Past goals:</div>
              {goals.slice(0, 3).map((g) => (
                <div key={g.id} className="flex justify-between">
                  <span>{g.month}</span>
                  <span>${g.target.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
