/**
 * Configuración de variables de entorno
 *
 * En Expo, las variables con prefijo EXPO_PUBLIC_ son accesibles
 * en el cliente a través de process.env
 *
 * NOTA: Para que los cambios en .env surtan efecto,
 * hay que reiniciar el servidor de desarrollo (npx expo start -c)
 */

export const env = {
  // API URLs
  QUOTES_API_URL:
    process.env.EXPO_PUBLIC_QUOTES_API_URL || "https://zenquotes.io/api/random",
  IMAGES_API_URL:
    process.env.EXPO_PUBLIC_IMAGES_API_URL || "https://picsum.photos",

  // Configuración
  API_TIMEOUT: Number(process.env.EXPO_PUBLIC_API_TIMEOUT) || 10000,
} as const;
