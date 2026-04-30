module.exports = {
  searchPlayers: `
    SELECT 
      p.*,
      CASE 
        WHEN t.id IS NULL THEN 'Free Agents'
        WHEN t.city = t.name THEN t.name
        ELSE CONCAT(t.city, ' ', t.name) 
      END AS team_name
    FROM players p
    LEFT JOIN teams t ON t.id = p.team_id
    WHERE p.name LIKE ?
    AND p.status NOT IN ('Retained', 'Buyout');
  `,

  getPlayerDetails: `
    SELECT 
      p.*,
      CASE 
        WHEN t.id IS NULL THEN 'Free Agents'
        WHEN t.city = t.name THEN t.name
        ELSE CONCAT(t.city, ' ', t.name) 
      END AS team_name,
      dt.name AS draft_team_name,
      ds.season AS draft_season_name,
      EXISTS (SELECT 1 FROM players p1 WHERE p1.name = p.draft_comparable) AS is_draft_comparable_local,
      (SELECT COUNT(*) FROM players p2 WHERE p2.name = p.name AND p2.status = 'Retained') AS retention_count
    FROM players p
    LEFT JOIN teams t ON t.id = p.team_id
    LEFT JOIN teams dt ON dt.id = p.draft_team_id
    LEFT JOIN seasons ds ON ds.id = p.draft_season_id
    WHERE p.name = ?
  `,

  getPlayerStatsSql: `
    SELECT 
      p.id,
      COALESCE(ps.pos, p.pos) AS pos,
      ps.season_id,
      se.season,
      ps.season_type,
      ps.Team AS team_name,
      ps.gp,
      ps.g,
      ps.a,
      ps.\`+/-\`,
      ps.pim,
      ps.ppg,
      ps.ppp,
      ps.shp,
      ps.ht,
      ps.ga,
      ps.ta,
      ps.p,
      ps.atoi,
      ps.appt,
      ps.apkt,
      ps.gwg,
      ps.sog,
      ROUND(CASE WHEN ps.SOG > 0 THEN ps.g / ps.SOG * 100 ELSE 0 END, 0) AS shot_percent,
      ps.sb,
      ROUND(ps.FO * 100, 0) AS faceoff_percent
    FROM players p
    LEFT JOIN teams t ON t.id = p.team_id
    LEFT JOIN players_stats ps ON p.name = ps.name
    LEFT JOIN seasons se ON se.id = ps.season_id
    WHERE p.name = ? AND p.status NOT IN ('Retained', 'Buyout')
    ORDER BY se.id DESC
  `,

  getGoalieStatsSql: `
    SELECT 
      p.id,
      gs.season_id,
      se.season,
      gs.season_type,
      gs.Team AS team_name,
      gs.gp,
      gs.w,
      gs.l,
      gs.t,
      gs.sha,
      gs.ga,
      gs.gaa,
      gs.sv,
      gs.so,
      gs.g,
      gs.a,
      gs.pim,
      gs.toi
    FROM players p
    LEFT JOIN goalies_stats gs ON p.name = gs.name
    LEFT JOIN seasons se ON se.id = gs.season_id
    WHERE p.name = ? AND p.status NOT IN ('Retained', 'Buyout')
    ORDER BY se.id DESC
  `,

  getPlayerAwardsSql: `
    SELECT 
      a.id,
      s.season,
      s.id AS season_id,
      a.award,
      t.name AS team_name
    FROM awards a
    JOIN seasons s ON s.id = a.season_id
    JOIN players p ON p.id = a.player_id
    JOIN teams t ON t.id = a.team_id
    WHERE p.name = ?
    ORDER BY s.id DESC
  `,

  getPlayerComparables: `
    SELECT DISTINCT p.name AS comparable_for
    FROM players p
    WHERE p.draft_comparable = ?
  `,

   getPlayerTrades: `
    SELECT
      t.id AS trade_id,
      s.season AS season,
      te1.name AS team_1,
      te2.name AS team_2,
      COALESCE(GROUP_CONCAT(
        CASE
          WHEN ti.receiving_team_id = t.team_id_1 THEN
            IF(p.id IS NOT NULL, p.name, CONCAT(d.season, ' ', te3.name, ' ', d.round))
        END
        ORDER BY ti.id
        SEPARATOR ', '
      ), '') AS players_1,
      COALESCE(GROUP_CONCAT(
        CASE
          WHEN ti.receiving_team_id = t.team_id_2 THEN
            IF(p.id IS NOT NULL, p.name, CONCAT(d.season, ' ', te3.name, ' ', d.round))
        END
        ORDER BY ti.id
        SEPARATOR ', '
      ), '') AS players_2
    FROM trades t
    JOIN trade_items ti ON ti.trade_id = t.id
    LEFT JOIN players p ON p.id = ti.player_id
    LEFT JOIN draft_picks d ON d.id = ti.draft_pick_id
    LEFT JOIN teams te1 ON te1.id = t.team_id_1
    LEFT JOIN teams te2 ON te2.id = t.team_id_2
    LEFT JOIN teams te3 ON te3.id = d.team_id_original
    LEFT JOIN seasons s ON s.id = t.season_id
    WHERE t.id IN (
      SELECT t.id
      FROM trades t
      JOIN trade_items ti ON ti.trade_id = t.id
      JOIN players p ON p.id = ti.player_id
      WHERE p.name = ?
    )
    GROUP BY t.id, s.season, te1.name, te2.name
    ORDER BY t.id DESC;
  `,
};
