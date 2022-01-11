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
      songUrl: this.props.value || ""
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
    let { isUploading, songUrl, progresPercentage} = this.state;
    let { onChange, uploadApi } = this.props;
    return (
      <div>
        {isUploading ? (
          <div>
          <CircularProgress color="secondary" />
          {progresPercentage}%
          </div>
        ) : songUrl || songUrl !== "" ? (
          <div>
          <audio controls>
                  <source src={songUrl} type="audio/mpeg" />
                </audio>
            <Button
              color="primary"
              onClick={() => {
                this.setState({ songUrl: "" });
                onChange("");
              }}
            >
              Edit
            </Button>
          </div>
        ) : (
          <GridContainer>
            <GridItem>
              <input
                type="file"
                accept=".mp3"
                onChange={e => {
                  if (e.target.files[0]) {
                    this.setState({ isUploading: true });
                    const progressFn = progresPercentage => {
                      this.setState({ progresPercentage });
                    };
                    const thenFn = res => {
                      this.setState({ isUploading: false, songUrl: res });
                      onChange(res);
                    };
                    const errorFn = () => {
                      alert("error occurred while uploading.");
                      this.setState({ isUploading: false });
                    };
                    uploadFile(uploadApi||fileApi.uploadSong, {
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
