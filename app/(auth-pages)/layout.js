import NavBar from "@/components/NavBar";

export default function RootLayout({ children }) {
  return (
    <div className="max-w-[100vw] h-[100dvh] flex flex-col gap-12 items-center justify-center">
      <NavBar styles={"!bg-[rgba(179,182,212,0.2)] !w-[80%] !rounded-xl "} />
      {children}
    </div>
  );
}
