import CirculaiKitDoc from "./CirculaiKitDoc";
import { getCirculaiKitDocById } from "@/lib/circulaiEgorBrand";

const doc = getCirculaiKitDocById("lettre");

export default function CirculaiLettreMunicipale() {
  return <CirculaiKitDoc doc={doc} />;
}
