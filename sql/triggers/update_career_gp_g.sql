DROP TRIGGER IF EXISTS update_career_gp_g;

DELIMITER $$

CREATE TRIGGER update_career_gp_g
AFTER INSERT ON goalies_stats
FOR EACH ROW
BEGIN
	UPDATE players
	SET totalGP = (
		SELECT SUM(gp) 
        FROM goalies_stats 
        WHERE name = NEW.name 
        AND season_type = 'Normal' 
        GROUP BY name
	)
	WHERE name = NEW.name;
END$$

DELIMITER ;