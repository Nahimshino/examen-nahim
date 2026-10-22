# Informe final — Examen práctico parcial "Equipo Pokémon"

**Autor:** Nahim Escudero · **Fecha:** 2026-10-22 · **Detalle por ticket:** ver `AUDITORIA.md`

## Resumen

La app arrancaba pero tenía 11 errores repartidos en 12 tickets (T1–T12), más 2 pedidos de mejora (T13, T14) y 3 observaciones de revisión de código que eran falsas alarmas (R1–R3). Corregí los 11 errores con un commit por corrección. `npx tsc --noEmit` pasó de **14 errores a 0**, y la app empaqueta para Android sin errores (`npx expo export --platform android`).

| Categoría | Tickets | Correcciones |
|---|---|---|
| Seguridad | T11, T12 | C2, C1 |
| Código / React | T3, T4, T5, T6, T7, T10 | C10, C3, C6, C4, C7, C8 |
| APIs y estados | T2 | C5 |
| Firebase Auth | T1 | C11 |
| Experiencia de usuario | T8, T9 | C9 |
| Mejoras (no se implementan) | T13, T14 | — |
| Falsas alarmas (sin cambios) | R1, R2, R3 | — |

## Paso a paso

### Paso 0 — Análisis y preparación del entorno
- Leí el enunciado, la guía de Firebase, las notas de la Semana 9 y la descripción de la plataforma. Revisé todo el código de `src/`.
- `npm install` y `npx tsc --noEmit`: **14 errores**. 12 eran `Cannot find name 'process'`, porque se había borrado `expo-env.d.ts`, que carga los tipos de `expo/types`. Los otros 2 corresponden a T4 y T7.
- Restauré `expo-env.d.ts` y guardé las versiones del entorno (Expo SDK 57, `metro.config.js`) en un commit aparte para no mezclarlas con las correcciones → `6bb50be`.

### Paso 1 — C1 · T12: secretos y Git (`c778ce1`)
- **Causa:** `.gitignore` no incluía `.env`, y `src/config/claves.ts` tenía una clave de administración escrita en el código.
- **Cambio:** agregué `.env` al `.gitignore` y eliminé `claves.ts` (ningún archivo lo usaba).
- **Importante:** la clave sigue en el historial (commit `59d499c`). Quitarla del archivo no basta: una clave real habría que rotarla.

### Paso 2 — C2 · T11: reglas de Firestore (`9e875ec`)
- **Causa:** la subcolección `usuarios/{uid}/equipo` tenía `allow read, write: if true`. La regla de `/usuarios/{uid}` no se aplica a las subcolecciones.
- **Cambio:** `request.auth != null && request.auth.uid == uid`.
- **Verificación:** en el simulador, el dueño tiene acceso permitido; otro usuario y un acceso sin autenticar quedan denegados.

### Paso 3 — C3 · T4: botón Quitar (`17db8c4`)
- **Causa:** `onClick` es del navegador; `Pressable` de React Native solo responde a `onPress`.
- **Cambio:** `onClick` → `onPress`. Esto desbloqueó la reproducción de T9 y T10.

### Paso 4 — C4 · T6: equipo vacío al volver a entrar (`f45ff95`)
- **Causa:** la caché se guardaba con `String(lista)`, que produce `"[object Object],…"`. Al volver a entrar, `JSON.parse` fallaba, la excepción cortaba la inicialización y nunca se pedía el equipo a Firestore.
- **Cambio:** `JSON.stringify` al guardar. Al leer, si la caché está dañada se borra y se devuelve `[]` (atiende la nota de soporte sobre copias dañadas de pruebas anteriores).

### Paso 5 — C5 · T2: ruedita infinita sin conexión (`33205bc`)
- **Causa:** la promesa no tenía `.catch` y no se comprobaba `res.ok`. Si la red fallaba, el estado se quedaba en `'cargando'`, y además la pantalla no tenía una rama para mostrar el error.
- **Cambio:** `res.ok`, tiempo máximo de 10 s con `AbortController`, estado `'error'` con mensaje y botón **Reintentar**.

### Paso 6 — C6 · T5: el rol no se actualiza en pantalla (`783a180`)
- **Causa:** se mutaba el objeto (`miembro.rol = rol`) y se pasaba la misma referencia a `setEquipo`, así que React no detectaba el cambio.
- **Cambio:** `map` + spread para crear un arreglo nuevo, y se actualiza también la caché.

### Paso 7 — C7 · T7: tercer botón de rol sin texto (`5f57e7e`)
- **Causa:** el selector usaba `'suplente'`, que no existe en el tipo `Rol` (`'banca'`). TypeScript ya lo marcaba.
- **Cambio:** `'suplente'` → `'banca'`. Con esto `tsc` quedó en **0 errores**.

### Paso 8 — C8 · T10: advertencia de key y tarjeta equivocada (`8f70986`)
- **Causa:** la lista de tarjetas no tenía `key`, así que React identificaba cada tarjeta por su posición y el estado "expandida" saltaba a otra al quitar una.
- **Cambio:** `key={m.id}`.

### Paso 9 — C9 · T8 + T9: botón Quitar pequeño y sin confirmación (`6663c5a`)
- **Causa:** `height: 28` (menos del mínimo de 44 px) y borrado con un solo toque.
- **Cambio:** `minHeight: 44` y `Alert.alert` con "Cancelar" y "Quitar" (destructivo).

### Paso 10 — C10 · T3: el buscador no filtra (`945a266`)
- **Causa:** al `useEffect` del filtro le faltaba `busqueda` en las dependencias.
- **Cambio:** `[estado]` → `[estado, busqueda]`.

### Paso 11 — C11 · T1: la sesión se pierde al cerrar la app (`d13bfcf`)
- **Causa:** `getAuth` en React Native guarda la sesión solo en memoria.
- **Cambio:** `initializeAuth` con `getReactNativePersistence(AsyncStorage)`. En `tsconfig.json` agregué una ruta alternativa a los tipos de React Native de `@firebase/auth`, porque npm lo instaló anidado.

### Paso 12 — Decisiones sin cambio (sección 2 de `AUDITORIA.md`)
- **T13 / T14:** son pedidos de mejora (traducción y modo claro), no errores. No se implementan.
- **R1:** `[]` es correcto: la suscripción a la sesión se crea una sola vez y se limpia al desmontar.
- **R2:** el `any` está acotado, documentado y validado justo después.
- **R3:** el índice como `key` es aceptable porque `ROLES` es una lista estática que nunca cambia.

### Paso 13 — Verificación global
- `npx tsc --noEmit` → 0 errores.
- `npx expo export --platform android` → empaqueta 822 módulos sin errores.
- Recorrido en el teléfono: login → Explorar → Detalle → Mi equipo, repetido después de publicar las reglas.

## Lecciones
1. **TypeScript encontró 2 errores sin ejecutar la app** (T4, T7): revisar `tsc` primero ahorra tiempo.
2. **Inmutabilidad y `key`**: React compara referencias e identifica los elementos de una lista por su `key`. Los dos errores (T5, T10) se ven como problemas de pantalla, pero la causa es cómo React detecta cambios.
3. **Toda petición puede fallar**: `fetch` necesita `.catch`, `res.ok` y un tiempo máximo.
4. **La seguridad no se ve en la app**: las reglas abiertas "funcionaban". Solo el simulador de reglas mostró el problema.
5. **Borrar un secreto no lo quita del historial**: hay que rotarlo.
6. **No todo lo raro es un error**: R1–R3 eran correctos, y cambiarlos podía romper algo.
