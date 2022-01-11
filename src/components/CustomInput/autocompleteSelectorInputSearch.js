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

import { Checkbox } from "@material-ui/core";
import Spinner from "reactstrap/lib/Spinner";
const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

function AutoCompleteSelectSearch(props) {
  const classes = useStyles();
  const { label, searchList, onType, onChange, objectKey, subtitleKey, value, keyExtractor, thumbnailUrlKey, isLoading } = props;
  const [isOpen, setOpen] = React.useState(false);
  const [searchString, setSearchString] = React.useState(
    value && value[`${objectKey || "title"}`]
  );
  const [multiSelectList, setMultiSelectList] = React.useState([]);
  const handleChange = value => {
    setOpen(false);

    document.removeEventListener("mousedown", () => {});
    setSearchString(value && value[`${objectKey || "title"}`]);
    onChange(value);
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
      {isLoading?<Spinner/>:null}
        <InputLabel>{label}</InputLabel>
        <Input
          onFocus={() => {
            document.addEventListener("mousedown", event => {
              if (
                wrapperRef &&
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target)
              ) {
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
            if ((e.target.value || "").length > 1) {
             onType(_.cloneDeep(e.target.value));
            }
            setSearchString(_.cloneDeep(e.target.value));
          }}
        />

        {isOpen ? (
          <div>
            <div
              style={{
                maxHeight: 100,
                overflow: "auto",
                padding: 5,
                boxShadow: "5px 5px 10px #aaa"
              }}
            >
              {_.map(searchList, (item, index) => (
                <div
                  key={keyExtractor(item, index)}
                  onClick={() => {
                    handleChange(item);
                  }}
                >
                  <MenuItem><div><img style={{width: 50, height: 50}} src={item && item[`${thumbnailUrlKey}`]||"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAS1BMVEW1tbX///+2trbR0dGvr6/MzMyysrL7+/v19fXX19e/v7/i4uKpqamenp7BwcGioqLs7OyYmJjn5+eLi4vU1NTHx8eFhYWQkJDw8PA11woWAAADG0lEQVR4nO3c23aqMBSF4STGgALiier7P+kGD+1Wi1ddaznXmP9NB72J30gAibYheS+k4DsK8aMQPwrxoxA/CvGjED8K8aMQPwrxoxA/CvGjED8K8aMQPwrxoxA/CvGjED8K8aMQPwrxoxA/CvGjED8K8aMQPwrxoxA/CvGjED8K8aMQPwrxoxA/CvGjED8K8aPw7yuX9MZTF25WU4PegNrCcoxT+6w2orpwcRHW7oVxrTailbBRm0Qrod4kmglrrRuGmTA2SkQ7YTzqnIqGwnhUmUVLYVxpEE2FKueirTBug7jRWBirtTTRWhirQZhoLoxxKUv8AKEw0U5Y/xBFF6qdcEj/XW4ER7QTLtt++33TEJxEQ2FO3fJ+sJAjWgpDatf3k9KpMKR8Pxk3YiPaCsfj2yzKvQm3FoZ83V6sW6kRzYWhXG+MnoXX34g98NsLQ/E+hyFvvQtLMx32Uq/jU4TVzruw8TyH+TweDa1nYTUeiS3STxBO79vOnoVleoRaiy3STxDuJa+knyAM42l47BwLL4u0c7qLcf3NOIUrwUVqLxwf8vcHn7uJd2G/+8qSr8FcGFJJoi/BXigdhX+dV+Ht+5Z5/OFSWMKw2tZj52YZHApLaqr4XXX2Jhx98fecCMtQzQCdCMtyzhfj4EFYhnlgFP+ayS1R4foNUPDztMckhWX7Tig27FOSws07YJTbmXlMUDhtwLzp5EA4e6OYagS3Zh4SFL69zsRW68v6VsJGa5FKCtMbYHXy8PcWuZ4XdmIfNb0keaU5zgJ7ye3Dp0Tv+DMX0/NO6zo6JSr8/Vqz+NJbokH6nXd6ncV9fxDdHn1J+Ompf3r+bdpxAnX3voSfgFPXr+7zWO03p4O2T34XI5Xu1Oe0Trk7HLqs7tPYiUqp5Lbv21ySgU9pvzRdkh/n98GV97z1oxA/CvGjED8K8aMQPwrxoxA/CvGjED8K8aMQPwrxoxA/CvGjED8K8aMQPwrxoxA/CvGjED8K8aMQPwrxoxA/CvGjED8K8aMQPwrxoxA/CvGjED8K8aMQPwrxoxC/dPunFY77B+gCGJm/tIG1AAAAAElFTkSuQmCC"}/></div>
                  <div>
                  <h6>{item && item[`${objectKey || "title"}`]}
                  </h6>
                  <p>
                    {item && item[`${subtitleKey || "subTitle"}`]}
                  </p>
                  </div></MenuItem>
                </div>
              ))}
            </div>
          </div>
        ) : null}
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

AutoCompleteSelectSearch.defaultProps = {
  keyExtractor: () => {
    return undefined;
  },
  onChange: ()=>{}
};
export default connect(
  mapStateToProps,
  {}
)(AutoCompleteSelectSearch);
