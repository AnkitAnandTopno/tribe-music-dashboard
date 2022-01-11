import React from "react";
import classNames from "classnames";
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
import { Checkbox } from "@material-ui/core";

const useStyles = makeStyles(styles);

export default function CustomCheckbox(props) {
  const classes = useStyles();
  const {
    formControlProps,
    labelText,
    id,
    labelProps,
    inputProps,
    error,
    success
  } = props;

  return (
    <FormControl
      {...formControlProps}
      className={formControlProps.className + " " + classes.formControl}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <Checkbox
          checked={inputProps && inputProps.value}
          onClick={() => {
            inputProps && inputProps.onChange(!inputProps && inputProps.value);
          }}
        />
        {labelText}
      </div>
    </FormControl>
  );
}

CustomCheckbox.propTypes = {
  labelText: PropTypes.node,
  labelProps: PropTypes.object,
  id: PropTypes.string,
  inputProps: PropTypes.object,
  formControlProps: PropTypes.object,
  error: PropTypes.bool,
  success: PropTypes.bool
};
