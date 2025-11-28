import { env } from "@/src/config";

import { apiClient, getApiErrorMessage } from "./client";

/**
 * Respuesta de la API de ZenQuotes
 */
interface ZenQuoteResponse {
  q: string; // quote
  a: string; // author
  h: string; // HTML formatted quote
}

/**
 * Cita normalizada para nuestra app
 */
export interface Quote {
  quote: string;
  author: string;
}

/**
 * Obtiene una cita aleatoria de ZenQuotes API
 *
 * @returns Promesa con la cita y autor
 * @throws Error si falla la petición
 */
export async function getRandomQuote(): Promise<Quote> {
  try {
    const response = await apiClient.get<ZenQuoteResponse[]>(
      env.QUOTES_API_URL
    );

    // ZenQuotes devuelve un array con una cita
    const [data] = response.data;

    if (!data) {
      throw new Error("No quote received");
    }

    return {
      quote: data.q,
      author: data.a,
    };
  } catch (error) {
    const message = getApiErrorMessage(error);
    console.error("[QuotesAPI] Failed to fetch quote:", message);
    throw new Error(message);
  }
}
