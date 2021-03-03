module.exports = {
  getPlayerDetails: `
  SELECT *, 
  (SELECT 
    CASE 
      WHEN p1.name IS NOT NULL THEN true
      ELSE false
    END
    FROM players p1 where p1.name = p.draft_comparable) as is_draft_comparable_local,
  (SELECT name from teams t WHERE t.id=p.draft_team_id) as draft_team_name, 
  (SELECT season FROM seasons s WHERE s.id = p.draft_season_id) AS draft_season_name 
  FROM players p WHERE name =  '!!{playerName}!!'
    `,
  getPlayerStatsSql: `
  SELECT p.id,IFNULL(ps.pos,p.pos ) as pos, ps.season_id , 
se.season ,
ps.season_type, 
ps.Team AS team_name, 
ps.gp , 
ps.g , 
ps.a , 
ps.\`+/-\` , 
ps.pim, 
ps.ppg ,
ps.ppp,
ps.shp ,
ps.ht ,
ps.ga,
ps.ta,
ps.p,
ps.atoi,
ps.appt,
ps.apkt,
ps.gwg , 
ps.sog, 
CONVERT(ROUND(ps.g/IFNULL(ps.SOG,999999)* 100), CHAR) AS shot_percent, 
ps.sb ,
CONVERT(ROUND(ps.FO *100),CHAR) AS faceoff_percent
FROM players AS p
LEFT JOIN teams t
ON t.id = p.team_id 
LEFT JOIN players_stats AS ps
ON p.name =ps.Name 
LEFT JOIN seasons AS se 
ON se.id =ps.season_id 
WHERE p.name ='!!{playerName}!!'
AND p.status NOT IN ('Retained', 'Buyout')
ORDER BY se.id DESC
    `,
  getGoalieStatsSql: `
    SELECT p.id, gs.season_id , 
se.season , 
gs.season_type , 
gs.Team as team_name, 
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
FROM players AS p
LEFT JOIN goalies_stats AS gs
ON p.name =gs.Name 
LEFT JOIN seasons AS se 
ON se.id =gs.season_id 
WHERE p.name ='!!{playerName}!!'
AND p.status NOT IN ('Retained', 'Buyout')
ORDER BY se.id DESC

    `,
  getPlayerAwardsSql: `
 
SELECT a.id, s.season, s.id as season_id, a.award , t.name AS team_name 
FROM awards a 
JOIN seasons s on s.id = a.season_id
JOIN players p on p.id = a.player_id 
JOIN teams t on t.id = a.team_id 
WHERE p.name = '!!{playerName}!!'
ORDER BY s.id DESC
    `,
};
