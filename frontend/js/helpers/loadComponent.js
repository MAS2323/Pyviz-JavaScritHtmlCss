// Función para cargar un archivo HTML parcial
export async function loadComponent(url, selector) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Error al cargar ${url}`);
    const html = await response.text();
    document.querySelector(selector).innerHTML = html;
    console.log(`Componente cargado: ${url}`);
  } catch (error) {
    console.error(error);
  }
}
