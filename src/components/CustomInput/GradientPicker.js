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
import { Label } from "reactstrap";
import { Checkbox } from "@material-ui/core";

const useStyles = makeStyles(styles);

export default function GradientPicker(props) {
  const classes = useStyles();
  const {
    formControlProps,
    labelText,
    onChange,
    cardColor1,
    cardColor2
  } = props;
  const colors = {
    colorPrimary: "#ED1E6E",
    colorPrimaryTwin: "#F12532",
    colorComplimentary: "#77E394",
    colorComplimentaryTwin: "#62bb14",
    colorSecondary: "#77A9E3",
    colorSecondaryTwin: "#1473BB",
    colorForth: "#F1CF25",
    colorForthTwin: "#EDA11E"
  };
  return (
    <FormControl
      {...formControlProps}
      className={(formControlProps || {}).className + " " + classes.formControl}
    >
      <Label>{labelText}</Label>

      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
        <div
          onClick={() => {
            onChange(colors.colorPrimary, colors.colorPrimaryTwin);
          }}
          style={{
            border:
              cardColor1 === colors.colorPrimary &&
              cardColor2 === colors.colorPrimaryTwin
                ? `4px solid #9c27b0`
                : "4px solid #fff",
            cursor: "pointer",
            width: 100,
            height: 100,
            margin: 10,
            backgroundImage: `linear-gradient(to bottom right, ${colors.colorPrimary} , ${colors.colorPrimaryTwin})`
          }}
        ></div>
        <div
          onClick={() => {
            onChange(colors.colorSecondary, colors.colorSecondaryTwin);
          }}
          style={{
            border:
              cardColor1 === colors.colorSecondary &&
              cardColor2 === colors.colorSecondaryTwin
                ? `4px solid #9c27b0`
                : "4px solid #fff",
            cursor: "pointer",
            width: 100,
            height: 100,
            margin: 10,
            backgroundImage: `linear-gradient(to bottom right, ${colors.colorSecondary} , ${colors.colorSecondaryTwin})`
          }}
        ></div>
        <div
          onClick={() => {
            onChange(colors.colorComplimentary, colors.colorComplimentaryTwin);
          }}
          style={{
            border:
              cardColor1 === colors.colorComplimentary &&
              cardColor2 === colors.colorComplimentaryTwin
                ? `4px solid #9c27b0`
                : "4px solid #fff",
            cursor: "pointer",
            width: 100,
            height: 100,
            margin: 10,
            backgroundImage: `linear-gradient(to bottom right, ${colors.colorComplimentary} , ${colors.colorComplimentaryTwin})`
          }}
        ></div>
        <div
          onClick={() => {
            onChange(colors.colorForth, colors.colorForthTwin);
          }}
          style={{
            border:
              cardColor1 === colors.colorForth &&
              cardColor2 === colors.colorForthTwin
                ? `4px solid #9c27b0`
                : "4px solid #fff",
            cursor: "pointer",
            width: 100,
            height: 100,
            margin: 10,
            backgroundImage: `linear-gradient(to bottom right, ${colors.colorForth} , ${colors.colorForthTwin})`
          }}
        ></div>
      </div>
    </FormControl>
  );
}

GradientPicker.propTypes = {
  labelText: PropTypes.node,
  labelProps: PropTypes.object,
  formControlProps: PropTypes.object
};
