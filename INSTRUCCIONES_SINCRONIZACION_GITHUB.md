# 📋 Instrucciones: Sincronizar TaskFlow desde GitHub

## Estado Actual ✅

Hemos sincronizado tu proyecto local con los cambios de tus compañeros en GitHub. Aquí está lo que se ha hecho:

### Archivos Sincronizados:
- ✅ `src/app.js` - API completa con endpoints de dashboard, weekly-hours, activity-log
- ✅ `public/JS/script.js` - Frontend con funciones de renderDash, logActivity, renderTaskDetail
- ✅ `src/routes/activity.js` - Rutas para registrar actividades del usuario

### Cambios Principales:
1. **Dashboard mejorado** - Métricas en tiempo real (horas hoy, horas esta semana, % productividad)
2. **Sistema de actividad** - Registro automático de acciones (task_created, task_completed, time_logged)
3. **Productividad semanal** - Gráfico dinámico con datos reales
4. **Navegación de tareas** - Click en tareas pendientes para ver detalles
5. **NaN fixes** - Conversión correcta de segundos a horas/minutos

---

## 🔧 Paso 1: Aplicar Migration SQL en Supabase

### Opción A: Usar SQL Editor de Supabase (RECOMENDADO)

1. Ir a https://supabase.com/dashboard
2. Seleccionar tu proyecto **TaskFlow**
3. En el menú izquierdo, ir a **SQL Editor**
4. Hacer clic en **New query**
5. Copiar y pegar TODO el contenido del archivo:
   - `MIGRATION_ACTIVITY_LOG.sql`
6. Hacer clic en **Run** (o Ctrl+Enter)

### Contenido a ejecutar:

```sql
-- ═══════════════════════════════════════════════════════════════════════
--  TABLA: activity_log - Registro de actividades del usuario
-- ═══════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  event VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  payload JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para queries frecuentes
CREATE INDEX IF NOT EXISTS idx_activity_actor ON activity_log(actor_id);
CREATE INDEX IF NOT EXISTS idx_activity_event ON activity_log(event);
CREATE INDEX IF NOT EXISTS idx_activity_created ON activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_entity ON activity_log(entity_type, entity_id);

-- RLS: Los usuarios solo ven su propia actividad
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "activity_log_select_own" ON activity_log;
CREATE POLICY "activity_log_select_own" ON activity_log
  FOR SELECT USING (actor_id = auth.uid() OR 
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'Admin');

DROP POLICY IF EXISTS "activity_log_insert_own" ON activity_log;
CREATE POLICY "activity_log_insert_own" ON activity_log
  FOR INSERT WITH CHECK (actor_id = auth.uid());
```

✅ Si no hay errores, ¡la migración fue exitosa!

---

## 📦 Paso 2: Confirmar que todo esté en tu código local

Los siguientes archivos YA están actualizados en tu carpeta local:

```
taskflow_final/
├── src/
│   ├── app.js                    ✅ (Con rutas activity, dashboard, weekly-hours)
│   ├── routes/
│   │   ├── activity.js           ✅ (Nuevo - registro de actividades)
│   │   ├── auth.js               ✅
│   │   ├── preferencias.js        ✅
│   │   └── mensajes.js            ✅
│   └── db.js                      ✅
├── public/
│   └── JS/
│       ├── script.js              ✅ (Con renderDash, logActivity, etc)
│       └── index.html             ✅
└── .env                           ✅ (Credenciales Supabase)
```

---

## 🚀 Paso 3: Sincronizar a GitHub

Una vez confirmado que la BD funciona:

### 1. Verificar cambios locales:
```bash
cd C:\Users\crist\Downloads\taskflow_1\taskflow_final
git status
```

### 2. Agregar todos los cambios:
```bash
git add .
```

### 3. Crear commit descriptivo:
```bash
git commit -m "feat: sincronizar cambios de compañeros y activity logging

- Actualizar app.js con endpoints mejorados
- Agregar rutas para activity_log (task_created, task_completed, time_logged)
- Mejorar renderDash con métricas en tiempo real
- Implementar logActivity para registro automático
- Agregar renderTaskDetail para navegación de tareas
- Fix: NaN values en dashboard (parseInt conversions)
- Todos los pending tasks visibles
- Navegación directa a detalles sin modal de edición"
```

### 4. Push a GitHub:
```bash
git push origin main
```

---

## ✨ Paso 4: Probar la Aplicación

Después de sincronizar todo:

1. **Levantar el servidor:**
   ```bash
   cd C:\Users\crist\Downloads\taskflow_1\taskflow_final
   npm start
   ```

2. **Abrir en navegador:**
   ```
   http://localhost:3000
   ```

3. **Tests recomendados:**
   - ✅ Login con usuario registrado
   - ✅ Ver dashboard (verificar métricas en tiempo real)
   - ✅ Hacer clic en tareas pendientes (deberías ir a detalles)
   - ✅ Iniciar cronómetro
   - ✅ Completar una tarea
   - ✅ Ver gráfico de productividad semanal
   - ✅ Revisar activity log

---

## 📊 Endpoints Disponibles Ahora

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/dashboard/:profile_id` | Métricas completas (horas, productividad, tareas) |
| GET | `/api/weekly-hours/:profile_id` | Productividad por día de la semana |
| GET | `/api/activity-log` | Historial de actividades del usuario |
| POST | `/api/activity-log` | Registrar nueva actividad |
| GET | `/api/tiempos` | Sesiones de tiempo (cronómetro) |
| POST | `/api/tiempos/iniciar` | Iniciar cronómetro |
| PATCH | `/api/tiempos/detener` | Detener cronómetro |

---

## 🔍 Si algo no funciona...

### Error: "activity_log table does not exist"
→ Ejecutar el SQL migration en Supabase (Paso 1)

### Error: "Cannot find module 'pg'"
→ Ejecutar: `npm install`

### Error: "ECONNREFUSED" en BD
→ Verificar credenciales en `.env`

### Dashboard muestra NaN
→ Asegurarse que `script.js` tiene `parseInt()` conversions (ya está incluido)

---

## ✅ Checklist Final

- [ ] SQL migration aplicado en Supabase
- [ ] Archivos sincronizados en local
- [ ] Git push completado
- [ ] Servidor levantado sin errores
- [ ] Login funciona
- [ ] Dashboard muestra métricas reales
- [ ] Cronómetro registra horas
- [ ] Activity log captura eventos
- [ ] Gráfico de productividad funciona

---

**¿Dudas?** Revisa los logs de la consola del navegador (F12 → Console)

**Última actualización:** 2026-05-10
