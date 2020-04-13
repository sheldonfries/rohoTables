module.exports = {
  getPlayersStatsSql: `
    SELECT ps.id,ps.pos, 
ps.name ,
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
FROM 
players_stats AS ps
WHERE ps.season_id = !!{seasonId}!! AND ps.season_type ='!!{seasonType}!!'
    `,
  getGoalieStatsSql: `
    SELECT gs.id,
gs.Name as  name,
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
FROM  goalies_stats AS gs
WHERE   gs.season_id = !!{seasonId}!! AND gs.season_type ='!!{seasonType}!!'
    `,
};
