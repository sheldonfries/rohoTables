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
  getPlayerComparables: `

  SELECT DISTINCT p.name AS comparable_for
  FROM players p
  WHERE p.draft_comparable = '!!{playerName}!!'
      `,
  getPlayerTrades: `

  SELECT
	  b.season as season,
    SUBSTRING_INDEX(b.players, ';', 1) AS players_1,
    SUBSTRING_INDEX(b.players, ';', -1) AS players_2,
    SUBSTRING_INDEX(b.receiving_team, ';', 1) AS team_1,
    SUBSTRING_INDEX(b.receiving_team, ';', -1) AS team_2
  FROM (SELECT 
		a.id AS id,
		a.season AS season,
		GROUP_CONCAT(a.players
			SEPARATOR ';') AS players,
		GROUP_CONCAT(a.receiving_team
			SEPARATOR ';') AS receiving_team
	  FROM
		(SELECT 
			t.id AS id,
				s.season AS season,
				CONCAT_WS(', ', GROUP_CONCAT(p.name
					SEPARATOR ', '), GROUP_CONCAT(CONCAT(d.season, ' ', te3.name, ' ', d.round)
					SEPARATOR ', ')) AS players,
				te.name AS receiving_team
		  FROM
			trade_items ti
		JOIN trades t ON t.id = ti.trade_id
		LEFT JOIN players p ON p.id = ti.player_id
		LEFT JOIN teams te ON te.id = ti.receiving_team_id
		LEFT JOIN seasons s ON s.id = t.season_id
		LEFT JOIN draft_picks d ON d.id = ti.draft_pick_id
		LEFT JOIN teams te3 ON te3.id = d.team_id_original
		WHERE
			t.id IN (SELECT 
					t.id
				FROM
					trade_items ti
				JOIN trades t ON t.id = ti.trade_id
				JOIN players p ON p.id = ti.player_id
				WHERE
					p.name = '!!{playerName}!!')
		GROUP BY t.id , s.season , te.name) a
	GROUP BY a.id , a.season) b
	ORDER BY b.id DESC
      `,
};
