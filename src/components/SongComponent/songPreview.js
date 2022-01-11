import React, { Component } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col
} from "reactstrap";
import { connect } from "react-redux";
import colors from "assets/colors";
import _ from "lodash";
import Button from "components/CustomButtons/Button.js";
import { SongListEditForm } from "views/Items/songListComponents";
import { convert_to_unicode } from "utills/stringUtil";

class SongPreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditMode: false
    };
  }
  onClose() {
    this.setState({ isEditMode: false });
  }
  render() {
    let {
      hindi,
      songIndex,
      songName,
      newNum,
      oldNum,
      lyrics,
      updateSong,
      songUrl,
      isModal,
      songKey
    } = this.props;
    return (
      <div>
        {!isModal ? null : (
          <div className="preview" style={{ background: "white" }}>
            <ModalHeader
              toggle={() => {
                this.onClose();
                this.props.toggle();
              }}
            >
              <h4 style={{ color: colors.colorPrimary }}>
                {" "}
                {newNum}. {hindi ? convert_to_unicode(songName) : songName}{" "}
                {songKey}
              </h4>
              {songUrl ? (
                <audio controls>
                  <source src={songUrl} type="audio/mpeg" />
                </audio>
              ) : null}
              {!this.state.isEditMode && this.props.isSongList ? (
                <Button
                  color="primary"
                  onClick={() => {
                    this.setState({ isEditMode: true });
                  }}
                >
                  Edit
                </Button>
              ) : null}
            </ModalHeader>
            <ModalBody>
              {this.state.isEditMode ? (
                <div>
                  <SongListEditForm
                    {...this.props.activeSong}
                    updateSong={song => {
                      this.onClose();
                      updateSong(song);
                    }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    padding: 1,
                    border: `1px solid ${colors.colorPrimary}`,
                    borderRadius: 10
                  }}
                >
                  <div style={{ display: "flex" }}>
                    <div style={{ flex: 1 }} />
                    <div
                      style={{
                        flex: 6,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      {_.map(lyrics, (item, index) => (
                        <div style={{ display: "flex", alignItems: "stretch" }}>
                          <span
                            key={"key" + index}
                            style={{
                              whiteSpace: "pre-line",
                              textAlign: "center"
                            }}
                          >
                            {hindi
                              ? convert_to_unicode(item.value)
                              : item.value}
                          </span>

                          {item.count > 1 ? (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                paddingLeft: 5
                              }}
                            >
                              <div style={{ height: "100%", width: 10 }}>
                                <svg
                                  version="1.1"
                                  id="Layer_1"
                                  xmlns="http://www.w3.org/2000/svg"
                                  x="0px"
                                  y="0px"
                                  width="100%"
                                  height="100%"
                                  viewBox="0 0 215.384 768"
                                  preserveAspectRatio="none"
                                >
                                  <g>
                                    <path
                                      d="M203.656,372.518h-10.438c-11.834,0-21.92,4.176-30.271,12.528c-8.353,8.349-12.524,18.448-12.524,30.269v233.819
                     c0,30.271-11.404,56.025-34.191,77.24c-22.788,21.226-51.587,31.837-86.373,31.837H13.678v-19.309h16.179
                     c24.704,0,37.056-14.266,37.056-42.796V462.287c0-45.581,25.053-78.81,75.156-99.686c-50.104-19.484-75.156-52.53-75.156-99.161
                     V71.896c0-28.522-12.352-42.797-37.056-42.797H13.678V9.79h16.179c34.786,0,63.585,10.62,86.373,31.836
                     c22.787,21.224,34.191,46.973,34.191,77.243v191.544c0,11.827,4.172,21.92,12.524,30.269c8.352,8.352,18.438,12.528,30.271,12.528
                     h10.438V372.518z"
                                    />
                                  </g>
                                </svg>
                              </div>
                              <span>{item.count}</span>
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                    <div style={{ flex: 1 }} />
                  </div>
                </div>
              )}
            </ModalBody>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    isModal: ownProps.isModal,

    songName: ownProps.songName,
    newNum: ownProps.newNum,
    oldNum: ownProps.oldNum,
    lyrics: ownProps.lyrics,
    songUrl: ownProps.songUrl
  };
};
export default connect(
  mapStateToProps,
  null
)(SongPreview);
