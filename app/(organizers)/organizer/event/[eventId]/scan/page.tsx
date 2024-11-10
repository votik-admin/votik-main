import ScanPage from "@app/containers/ScanPage/ScanPage";
import { BouncerProvider } from "@app/contexts/BouncerContext";
import QRScanner from "@app/organizers/components/Scan/QRScanner";

export default function Page() {
  return (
    <BouncerProvider>
      <ScanPage />
    </BouncerProvider>
  );
}
