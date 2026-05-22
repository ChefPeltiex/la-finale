import CirculaiKitDoc from "./CirculaiKitDoc";
import { getCirculaiKitDocById } from "@/lib/circulaiEgorBrand";

export default function CirculaiReferencesCulturelles() {
  return <CirculaiKitDoc doc={getCirculaiKitDocById("references-culture")} />;
}
