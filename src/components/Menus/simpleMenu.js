import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import SimpleIcon from "components/simpleIcon/simpleIcon";
import _ from "lodash";
import React from "react";

export default function SimpleMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { items } = props;
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <SimpleIcon
        iconName={"mdi-dots-horizontal"}
        iconColor="black"
        onClick={event => {
          handleClick(event);
        }}
      />
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {_.map(items, (item, index) => (
          // <MenuItem>
          <div
            style={{ cursor: "pointer", padding: 10 }}
            onClick={() => {
              handleClose();
              item.onClick();
            }}
          >
            {item.label}
          </div>
          // </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
