DROP TRIGGER IF EXISTS update_career_gp;

DELIMITER $$

CREATE TRIGGER update_career_gp
AFTER INSERT ON players_stats
FOR EACH ROW
BEGIN
	UPDATE players
	SET totalGP = (
		SELECT SUM(gp) 
        FROM players_stats 
        WHERE name = NEW.name 
        AND season_type = 'Normal' 
        GROUP BY name
	)
	WHERE name = NEW.name;
END$$

DELIMITER ;