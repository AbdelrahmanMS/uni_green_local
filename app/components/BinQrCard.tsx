import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Button } from "./ui";
import { materialColor, materialLabel } from "../lib/i18n";

/** Client-side QR rendering (constitution: no server QR endpoint). */
export function BinQrCard({
  qrCode,
  material,
}: {
  qrCode: string;
  material: string;
}) {
  // Off-screen high-resolution canvas used only to produce the print image.
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const canvas = printRef.current?.querySelector("canvas");
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    const win = window.open("", "_blank", "width=600,height=700");
    if (!win) return;
    win.document.write(`<!doctype html>
<html><head><title>${qrCode}</title><style>
  @page { margin: 0; }
  html, body { height: 100%; margin: 0; }
  body { display: flex; align-items: center; justify-content: center; }
  img { width: 80vmin; height: 80vmin; image-rendering: pixelated; }
</style></head>
<body><img src="${dataUrl}" onload="window.focus();window.print();" /></body>
</html>`);
    win.document.close();
  };

  return (
    <div className="text-center">
      <div className="mx-auto mb-4 inline-block rounded-xl border border-line bg-white p-5">
        <QRCodeCanvas value={qrCode} size={200} includeMargin />
        <div className="mt-3 break-all font-mono text-xs text-muted">
          {qrCode}
        </div>
        <div className="mt-1 flex items-center justify-center gap-2 text-sm font-semibold text-ink">
          <span
            className="inline-block h-3 w-3 rounded-full ring-1 ring-black/15"
            style={{ background: materialColor(material) }}
          />
          {materialLabel(material)}
        </div>
      </div>

      {/* Hidden hi-res canvas for crisp printing */}
      <div
        ref={printRef}
        className="pointer-events-none absolute -left-[9999px] top-0"
      >
        <QRCodeCanvas value={qrCode} size={512} includeMargin />
      </div>

      <Button
        variant="secondary"
        icon="print"
        className="w-full"
        onClick={handlePrint}
      >
        طباعة
      </Button>
    </div>
  );
}
