export default function MeasurementFrame() {
  const ticks = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="measurement-frame" aria-hidden="true">
      <div className="measurement-edge measurement-edge-top">
        {ticks.map((i) => (
          <span key={`t-${i}`} className="measurement-mark">
            {String(i * 80).padStart(4, '0')}
          </span>
        ))}
      </div>
      <div className="measurement-edge measurement-edge-bottom">
        {ticks.map((i) => (
          <span key={`b-${i}`} className="measurement-mark">
            X{String(i * 120).padStart(4, '0')}
          </span>
        ))}
      </div>
      <div className="measurement-edge measurement-edge-left hidden lg:flex">
        {ticks.slice(0, 8).map((i) => (
          <span key={`l-${i}`} className="measurement-mark-vert">
            {String(i * 140).padStart(4, '0')}
          </span>
        ))}
      </div>
      <div className="measurement-edge measurement-edge-right hidden lg:flex">
        {ticks.slice(0, 8).map((i) => (
          <span key={`r-${i}`} className="measurement-mark-vert">
            Y{String(i * 90).padStart(3, '0')}
          </span>
        ))}
      </div>
    </div>
  );
}
