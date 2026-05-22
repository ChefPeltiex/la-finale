import CirculaiKitDoc from "./CirculaiKitDoc";
import { getCirculaiKitDocById } from "@/lib/circulaiEgorBrand";

export default function CirculaiEquationsSysteme() {
  return <CirculaiKitDoc doc={getCirculaiKitDocById("equations-systeme")} />;
}
