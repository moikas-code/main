// /stories/pages/home.stories.jsx

import Home from '../../pages/index';
import DABU from '../../dabu/index';
const dabu = new DABU();

export default {
  title: 'Pages/Home',
  component: Home,
};

export const HomePage = () => <Home dabu={dabu} />;
