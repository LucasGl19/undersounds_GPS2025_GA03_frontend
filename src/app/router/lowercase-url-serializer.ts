import { DefaultUrlSerializer, UrlSerializer, UrlTree } from '@angular/router';

// Normaliza todas las URLs a minúsculas para que las rutas no fallen por mayúsculas/minúsculas
export class LowerCaseUrlSerializer extends DefaultUrlSerializer implements UrlSerializer {
  override parse(url: string): UrlTree {
    // Convierte todo el path a minúsculas. Mantiene query y fragment pero en minúsculas también.
    // Si en el futuro se necesita preservar el case de query/fragment, habría que separar manualmente.
    return super.parse(url.toLowerCase());
  }
}
