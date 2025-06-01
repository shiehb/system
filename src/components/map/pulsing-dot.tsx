import { useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

interface PulsingDotProps {
  position: [number, number];
}

const PulsingDot: React.FC<PulsingDotProps> = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    // Create a div icon with Tailwind styles
    const divIcon = L.divIcon({
      className: "tailwind-pulsing-dot",
      iconSize: [20, 20],
      html: `<div class="relative w-3 h-3 rounded-full bg-blue-600 shadow-md"></div>`,
    });

    const marker = L.marker(position, { icon: divIcon }).addTo(map);

    return () => {
      map.removeLayer(marker);
    };
  }, [map, position]);

  return (
    <>
      <style>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(59, 130, 246, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          }
        }
        .tailwind-pulsing-dot > div {
          animation: pulse 2s infinite;
        }
      `}</style>
    </>
  );
};

export default PulsingDot;
