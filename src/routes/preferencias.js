'use strict';
/**
 * routes/preferencias.js
 * Responsable: Eduardo
 * Jue 1 may: GET/PUT /api/preferencias/:usuarioId
 * Lun 5 may: persistencia de alto_contraste, fuente_dyslexic, modo_enfoque
 */
const router = require('express').Router();
const pool   = require('../db');
const { verifyToken } = require('../middlewares/auth');

const DEFAULTS = {
  alto_contraste:  false,
  fuente_dyslexic: false,
  modo_enfoque:    false,
  tamano_fuente:   'normal',
  espaciado:       'normal'
};

/* GET /api/preferencias/:usuarioId */
router.get('/:usuarioId', verifyToken, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM user_preferences WHERE profile_id=$1',
      [req.params.usuarioId]
    );
    // Devolver defaults si aún no existen
    res.json(rows[0] || { profile_id: req.params.usuarioId, ...DEFAULTS });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* PUT /api/preferencias/:usuarioId */
// Body: { alto_contraste?, fuente_dyslexic?, modo_enfoque?, tamano_fuente?, espaciado? }
router.put('/:usuarioId', verifyToken, async (req, res) => {
  const { alto_contraste, fuente_dyslexic, modo_enfoque, tamano_fuente, espaciado } = req.body;

  // Validar tamano_fuente
  const validTamanos = ['normal', 'grande', 'xl'];
  if (tamano_fuente && !validTamanos.includes(tamano_fuente)) {
    return res.status(400).json({ error: `tamano_fuente debe ser: ${validTamanos.join(', ')}` });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO user_preferences
         (profile_id, alto_contraste, fuente_dyslexic, modo_enfoque, tamano_fuente, espaciado)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (profile_id) DO UPDATE SET
         alto_contraste  = COALESCE($2, user_preferences.alto_contraste),
         fuente_dyslexic = COALESCE($3, user_preferences.fuente_dyslexic),
         modo_enfoque    = COALESCE($4, user_preferences.modo_enfoque),
         tamano_fuente   = COALESCE($5, user_preferences.tamano_fuente),
         espaciado       = COALESCE($6, user_preferences.espaciado),
         updated_at      = NOW()
       RETURNING *`,
      [req.params.usuarioId, alto_contraste, fuente_dyslexic, modo_enfoque, tamano_fuente, espaciado]
    );
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
