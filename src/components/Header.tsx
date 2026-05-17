import { auth } from "@/auth";
import { getCartAction } from "@/actions/cart";
import { Navbar } from "@/components/Navbar";
import { CartInitializer } from "@/components/CartInitializer";

export async function Header() {
  const session = await auth();
  const res = session?.user?.id ? await getCartAction() : null;

  return (
    <>
      <CartInitializer initialItems={res?.success && res.cart ? res.cart.items : []} />
      <Navbar session={session} />
    </>
  );
}
