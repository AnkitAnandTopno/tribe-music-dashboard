import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "components/CustomButtons/Button.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import { fileApi } from "constant/api.js";
import React, { Component } from "react";
import { uploadFile } from "utills/util";
import { sendRequest } from "utills/util.js";
import CustomInput from "./CustomInput.js";

class Uploader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isUploading: false,
      progresPercentage: 0,
      imageList: [],
      imageUrl: this.props.value || ""
    };
  }
  refreshImageList() {
    const thenFn = res => {
      console.log(res);
      this.setState({ imageList: (res && res.data) || [] });
    };
    const errorFn = () => {
      alert("error");
    };

    sendRequest(fileApi.getImages, {
      success: { fn: thenFn },
      error: { fn: errorFn }
    });
  }
  componentDidMount() {}
  render() {
    let { isUploading, imageUrl, imageList } = this.state;
    let { onChange, imageStyle, uploadApi } = this.props;
    imageStyle = imageStyle || {};
    return (
      <div>
        {isUploading ? (
          <CircularProgress color="secondary" />
        ) : imageUrl || imageUrl !== "" ? (
          <div>
            <img
              src={imageUrl}
              style={{ width: 100, height: 100, ...imageStyle }}
            />
            <Button
              color="primary"
              onClick={() => {
                this.setState({ imageUrl: "" });
                onChange("");
              }}
            >
              Edit
            </Button>
          </div>
        ) : (
          <GridContainer>
            <GridItem>
              <CustomInput
                labelText="Image URL"
                id="imageUrl"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  onChange: e => {
                    this.setState({
                      imageUrl: e.target.value
                    });
                    onChange(e.target.value);
                  }
                }}
              />
              <h3>OR</h3>
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
                    uploadFile(uploadApi||fileApi.uploadImage, {
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

export default Uploader;
