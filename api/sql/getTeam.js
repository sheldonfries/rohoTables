module.exports = {
  getPlayersSql: `
    SELECT p.id, 
    p.country,
     p.name, 
     p.status,
     p.contract_type, 
     p.pos AS position
      , p.age, 
      p.salary, p.contract_duration, p.expiry_type, p.type, p.handedness
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
        WHEN p.status IN ('NHL', 'Retained', 'Buyout') THEN p.salary
        ELSE 0
      END
    ) AS capHit,
    SUM(
      CASE
        WHEN p.status = 'Retained' THEN p.salary
        ELSE 0
      END
    ) AS retained,
    SUM(
      CASE
        WHEN p.status = 'Buyout' THEN p.salary
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
          p.pos LIKE 'C%'
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
          p.pos LIKE 'LD%'
          OR p.pos LIKE 'RD%'
        ) THEN 1
        ELSE NULL
      END
    ) AS defenceCount,
    COUNT(
      CASE
        WHEN p.status = 'NHL'
        AND p.contract_type = 'signed'
        AND p.pos LIKE 'G%'
        THEN 1
        ELSE NULL
      END
    ) AS goalieCount,
    COUNT(
      CASE
        WHEN p.status IN ('NHL', 'minors') THEN 1
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
