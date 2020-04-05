import Home from './pages/Home';
import LeagueOverview from './pages/LeagueOverview';
import PlayerDetails from './pages/PlayerDetails';
import PlayerStats from './pages/PlayerStats';
import TeamDetails from './pages/TeamDetails';

const routes = [
  {
    path: '/',
    Component: Home,
    exact: true,
    mainNav: true,
    label: 'Home',
  },
  {
    path: '/players/:id',
    Component: PlayerDetails,
    label: 'Player Details',
  },
  {
    path: '/players',
    Component: PlayerStats,
    mainNav: true,
    label: 'Players',
  },
  {
    path: '/teams/:id',
    Component: TeamDetails,
    label: 'Team Details',
  },
  {
    path: '/teams',
    Component: LeagueOverview,
    mainNav: true,
    label: 'League Overview',
  },
];

export default routes;
