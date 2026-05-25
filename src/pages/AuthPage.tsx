import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { EcoPhoraLogo } from "@/components/EcoPhoraLogo";
import { toast } from "sonner";

const signupSchema = z.object({
  displayName: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
  role: z.enum(["admin", "operator", "viewer"]).default("viewer"),
});

const loginSchema = z.object({
  email: z.string().trim().email("Invalid email"),
  password: z.string().min(1, "Password required"),
});

export default function AuthPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"login" | "signup">("login");

  useEffect(() => {
    if (!authLoading && user) navigate("/", { replace: true });
  }, [user, authLoading, navigate]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = loginSchema.safeParse({ email: fd.get("email"), password: fd.get("password") });
    if (!parsed.success) { toast.error(parsed.error.errors[0].message); return; }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: parsed.data.email, password: parsed.data.password });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Welcome back!");
    navigate("/", { replace: true });
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = signupSchema.safeParse({
      displayName: fd.get("displayName"),
      email: fd.get("email"),
      password: fd.get("password"),
      role: fd.get("role") || "viewer",
    });
    if (!parsed.success) { toast.error(parsed.error.errors[0].message); return; }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { display_name: parsed.data.displayName, role: parsed.data.role },
      },
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Account created! You're signed in.");
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-primary/[0.07] blur-[100px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-accent/[0.05] blur-[100px]" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-emerald-600 shadow-xl shadow-primary/25 mb-4 animate-glow-pulse">
            <EcoPhoraLogo className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Eco<span className="text-gradient">Phora</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Smart Waste Management System</p>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <Tabs value={tab} onValueChange={(v) => setTab(v as "login" | "signup")}>
            <TabsList className="grid grid-cols-2 w-full mb-6 bg-white/[0.04]">
              <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</Label>
                  <Input id="login-email" name="email" type="email" placeholder="you@example.com" required className="bg-white/[0.04] border-white/[0.08] focus:border-primary/50 focus:ring-primary/20 placeholder:text-muted-foreground/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Password</Label>
                  <Input id="login-password" name="password" type="password" placeholder="••••••••" required className="bg-white/[0.04] border-white/[0.08] focus:border-primary/50 focus:ring-primary/20 placeholder:text-muted-foreground/50" />
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-primary to-emerald-600 hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 font-semibold">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Full Name</Label>
                  <Input id="signup-name" name="displayName" placeholder="John Doe" required className="bg-white/[0.04] border-white/[0.08] focus:border-primary/50 focus:ring-primary/20 placeholder:text-muted-foreground/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</Label>
                  <Input id="signup-email" name="email" type="email" placeholder="you@example.com" required className="bg-white/[0.04] border-white/[0.08] focus:border-primary/50 focus:ring-primary/20 placeholder:text-muted-foreground/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Password</Label>
                  <Input id="signup-password" name="password" type="password" placeholder="At least 8 characters" required className="bg-white/[0.04] border-white/[0.08] focus:border-primary/50 focus:ring-primary/20 placeholder:text-muted-foreground/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-role" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Select Role (For Testing)</Label>
                  <Select name="role" defaultValue="viewer">
                    <SelectTrigger id="signup-role" className="bg-white/[0.04] border-white/[0.08] focus:ring-primary/20">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin (Full Access)</SelectItem>
                      <SelectItem value="operator">Operator</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-primary to-emerald-600 hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 font-semibold">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Account"}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Select your role for the testing phase.
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </div>

        <p className="text-center text-xs text-muted-foreground/60 mt-6">
          EcoPhora · Smart Waste Management IoT Prototype
        </p>
      </div>
    </div>
  );
}
