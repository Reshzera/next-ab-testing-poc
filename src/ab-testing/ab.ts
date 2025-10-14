import { cookies } from "next/headers";
import type { Variant } from "./experiments";

export async function getVariant(
  expKey: string,
  fallback: Variant = "controller"
): Promise<Variant> {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;
  console.log("User ID:", userId);
  const variant = cookieStore.get(`ab_${expKey}_${userId}`)?.value as Variant;
  return !!variant ? variant : fallback;
}
