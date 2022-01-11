import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import moment from "moment";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";
import Input from "@material-ui/core/Input";
import _ from "lodash";
// @material-ui/icons
import Clear from "@material-ui/icons/Clear";
import Check from "@material-ui/icons/Check";
// core components
import styles from "assets/jss/material-dashboard-react/components/customInputStyle.js";
import { Select, MenuItem } from "@material-ui/core";

const useStyles = makeStyles(styles);

export default function ToFromTimeInput(props) {
  const classes = useStyles();
  const {
    formControlProps,
    labelText,
    id,
    labelProps,
    inputProps,
    toFromTime,
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

  const [fromTime, setFromTime] = React.useState(
    (toFromTime && toFromTime.from) || moment("07:30").format()
  );
  const [toTime, setToTime] = React.useState(
    (toFromTime && toFromTime.to) || moment("09:30").format()
  );
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
          <TextField
            id="time"
            label="From"
            type="time"
            defaultValue={moment(
              (toFromTime && toFromTime.from) || fromTime
            ).format("HH:mm")}
            className={classes.textField}
            InputLabelProps={{
              shrink: true
            }}
            inputProps={{
              onChange: e => {
                setFromTime(moment(e.target.value, "HH:mm").format());
                onChange({
                  from: moment(e.target.value, "HH:mm").format(),
                  to: toTime
                });
              },
              step: 300 // 5 min
            }}
          />
        </FormControl>
      </div>
      <div style={{ flex: 1 }}>
        <FormControl>
          <TextField
            id="time"
            label="To"
            type="time"
            defaultValue={moment(
              (toFromTime && toFromTime.to) || toTime
            ).format("HH:mm")}
            className={classes.textField}
            InputLabelProps={{
              shrink: true
            }}
            inputProps={{
              onChange: e => {
                setToTime(moment(e.target.value, "HH:mm").format());
                onChange({
                  from: fromTime,
                  to: moment(e.target.value, "HH:mm").format()
                });
              },
              step: 300 // 5 min
            }}
          />
        </FormControl>
      </div>
    </div>
  );
}

ToFromTimeInput.propTypes = {
  labelText: PropTypes.node,
  labelProps: PropTypes.object,
  id: PropTypes.string,
  inputProps: PropTypes.object,
  formControlProps: PropTypes.object,
  error: PropTypes.bool,
  success: PropTypes.bool
};
