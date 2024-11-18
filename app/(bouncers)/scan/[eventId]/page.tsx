import ScanPage from "@app/containers/ScanPage/ScanPage";
import { BouncerProvider } from "@app/contexts/BouncerContext";

export default function Page() {
  return (
    <BouncerProvider>
      <ScanPage />
    </BouncerProvider>
  );
}
