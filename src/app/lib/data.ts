"use server";

import { sql } from "@vercel/postgres";
import { Card, User, VerifyImage } from "@/utils/types";

export async function fetchAllUsers() {
  try {
    return (
      await sql`SELECT *
                FROM users`
    ).rows;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch user data.");
  }
}

export async function updateUser(user: User) {
  try {
    return (
      await sql`UPDATE users
                SET name        = ${user.name},
                    image       = ${user.image},
                    admin       = ${user.admin},
                    allowlisted = ${user.allowlisted}
                WHERE id = ${user.id}`
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
          FROM cards
          ORDER BY name ASC
      `
    ).rows;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch card data.");
  }
}

export async function fetchCharacterCards(character: string) {
  try {
    return (
      await sql`
          SELECT *
          FROM cards
          WHERE name = ${character}
          ORDER BY name ASC
      `
    ).rows;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch user card data.");
  }
}

export async function fetchUserCards(username: string) {
  try {
    return (
      await sql`
          SELECT *
          FROM cards
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
        INSERT INTO cards (name, pronouns, strength, comedic_timing, dirty_minded, accident_prone,
                           rizz, serving_cunt, image, residence, occupation, quote,
                           special_interest, owner)
        VALUES (${card.name}, ${card.pronouns}, ${card.strength}, ${card.comedic_timing},
                ${card.dirty_minded}, ${card.accident_prone}, ${card.rizz}, ${card.serving_cunt},
                ${card.image}, ${card.residence}, ${card.occupation}, ${card.quote},
                ${card.special_interest}, ${card.owner})`;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error(`Failed to add card "${card.name}".`);
  }
}

export async function updateCard(card: Card) {
  if (card.newimage && card.newimage !== card.image) {
    await addImage(card);
  }
  try {
    await sql`
        UPDATE cards
        SET name             = ${card.name},
            pronouns         = ${card.pronouns},
            strength         = ${card.strength},
            comedic_timing   = ${card.comedic_timing},
            dirty_minded     = ${card.dirty_minded},
            accident_prone   = ${card.accident_prone},
            rizz             = ${card.rizz},
            serving_cunt     = ${card.serving_cunt},
            image            = ${card.image},
            residence        = ${card.residence},
            occupation       = ${card.occupation},
            quote            = ${card.quote},
            special_interest = ${card.special_interest},
            owner            = ${card.owner}
        WHERE id = ${card.id}`;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error(`Failed to update card "${card.name}".`);
  }
}

export async function deleteCard(card: Card) {
  try {
    await sql`
        DELETE
        FROM cards
        WHERE id = ${card.id}`;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error(`Failed to delete card "${card.name}".`);
  }
}

export async function addImage(card: Card) {
  try {
    await sql`
        INSERT INTO images ("user", character, image)
        VALUES (${card.owner}, ${card.name},
                ${card.newimage ?? card.image}) ON CONFLICT (character) DO
        UPDATE SET image = ${card.newimage ?? card.image}`;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error(`Failed to add image "${card.name}".`);
  }
}

export async function deleteImage(image: VerifyImage) {
  try {
    await sql`
        DELETE
        FROM images
        WHERE id = ${image.id}`;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error(`Failed to delete image "${image.image}".`);
  }
}

export async function approveImage(image: VerifyImage) {
  try {
    await sql`
        UPDATE cards
        SET image = ${image.image}
        WHERE name = ${image.character}
          AND owner = ${image.user};
    `;
    await deleteImage(image);
  } catch (error) {
    console.error("Database error:", error);
    throw new Error(`Failed to approve image "${image.image}".`);
  }
}

export async function fetchAllImages() {
  try {
    return (
      await sql`
          SELECT *
          FROM images
      `
    ).rows;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch image data.");
  }
}

export async function fetchUserImages(username: string) {
  try {
    return (
      await sql`
          SELECT *
          FROM images
          WHERE "user" = ${username}
      `
    ).rows;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch user image data.");
  }
}
