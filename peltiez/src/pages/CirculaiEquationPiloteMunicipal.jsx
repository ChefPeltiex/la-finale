import CirculaiKitDoc from "./CirculaiKitDoc";
import { getCirculaiKitDocById } from "@/lib/circulaiEgorBrand";

export default function CirculaiEquationPiloteMunicipal() {
  return <CirculaiKitDoc doc={getCirculaiKitDocById("equation-pilote")} />;
}
