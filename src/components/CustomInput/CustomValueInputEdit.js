import React from "react";
import classNames from "classnames";
import { connect } from "react-redux";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
// @material-ui/icons
import Clear from "@material-ui/icons/Clear";
import Check from "@material-ui/icons/Check";
// core components
import styles from "assets/jss/material-dashboard-react/components/customInputStyle.js";
import SimpleIcon from "components/simpleIcon/simpleIcon";

const useStyles = makeStyles(styles);

function CustomValueInputEdit(props) {
  const classes = useStyles();
  const { id, inputProps, onChange, value, postfix, type } = props;
  const [editable, changeEditability] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value);
  return (
    <FormControl key={id}>
      {!editable ? (
        <div style={{ display: "flex" }}>
          {value}
          {postfix}
          <SimpleIcon
            onClick={() => {
              changeEditability(true);
            }}
            iconName="mdi-square-edit-outline"
            iconColor="gray"
          />
        </div>
      ) : (
        <Input
          autoFocus={true}
          key={id}
          id={id}
          type={type || "text"}
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onFocus={() => {
            setInputValue(value);
          }}
          onBlur={() => {
            changeEditability(false);
            if (inputValue == "") {
              if (type == "text" || type == undefined) {
                onChange(inputValue);
              } else if (type == "number") {
                onChange(0);
              }
            } else onChange(inputValue);
          }}
        />
      )}
    </FormControl>
  );
}

CustomValueInputEdit.propTypes = {
  labelText: PropTypes.node,
  labelProps: PropTypes.object,
  id: PropTypes.string,
  inputProps: PropTypes.object,
  formControlProps: PropTypes.object,
  error: PropTypes.bool,
  success: PropTypes.bool
};

const mapStateToProps = (state, ownState) => {
  let { id, inputProps, onChange, value, postfix, type } = ownState;
  return { id, inputProps, onChange, value, postfix, type };
};

export default connect(
  mapStateToProps,
  {}
)(CustomValueInputEdit);
