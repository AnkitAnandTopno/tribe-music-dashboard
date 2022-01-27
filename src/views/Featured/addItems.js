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
        
        <AddItemForm addItem={newItem => this.addItem(newItem)} />
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
