import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { List, ListItem, ListItemText, Divider, IconButton, Paper, ListItemIcon } from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew'; 
import HomeIcon from "@material-ui/icons/Home";
import PersonIcon from "@material-ui/icons/Person"; 
import EqualizerIcon from "@material-ui/icons/Equalizer";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import DescriptionIcon from "@material-ui/icons/Description";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  sidebarContainer: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "250px",
    height: "100%",
    zIndex: 1,
    overflowX: "hidden",
  },
  sidebarBackground: {
    backgroundImage: "url('https://images.pexels.com/photos/20832069/pexels-photo-20832069/free-photo-of-lumineux-leger-ville-route.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    width: "250px",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    filter: "brightness(70%)",
  },
  sidebarContent: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    width: "250px",
    height: "100%",
    borderRight: "1px solid #e0e0e0",
    position: "relative",
    zIndex: 2,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    transition: "width 0.3s ease",
    overflowX: "hidden",
    padding: "5px",
  },
  collapsedSidebar: {
    width: "50px",
  },
  listItem: {
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#444",
      
    }
  },
  icon: {
    color: "#fff",
    transition: "color 0.3s ease",
  },
  logo: {
    display: "block",
    margin: "20px auto",
    width: "60%",
    height: "auto",
  },
  whiteText: {
    color: "#fff",
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(1.2)',
    color: '#fff',
  },
}));

