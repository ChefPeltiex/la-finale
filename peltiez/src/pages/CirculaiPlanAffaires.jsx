import CirculaiKitDoc from "./CirculaiKitDoc";
import { getCirculaiKitDocById } from "@/lib/circulaiEgorBrand";

const doc = getCirculaiKitDocById("plan-affaires");

export default function CirculaiPlanAffaires() {
  return <CirculaiKitDoc doc={doc} />;
}
