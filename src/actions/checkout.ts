"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function processCheckoutAction(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Please log in to complete checkout." };
  }

  const name = formData.get("name") as string;
  const address = formData.get("address") as string;
  const cardNumber = formData.get("cardNumber") as string;
  const userId = session.user.id as string;

  if (!name || !address || !cardNumber) {
    return { error: "Please fill in all required shipping and payment fields." };
  }

  try {
    // 1. Get cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return { error: "Your cart is empty." };
    }

    // 2. Verify all stock is still available
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return {
          error: `Sorry, ${item.product.title} only has ${item.product.stock} units remaining. Please update your cart.`,
        };
      }
    }

    // 3. Calculate total
    const subtotal = cart.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const shipping = subtotal >= 150 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const totalAmount = parseFloat((subtotal + shipping + tax).toFixed(2));

    // 4. Perform atomic transaction: create order, decrement stock, empty cart
    const order = await prisma.$transaction(async (tx) => {
      // Decrement stock
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Create Order
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalAmount,
          status: "COMPLETED",
          stripePaymentId: `mock_pi_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              priceAtPurchase: item.product.price,
            })),
          },
        },
      });

      // Delete Cart items
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    revalidatePath("/");
    revalidatePath("/products");
    return { success: true, orderId: order.id };
  } catch (error) {
    console.error("Checkout processing error:", error);
    return { error: "Failed to process order. Please try again." };
  }
}
