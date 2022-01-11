import React, { useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import _ from "lodash";
import { connect } from "react-redux";
import { Input } from "@material-ui/core";
import Fuse from "fuse.js";

import { sendRequest } from "utills/util";
import { itemApi } from "constant/api";

import { Checkbox } from "@material-ui/core";
const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

function AutoCompleteMultiSelect(props) {
  const classes = useStyles();
  const { label, onChange, objectKey, value, keyExtractor } = props;
  const [isOpen, setOpen] = React.useState(false);
  const [searchString, setSearchString] = React.useState("");
  const [itemsLoading, setItemsLoading] = React.useState(false);
  let [searchList, setSearchList] = React.useState([]);
  const [multiSelectList, setMultiSelectList] = React.useState(value || []);

  // searchItems
  const fetchItemsList = searchStr => {
    setSearchString(searchStr);
    setItemsLoading(true);
    const thenFn = res => {
      setItemsLoading(false);
      setSearchList((res && res.data) || []);
    };
    const errorFn = error => {
      console.log(error);
      setItemsLoading(false);
    };
    sendRequest(itemApi.searchItems, {
      searchString: searchStr,
      success: { fn: thenFn },
      error: { fn: errorFn }
    });
  };

  const handleChange = (itemM, isChecked) => {
    // setOpen(false);
    // document.removeEventListener("mousedown", () => {});
    // setSearchString(value && value[`${objectKey || "title"}`]);
    let newMultiSelectList = [];
    if (isChecked) {
      newMultiSelectList = _.filter(
        multiSelectList,
        (item, index) =>
          `${keyExtractor(item, index)}` != `${keyExtractor(itemM)}`
      );
    } else {
      newMultiSelectList = multiSelectList;
      newMultiSelectList.push({
        _id: itemM._id,
        name: itemM.name,
        altName: itemM.altName
      });
    }
    setMultiSelectList(newMultiSelectList);
    onChange(newMultiSelectList);
  };

  const wrapperRef = useRef(null);
  React.useEffect(() => {
    return () => {
      document.removeEventListener("mousedown", () => {});
    };
  }, []);
  return (
    <div ref={wrapperRef}>
      <FormControl className={classes.formControl}>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          <div style={{ flex: 4 }}>
            <InputLabel>{label}</InputLabel>
            <Input
              onFocus={() => {
                document.addEventListener("mousedown", event => {
                  if (
                    wrapperRef &&
                    wrapperRef.current &&
                    !wrapperRef.current.contains(event.target)
                  ) {
                    setOpen(false);
                    document.removeEventListener("mousedown", () => {});
                  }
                  if (
                    (wrapperRef && wrapperRef.current == null) ||
                    (wrapperRef && wrapperRef.current == undefined)
                  ) {
                    document.removeEventListener("mousedown", () => {});
                  }
                });
                setOpen(true);
              }}
              onBlur={() => {
                document.removeEventListener("mousedown", () => {});
                // setOpen(false);
              }}
              value={searchString}
              onChange={e => {
                if ((e.target.value || "").length > 3) {
                  fetchItemsList(e.target.value);
                } else {
                  setSearchString(_.cloneDeep(e.target.value));
                }
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            {(multiSelectList || []).length > 0 ? (
              <div
                onClick={() => {
                  setMultiSelectList([]);
                  onChange([]);
                }}
                style={{
                  width: 200,
                  padding: 10,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                Deselect All
              </div>
            ) : null}
          </div>
        </div>
        <div>
          <div
            style={{
              maxHeight: 200,
              overflow: "auto",
              padding: 5,
              boxShadow: "5px 5px 10px #aaa"
            }}
          >
            {_.map(searchList, (item, index) => (
              <div key={keyExtractor(item, index)}>
                <MenuItem
                  onClick={() => {
                    handleChange(
                      item,
                      _.find(
                        multiSelectList,
                        (itemMSL, indexMSL) =>
                          `${keyExtractor(itemMSL, indexMSL)}` ==
                          `${keyExtractor(item)}`
                      )
                        ? true
                        : false
                    );
                  }}
                >
                  <div style={{ display: "flex", width: "100%" }}>
                    <div style={{ flex: 3 }}>
                      {item && item[`${objectKey || "title"}`]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <Checkbox
                        checked={
                          _.find(
                            multiSelectList,
                            (itemMSL, indexMSL) =>
                              `${keyExtractor(itemMSL, indexMSL)}` ==
                              `${keyExtractor(item)}`
                          )
                            ? true
                            : false
                        }
                      />
                    </div>
                  </div>
                </MenuItem>
              </div>
            ))}
          </div>
        </div>
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

AutoCompleteMultiSelect.defaultProps = {
  keyExtractor: () => {
    return undefined;
  }
};
export default connect(
  mapStateToProps,
  {}
)(AutoCompleteMultiSelect);
