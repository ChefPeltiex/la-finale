import CirculaiKitDoc from "./CirculaiKitDoc";
import { getCirculaiKitDocById } from "@/lib/circulaiEgorBrand";

export default function CirculaiMainOeuvre() {
  return <CirculaiKitDoc doc={getCirculaiKitDocById("main-oeuvre")} />;
}
