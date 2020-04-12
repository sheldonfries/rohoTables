module.exports = {
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
ORDER BY se.id

    `,
  getPlayerAwardsSql: `
 
SELECT a.id, s.season, s.id as season_id, a.award , t.name AS team_name 
FROM awards a 
JOIN seasons s on s.id = a.season_id
JOIN players p on p.id = a.player_id 
JOIN teams t on t.id = a.team_id 
    WHERE p.name = '!!{playerName}!!'
    `,
};
