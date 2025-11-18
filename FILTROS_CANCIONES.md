# Filtros de Canciones

Sistema de filtrado de canciones que conecta con el backend de contenidos.

## Filtros disponibles

- **Búsqueda por texto**: busca en título, artista y descripción (campo `q`)
- **Género**: Rock, Pop, Jazz, Electronic, Hip Hop, Classical, Folk, Metal, Reggae, Blues, Ambient, Synthwave, Lofi, Shoegaze, House
- **Etiquetas**: indie, experimental, acoustic, live, remix, instrumental, lo-fi, ambient, chill
- **Idioma**: español, inglés, francés, alemán, italiano, portugués, instrumental
- **Fechas de publicación**: desde/hasta con campos de tipo date
- **Ordenación**: por título, duración o reproducciones (ascendente/descendente)

Los filtros de duración (minDurationSec/maxDurationSec) fueron quitados de la UI por ser poco útiles en la práctica.

## Configuración

El frontend se conecta a dos backends:

- **Contenidos** (álbumes, pistas): `http://localhost:8081`
- **Usuarios** (login, registro): `http://localhost:8080`

Configuración en `src/environments/`:
```typescript
contentApiUrl: 'http://localhost:8081',
usersApiUrl: 'http://localhost:8080',
showDebugInfo: false  // oculta badges y logs de debug
```

## Backend

El endpoint `/tracks` devuelve:
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Canción",
      "genre": "Rock",  // derivado del primer valor de album.genres
      "album": { "genres": "Rock,Alternative", ... },
      ...
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 100 }
}
```

### Normalización de géneros

El backend acepta variantes del género (espacios, guiones, mayúsculas):
- `Hip Hop` → busca `Hip Hop`, `hip hop`, `hip-hop`, `hiphop`, `HIPHOP`, etc.
- Aplica a acentos y puntuación: `R&B` → `R B`, `RB`, etc.

Implementado con helpers:
```javascript
stripDiacritics(s)    // quita acentos
stripPunctuation(s)   // normaliza puntuación
```

Los géneros se guardan en `Album.genres` como CSV (`"Rock,Alternative"`). El endpoint `/tracks` devuelve un campo derivado `genre` con el primer valor.

## Archivos clave

**Frontend:**
- `api.service.ts`: define `TrackFilters`, `getTracks()`
- `songs.service.ts`: `getTracksFromBackend()` mapea `meta` a `pagination`
- `songs.component.ts`: lógica de filtros, paginación
- `songs.component.html`: UI de filtros
- `environment.ts`: URLs de los backends

**Backend:**
- `service/TracksService.js`: filtrado con Prisma, normalización de géneros, campo derivado `genre`
- `service/AlbumsService.js`: CRUD de álbumes (guarda genres como CSV)
- `prisma/schema.prisma`: modelo de datos

## Modo debug

Cambiar `showDebugInfo: true` en environment para ver:
- Badge "🌐 Conectado al Backend"
- Logs de consola con filtros y respuestas
- Banner de error cuando falla el backend

Por defecto está en `false` para producción limpia.

## Historial de cambios

1. Implementación inicial con todos los filtros del backend
2. Corrección de puerto: 8080 usuarios, 8081 contenidos
3. Fix estructura de respuesta: `pagination` → `meta`
4. Eliminación de fallback automático a mock
5. Backend: fix filtro de género (Prisma relation syntax)
6. Backend: normalización de géneros (espacios/guiones/mayúsculas/acentos)
7. Backend: campo derivado `genre` en respuesta
8. Frontend: ocultación de indicadores debug con `showDebugInfo`
