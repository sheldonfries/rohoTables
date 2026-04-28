module.exports = `
SELECT
  t1.id,
  t1.name,
  t1.gmName,
  t1.capHit,
  t1.retained,
  t1.retainedCount,
  t1.buyout,
  t1.buried,
  t1.averageAge,
  t1.forwardCount,
  t1.defenceCount,
  t1.goalieCount,
  t1.contractCount,
  t1.minorsCount,
  ((
    SELECT s2.salary_max
    FROM seasons s2
    ORDER BY season DESC
    LIMIT 1
  ) - t1.capHit) AS capSpace,
  (t1.forwardCount + t1.defenceCount + t1.goalieCount) AS playerCount
FROM (
  SELECT
    t.id,
    t.name,
    u.username AS gmName,
    SUM(
      CASE
        WHEN p.status IN ('NHL', 'Retained', 'Buyout') THEN p.salary
        WHEN p.status IN ('minors', 'Waivers') 
             AND ((p.pos = 'G' AND p.totalGP >= 45) 
                  OR (p.pos <> 'G' AND p.totalGP >= 140))
             AND p.salary > 1 THEN p.salary - 1
        ELSE 0
      END
    ) AS capHit,
    SUM(CASE WHEN p.status = 'Retained' THEN p.salary ELSE 0 END) AS retained,
    SUM(CASE WHEN p.status = 'Retained' THEN 1 ELSE 0 END) AS retainedCount,
    SUM(CASE WHEN p.status = 'Buyout' THEN p.salary ELSE 0 END) AS buyout,
    SUM(
      CASE
        WHEN p.status IN ('minors', 'Waivers') 
             AND ((p.pos = 'G' AND p.totalGP >= 45) 
                  OR (p.pos <> 'G' AND p.totalGP >= 140))
             AND p.salary > 1 THEN p.salary - 1
        ELSE 0
      END
    ) AS buried,
    ROUND(
      IFNULL(AVG(CASE WHEN p.status = 'NHL' THEN NULLIF(p.age,0) END),0),1
    ) AS averageAge,
    SUM(
      CASE 
        WHEN p.status = 'NHL' AND p.contract_type = 'signed' 
             AND p.pos IN ('C','LW','RW','C1','C2','LW1','LW2','RW1','RW2') 
        THEN 1 
        ELSE 0 
      END
    ) AS forwardCount,
    SUM(
      CASE 
        WHEN p.status = 'NHL' AND p.contract_type = 'signed' 
             AND p.pos IN ('LD','RD','LD1','RD1','LD2','RD2') 
        THEN 1 
        ELSE 0 
      END
    ) AS defenceCount,
    SUM(
      CASE 
        WHEN p.status = 'NHL' AND p.contract_type = 'signed' 
             AND p.pos LIKE 'G%' 
        THEN 1 
        ELSE 0 
      END
    ) AS goalieCount,
    COUNT(CASE WHEN p.status IN ('NHL','minors') THEN 1 ELSE NULL END) AS contractCount,
    COUNT(CASE WHEN p.status = 'minors' AND p.contract_type = 'signed' THEN 1 ELSE NULL END) AS minorsCount
  FROM teams t
  LEFT JOIN players p ON t.id = p.team_id
  LEFT JOIN users u ON u.id = t.user_id_gm
  WHERE t.id <> 31
  GROUP BY t.name
) AS t1;
`;
