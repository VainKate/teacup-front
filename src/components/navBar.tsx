import { AppBar, IconButton, Toolbar, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { Link } from 'react-router-dom';

const NavBar: React.FC = () => {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <IconButton edge="start">
          <MenuIcon onClick={() => { alert('clicked') }} />
        </IconButton>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Typography variant="h1">TeaCup</Typography>
        </Link>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;