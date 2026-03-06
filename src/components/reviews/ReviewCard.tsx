"use client";

import { useState } from "react";
import Image from "next/image";
import { Review } from "@/types/Review";
import { StarRating } from "@/components/ui/StarRating";
import { ImageModal } from "./ImageModal";

type ReviewCardProps = {
  review: Review;
};

export function ReviewCard({ review }: ReviewCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <div className="flex-grow">
          <h3 className="font-semibold text-base text-gray-800 m-0">
            {review.name}
          </h3>
          <div className="flex items-center gap-1">
            <span className="font-bold text-sm">{review.rating.toFixed(1).replace(".", ",")}</span>
            <StarRating rating={review.rating} />
          </div>
          <p className="text-sm text-gray-600 mt-1">{review.text}</p>
        </div>
        {review.image && (
          <div className="ml-4 flex-shrink-0">
            <Image
              src={review.image}
              alt={`Avaliação de ${review.name}`}
              width={70}
              height={70}
              className="rounded-lg cursor-pointer object-cover w-[70px] h-[70px]"
              onClick={() => setModalOpen(true)}
              loading="lazy"
            />
          </div>
        )}
      </div>

      {modalOpen && review.image && (
        <ImageModal
          src={review.image}
          alt={`Avaliação de ${review.name}`}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
