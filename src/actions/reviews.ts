"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitReviewAction(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Please sign in to leave a review." };
  }

  const productId = formData.get("productId") as string;
  const ratingStr = formData.get("rating") as string;
  const comment = formData.get("comment") as string;
  const rating = parseInt(ratingStr, 10);

  if (!productId || isNaN(rating) || rating < 1 || rating > 5) {
    return { error: "Please select a valid rating between 1 and 5 stars." };
  }

  try {
    // Check if user already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: session.user.id,
        productId,
      },
    });

    if (existingReview) {
      return { error: "You have already reviewed this product." };
    }

    // Create review
    await prisma.review.create({
      data: {
        rating,
        comment: comment?.trim() || null,
        userId: session.user.id,
        productId,
      },
    });

    // Recalculate product rating
    const allReviews = await prisma.review.findMany({
      where: { productId },
      select: { rating: true },
    });

    const totalReviews = allReviews.length;
    const avgRating = totalReviews > 0 ? allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 0;

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: avgRating,
        reviewCount: totalReviews,
      },
    });

    revalidatePath(`/products/${productId}`);
    revalidatePath("/products");
    return { success: true };
  } catch (error) {
    console.error("Submit review error:", error);
    return { error: "Failed to submit review. Please try again." };
  }
}
