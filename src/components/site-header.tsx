import { NotificationDropdown } from "@/components/notifications/notification-dropdown";

export function SiteHeader() {
  return (
    <>
      {/* Desktop Header */}
      <header className="bg-background sticky top-0 z-40 flex w-full items-center">
        <div
          className="flex items-center gap-2 px-12 md:px-4 md:min-w-20 lg:min-w-70"
          aria-label="Go to dashboard"
        >
          <img src="/assets/DENR-Logo.svg" className="size-8" alt="DENR Logo" />
          <div className="grid md:hidden lg:grid text-left text-sm select-none">
            <span className="truncate text-xs font-medium">
              Integrated Establishment Regulatory
            </span>
            <span className="truncate text-xs">Management System</span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-6 ml-auto">
          <NotificationDropdown />
        </div>
      </header>
    </>
  );
}
