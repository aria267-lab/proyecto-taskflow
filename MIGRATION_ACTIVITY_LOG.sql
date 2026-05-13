-- ═══════════════════════════════════════════════════════════════════════
--  MIGRATION: Tabla activity_log para registrar actividades del usuario
--  Fecha: 2026-05-10
--  Responsable: Sistema
--  ⚠️  IMPORTANTE: Ejecutar en Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════════════

-- Crear tabla activity_log si no existe
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

-- Vista para resumen de actividad
CREATE OR REPLACE VIEW v_activity_summary AS
SELECT
  actor_id,
  DATE(created_at) as fecha,
  event,
  COUNT(*) as total,
  MAX(created_at) as ultima_actividad
FROM activity_log
GROUP BY actor_id, DATE(created_at), event
ORDER BY actor_id, fecha DESC, event;

GRANT SELECT ON v_activity_summary TO authenticated;

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_activity_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS activity_log_updated_at ON activity_log;
CREATE TRIGGER activity_log_updated_at
  BEFORE UPDATE ON activity_log
  FOR EACH ROW
  EXECUTE FUNCTION update_activity_updated_at();

-- ✅ Migration completada
SELECT 'Activity Log Migration Completed Successfully' as status;
