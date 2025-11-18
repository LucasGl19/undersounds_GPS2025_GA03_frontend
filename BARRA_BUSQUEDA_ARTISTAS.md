# Barra de Búsqueda de Artistas

## Descripción
Se ha implementado una barra de búsqueda funcional para buscar artistas en la página de Artistas del frontend.

## Características Implementadas

### 1. **Componente de Búsqueda**
- Barra de búsqueda con input de texto
- Búsqueda con debounce (300ms) para evitar llamadas excesivas al backend
- Indicador de "Buscando..." mientras se realiza la búsqueda
- Mensajes de error si falla la conexión al backend

### 2. **Integración con Backend**
- Endpoint utilizado: `GET /artists?q={query}&page={page}&page_size={pageSize}`
- URL del backend: `http://localhost:8080` (configurado en `environment.ts`)
- El endpoint busca artistas por nombre y email (implementado en `artists_controller.py`)

### 3. **Servicio de Artistas**
Se actualizó `artists.service.ts` con:
- Método `searchArtists()` que consulta el endpoint del backend
- Soporte para paginación (aunque no se usa en la versión actual)
- Manejo de parámetros de búsqueda con `HttpParams`

### 4. **Componente de Artistas**
Se actualizó `artists.component.ts` con:
- Manejo de estado de búsqueda (`isSearching`, `searchError`)
- Observable con debounce para optimizar las búsquedas
- Distinción entre artistas locales (mock) y resultados de búsqueda del backend
- Limpieza de recursos en `ngOnDestroy()`

### 5. **Interfaz de Usuario**
- Barra de búsqueda estilizada con bordes redondeados
- Efecto de focus con cambio de color y sombra
- Diseño responsive que se adapta a diferentes tamaños de pantalla
- Sección separada para mostrar resultados de búsqueda
- Mensaje cuando no se encuentran resultados
- Imagen por defecto (`default-artist.svg`) para artistas sin avatar

### 6. **Estilos CSS**
Se agregaron los siguientes estilos en `artists.component.css`:
- `.search-bar-container`: Contenedor principal de la búsqueda
- `.search-input`: Estilos del input de búsqueda con transiciones
- `.search-status`: Indicador de estado "Buscando..."
- `.search-error`: Mensajes de error en rojo
- `.search-results`: Contenedor de resultados
- `.no-results`: Mensaje cuando no hay resultados

## Flujo de Funcionamiento

1. **Al cargar la página**: Se ejecuta automáticamente una consulta al backend para obtener todos los artistas (sin filtro de búsqueda)
2. **Búsqueda en tiempo real**: El usuario escribe en la barra de búsqueda
3. Después de 300ms sin escribir (debounce), se ejecuta la búsqueda filtrada
4. Se realiza una petición HTTP al endpoint `/artists` con el parámetro `q`
5. Los resultados se muestran dinámicamente desde el backend
6. Si se borra la búsqueda, se recargan todos los artistas del backend
7. **Fallback**: Si el backend no está disponible, se muestran datos locales de ejemplo

## Archivos Modificados

- `src/app/services/artists.service.ts` - Añadido método de búsqueda
- `src/app/pages/artists/artists.component.ts` - Lógica de búsqueda
- `src/app/pages/artists/artists.component.html` - Barra de búsqueda y resultados
- `src/app/pages/artists/artists.component.css` - Estilos de la búsqueda
- `src/assets/images/artists/default-artist.svg` - Imagen por defecto (creado)

## Requisitos

- El backend debe estar corriendo en `http://localhost:8080`
- El endpoint `/artists` debe estar implementado y funcional
- HttpClient debe estar configurado en `app.config.ts` (ya configurado)

## Uso

1. Navegar a la página de Artistas
2. Escribir el nombre o email del artista en la barra de búsqueda
3. Los resultados aparecerán automáticamente después de dejar de escribir
4. Para volver a ver todos los artistas, borrar el texto de búsqueda

## Mejoras Futuras

- Implementar paginación para resultados de búsqueda
- Agregar filtros combinados (búsqueda + género + país)
- Guardar historial de búsquedas
- Agregar autocompletado
- Implementar caché de resultados
