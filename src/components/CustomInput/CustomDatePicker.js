import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import _ from "lodash";
import { connect } from "react-redux";
import { TextField } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

function CustomDatePicker(props) {
  const classes = useStyles();
  const { label, onChange, value } = props;

  const handleChange = event => {
    onChange(event.target.value);
  };

  return (
    <div>
      <FormControl className={classes.formControl}>
        <TextField
          label={label}
          type="date"
          defaultValue={value}
          onChange={handleChange}
        />
      </FormControl>
    </div>
  );
}
const mapStateToProps = (state, ownProps) => {
  return {
    label: ownProps.label,
    value: ownProps.value || ""
  };
};

export default connect(
  mapStateToProps,
  {}
)(CustomDatePicker);
