module.exports = {
  getPlayersStatsSql: `
    SELECT 
      ps.id,
      ps.pos,
      ps.name,
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
    FROM players_stats AS ps
    WHERE ps.season_id = ? AND ps.season_type = ?
  `,

  getGoalieStatsSql: `
    SELECT 
      gs.id,
      gs.name,
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
    FROM goalies_stats AS gs
    WHERE gs.season_id = ? AND gs.season_type = ?
  `,
};