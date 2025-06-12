import { SiteHeader } from "@/components/site-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import React, { useEffect, useState } from "react";
import Map from "@/components/map/map";
import { LayersControl, TileLayer } from "react-leaflet";
import PulsingDot from "@/components/map/pulsing-dot"; // for user location
import "leaflet/dist/leaflet.css";

const MapPage: React.FC = () => {
  const [zoom, setZoom] = useState(13);
  const [center, setCenter] = useState<[number, number]>([16.6156, 120.3166]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: [number, number] = [
          position.coords.latitude,
          position.coords.longitude,
        ];
        setUserLocation(coords);
        setCenter(coords); // Optional: center map to user
      },
      (error) => {
        console.error("Geolocation error:", error);
      }
    );
  }, []);

  return (
    <div className="[--header-height:calc(theme(spacing.14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <div className="flex flex-1 flex-col gap-4 p-4">
            <h1 className="text-xl font-semibold mb-2">Map with Layers</h1>
            <p className="text-sm text-muted-foreground mb-1">
              Zoom: {zoom} | Center: {center[0].toFixed(4)},{" "}
              {center[1].toFixed(4)}
            </p>

            <div className="border rounded shadow h-[calc(100vh-var(--header-height)-8rem)] overflow-hidden">
              <Map
                center={center}
                zoom={zoom}
                minZoom={1}
                maxZoom={22}
                style={{ height: "100%", width: "100%" }}
                onZoomChange={setZoom}
                onCenterChange={setCenter}
              >
                <LayersControl position="topright">
                  <LayersControl.BaseLayer checked name="OpenStreetMap">
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  </LayersControl.BaseLayer>

                  <LayersControl.BaseLayer name="Satellite">
                    <TileLayer
                      url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                      subdomains={["mt0", "mt1", "mt2", "mt3"]}
                    />
                  </LayersControl.BaseLayer>

                  <LayersControl.BaseLayer name="Terrain">
                    <TileLayer
                      url="https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}"
                      subdomains={["mt0", "mt1", "mt2", "mt3"]}
                    />
                  </LayersControl.BaseLayer>

                  {userLocation && (
                    <LayersControl.Overlay checked name="Your Location">
                      <PulsingDot position={userLocation} />
                    </LayersControl.Overlay>
                  )}
                </LayersControl>
              </Map>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default MapPage;
