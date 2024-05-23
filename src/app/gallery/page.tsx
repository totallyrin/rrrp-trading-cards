"use client";

import CardGallery from "@/components/CardGallery";
import { useEffect, useState } from "react";
import { Card as CardType } from "@/utils/types";
import { fetchAllCards } from "@/app/lib/data";

export default function Gallery() {
  const [cards, setCards] = useState<CardType[]>([]);

  useEffect(() => {
    fetchAllCards()
      .then((cards) => {
        setCards(cards as CardType[]);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  return <CardGallery cards={cards} />;
}
