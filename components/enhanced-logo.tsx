interface EnhancedLogoProps {
  className?: string
}

export default function EnhancedLogo({ className = "" }: EnhancedLogoProps) {
  return (
    <div className={`enhanced-logo ${className}`}>
      <svg
        viewBox="0 0 800 600"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        style={{
          filter: "brightness(0) invert(1)",
          stroke: "white",
          strokeWidth: "8px",
          fill: "white",
        }}
      >
        <use href="/images/moterosdelbbinvertido.svg#logo" />
      </svg>
    </div>
  )
}

