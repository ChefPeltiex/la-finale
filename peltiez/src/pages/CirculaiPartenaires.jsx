import CirculaiKitDoc from "./CirculaiKitDoc";
import { getCirculaiKitDocById } from "@/lib/circulaiEgorBrand";

export default function CirculaiPartenaires() {
  return <CirculaiKitDoc doc={getCirculaiKitDocById("partenaires")} />;
}
