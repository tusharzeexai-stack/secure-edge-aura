/**
 * DesktopPanel – wraps dark "mobile" screens in a centered, properly-sized
 * desktop card so they look right inside the dashboard shell.
 */
export function DesktopPanel({
  children,
  dark = false,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) {
  if (!dark) {
    // Light screens fill the whole area naturally
    return <div className="h-full w-full overflow-auto">{children}</div>;
  }

  // Dark screens: center a card in the panel
  return (
    <div className="min-h-full w-full flex items-start justify-center bg-[#0A192F] p-8">
      <div className="w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl shadow-black/40 ring-1 ring-white/10">
        <div className="h-[600px] overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
