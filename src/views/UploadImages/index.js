import Uploader from "components/CustomInput/uploader";
import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Cookies from "universal-cookie";
import Button from "components/CustomButtons/Button.js";
import MultiUploader from "components/CustomInput/multiUploader";
class UploadImageComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadedImages: []
    };
  }
  addUploadedImage(imageUrl) {
    let { uploadedImages } = _.clone(this.state);
    uploadedImages.push(imageUrl);
    this.setState({ uploadedImages });
  }
  copyToClipBoard(id) {
    var copyText = document.getElementById(id);
    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/
    /* Copy the text inside the text field */
    document.execCommand("copy");

    /* Alert the copied text */
    alert("Copied the image link.");
  }
  componentDidMount() {}

  render() {
    let { uploadedImages } = this.state;
    let { history } = this.props;
    return (
      <div>
        <div style={{ background: "white", padding: 10 }}>
          <MultiUploader
            imageStyle={{ width: 120, height: "auto" }}
            onChange={imageUrl => {
              if (imageUrl != "") {
                this.addUploadedImage(imageUrl);
              }
            }}
          />
          {_.map(uploadedImages, (item, index) => {
            return (
              <div
                key={item}
                style={{
                  display: "flex",
                  padding: 10,
                  border: "0.5px solid #f0f0f0"
                }}
              >
                <img src={item} style={{ width: 120, height: "auto" }} />
                <input
                  id={item}
                  type="text"
                  value={item}
                  style={{ height: "fit-content" }}
                />
                <Button
                  color="primary"
                  onClick={() => {
                    this.copyToClipBoard(item);
                  }}
                  style={{ height: 50 }}
                >
                  Copy Link
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {};
};
const mapDispatchToProps = dispatch => {
  return {};
};
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(UploadImageComponent)
);
