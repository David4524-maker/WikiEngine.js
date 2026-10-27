/**
 * WikiEngine.js - Motor ligero para integrar búsquedas de Wikipedia en tus proyectos.
 */
export class WikiEngine {
  constructor(lang = 'es') {
    this.lang = lang;
    this.restApiUrl = `https://${lang}.wikipedia.org/api/rest_v1`;
  }

  /**
   * Obtiene el resumen, imagen y enlace de una página directamente por su término de búsqueda.
   * Usa la API REST moderna de Wikipedia, que es ideal para tarjetas de contenido.
   * @param {string} query - El término a buscar (ej. "JavaScript", "Planeta Marte").
   */
  async getArticle(query) {
    // Formateamos el texto para la URL de Wikipedia (reemplaza espacios por guiones bajos)
    const formattedQuery = encodeURIComponent(query.trim().replace(/\s+/g, '_'));
    const endpoint = `${this.restApiUrl}/page/summary/${formattedQuery}`;

    try {
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('No se encontró ningún artículo con ese nombre.');
        }
        throw new Error('Error al conectar con Wikipedia.');
      }

      const data = await response.json();

      // Devolvemos un objeto limpio con lo que realmente vas a mostrar
      return {
        title: data.title,
        extract: data.extract, // Resumen de texto de introducción
        url: data.content_urls.desktop.page, // Enlace original por si quieren leer más
        image: data.originalimage ? data.originalimage.source : null, // URL de la imagen principal (si tiene)
        description: data.description // Una línea corta descriptiva
      };
    } catch (error) {
      console.error('WikiEngine Error:', error.message);
      throw error;
    }
  }
}
