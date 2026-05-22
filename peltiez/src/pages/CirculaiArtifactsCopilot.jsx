import CirculaiKitDoc from "./CirculaiKitDoc";
import { getCirculaiKitDocById } from "@/lib/circulaiEgorBrand";

export default function CirculaiArtifactsCopilot() {
  return <CirculaiKitDoc doc={getCirculaiKitDocById("artifacts-copilot")} />;
}
