import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import _ from "lodash";
// @material-ui/icons
import Clear from "@material-ui/icons/Clear";
import Check from "@material-ui/icons/Check";
// core components
import styles from "assets/jss/material-dashboard-react/components/customInputStyle.js";
import { Select, MenuItem } from "@material-ui/core";

const useStyles = makeStyles(styles);

export default function UnitInput(props) {
  const classes = useStyles();
  const {
    formControlProps,
    labelText,
    id,
    labelProps,
    inputProps,
    error,
    success,
    values,
    onChange
  } = props;

  const labelClasses = classNames({
    [" " + classes.labelRootError]: error,
    [" " + classes.labelRootSuccess]: success && !error
  });
  const underlineClasses = classNames({
    [classes.underlineError]: error,
    [classes.underlineSuccess]: success && !error,
    [classes.underline]: true
  });
  const marginTop = classNames({
    [classes.marginTop]: labelText === undefined
  });

  const [unitValue, setUnitValue] = React.useState(values.value || "1");
  const [unitType, setUnitType] = React.useState(values.type || "kg");
  const options = [
    { value: "kg", name: "Kilogram(s)" },
    { value: "g", name: "Gram(s)" },
    { value: "l", name: "Litre(s)" },
    { value: "ml", name: "Mililitre(s)" },
    { value: "cm", name: "Centimetre(s)" },
    { value: "m", name: "Metre(s)" },
    { value: "piece", name: "Piece(s)" }
  ];
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div style={{ flex: 1 }}>
        <FormControl>
          <Input
            classes={{
              root: marginTop,
              disabled: classes.disabled,
              underline: underlineClasses
            }}
            id={id}
            placeholder="value"
            value={values && values.value}
            onChange={e => {
              setUnitValue(e.target.value);
              onChange(`${e.target.value} ${unitType}`);
            }}
          />
          {error ? (
            <Clear
              className={classes.feedback + " " + classes.labelRootError}
            />
          ) : success ? (
            <Check
              className={classes.feedback + " " + classes.labelRootSuccess}
            />
          ) : null}
        </FormControl>
      </div>
      <div style={{ flex: 3 }}>
        <FormControl
          {...formControlProps}
          className={formControlProps.className + " " + classes.formControl}
        >
          <Input
            classes={{
              root: marginTop,
              disabled: classes.disabled,
              underline: underlineClasses
            }}
            id={id}
            value={values && values.type}
            onChange={e => {
              setUnitType(e.target.value);

              onChange(`${unitValue} ${e.target.value}`);
            }}
          />
          {
            //   <Select
            //   labelId="demo-simple-select-label"
            //   id="demo-simple-select"
            //   value={values && values.type}
            //   onChange={e => {
            //     setUnitType(e.target.value);
            //     onChange(`${unitValue} ${e.target.value}`);
            //   }}
            // >
            //   {_.map(options, (item, index) => (
            //     <MenuItem key={index} value={item.value}>
            //       {item.name}
            //     </MenuItem>
            //   ))}
            // </Select>
          }
        </FormControl>
      </div>
    </div>
  );
}

UnitInput.propTypes = {
  labelText: PropTypes.node,
  labelProps: PropTypes.object,
  id: PropTypes.string,
  inputProps: PropTypes.object,
  formControlProps: PropTypes.object,
  error: PropTypes.bool,
  success: PropTypes.bool
};
