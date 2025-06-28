// components/PolygonDrawer.tsx
import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";

interface PolygonDrawerProps {
  onPolygonCreated?: (polygon: L.Polygon) => void;
  onPolygonEdited?: (polygon: L.Polygon) => void;
  onPolygonDeleted?: (polygon: L.Polygon) => void;
  editable?: boolean;
  initialPolygons?: L.LatLngExpression[][];
}

export default function PolygonDrawer({
  onPolygonCreated,
  onPolygonEdited,
  onPolygonDeleted,
  editable = true,
  initialPolygons = [],
}: PolygonDrawerProps) {
  const map = useMap();
  const featureGroupRef = useRef<L.FeatureGroup>();
  const drawControlRef = useRef<L.Control.Draw>();

  useEffect(() => {
    if (!map) return;

    // Initialize feature group to store drawn items
    featureGroupRef.current = L.featureGroup().addTo(map);

    // Add initial polygons if provided
    initialPolygons.forEach((coordinates) => {
      const polygon = L.polygon(coordinates, {
        color: "#3388ff",
        weight: 3,
        opacity: 0.5,
        fillOpacity: 0.2,
      });
      featureGroupRef.current?.addLayer(polygon);
    });

    // Initialize draw control if editable
    if (editable) {
      const drawControlOptions: L.Control.DrawOptions = {
        position: "topright",
        draw: {
          polygon: {
            allowIntersection: false,
            drawError: {
              color: "#b00b00",
              message: "<strong>Error:<strong> polygon edges cannot cross!",
            },
            shapeOptions: {
              color: "#3388ff",
              weight: 3,
              opacity: 0.5,
              fillOpacity: 0.2,
            },
          },
          polyline: false,
          rectangle: false,
          circle: false,
          circlemarker: false,
          marker: false,
        },
        edit: {
          featureGroup: featureGroupRef.current,
          remove: true,
        },
      };

      drawControlRef.current = new L.Control.Draw(drawControlOptions);
      map.addControl(drawControlRef.current);

      // Event handlers
      map.on(L.Draw.Event.CREATED, handleDrawCreated);
      map.on(L.Draw.Event.EDITED, handleDrawEdited);
      map.on(L.Draw.Event.DELETED, handleDrawDeleted);
    }

    return () => {
      // Cleanup
      if (editable && drawControlRef.current) {
        map.removeControl(drawControlRef.current);
        map.off(L.Draw.Event.CREATED, handleDrawCreated);
        map.off(L.Draw.Event.EDITED, handleDrawEdited);
        map.off(L.Draw.Event.DELETED, handleDrawDeleted);
      }

      if (featureGroupRef.current) {
        map.removeLayer(featureGroupRef.current);
      }
    };
  }, [map, editable, initialPolygons]);

  const handleDrawCreated = (e: L.DrawEvents.Created) => {
    const layer = e.layer;
    if (layer instanceof L.Polygon) {
      featureGroupRef.current?.addLayer(layer);
      onPolygonCreated?.(layer);
    }
  };

  const handleDrawEdited = (e: L.DrawEvents.Edited) => {
    const layers = e.layers;
    layers.eachLayer((layer) => {
      if (layer instanceof L.Polygon) {
        onPolygonEdited?.(layer);
      }
    });
  };

  const handleDrawDeleted = (e: L.DrawEvents.Deleted) => {
    const layers = e.layers;
    layers.eachLayer((layer) => {
      if (layer instanceof L.Polygon) {
        onPolygonDeleted?.(layer);
      }
    });
  };

  return null;
}
