import CirculaiKitDoc from "./CirculaiKitDoc";
import { getCirculaiKitDocById } from "@/lib/circulaiEgorBrand";

const doc = getCirculaiKitDocById("plan-demo");

export default function CirculaiPlanDemonstration() {
  return <CirculaiKitDoc doc={doc} />;
}
