module.exports = {
  getPlayersSql: `
    SELECT p.id, 
    p.country,
     p.name, 
     p.status,
     p.contract_type, 
    IFNULL((SELECT ps.pos
      FROM players_stats ps
      WHERE ps.Name =p.name
      ORDER BY season_id DESC LIMIT 1 ), p.pos) AS position
      , p.age, 
      p.salary, p.contract_duration, p.expiry_type, p.role, p.handedness
    FROM players AS p
    WHERE p.team_id = !!{teamId}!!
    ORDER BY p.salary DESC
    `,
  getTeamDetailsSql: `
    SELECT
    *,
    (
  (
    SELECT
        s2.salary_max
    FROM seasons AS s2
    ORDER BY
      season DESC
    LIMIT
      1
  ) - t1.capHit
) AS capSpace,
    t1.forwardCount + t1.defenceCount + t1.goalieCount AS playerCount
FROM (
  SELECT
        t.id,
        t.name,
    (
      SELECT
            u2.username
        FROM users u2
        WHERE
        u2.id = t.user_id_gm
      LIMIT
        1
    ) AS gmName,
    SUM(
      CASE
        WHEN p.status = 'NHL' THEN p.salary
        ELSE 0
      END
    ) AS capHit,
    SUM(
      CASE
        WHEN p.contract_type = 'retained'
        AND p.status = 'NHL' THEN p.salary
        ELSE 0
      END
    ) AS retained,
    SUM(
      CASE
        WHEN p.contract_type = 'buyout'
        AND p.status = 'NHL' THEN p.salary
        ELSE 0
      END
    ) AS buyout,
    ROUND(
      IFNULL(AVG(
        CASE
          WHEN p.status = 'NHL' THEN p.age
          ELSE null
        END
      ),
      0
    ),1) AS averageAge,
    COUNT(
      CASE
        WHEN p.status = 'NHL'
        AND p.contract_type = 'signed'
        AND (
          ps.Pos LIKE 'C%'
        OR ps.Pos LIKE 'LW%'
        OR ps.Pos LIKE 'RW%'
        OR p.pos LIKE 'C%'
        OR p.pos LIKE 'LW%'
        OR p.pos LIKE 'RW%'
        ) THEN 1
        ELSE NULL
      END
    ) AS forwardCount,
    COUNT(
      CASE
        WHEN p.status = 'NHL'
        AND p.contract_type = 'signed'
        AND (
          ps.Pos LIKE 'LD%'
        OR ps.Pos LIKE 'RD%'
        OR p.pos LIKE 'LD%'
        OR p.pos LIKE 'RD%'
        ) THEN 1
        ELSE NULL
      END
    ) AS defenceCount,
    COUNT(
      CASE
        WHEN p.status = 'NHL'
        AND p.contract_type = 'signed'
        AND (
          p.pos LIKE 'G%'
        OR gs.id
        ) THEN 1
        ELSE NULL
      END
    ) AS goalieCount,
    COUNT(
      CASE
        WHEN p.contract_type = 'signed' THEN 1
        ELSE NULL
      END
    ) contractCount,
    COUNT(
      CASE
        WHEN p.status = 'minors'
        AND p.contract_type = 'signed' THEN 1
        ELSE NULL
      END
    ) minorsCount
FROM teams AS t
  LEFT JOIN players AS p ON t.id = p.team_id
  LEFT JOIN players_stats AS ps ON ps.Name = p.name
    AND ps.season_id =
(
      SELECT
    s2.id
FROM seasons AS s2
ORDER BY
        season
      LIMIT
        1
    )
    AND ps
.season_type = 'normal'
  LEFT JOIN goalies_stats AS gs ON gs.Name = p.name
    AND gs.season_id =
(
      SELECT
    s2.id
FROM seasons AS s2
ORDER BY
        season
      LIMIT
        1
    )
    AND gs.season_type = 'normal'
    WHERE t.name = '!!{teamName}!!'
  GROUP BY
    t.name
) AS t1
`,
  getDraftPicksSQL: `
SELECT 
dp.id, 
t.name AS original_team_name,
season ,
round 
FROM draft_picks dp 
LEFT JOIN teams t 
ON t.id = dp.team_id_original 
WHERE dp.team_id_current = !!{teamId}!!
ORDER BY dp.season , dp.round 

`,
};
