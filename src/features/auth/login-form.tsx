import { useState } from "react";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, User2, KeyRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAuth } from "@/contexts/useAuth";
import { authService } from "./authService";
import { Terms } from "./terms";

interface LoginFormProps extends React.ComponentPropsWithoutRef<"div"> {
  onLoadingChange: (loading: boolean) => void;
}

export function LoginForm({
  className,
  onLoadingChange,
  ...props
}: LoginFormProps) {
  const { login_user } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    onLoadingChange(true);
    setError("");

    try {
      await authService.login(username, password, login_user);
      // Redirect to intended path or default
      const redirectPath = location.state?.from?.pathname || "/dashboard";
      navigate(redirectPath);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setError(errorMessage);
      setUsername("");
      setPassword("");
    } finally {
      onLoadingChange(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (error) setError("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) setError("");
  };

  // Determine if we should show error styling
  const showUsernameError = error && !isUsernameFocused;
  const showPasswordError = error && !isPasswordFocused;

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <Card className="md:w-[400px] lg:w-[400px] md:mx-auto border border-foreground">
        <CardHeader className="text-center">
          <div className="flex flex-col items-center text-center mb-2">
            <span className="text-xs md:text-xl font-bold">
              Integrated Establishment Regulatory
            </span>
            <span className="text-xs md:text-xl font-bold">
              Management System
            </span>
          </div>
          <CardTitle>
            <div className="flex items-center justify-center gap-2 text-lg md:text-xl font-bold text-muted-foreground">
              <User2 className="text-primary" size={22} />
              Account Login
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            {error && (
              <div className="mb-4 p-3 text-sm text-destructive bg-destructive/10 rounded-md text-center">
                {error}
              </div>
            )}
            <div className="grid gap-6">
              {/* ID Number Input */}
              <div className="grid gap-2">
                <Label htmlFor="id">ID Number</Label>
                <div className="relative">
                  <Input
                    id="id"
                    value={username}
                    onChange={handleUsernameChange}
                    onFocus={() => setIsUsernameFocused(true)}
                    onBlur={() => setIsUsernameFocused(false)}
                    className={cn(
                      "pl-10",
                      showUsernameError &&
                        "border-destructive focus-visible:ring-destructive"
                    )}
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="e.g. 12345678"
                    required
                  />
                  <User2
                    className={cn(
                      "absolute left-3 top-1/2 -translate-y-1/2",
                      showUsernameError
                        ? "text-destructive"
                        : "text-muted-foreground"
                    )}
                    size={18}
                  />
                </div>
              </div>
              {/* Password Input */}
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                    onClick={(e) => {
                      e.preventDefault();
                      authService.handleForgotPassword();
                    }}
                  >
                    Forgot your password?
                  </a>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    className={cn(
                      "pl-10",
                      showPasswordError &&
                        "border-destructive focus-visible:ring-destructive"
                    )}
                    placeholder="••••••••"
                    required
                  />
                  <KeyRound
                    className={cn(
                      "absolute left-3 top-1/2 -translate-y-1/2",
                      showPasswordError
                        ? "text-destructive"
                        : "text-muted-foreground"
                    )}
                    size={18}
                  />
                  <button
                    type="button"
                    className={cn(
                      "absolute right-3 top-1/2 -translate-y-1/2 hover:text-primary",
                      showPasswordError
                        ? "text-destructive hover:text-destructive"
                        : "text-muted-foreground"
                    )}
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full text-foreground border border-foreground hover:scale-95"
              >
                LOGIN
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Terms />
        </CardFooter>
      </Card>
    </div>
  );
}
