import { LoginForm } from "@/components/form/login-form";
import denrLogo from "@/assets/DENR-Logo.svg";
import BPLogo from "@/assets/Bagong-Pilipinas-Logo.svg";
import { useState } from "react";
import { LoadingWave } from "@/components/ui/loading-wave";

export default function LoginPage() {
  // Set header height for mobile and larger screens
  const headerHeightMobile = "h-[90px]"; // adjust as needed
  const headerHeightMd = "md:h-[110px]"; // adjust as needed
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-svh w-full">
      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-background/80 z-50 flex items-center justify-center">
          <LoadingWave message="Authenticating..." />
        </div>
      )}

      {/* Fixed Responsive Header */}
      <header
        className={`fixed top-0 left-0 w-full ${headerHeightMobile} ${headerHeightMd}`}
      >
        <div
          className="
            flex flex-col items-center gap-2 px-2 py-3
            sm:gap-3
            md:flex-row md:items-center md:justify-between md:gap-4 md:px-6
            max-w-4xl mx-auto relative
            md:mt-6
          "
        >
          {/* Logos Row (mobile: images side by side, tablet/desktop: left/right) */}
          <div className="flex w-full md:w-auto items-center justify-center md:justify-start gap-2 md:gap-4">
            <img
              src={denrLogo}
              alt="DENR Logo"
              className="
                h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 object-contain shadow-lg rounded-full
                transition-all
              "
              style={{ maxWidth: "64px", height: "auto" }}
            />
            {/* Bagong Pilipinas logo: always next to DENR on mobile, on right for md+ */}
            <div className="block md:hidden">
              <img
                src={BPLogo}
                alt="Bagong Pilipinas Logo"
                className="h-12 w-12 sm:h-12 sm:w-12 object-containtransition-all"
                style={{ maxWidth: "64px", height: "auto" }}
              />
            </div>
          </div>
          {/* Centered Text */}
          <div
            className="
            flex flex-col items-center text-center min-w-[180px]
            mt-2 md:mt-0
          "
          >
            <span className="text-xs sm:text-sm md:text-base lg:text-xl font-bold text-foreground">
              Republic of the Philippines
            </span>
            <span className="text-xs sm:text-sm md:text-base lg:text-xl font-bold text-foreground">
              Department of Environment and Natural Resources
            </span>
            <span className="text-xs sm:text-sm md:text-base lg:text-xl font-bold text-foreground">
              ENVIRONMENTAL MANAGEMENT BUREAU
            </span>
          </div>
          {/* Bagong Pilipinas Logo (tablet/desktop only) */}
          <div className="hidden md:flex items-center gap-4 w-full md:w-auto justify-center md:justify-end mt-2 md:mt-0">
            <img
              src={BPLogo}
              alt="Bagong Pilipinas Logo"
              className="
                h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 object-contain transition-all
              "
              style={{ maxWidth: "64px", height: "auto" }}
            />
          </div>
        </div>
      </header>
      {/* Main Content: Add padding-top equal to header height */}
      <main
        className={`flex items-center justify-center min-h-svh pt-[100px] md:pt-[120px] px-2`}
      >
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
          <LoginForm onLoadingChange={setLoading} />
        </div>
      </main>
    </div>
  );
}
