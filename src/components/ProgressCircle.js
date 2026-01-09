//progress circle of month
export default function ProgressCircle({
  value,
  max,
  size = 225,
  stroke = 25,
}) {
  //how full the circle should be (0 → 1)
  const pct = max > 0 ? Math.min(1, value / max) : 0;

  //circle math
  const r = (size - stroke) / 2;        //radius
  const c = 2 * Math.PI * r;             //circumference
  const dashOffset = c * (1 - pct);      //how much to hide

  return (
    <div className="progress-wrap">
      <svg width={size} height={size} className="progress-svg">
        {/* background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          className="progress-track"
          strokeWidth={stroke}
          fill="none"
        />

        {/* progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          className="progress-bar"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>

      <div className="progress-text">
        <div className="progress-number">{value}</div>
        <div className="progress-label"> active {value === 1 ? "day" : "days"} this month</div>
      </div>
    </div>
  );
}
