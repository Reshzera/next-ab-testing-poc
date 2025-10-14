import { getVariant } from "../ab-testing/ab";
import HomeA from "./_components/Home/HomeA";
import HomeB from "./_components/Home/HomeB";

export default async function Home() {
  const variant = await getVariant("home");
  return variant === "variant" ? <HomeA /> : <HomeB />;
}
