'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { Brain, FileText, GitBranch } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const router = useRouter();
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setLoading(true);

      const result = await signup(name, email, password);

      if (result.success) {
        router.push('/login');
      } else {
        setError(result.error || 'Sign Up failed. Please try again.');
      }

      setLoading(false);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex justify-between">
        <div className="flex flex-col justify-center p-8 lg:p-16 bg-black/20">
            <div className="max-w-xl mx-auto w-full space-y-8">
              <div className="space-y-4">
                <div className="inline-block px-3 py-1 bg-slate-800/50 border border-slate-700 rounded-full">
                  <span className="text-xs text-slate-400 font-medium tracking-wide">INFRASTRUCTURE LAYERS</span>
                </div>
                <h2 className="text-4xl font-bold text-white">
                  Welcome to ProtoLabs
                </h2>
                <p className="text-slate-400">
                  Proto treats AI as infrastructure, not a feature. Built as clear, intentional layers.
                </p>
              </div>

              <div className="grid gap-6 pt-4">
                {/* Execution Layer */}
                <div className="space-y-3 p-6 rounded-xl bg-slate-900/50 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                      <GitBranch className="w-5 h-5 text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Execution</h3>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Chains, steps, retries, control flow. Separated from compute. Test without invoking models.
                  </p>
                </div>

                {/* Compute Layer */}
                <div className="space-y-3 p-6 rounded-xl bg-slate-900/50 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                      <Brain className="w-5 h-5 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Compute</h3>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    LLMs as interchangeable engines. Swap models without rewriting logic.
                  </p>
                </div>

                {/* Knowledge Layer */}
                <div className="space-y-3 p-6 rounded-xl bg-slate-900/50 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Knowledge</h3>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    RAG with provenance and traceability. Answers know where they came from.
                  </p>
                </div>
              </div>

              <div className="pt-4 text-center">
                <p className="text-sm text-slate-500 italic">
                  No magic prompts. No black boxes. Just systems you can understand, test, and evolve.
                </p>
              </div>
            </div>
          </div>
        <div className='flex flex-1 w-full'>

          <Card className="w-full flex justify-center items-center">
            <CardHeader className={'w-xl'}>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>
                Enter your credentials to access the AI services
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4 w-xl">
                {error && (
                  <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="name"
                    type="name"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </CardContent>
              <CardFooter className="my-2">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Signing up...' : 'Sign Up'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>

        </div>
      );
}