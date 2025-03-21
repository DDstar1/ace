import NavBar from "@/components/NavBar";
import Script from "next/script";
import { Suspense } from "react";

export default function RootLayout({ children }) {
  return (
    <main className="max-w-screen overflow-x-hidden">
      <NavBar />

      {/* <Script
        src="https://js.paystack.co/v1/inline.js"
        strategy="afterInteractive" // This ensures the script runs after the component is interactive
      /> */}
      <Suspense>{children}</Suspense>
    </main>
  );
}
