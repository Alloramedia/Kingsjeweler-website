import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FBF9F4]" role="status" aria-label="Loading">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          {/* Pulse ring */}
          <div className="absolute inset-0 animate-ping rounded-full bg-[#B08D3E]/10" />
          <div className="relative animate-pulse">
            <Image
              src="/images/kings-jeweler-badge.webp"
              alt="Loading"
              width={1000}
              height={1000}
              sizes="120px"
              className="h-auto w-28"
              priority
            />
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#B08D3E]" style={{ animationDelay: "0ms" }} />
          <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#B08D3E]" style={{ animationDelay: "150ms" }} />
          <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#B08D3E]" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}
