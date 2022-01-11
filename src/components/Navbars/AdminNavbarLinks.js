import Backdrop from "@material-ui/core/Backdrop";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Divider from "@material-ui/core/Divider";
import Grow from "@material-ui/core/Grow";
import Hidden from "@material-ui/core/Hidden";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Modal from "@material-ui/core/Modal";
import Paper from "@material-ui/core/Paper";
import Poppers from "@material-ui/core/Popper";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import Person from "@material-ui/icons/Person";
import styles from "assets/jss/material-dashboard-react/components/headerLinksStyle.js";
import classNames from "classnames";
import Card from "components/Card/Card.js";
import Button from "components/CustomButtons/Button.js";
import SimpleIcon from "components/simpleIcon/simpleIcon";
import Player from "components/Player/player";
import { itemApi } from "constant/api";
import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import socketIOClient from "socket.io-client";
import Cookies from "universal-cookie";
import { sendRequest } from "utills/util";
import { getSong, isPlaying, addPlayer, playSong, pauseSong} from "modules/songs/reducer";

const cookies = new Cookies();

const useStyles = makeStyles(styles);
// const ENDPOINT = "https://ozon-backend.herokuapp.com/notification";
const ENDPOINT = process.env.REACT_APP_NOTIFICATION_SERVER_DEV;

