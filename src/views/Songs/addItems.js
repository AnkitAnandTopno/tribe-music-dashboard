import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink, withRouter } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import _ from "lodash";
import AddSongList from "./addSongsComponents/addSongList";
import { sendRequest } from "utills/util";
import { AddItemForm } from "./addSongsComponents";
import { itemApi } from "constant/api";
import SimpleIcon from "components/simpleIcon/simpleIcon";
import { uploadFile } from "utills/util";
import { fileApi } from "constant/api";

import Button from "components/CustomButtons/Button.js";
class AddSong extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      lastScrollY: 0,
      songList: []
    };
  }
  onDelete(songIndex) {
    let newSongList = _.cloneDeep(this.state.songList);
    newSongList = _.remove(newSongList, (item, index) => {
      return songIndex === index;
    });
    this.setState({ songList: newSongList });
  }
  addItem(newItem) {
    let newSongList = _.cloneDeep(this.state.songList);
    // let newSongListMain = _.cloneDeep(this.props.songs);
    newSongList.push(newItem);
    // newSongListMain.push(newSong);
    this.setState({ songList: newSongList });
  }
  //save to server
  submitToApp() {
    let { songList } = this.state;
    let { history } = this.props;
    this.setState({ isLoading: true });
    const thenFn = () => {
      this.setState({ isLoading: false, songList: [] });
      history.push("/admin/songList");
    };
    const errorFn = () => {
      this.setState({ isLoading: false });
    };
    sendRequest(itemApi.submitToApp, {
      songs: songList,
      success: { fn: thenFn },
      error: { fn: errorFn }
    });
  }
  componentDidMount() {}
  render() {
    let {
      isLoading,
      isUploading,
      progresPercentage,
      xlFile,
      xlFileD
    } = this.state;
    let { match, history } = this.props;
    let id = match && match.params && match.params.id;
    return (
      <div>
        {isLoading ? (
          <CircularProgress color="secondary" />
        ) : (
          <GridContainer>
            <GridItem xs={12} sm={12} md={8}>
              <div style={{ display: "flex" }}>
                <SimpleIcon
                  iconName={"mdi-arrow-left"}
                  iconColor={"black"}
                  onClick={() => {
                    window.history.back();
                  }}
                />
                <h2>{id ? "Edit Items" : "Add Items"}</h2>
              </div>

              <NavLink to={"/admin/itemList"}>Go To Item List</NavLink>
              {id ? null : isUploading ? (
                <div>
                  <span>{progresPercentage}</span>
                  <CircularProgress color="secondary" />
                </div>
              ) : (
                <div style={{ margin: 10, padding: 10, background: "white" }}>
                  <h5>Upload Excel To Add or Update Items</h5>
                  <input
                    type="file"
                    accept=".xlsx"
                    onChange={e => {
                      if (
                        e.target.files &&
                        e.target.files[0] &&
                        e.target.files[0].name == "Book2.xlsx"
                      ) {
                        this.setState({ xlFile: e.target.files[0] });
                      } else {
                        alert("The Excel file should be name 'Book2.xslx'.");
                      }
                    }}
                  />
                  <Button
                    color={"primary"}
                    onClick={() => {
                      if (xlFile) {
                        if (window.confirm("Do You really want to upload?")) {
                          this.setState({ isUploading: true });
                          const progressFn = progresPercentage => {
                            this.setState({ progresPercentage });
                          };
                          const thenFn = res => {
                            this.setState({ isUploading: false });
                            alert("Items Saved Successfully");
                            history.push("/admin/itemList");
                          };
                          const errorFn = () => {
                            alert("error occurred while uploading.");
                            this.setState({ isUploading: false });
                          };
                          uploadFile(fileApi.uploadExcel, {
                            file: xlFile,
                            success: { fn: thenFn },
                            error: { fn: errorFn },
                            progress: { fn: progressFn }
                          });
                        }
                      } else {
                        alert("Choose an excel sheet first.");
                      }
                    }}
                  >
                    Upload
                  </Button>
                </div>
              )}
              {id ? null : isUploading ? (
                <div>
                  <span>{progresPercentage}</span>
                  <CircularProgress color="secondary" />
                </div>
              ) : (
                <div style={{ margin: 10, padding: 10, background: "white" }}>
                  <h5>Upload Excel To Delete Items</h5>
                  <input
                    type="file"
                    accept=".xlsx"
                    onChange={e => {
                      if (
                        e.target.files &&
                        e.target.files[0] &&
                        e.target.files[0].name == "Book2.xlsx"
                      ) {
                        this.setState({ xlFileD: e.target.files[0] });
                      } else {
                        alert("The Excel file should be name 'Book2.xslx'.");
                      }
                    }}
                  />
                  <Button
                    color={"primary"}
                    onClick={() => {
                      if (xlFileD) {
                        if (
                          window.confirm(
                            "Do You really want to delete these items?"
                          )
                        ) {
                          this.setState({ isUploading: true });
                          const progressFn = progresPercentage => {
                            this.setState({ progresPercentage });
                          };
                          const thenFn = res => {
                            this.setState({ isUploading: false });
                            alert("Items Deleted Successfully");
                            history.push("/admin/itemList");
                          };
                          const errorFn = () => {
                            alert("error occurred while uploading.");
                            this.setState({ isUploading: false });
                          };
                          uploadFile(fileApi.uploadItemExcelToDelete, {
                            file: xlFileD,
                            success: { fn: thenFn },
                            error: { fn: errorFn },
                            progress: { fn: progressFn }
                          });
                        }
                      } else {
                        alert("Choose an excel sheet first.");
                      }
                    }}
                  >
                    Upload
                  </Button>
                </div>
              )}
              {id ? null : <h3>Or</h3>}
              {isUploading ? null : (
                <AddItemForm addItem={newItem => this.addItem(newItem)} />
              )}
            </GridItem>
            <GridItem xs={12} sm={12} md={4}></GridItem>
          </GridContainer>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    // songs: getSongs(state) || []
  };
};
const mapDispatchToProps = dispatch => {
  return {
    // addSongs: payload => dispatch(addSongs(payload))
  };
};
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AddSong)
);
