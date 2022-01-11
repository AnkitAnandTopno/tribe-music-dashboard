import React, { Component } from "react";
import { uploadFile } from "utills/util";
import CustomInput from "./CustomInput.js";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "components/CustomButtons/Button.js";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import { fileApi } from "constant/api.js";
import _ from "lodash";
import { sendRequest } from "utills/util.js";

class MultiUploader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isUploading: false,
      progresPercentage: 0,
      imageList: [],
      imageUrl: this.props.value || ""
    };
  }
  componentDidMount() {}
  render() {
    let { isUploading, imageUrl, imageList } = this.state;
    let { onChange, imageStyle } = this.props;
    imageStyle = imageStyle || {};
    return (
      <div>
        {isUploading ? (
          <CircularProgress color="secondary" />
        ) : (
          <GridContainer>
            <GridItem>
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={e => {
                  if (e.target.files[0]) {
                    this.setState({ isUploading: true });
                    const progressFn = progresPercentage => {
                      this.setState({ progresPercentage });
                    };
                    const thenFn = res => {
                      this.setState({ isUploading: false, imageUrl: res });
                      onChange(res);
                    };
                    const errorFn = () => {
                      alert("error occurred while uploading.");
                      this.setState({ isUploading: false });
                    };
                    uploadFile(fileApi.uploadImage, {
                      file: e.target.files[0],
                      success: { fn: thenFn },
                      error: { fn: errorFn },
                      progress: { fn: progressFn }
                    });
                  }
                }}
              />
            </GridItem>
          </GridContainer>
        )}
      </div>
    );
  }
}

export default MultiUploader;
