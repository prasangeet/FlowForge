import { Poppins, Ubuntu } from "next/font/google";

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["400", "300", "700", "500"],
});
