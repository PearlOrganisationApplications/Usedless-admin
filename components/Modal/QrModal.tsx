"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QRCodeCanvas } from "qrcode.react";
import { useRef } from "react";
import { Download } from "lucide-react";

export default function QrModal({
  open,
  onClose,
  item,
}: {
  open: boolean;
  onClose: () => void;
  item: any | null;
}) {
  const qrRef = useRef<HTMLDivElement>(null);

  if (!item) return null;

  const qrData = JSON.stringify(item);

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;

    const pngUrl = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = `${item.name || "qr-code"}.png`;
    link.click();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm rounded-2xl p-6">
        <DialogHeader className="text-center space-y-1">
          <DialogTitle className="text-xl font-bold text-gray-800">
            QR Code
          </DialogTitle>
          <p className="text-sm text-gray-500">
            Scan to view details for <span className="font-semibold">{item.name}</span>
          </p>
        </DialogHeader>

        {/* QR Container */}
        <div className="flex justify-center my-6">
          <div
            ref={qrRef}
            className="bg-white p-4 rounded-xl shadow-lg border"
          >
            <QRCodeCanvas
              value={qrData}
              size={220}
              bgColor="#ffffff"
              fgColor="#000000"
              level="H"              // High error correction
              includeMargin={true}   // Important for scanning
            />
          </div>
        </div>

        <DialogFooter className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
          >
            Close
          </Button>

          <Button
            className="flex-1 flex items-center gap-2"
            onClick={handleDownload}
          >
            <Download size={18} />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
