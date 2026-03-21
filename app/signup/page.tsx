"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Mail, Lock, Eye, EyeOff, User, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useEffect } from "react";
import { useAuth } from "@/lib/useAuth";




export default function SignupPage() {
  const { user, loading } = useAuth();
const router = useRouter();

useEffect(() => {
  if (!loading && user) {
    router.push("/dashboard");
  }
}, [user, loading]);

  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  
  const handleGoogleSignup = async () => {
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);

    router.push("/dashboard");

  } catch (error) {
    console.error(error);
  }
};


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    // Save name to Firebase user profile
    await updateProfile(user, {
      displayName: name,
    });

    console.log("User created:", user);

    router.push("/dashboard");

  } catch (error: any) {
  console.error(error.code);

  if (error.code === "auth/email-already-in-use") {
    setErrorMsg("Account already exists. Please login.");
  } else if (error.code === "auth/invalid-credential") {
    setErrorMsg("Invalid email or password.");
  } else if (error.code === "auth/weak-password") {
    setErrorMsg("Password must be at least 6 characters.");
  } else {
    setErrorMsg("Something went wrong. Try again.");
  }
}


  setIsLoading(false);
};


  return (
    <div className="min-h-screen gradient-mesh flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Wallet className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-2xl font-semibold text-foreground">KalBudget</span>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">Create account</h1>
            <p className="text-muted-foreground">Start managing your finances today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>
            </div>
             {/* 🔴 ERROR MESSAGE */}
  {errorMsg && (
    <p className="text-red-500 text-sm text-center">
      {errorMsg}
    </p>
  )}

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
             {/* 🔴 ERROR MESSAGE */}
  {errorMsg && (
    <p className="text-red-500 text-sm text-center">
      {errorMsg}
    </p>
  )}



              <Button
  type="submit"
  className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-all"
  disabled={isLoading}
>
  {isLoading ? (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
    />
  ) : (
    "Create Account"
  )}
</Button>

            
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                />
              ) : (
                "Create Account"
              )}
            

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-card text-muted-foreground">or continue with</span>
              </div>
            </div>


          </form>
                      {/* Google Button OUTSIDE*/}
            <Button
              type="button"
              onClick={handleGoogleSignup}
              variant="outline"
              className="w-full h-12 bg-secondary border-border text-foreground hover:bg-secondary/80 font-medium"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

          {/* Terms */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            By creating an account, you agree to our{" "}
            <Link href="#" className="text-primary hover:text-primary/80 transition-colors">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-primary hover:text-primary/80 transition-colors">
              Privacy Policy
            </Link>
          </p>

          {/* Login Link */}
          <p className="mt-4 text-center text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
