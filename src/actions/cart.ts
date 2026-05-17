"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getCartAction() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized", cart: null };
  }

  try {
    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: true,
          },
          orderBy: { id: "asc" },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: session.user.id },
        include: { items: { include: { product: true } } },
      });
    }

    return { success: true, cart };
  } catch (error) {
    console.error("Failed to get cart:", error);
    return { error: "Database error", cart: null };
  }
}

export async function addToCartAction(productId: string, quantity = 1) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Please log in to add items to your cart." };
  }

  try {
    // 1. Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: session.user.id },
      });
    }

    // 2. Check stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || product.stock < quantity) {
      return { error: "Not enough items in stock." };
    }

    // 3. Upsert cart item
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (existingItem) {
      const newQty = existingItem.quantity + quantity;
      if (product.stock < newQty) {
        return { error: "Cannot add more than available stock." };
      }
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQty },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    revalidatePath("/");
    revalidatePath("/products");
    return { success: true };
  } catch (error) {
    console.error("Add to cart error:", error);
    return { error: "Failed to add item to cart." };
  }
}

export async function updateCartItemAction(itemId: string, quantity: number) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: itemId } });
    } else {
      const item = await prisma.cartItem.findUnique({
        where: { id: itemId },
        include: { product: true },
      });

      if (!item) return { error: "Item not found" };

      if (item.product.stock < quantity) {
        return { error: "Requested quantity exceeds stock." };
      }

      await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity },
      });
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Update cart item error:", error);
    return { error: "Failed to update item." };
  }
}

export async function removeFromCartAction(itemId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.cartItem.delete({ where: { id: itemId } });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Remove from cart error:", error);
    return { error: "Failed to remove item." };
  }
}
