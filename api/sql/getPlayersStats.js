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
};
