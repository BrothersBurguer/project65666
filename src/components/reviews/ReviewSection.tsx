import { reviews, reviewSummary } from "@/data/reviews";
import { StarRating } from "@/components/ui/StarRating";
import { ReviewCard } from "./ReviewCard";

export function ReviewSection() {
  return (
    <section className="max-w-5xl mx-auto px-5 py-6">
      {/* Summary */}
      <div className="text-center rounded-xl outline outline-2 outline-prime-border p-4 mb-4">
        <b className="text-xl">{reviewSummary.rating.toFixed(1).replace(".", ",")}</b>
        <div className="flex justify-center my-1">
          <StarRating rating={reviewSummary.rating} size={18} />
        </div>
        <div className="text-sm">
          <b>{reviewSummary.recentCount} avaliações</b> •{" "}
          {reviewSummary.recentPeriod}
        </div>
        <div className="text-xs text-gray-500">
          {reviewSummary.totalCount.toLocaleString("pt-BR")} avaliações no total
        </div>
      </div>

      {/* Review list */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-3">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
}
