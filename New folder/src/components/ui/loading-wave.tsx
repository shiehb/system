export const LoadingWave = ({
  message = "Loading...",
  logoSrc = "/assets/DENR-Logo.svg",
}: {
  message?: string;
  logoSrc?: string;
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="flex items-center gap-4">
        {/* Logo with both pulse and wave animations */}
        <div className="relative h-10 w-10">
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-[pulse_3s_ease-in-out_infinite]" />
          <img
            src={logoSrc}
            alt="Loading Logo"
            className="relative z-10 h-full w-full object-contain animate-[wave_1.3s_ease-in-out_infinite,pulse_3s_ease-in-out_infinite]"
            style={{
              transformOrigin: "bottom center",
              animationDelay: "0.1s", // Slight delay to offset from the pulse background
            }}
          />
        </div>

        {/* Animated message with individual character wave */}
        <div className="flex items-center justify-center space-x-1 h-8">
          {message.split("").map((char, index) => (
            <span
              key={index}
              className="text-primary font-medium tracking-wider animate-[wave_1.3s_ease-in-out_infinite]"
              style={{
                animationDelay: `${index * 0.1}s`,
                display: "inline-block",
                transformOrigin: "bottom center",
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
