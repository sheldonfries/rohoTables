// queries.js
module.exports = {
  getPlayersSql: `
    SELECT 
      p.id, 
      p.country,
      p.name, 
      p.status,
      p.contract_type, 
      p.pos AS position,
      p.age, 
      p.salary, 
      p.contract_duration, 
      p.expiry_type, 
      p.type, 
      p.handedness, 
      p.totalGP,
      (SELECT COUNT(*) FROM players p2 WHERE p2.name = p.name AND p2.status = 'Retained') AS retention_count
    FROM ?? AS p
    WHERE p.team_id = ?
    ORDER BY p.salary DESC
  `,
  getTeamDetailsSql: `
    SELECT t1.*, 
    (
      SELECT s2.salary_max
      FROM seasons s2
      ORDER BY season DESC
      LIMIT 1
    ) - t1.capHit AS capSpace,
    t1.forwardCount + t1.defenceCount + t1.goalieCount AS playerCount
  FROM (
    SELECT
      t.id,
      t.name,
      (
        SELECT u2.username
        FROM users u2
        WHERE u2.id = t.user_id_gm
        LIMIT 1
      ) AS gmName,
      SUM(
        CASE
          WHEN p.status IN ('NHL', 'Retained', 'Buyout') THEN p.salary
          WHEN (p.status IN ('minors', 'Waivers') AND p.pos = 'G' AND p.totalGP >= 45 AND p.salary > 1) THEN p.salary - 1
          WHEN (p.status IN ('minors', 'Waivers') AND p.pos <> 'G' AND p.totalGP >= 140 AND p.salary > 1) THEN p.salary - 1
          ELSE 0
        END
      ) AS capHit,
      SUM(CASE WHEN p.status = 'Retained' THEN p.salary ELSE 0 END) AS retained,
      SUM(CASE WHEN p.status = 'Retained' THEN 1 ELSE 0 END) AS retainedCount,
      SUM(CASE WHEN p.status = 'Buyout' THEN p.salary ELSE 0 END) AS buyout,
      SUM(
        CASE
          WHEN (p.status IN ('minors', 'Waivers') AND p.pos = 'G' AND p.totalGP >= 45 AND p.salary > 1) THEN p.salary - 1
          WHEN (p.status IN ('minors', 'Waivers') AND p.pos <> 'G' AND p.totalGP >= 140 AND p.salary > 1) THEN p.salary - 1
          ELSE 0
        END
      ) AS buried,
      ROUND(IFNULL(AVG(CASE WHEN p.status = 'NHL' THEN p.age END), 0),1) AS averageAge,
      COUNT(CASE WHEN p.status = 'NHL' AND p.contract_type = 'signed' AND (p.pos LIKE 'C%' OR p.pos LIKE 'LW%' OR p.pos LIKE 'RW%') THEN 1 END) AS forwardCount,
      COUNT(CASE WHEN p.status = 'NHL' AND p.contract_type = 'signed' AND (p.pos LIKE 'LD%' OR p.pos LIKE 'RD%') THEN 1 END) AS defenceCount,
      COUNT(CASE WHEN p.status = 'NHL' AND p.contract_type = 'signed' AND p.pos LIKE 'G%' THEN 1 END) AS goalieCount,
      COUNT(CASE WHEN p.status IN ('NHL', 'minors') THEN 1 END) AS contractCount,
      COUNT(CASE WHEN p.status = 'minors' AND p.contract_type = 'signed' THEN 1 END) AS minorsCount
    FROM teams t
    LEFT JOIN players p ON t.id = p.team_id
    WHERE t.name = ?
    GROUP BY t.name
  ) AS t1
  `,
  getDraftPicksSQL: `
    SELECT 
      dp.id, 
      t.name AS original_team_name,
      dp.season,
      dp.round
    FROM draft_picks dp 
    LEFT JOIN teams t ON t.id = dp.team_id_original 
    WHERE dp.team_id_current = ?
    ORDER BY dp.season, dp.round
  `
};