const Sidebar = ({ onSidebarItemClick }) => {
  const classes = useStyles();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userProfileSelected, setUserProfileSelected] = useState(false);
  const [demandeSelected, setDemandeSelected] = useState(false);
  const [ConsulterSelected, setConsulterSelected] = useState(false);
  const [StatiqueSelected, setStatiqueSelected] = useState(false);
  const [modifierSelected, setmodifierSelected] = useState(false);
  const history = useHistory();
  const [contentWidth, setContentWidth] = useState("calc(100% - 250px)");
  const sidebarWidth = sidebarOpen ? "250px" : "50px";

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    setContentWidth(sidebarOpen ? "calc(100% - 50px)" : "calc(100% - 250px)");
  };

  const handleSelectChange = (option) => {
    setUserProfileSelected(option === "userProfil" ? !userProfileSelected : false);
    setDemandeSelected(option === "demander" ? !demandeSelected : false);
    setConsulterSelected(option === "Consulter" ? !ConsulterSelected : false);
    setStatiqueSelected(option === "Statique" ? !StatiqueSelected : false);
    setmodifierSelected(option === "Modifier" ? !modifierSelected : false);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('role');
    localStorage.removeItem('adminData');
    history.push('/');
    window.location.reload();
  };

  return (
    <div className={classes.sidebarContainer} style={{width:'350px'}}> 
      <div className={`${classes.sidebarBackground} ${!sidebarOpen && classes.collapsedSidebar}`}></div>
      <Paper className={`${classes.sidebarContent} ${!sidebarOpen && classes.collapsedSidebar}`} style={{ width: sidebarWidth }}>
        <IconButton onClick={toggleSidebar} style={{ marginTop:'40px'}}>
          <MenuIcon className={`${classes.icon} ${classes.whiteText}`} />
        </IconButton>
        {sidebarOpen && (
          <>
           
          </>
        )}
        {sidebarOpen && (
          <IconButton onClick={handleLogout} style={{marginLeft:'140px', marginTop:'40px'}} >
            <PowerSettingsNewIcon className={`${classes.icon} ${classes.whiteText}`} />
          </IconButton>
        )}
        <List className={classes.list} style={{marginTop:'80px'}}>
          <ListItem button className={classes.listItem} onClick={() => onSidebarItemClick("Tous")}>
            <HomeIcon className={`${classes.icon} ${classes.whiteText}`} />
            {sidebarOpen && <ListItemText primary="Tableau de bord " className={classes.whiteText} />}
          </ListItem>
          <Divider />
          <ListItem button className={classes.listItem} onClick={() => handleSelectChange("userProfil")}>
            <PersonIcon className={`${classes.icon} ${classes.whiteText}`} />
            {sidebarOpen && <ListItemText primary="Profils d'utilisateur" className={classes.whiteText} />}
          </ListItem>
          {userProfileSelected && sidebarOpen && (
            <>
              <ListItem button className={`${classes.listItem} ${classes.nested}`} onClick={() => onSidebarItemClick("ProfilParticipant")}>
                <ListItemIcon>
                  <span className={classes.bullet}>-</span>
                </ListItemIcon>
                <ListItemText primary="Participants" className={classes.whiteText} />
              </ListItem>
              <ListItem button className={`${classes.listItem} ${classes.nested}`} onClick={() => onSidebarItemClick("ListeInstructeursAdmin")}>
                <ListItemIcon>
                  <span className={classes.bullet}>-</span>
                </ListItemIcon>
                <ListItemText primary="Instructeurs" className={classes.whiteText} />
              </ListItem>
            </>
          )}
          <ListItem button className={classes.listItem} onClick={() => handleSelectChange("Statique")}>
            <EqualizerIcon className={`${classes.icon} ${classes.whiteText}`} />
            {sidebarOpen && <ListItemText primary="Statistiques" className={classes.whiteText} />}
          </ListItem>
          {StatiqueSelected && sidebarOpen && (
            <>
              <ListItem button className={classes.listItem} onClick={() => onSidebarItemClick("InstructorChart")}>
              <ListItemIcon>
                  <span className={classes.bullet}>-</span>
                </ListItemIcon>
                <ListItemText primary="Augmentation" className={classes.whiteText} />
              </ListItem>
              <ListItem button className={classes.listItem} onClick={() => onSidebarItemClick("statiqueAdmin")}>
              <ListItemIcon>
                  <span className={classes.bullet}>-</span>
                </ListItemIcon>
                <ListItemText primary="Global" className={classes.whiteText} />
              </ListItem>
              <ListItem button className={classes.listItem} onClick={() => onSidebarItemClick("TotalChart")}>
              <ListItemIcon>
                  <span className={classes.bullet}>-</span>
                </ListItemIcon>
                <ListItemText primary="Nombre" className={classes.whiteText} />
              </ListItem>
              <ListItem button className={classes.listItem} onClick={() => onSidebarItemClick("StackedBarChart")}>
              <ListItemIcon>
                  <span className={classes.bullet}>-</span>
                </ListItemIcon>
                <ListItemText primary="Domaine" className={classes.whiteText} />
              </ListItem>
            </>
          )}
          <ListItem button className={classes.listItem} onClick={() => handleSelectChange("demander")}>
            <PlaylistAddIcon className={`${classes.icon} ${classes.whiteText}`} />
            {sidebarOpen && <ListItemText primary="Créations" className={classes.whiteText} />}
          </ListItem>
          {demandeSelected && sidebarOpen && (
            <>
              <ListItem button className={classes.listItem} onClick={() => onSidebarItemClick("FormationAdminD")}>
              <ListItemIcon>
                  <span className={classes.bullet}>-</span>
                </ListItemIcon>
                <ListItemText primary="Formation" className={classes.whiteText} />
              </ListItem>
              <ListItem button className={classes.listItem} onClick={() => onSidebarItemClick("CoursListAdminD")}>
              <ListItemIcon>
                  <span className={classes.bullet}>-</span>
                </ListItemIcon>
                <ListItemText primary="Cours gratuits" className={classes.whiteText} />
              </ListItem>
              <ListItem button className={classes.listItem} onClick={() => onSidebarItemClick("RessourcesDemande")}>
              <ListItemIcon>
                  <span className={classes.bullet}>-</span>
                </ListItemIcon>
                <ListItemText primary="Ressources" className={classes.whiteText} />
              </ListItem>
              <ListItem button className={classes.listItem} onClick={() => onSidebarItemClick("ListPublicationAdmin")}>
              <ListItemIcon>
                  <span className={classes.bullet}>-</span>
                </ListItemIcon>
                <ListItemText primary="Publications" className={classes.whiteText} />
              </ListItem>
              <ListItem button className={classes.listItem} onClick={() => onSidebarItemClick("CoursPayantListAdminD")}>
              <ListItemIcon>
                  <span className={classes.bullet}>-</span>
                </ListItemIcon>
                <ListItemText primary="Cours payant" className={classes.whiteText} />
              </ListItem>
            </>
          )}
          <ListItem button className={classes.listItem} onClick={() => handleSelectChange("Modifier")}>
            <PlaylistAddIcon className={`${classes.icon} ${classes.whiteText}`} />
            {sidebarOpen && <ListItemText primary="Modifications" className={classes.whiteText} />}
          </ListItem>
          {modifierSelected && sidebarOpen && (
            <>
              <ListItem button className={classes.listItem} onClick={() => onSidebarItemClick("FormationAdminDModifier")}>
              <ListItemIcon>
                  <span className={classes.bullet}>-</span>
                </ListItemIcon>
                <ListItemText primary="Formation" className={classes.whiteText} />
              </ListItem>
              <ListItem button className={classes.listItem} onClick={() => onSidebarItemClick("CoursListAdminModifier")}>
              <ListItemIcon>
                  <span className={classes.bullet}>-</span>
                </ListItemIcon>
                <ListItemText primary="Cours gratuits" className={classes.whiteText} />
              </ListItem>
              <ListItem button className={classes.listItem} onClick={() => onSidebarItemClick("RessourcesDemandeModifier")}>
              <ListItemIcon>
                  <span className={classes.bullet}>-</span>
                </ListItemIcon>
                <ListItemText primary="Ressources" className={classes.whiteText} />
              </ListItem>
              <ListItem button className={classes.listItem} onClick={() => onSidebarItemClick("ListPublicationAdminModifier")}>
              <ListItemIcon>
                  <span className={classes.bullet}>-</span>
                </ListItemIcon>
                <ListItemText primary="Publications" className={classes.whiteText} />
              </ListItem>
              <ListItem button className={classes.listItem} onClick={() => onSidebarItemClick("CoursPayantAdminModifier")}>
              <ListItemIcon>
                  <span className={classes.bullet}>-</span>
                </ListItemIcon>
                <ListItemText primary="Cours payant" className={classes.whiteText} />
              </ListItem>
            </>
          )}
          <ListItem button className={classes.listItem} onClick={() => handleSelectChange("Consulter")}>
            <DescriptionIcon className={`${classes.icon} ${classes.whiteText}`} />
            {sidebarOpen && <ListItemText primary="Consultations" className={classes.whiteText} />}
          </ListItem>
          {ConsulterSelected && sidebarOpen && (
            <>
              <ListItem button className={classes.listItem} onClick={() => onSidebarItemClick("ListeFormationAdmin")}>
              <ListItemIcon>
                  <span className={classes.bullet}>-</span>
                </ListItemIcon>
                <ListItemText primary="Formation" className={classes.whiteText} />
              </ListItem>
              <ListItem button className={classes.listItem} onClick={() => onSidebarItemClick("ListecourAdmin")}>
              <ListItemIcon>
                  <span className={classes.bullet}>-</span>
                </ListItemIcon>
                <ListItemText primary="Cours gratuits" className={classes.whiteText} />
              </ListItem>
              <ListItem button className={classes.listItem} onClick={() => onSidebarItemClick("ListeRessourceAdmin")}>
              <ListItemIcon>
                  <span className={classes.bullet}>-</span>
                </ListItemIcon>
                <ListItemText primary="Ressources pédagogie " className={classes.whiteText} />
              </ListItem>
              <ListItem button className={classes.listItem} onClick={() => onSidebarItemClick("ListecourPayantAdmin")}>
              <ListItemIcon>
                  <span className={classes.bullet}>-</span>
                </ListItemIcon>
                <ListItemText primary="Cours payant" className={classes.whiteText} />
              </ListItem>
              <ListItem button className={classes.listItem} onClick={() => onSidebarItemClick("QuizBlanDetailleTableau")}>
              <ListItemIcon>
                  <span className={classes.bullet}>-</span>
                </ListItemIcon>
                <ListItemText primary="Quiz blanc" className={classes.whiteText} />
              </ListItem>
              <ListItem button className={classes.listItem} onClick={() => onSidebarItemClick("QuizDetailsTable")}>
              <ListItemIcon>
                  <span className={classes.bullet}>-</span>
                </ListItemIcon>
                <ListItemText primary="Quiz final" className={classes.whiteText} />
              </ListItem>
            </>
          )}
          <Divider />
         
          <ListItem button className={classes.listItem} onClick={() => onSidebarItemClick("Tableau")}>
            <FormatListBulletedIcon className={`${classes.icon} ${classes.whiteText}`} />
            {sidebarOpen && <ListItemText primary="Table Liste" className={classes.whiteText} />}
          </ListItem>
          <ListItem button className={classes.listItem} onClick={() => onSidebarItemClick("PaiementTabl")}>
            <FormatListBulletedIcon className={`${classes.icon} ${classes.whiteText}`} />
            {sidebarOpen && <ListItemText primary="Table Paiement" className={classes.whiteText} />}
          </ListItem>
          <ListItem button className={classes.listItem} onClick={() => onSidebarItemClick("ModifierAdmin")}>
            <SupervisorAccountIcon className={`${classes.icon} ${classes.whiteText}`} />
            {sidebarOpen && <ListItemText primary="donnée personnelle" className={classes.whiteText} />}
          </ListItem>
        </List>
      </Paper>
      <div className="content" style={{ width: contentWidth }}>
        {/* Le contenu du tableau de bord va ici */}
      </div>
    </div>
  );
};

export default Sidebar;
