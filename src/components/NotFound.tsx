import type { FC } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound: FC = () => {
  const location = useLocation();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-center items-center px-4 py-12"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="w-full max-w-md mx-auto text-center"
      >
        <div className="relative w-40 h-40 mx-auto mb-8">
          {/* Animated SVG illustration */}
          <motion.svg
            className="w-full h-full"
            viewBox="0 0 200 200"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{
              repeat: Infinity,
              duration: 5,
              repeatType: "reverse",
            }}
          >
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="#EFF6FF"
              stroke="#3B82F6"
              strokeWidth="4"
            />
            <circle cx="70" cy="80" r="10" fill="#3B82F6">
              <animate
                attributeName="cy"
                values="80;75;80"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="130" cy="80" r="10" fill="#3B82F6">
              <animate
                attributeName="cy"
                values="80;75;80"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <path
              d="M60 140 Q100 160 140 140"
              stroke="#3B82F6"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            >
              <animate
                attributeName="d"
                values="M60 140 Q100 160 140 140; M60 140 Q100 165 140 140; M60 140 Q100 160 140 140"
                dur="3s"
                repeatCount="indefinite"
              />
            </path>
          </motion.svg>
        </div>

        <h1 className="text-6xl md:text-8xl font-bold text-gray-800 mb-2">
          404
        </h1>
        <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-4">
          Page Not Found:{" "}
          <span className="text-blue-600">{location.pathname}</span>
        </h2>

        <p className="text-gray-600 mb-8">
          The page you're looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/"
              className="block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return to Homepage
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/contact"
              className="block px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Contact Support
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NotFound;
