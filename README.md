# TaskFlow - Gestor de Proyectos y Tareas

Un sistema completo de gestión de proyectos con tablero Kanban, cronómetro integrado, asistente virtual inteligente y múltiples funcionalidades de accesibilidad.

## 🚀 Características Principales

### Core
- ✅ **Autenticación JWT** - Registro, login, recuperación de contraseña
- ✅ **Proyectos** - Crear, editar, gestionar con múltiples usuarios
- ✅ **Tablero Kanban** - Drag & drop en tiempo real (To Do, Progress, Review, Done)
- ✅ **Tareas** - Crear, editar, comentar, asignar con prioridades (Alta, Media, Baja)
- ✅ **Cronómetro** - Registrar tiempo en tareas, histórico de horas
- ✅ **Dashboard** - Resumen de actividad y métricas
- ✅ **Reportes** - Analytics por usuario y proyecto

### Asistente Virtual Inteligente
- ✅ Categorías de ayuda con dropdown de preguntas
- ✅ Búsqueda inteligente (acentos, faltas, palabras clave)
- ✅ Interfaz colapsable con filtros

### Accesibilidad (WCAG 2.1 AA)
- ✅ Alto contraste mejorado
- ✅ Tamaños de fuente escalables (12px - 18px)
- ✅ Espaciado de letras ampliado
- ✅ Fuente OpenDyslexic
- ✅ Modo Enfoque para TDAH
- ✅ Indicadores de foco visibles
- ✅ Compatibilidad ARIA

## 🏗️ Stack Tecnológico

**Frontend:** HTML5, CSS3, Vanilla JavaScript
**Backend:** Node.js, Express, PostgreSQL
**Auth:** JWT + Bcrypt
**Infraestructura:** Supabase + RLS

## 📁 Estructura

```
taskflow_final/
├── public/           # Frontend
│   ├── index.html
│   ├── CSS/
│   │   ├── style.css
│   │   └── assistant.css
│   └── JS/
│       ├── script.js
│       └── assistant.js
├── src/              # Backend
│   ├── app.js
│   ├── server.js
│   ├── db.js
│   ├── middlewares/auth.js
│   └── routes/
├── package.json
└── .gitignore
```

## 🚀 Instalación

```bash
git clone https://github.com/aria267-lab/proyecto-taskflow.git
cd proyecto-taskflow
npm install
npm start
```

## 👥 Roles

- **Admin** - Acceso total
- **Gerente** - Crear proyectos, asignar tareas
- **Empleado** - Completar tareas

## 📝 Licencia

MIT License

## 👨‍💻 Autor

Cristina Cáceres - lcaceres81@gmail.com