function AdminNavbarLinks(props) {
  const classes = useStyles();
  const [openNotification, setOpenNotification] = React.useState(null);
  const [openProfile, setOpenProfile] = React.useState(null);
  const [notifications, setNotification] = React.useState([]);
  const { unsavedItemUpdate, emptyUnsavedItemUpdate } = props || {};
  React.useEffect(() => {
    if (!props.sidebar) {
      const socket = socketIOClient(ENDPOINT);
      socket.on("connectionEstablished", data => {});
      socket.on("newOrderAdded", data => {
        console.log("newOrderAdded", data);
        if (data.distributorId === cookies.get("distributorId")) {
          handleClose();
          handleOpen();
        }
      });
      return () => socket.disconnect();
    }
  }, []);

  const [open, setOpen] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleClickNotification = event => {
    if (openNotification && openNotification.contains(event.target)) {
      setOpenNotification(null);
    } else {
      setOpenNotification(event.currentTarget);
    }
  };
  const handleCloseNotification = () => {
    setOpenNotification(null);
  };
  const handleClickProfile = event => {
    if (openProfile && openProfile.contains(event.target)) {
      setOpenProfile(null);
    } else {
      setOpenProfile(event.currentTarget);
    }
  };
  const handleCloseProfile = () => {
    setOpenProfile(null);
    cookies.remove("userId", { path: "/" });
    cookies.remove("isAdmin", { path: "/" });
    window.location.reload();
  };
  const handleClickAway = () => {
    setOpenProfile(null);
  };
  let {song, addPlayer, isPlaying, playSong, pauseSong} = props;
  return (
    <div>
      <div className={classes.searchWrapper}>
      
        {
          //new order modal
        }
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%"
            }}
          >
            <Card style={{ width: "fit-content", padding: 20 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <SimpleIcon iconName="mdi-bell" iconColor="green" />
                <h2 id="transition-modal-title">Alert!!</h2>
              </div>
              <h1 id="transition-modal-description">New Order</h1>

              <audio src={process.env.REACT_APP_NOTIFICATION_AUDIO} autoPlay />
              <Button color="primary" onClick={handleClose}>
                OK
              </Button>
            </Card>
          </div>
        </Modal>
        {
          // <CustomInput
          //   formControlProps={{
          //     className: classes.margin + " " + classes.search
          //   }}
          //   inputProps={{
          //     placeholder: "Search",
          //     inputProps: {
          //       "aria-label": "Search"
          //     }
          //   }}
          // />
          // <Button color="white" aria-label="edit" justIcon round>
          //   <Search />
          // </Button>
        }
      </div>

      <div className={classes.manager}>
        {
          //   <Button
          //   color={window.innerWidth > 959 ? "transparent" : "white"}
          //   justIcon={window.innerWidth > 959}
          //   simple={!(window.innerWidth > 959)}
          //   aria-owns={openNotification ? "notification-menu-list-grow" : null}
          //   aria-haspopup="true"
          //   onClick={handleClickNotification}
          //   className={classes.buttonLink}
          // >
          //   <Notifications className={classes.icons} />
          //   <span className={classes.notifications}>5</span>
          //   <Hidden mdUp implementation="css">
          //     <p onClick={handleCloseNotification} className={classes.linkText}>
          //       Notification
          //     </p>
          //   </Hidden>
          // </Button>
          // <Poppers
          //   open={Boolean(openNotification)}
          //   anchorEl={openNotification}
          //   transition
          //   disablePortal
          //   className={
          //     classNames({ [classes.popperClose]: !openNotification }) +
          //     " " +
          //     classes.popperNav
          //   }
          // >
          //   {({ TransitionProps, placement }) => (
          //     <Grow
          //       {...TransitionProps}
          //       id="notification-menu-list-grow"
          //       style={{
          //         transformOrigin:
          //           placement === "bottom" ? "center top" : "center bottom"
          //       }}
          //     >
          //       <Paper>
          //         <ClickAwayListener onClickAway={handleCloseNotification}>
          //           <MenuList role="menu">
          //             <MenuItem
          //               onClick={handleCloseNotification}
          //               className={classes.dropdownItem}
          //             >
          //               Mike John responded to your email
          //             </MenuItem>
          //             <MenuItem
          //               onClick={handleCloseNotification}
          //               className={classes.dropdownItem}
          //             >
          //               You have 5 new tasks
          //             </MenuItem>
          //             <MenuItem
          //               onClick={handleCloseNotification}
          //               className={classes.dropdownItem}
          //             >
          //               You{"'"}re now friend with Andrew
          //             </MenuItem>
          //             <MenuItem
          //               onClick={handleCloseNotification}
          //               className={classes.dropdownItem}
          //             >
          //               Another Notification
          //             </MenuItem>
          //             <MenuItem
          //               onClick={handleCloseNotification}
          //               className={classes.dropdownItem}
          //             >
          //               Another One
          //             </MenuItem>
          //           </MenuList>
          //         </ClickAwayListener>
          //       </Paper>
          //     </Grow>
          //   )}
          // </Poppers>
        }
      </div>
      <div className={classes.manager}>
        
        <Button
          color={window.innerWidth > 959 ? "transparent" : "white"}
          justIcon={window.innerWidth > 959}
          simple={!(window.innerWidth > 959)}
          aria-owns={openProfile ? "profile-menu-list-grow" : null}
          aria-haspopup="true"
          onClick={handleClickProfile}
          className={classes.buttonLink}
        >
          <Person className={classes.icons} />
          <Hidden mdUp implementation="css">
            <p className={classes.linkText}>Profile</p>
          </Hidden>
        </Button>
        <Poppers
          open={Boolean(openProfile)}
          anchorEl={openProfile}
          transition
          disablePortal
          className={
            classNames({ [classes.popperClose]: !openProfile }) +
            " " +
            classes.popperNav
          }
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="profile-menu-list-grow"
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom"
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClickAway}>
                  <MenuList role="menu">
                    <MenuItem
                      onClick={() => {
                        setOpenProfile(null);
                        props &&
                          props.history.push("/admin/distributorSettings");
                      }}
                      className={classes.dropdownItem}
                    >
                      Profile Settings
                    </MenuItem>
                    <Divider light />
                    <MenuItem
                      onClick={handleCloseProfile}
                      className={classes.dropdownItem}
                    >
                      Logout
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Poppers>
      </div>
    </div>
  );
}
const mapStateToProps = state => {
  return {
    song: getSong(state),
    isPlaying: isPlaying(state)
  };
};
const mapDispatchToProps = dispatch => {
  return {
    addPlayer: payload => dispatch(addPlayer(payload)),
    playSong: payload => dispatch(playSong(payload)),
    pauseSong: payload=> dispatch(pauseSong(payload))
  };
};
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AdminNavbarLinks)
);
