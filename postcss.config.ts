import type { Config } from "postcss";

export default {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
} satisfies Config;
