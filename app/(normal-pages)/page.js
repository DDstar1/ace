"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import MoonScene from "@/components/Moon";

export default function Home() {
  const [moonWidth, setMoonWidth] = useState(90); // State to store the width of the moon
  const [moonHeight, setMoonHeight] = useState(0); // State to store the height of the moon
  const moonRef = useRef(null); // Reference to the moon element
  const isAnimating = useRef(false); // Ref to keep track of animation state

  useEffect(() => {
    const handleScroll = () => {
      if (isAnimating.current) return; // Prevent redundant updates

      isAnimating.current = true; // Mark the animation as in progress

      // Schedule the update using requestAnimationFrame
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const width = Math.max(90 - scrollY / 10, 20); // Reduce width to a minimum of 50%
        setMoonWidth(width);

        // Calculate the height as half of the width in pixels
        const viewportWidth = window.innerWidth;
        const moonWidthPixels = (viewportWidth * width) / 100;
        const moonHeightPixels = moonWidthPixels / 2;

        setMoonHeight(moonHeightPixels); // Set the height dynamically in pixels
        isAnimating.current = false; // Mark the animation as completed
      });
    };

    const handleResize = () => {
      if (moonRef.current) {
        // Get the width in pixels
        const moonWidthInPixels = moonRef.current.offsetWidth;

        // Set the height to half of the width
        setMoonHeight(moonWidthInPixels / 2);
      }
    };

    // Initial calls
    handleResize();
    handleScroll();

    // Attach scroll and resize listeners
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      // Cleanup the event listeners
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <main className="relative max-w-[100vw] overflow-hidden">
      <img
        src="/star_bg.jfif"
        alt="Star Background"
        className="object-cover fixed w-screen h-screen top-0"
        loading="eager" // equivalent to `priority` in Next.js
      />

      <div
        style={{
          marginTop: `calc(100vh - ${moonHeight}px)`,
          height: "calc(100vh - 60px)",
        }}
        className="flex flex-col relative  items-center gap-1"
      >
        <div
          ref={moonRef} // Attach ref to the moon element
          className="relative  flex items-center justify-center rounded-t-full overflow-hidden"
          style={{
            width: `${moonWidth}%`, // Keep the width dynamic based on scroll
            height: `${moonHeight}px`, // Set height dynamically in pixels
            transition: "width 0.01s ease-out, height 0.01s ease-out",
          }}
        >
          {/* <Image
            src="/3d/moon-texture.jpg"
            alt="Moon Surface"
            fill
            className="object-cover"
            priority
          /> */}
          <MoonScene />
        </div>
        <div
          className="w-full flex flex-1 justify-center items-center relative bg-gradient-to-b from-gray-800 to-gray-300"
          style={{
            clipPath: `polygon(0% 25%, ${(100 - moonWidth) / 2}% 0%, ${
              (100 + moonWidth) / 2
            }% 0%, 100% 25%, 100% 100%, 0% 100%)`,
            perspective: "500px",
            transformStyle: "preserve-3d",
          }}
        >
          <Button
            variant="secondary"
            className="relative p-4 text-2xl"
            style={{
              transform: "rotateX(35deg)",
            }}
          >
            Explore Moon
          </Button>
        </div>
      </div>
    </main>
  );
}
