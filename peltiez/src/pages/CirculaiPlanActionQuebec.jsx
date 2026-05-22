import CirculaiKitDoc from "./CirculaiKitDoc";
import { getCirculaiKitDocById } from "@/lib/circulaiEgorBrand";

const doc = getCirculaiKitDocById("plan-action-quebec");

export default function CirculaiPlanActionQuebec() {
  return <CirculaiKitDoc doc={doc} />;
}
