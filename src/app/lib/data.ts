"use server";

import { sql } from "@vercel/postgres";
import { Card, User } from "@/utils/types";

export async function fetchAllUsers() {
  try {
    return (await sql`SELECT * FROM users`).rows;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch user data.");
  }
}

export async function updateUser(user: User) {
  try {
    return (
      await sql`UPDATE users SET name = ${user.name}, image = ${user.image}, admin = ${user.admin}, allowlisted = ${user.allowlisted} WHERE id = ${user.id}`
    ).rows;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to update user data.");
  }
}

export async function fetchAllCards() {
  try {
    return (
      await sql`
SELECT *
FROM rrrp_top_trumps_cards
ORDER BY name ASC
`
    ).rows;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch card data.");
  }
}

export async function fetchUserCards(username: string) {
  try {
    return (
      await sql`
SELECT *
FROM rrrp_top_trumps_cards
WHERE owner = ${username}
ORDER BY name ASC
`
    ).rows;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch user card data.");
  }
}

export async function addCard(card: Card) {
  try {
    await sql`
INSERT INTO rrrp_top_trumps_cards (name, pronouns, strength, comedic_timing, dirty_minded, accident_prone, rizz, serving_cunt, image, residence, occupation, quote, special_interest, owner)
VALUES (${card.name}, ${card.pronouns}, ${card.strength}, ${card.comedic_timing}, ${card.dirty_minded}, ${card.accident_prone}, ${card.rizz}, ${card.serving_cunt}, ${card.image}, ${card.residence}, ${card.occupation}, ${card.quote}, ${card.special_interest}, ${card.owner})`;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error(`Failed to add card "${card.name}".`);
  }
}

export async function updateCard(card: Card) {
  try {
    await sql`
UPDATE rrrp_top_trumps_cards
SET
name = ${card.name},
pronouns = ${card.pronouns},
strength = ${card.strength},
comedic_timing = ${card.comedic_timing},
dirty_minded = ${card.dirty_minded},
accident_prone = ${card.accident_prone},
rizz = ${card.rizz},
serving_cunt = ${card.serving_cunt},
image = ${card.image},
residence = ${card.residence},
occupation = ${card.occupation},
quote = ${card.quote},
special_interest = ${card.special_interest}
WHERE
id = ${card.id}`;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error(`Failed to update card "${card.name}".`);
  }
}

export async function deleteCard(card: Card) {
  try {
    await sql`
DELETE FROM rrrp_top_trumps_cards
WHERE id = ${card.id}`;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error(`Failed to delete card "${card.name}".`);
  }
}
