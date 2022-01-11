import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import _ from "lodash";
import { connect } from "react-redux";

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

function SimpleSelect(props) {
  const classes = useStyles();
  const { label, options, onChange, value } = props;

  const handleChange = event => {
    onChange(event.target.value);
  };

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">{label}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          onChange={handleChange}
        >
          {_.map(options, (item, index) => (
            <MenuItem key={index} value={item.value}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
const mapStateToProps = (state, ownProps) => {
  return {
    label: ownProps.label,
    options: ownProps.options,
    value: ownProps.value || ""
  };
};

export default connect(
  mapStateToProps,
  {}
)(SimpleSelect);
