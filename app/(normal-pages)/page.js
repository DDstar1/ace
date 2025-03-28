"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
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
    <main className="relative max-w-[100vw] h-screen">
      <MoonScene />
    </main>
  );
}
