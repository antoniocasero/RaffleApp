import Image from "next/image";

interface MDALogoProps {
  className?: string;
}

export default function MDALogo({ className = "" }: MDALogoProps) {
  return (
    <div className={`fixed top-4 left-4 z-50 ${className}`}>
      <div className="rounded-full border-2 border-white overflow-hidden shadow-lg">
        <Image
          src="/images/mda-logo-dark.jpeg"
          alt="MDA Logo"
          width={200}
          height={200}
          className="w-auto h-auto max-w-[200px] rounded-full"
          priority
        />
      </div>
    </div>
  );
}
