# TaskFlow — Backend conectado a Supabase

## Archivos modificados
- `src/app.js`      → API REST completa (proyectos, tareas, cronómetro, comentarios, reportes)
- `src/server.js`   → Servidor limpio
- `public/script.js`→ Frontend conectado a la API (sin localStorage para datos)
- `.env`            → Credenciales Supabase (ya configuradas)

## Iniciar
```bash
npm install
npm start         # producción
npm run dev       # desarrollo con nodemon
```
Abre: http://localhost:3000

## Lo que funciona con la BD
| Acción              | Endpoint                        |
|---------------------|---------------------------------|
| Ver proyectos       | GET /api/proyectos              |
| Crear proyecto      | POST /api/proyectos             |
| Ver tareas Kanban   | GET /api/tareas                 |
| Crear tarea         | POST /api/tareas                |
| Mover columna       | PATCH /api/tareas/:id/mover     |
| Editar tarea        | PUT /api/tareas/:id             |
| Eliminar tarea      | DELETE /api/tareas/:id          |
| Comentarios         | GET/POST /api/tareas/:id/comentarios |
| Cronómetro iniciar  | POST /api/tiempos/iniciar       |
| Cronómetro detener  | PATCH /api/tiempos/detener      |
| Historial tiempo    | GET /api/tiempos                |
| Dashboard resumen   | GET /api/dashboard/:profile_id  |
| Reportes usuarios   | GET /api/reportes/usuarios      |

## Flujo de login
El login autentica contra los perfiles en la BD de Supabase.
Usa los emails de los perfiles seed: `v.fonseca@creativehub.com`, etc.
(En producción conectar con Supabase Auth)
