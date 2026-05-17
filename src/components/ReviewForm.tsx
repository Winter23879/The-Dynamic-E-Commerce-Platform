"use client";

import { useActionState, useEffect, useState } from "react";
import { submitReviewAction } from "@/actions/reviews";
import { Star, Send, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export function ReviewForm({ productId, userName }: { productId: string; userName?: string | null }) {
  const [state, formAction, isPending] = useActionState(submitReviewAction, null);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    if (state?.success) {
      setSuccessMsg(true);
      setComment("");
      setRating(5);
      setTimeout(() => setSuccessMsg(false), 4000);
    }
  }, [state]);

  if (!userName) {
    return (
      <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-3xl text-center space-y-2">
        <p className="text-sm font-semibold text-slate-300">Want to share your experience?</p>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Sign in with your Prime account to leave a verified rating and review for this gadget.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-900/60 backdrop-blur border border-slate-800 rounded-3xl space-y-6 shadow-xl shadow-cyan-950/10">
      <div className="border-b border-slate-800/80 pb-4">
        <h3 className="text-lg font-bold text-white">Write a Review</h3>
        <p className="text-xs text-slate-400 mt-0.5">Posting publicly as {userName}</p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3 text-emerald-400 text-xs animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-bold">Review submitted successfully!</p>
            <p className="text-emerald-500/80 text-[10px] mt-0.5">Thank you for helping the Prime community.</p>
          </div>
        </div>
      )}

      {state?.error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center gap-3 text-rose-400 text-xs animate-shake">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="productId" value={productId} />
        <input type="hidden" name="rating" value={rating} />

        {/* Star Selector */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Overall Rating
          </label>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(null)}
                className="p-1 transition-transform hover:scale-125 focus:outline-none"
              >
                <Star
                  className={`w-7 h-7 transition-colors ${
                    star <= (hoverRating ?? rating) ? "text-amber-400 fill-amber-400" : "text-slate-700"
                  }`}
                />
              </button>
            ))}
            <span className="ml-3 text-xs font-bold font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
              {rating}.0 Stars
            </span>
          </div>
        </div>

        {/* Comment input */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Written Review <span className="text-slate-600">(Optional)</span>
          </label>
          <textarea
            name="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="How is the build quality? Acoustic performance? OLED refresh rate?"
            className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-xs transition-all resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 px-6 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-semibold rounded-2xl shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 text-xs transition-all disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Submitting review...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Post Verified Review</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
