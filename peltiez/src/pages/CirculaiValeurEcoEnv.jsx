import CirculaiKitDoc from "./CirculaiKitDoc";
import { getCirculaiKitDocById } from "@/lib/circulaiEgorBrand";

export default function CirculaiValeurEcoEnv() {
  return <CirculaiKitDoc doc={getCirculaiKitDocById("valeur-eco-env")} />;
}
