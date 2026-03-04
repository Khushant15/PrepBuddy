"use client"

export function AnimatedGradient() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Primary gradient overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: "radial-gradient(circle at 20% 50%, rgba(167, 139, 250, 0.2) 0%, transparent 50%)",
        }}
      />
      {/* Accent gradient overlay */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          background: "radial-gradient(circle at 80% 80%, rgba(196, 181, 253, 0.15) 0%, transparent 50%)",
        }}
      />
      {/* Subtle wave effect */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          background:
            "linear-gradient(90deg, rgba(167, 139, 250, 0.1) 0%, rgba(196, 181, 253, 0.1) 50%, rgba(167, 139, 250, 0.1) 100%)",
          backgroundSize: "200% 200%",
          animation: "gradient-shift 8s ease infinite",
        }}
      />
    </div>
  )
}
