import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import { Link } from 'react-router-dom';

export const mainListItems = (
    <React.Fragment>

        <ListItemButton component={Link} to="/">
            <ListItemIcon>
                <EventIcon />
            </ListItemIcon>
            <ListItemText primary="Gestión de Turnos" />
        </ListItemButton>

        <ListItemButton component={Link} to="/barberos">
            <ListItemIcon>
                <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Barberos" />
        </ListItemButton>

        <ListItemButton component={Link} to="/clientes">
            <ListItemIcon>
                <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Clientes" />
        </ListItemButton>

        <ListItemButton component={Link} to="/servicios">
            <ListItemIcon>
                <ContentCutIcon />
            </ListItemIcon>
            <ListItemText primary="Servicios" />
        </ListItemButton>

        <ListItemButton component={Link} to="/reportes">
            <ListItemIcon>
                <AssessmentIcon />
            </ListItemIcon>
            <ListItemText primary="Reportes" />
        </ListItemButton>

    </React.Fragment>
);