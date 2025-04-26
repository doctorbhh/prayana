import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import Logo from '@/components/Logo';

const Login = () => {
  const navigate = useNavigate();
  const { login, register, isLoading } = useAuth();
  const { toast } = useToast();
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register form state
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!loginEmail || !/\S+@\S+\.\S+/.test(loginEmail)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (!loginPassword || loginPassword.length < 6) {
      toast({
        title: "Invalid password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    try {
      await login(loginEmail, loginPassword);
      console.log("Login completed in Login.tsx");
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
      // Redirect is handled by LoginRoute in App.tsx
    } catch (error: any) {
      console.error('Login failed:', error.code, error.message);
      let errorMessage = "Invalid email or password. Please try again.";
      if (error.code === 'auth/invalid-api-key') {
        errorMessage = "Invalid Firebase configuration. Please contact support.";
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = "No account found with this email.";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error.code === 'auth/api-key-not-valid.-please-pass-a-valid-api-key') {
        errorMessage = "Invalid API key. Please contact support.";
      }
      toast({
        title: "Sign in failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!registerEmail || !/\S+@\S+\.\S+/.test(registerEmail)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (!registerPassword || registerPassword.length < 6) {
      toast({
        title: "Weak password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (registerPassword !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (!registerName || registerName.length < 3) {
      toast({
        title: "Invalid name",
        description: "Full name must be at least 3 characters long.",
        variant: "destructive",
      });
      return;
    }

    try {
      await register(registerEmail, registerPassword, registerName);
      console.log("Registration completed in Login.tsx");
      toast({
        title: "Account created!",
        description: "You've successfully signed up.",
      });
      // Redirect is handled by LoginRoute in App.tsx
    } catch (error: any) {
      console.error('Registration failed:', error.code, error.message);
      let errorMessage = "Could not create your account. Please try again.";
      if (error.code === 'auth/invalid-api-key') {
        errorMessage = "Invalid Firebase configuration. Please contact support.";
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = "This email is already registered. Please sign in or use a different email.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password is too weak. Please use at least 6 characters.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Invalid email format. Please check your email.";
      } else if (error.code === 'auth/username-already-in-use') {
        errorMessage = "This name is already taken. Please choose another.";
      } else if (error.code === 'auth/api-key-not-valid.-please-pass-a-valid-api-key') {
        errorMessage = "Invalid API key. Please contact support.";
      }
      toast({
        title: "Sign up failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-ebike-softBlue to-white flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md mb-6">
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>
        
        <Card className="w-full animate-slide-up card-shadow border-t-4 border-t-ebike-primary">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Welcome</CardTitle>
            <CardDescription className="text-center">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      className="input-field"
                      autoComplete="email"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label htmlFor="password" className="text-sm font-medium">
                        Password
                      </label>
                      <a href="#" className="text-xs text-ebike-primary hover:underline">
                        Forgot password?
                      </a>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      className="input-field"
                      autoComplete="current-password"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full btn-primary" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      required
                      className="input-field"
                      autoComplete="name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="register-email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="your@email.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                      className="input-field"
                      autoComplete="email"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="register-password" className="text-sm font-medium">
                      Password
                    </label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                      className="input-field"
                      autoComplete="new-password"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="confirm-password" className="text-sm font-medium">
                      Confirm Password
                    </label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="input-field"
                      autoComplete="new-password"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full btn-primary" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;