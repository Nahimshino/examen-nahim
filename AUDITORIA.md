# Bitácora de auditoría — Examen práctico parcial

**Nombre:** ______________________   **Fecha:** ____________   **Repositorio:** ______________________

> Cada comentario de la bandeja de soporte (T1 a T14) y cada observación de la revisión de código (R1 a R3) debe quedar registrado en **una** de las secciones 1, 2 o 3.
> Use identificadores propios (C1, C2...) para las correcciones y cítelos en los mensajes de sus commits.
> Cómo se califica cada campo: ver la sección 8 del enunciado.

## 1. Correcciones realizadas

| ID | Ticket(s) | Síntoma (lo que usted observó al reproducirlo) | Causa (por qué ocurría) | Cambio realizado (archivo y qué cambió; commit) | Prueba que confirma la solución (acción + resultado) | ¿IA? (Sí / No / Parcial) | Prompt utilizado (literal) y qué ajustó de la respuesta |
|---|---|---|---|---|---|---|---|
| C1 | | | | | | | |
| C2 | | | | | | | |
| C3 | | | | | | | |
| C4 | | | | | | | |
| C5 | | | | | | | |
| C6 | | | | | | | |
| C7 | | | | | | | |
| C8 | | | | | | | |
| C9 | | | | | | | |
| C10 | | | | | | | |
| C11 | | | | | | | |
| C12 | | | | | | | |

(Agregue las filas que necesite. Una fila puede cubrir varios tickets, por ejemplo T8 y T9.)

### Ejemplo de una fila bien completada (ticket ficticio T0; no pertenece a este examen)
| ID | Ticket(s) | Síntoma | Causa | Cambio realizado | Prueba | ¿IA? | Prompt |
|---|---|---|---|---|---|---|---|
| C0 | T0 | Al marcar la tarea 2, el contador de pendientes seguía en 5; al cerrar y abrir la app mostraba 4 | `setTareas` recibía el mismo arreglo porque se hacía `push`, y React no detectaba el cambio | `TareasContext.tsx`: se reemplazó `push` por `[...tareas, nueva]` (commit `fix(C0): estado inmutable`) | Marqué una tarea: el contador bajó al instante y seguía igual tras reabrir la app | Parcial | "Esta función marca una tarea como hecha pero la pantalla no se actualiza, el estado es un arreglo de objetos, ¿qué hipótesis hay y cuál es el cambio mínimo?" → ajusté el nombre de la variable y añadí la actualización de la caché |

## 2. Decisión sobre T13, T14 y R1 a R3

Para cada uno: qué revisó, si lo cambió o no, por qué y cómo lo comprobó.

| Ticket u observación | Qué revisó (pantalla, archivo y fragmento) | Decisión (cambié / no cambié) | Justificación | Cómo lo comprobó |
|---|---|---|---|---|
| T13 | | | | |
| T14 | | | | |
| R1 | | | | |
| R2 | | | | |
| R3 | | | | |

## 3. Errores no resueltos

Comentarios que reprodujo (o intentó reproducir) pero no logró corregir.

| Ticket | Qué intentó | Qué observó | Hipótesis de la causa |
|---|---|---|---|
| | | | |

## 4. Declaración sobre el uso de IA
- Plataformas o agentes de IA utilizados: ______________________
- Cantidad aproximada de conversaciones o consultas: ______________
- Declaro que la información de esta bitácora es veraz y que puedo explicar cada cambio realizado.

**Firma / nombre:** ______________________
