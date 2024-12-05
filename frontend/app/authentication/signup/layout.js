import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function SignUpLayout({ children }) {
  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen bg-yellow-100 p-4 overflow-y-auto ${poppins.className}`}
    >
      {children}
    </div>
  );
}
