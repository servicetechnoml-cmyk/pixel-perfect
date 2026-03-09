const WaveBottom = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`absolute bottom-0 left-0 right-0 ${className}`}>
      <svg
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        preserveAspectRatio="none"
      >
        <path
          d="M0 0C240 80 480 80 720 40C960 0 1200 0 1440 40V120H0V0Z"
          fill="hsl(var(--background))"
        />
      </svg>
    </div>
  );
};

export default WaveBottom;
