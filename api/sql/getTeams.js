module.exports = `SELECT
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
        WHEN (p.status IN ('minors', 'Waivers') AND p.pos = 'G' AND p.totalGP >= 45 AND p.salary > 1) THEN p.salary - 1
        WHEN (p.status IN ('minors', 'Waivers') AND p.pos <> 'G' AND p.totalGP >= 140 AND p.salary > 1) THEN p.salary - 1
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
        WHEN p.status = 'Retained' THEN 1
        ELSE 0
      END
    ) AS retainedCount,
    SUM(
      CASE
        WHEN p.status = 'Buyout' THEN p.salary
        ELSE 0
      END
    ) AS buyout,
    SUM(
      CASE
        WHEN (p.status IN ('minors', 'Waivers') AND p.pos = 'G' AND p.totalGP >= 45 AND p.salary > 1) THEN p.salary - 1
        WHEN (p.status IN ('minors', 'Waivers') AND p.pos <> 'G' AND p.totalGP >= 140 AND p.salary > 1) THEN p.salary - 1
        ELSE 0
      END
    ) AS buried,
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
  WHERE t.id <> 31
  GROUP BY
    t.name
) AS t1 `;
