import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import CircularProgress from "@material-ui/core/CircularProgress";
import CustomInput from "components/CustomInput/CustomInput.js";
import SongCard from "components/SongComponent/songCard";
import SongPreview from "components/SongComponent/songPreview";
import { getSongs } from "modules/songs/reducer";
import { sendRequest } from "utills/util";
import { itemApi } from "constant/api";
import { setSongs } from "modules/songs/reducer";
//regex - ([S|M|K|B|Sa|E]\s)?[0-9]+
class SongListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      lastScrollY: 0,
      isModal: false,
      activeSong: {},
      songList: []
    };
  }
  toggleModal() {
    this.setState(prevState => ({
      activeSong: {}
    }));
  }
  updateSong(song, songIndex) {
    let newSongListMain = _.cloneDeep(this.props.songList);
    newSongListMain[songIndex] = song;
    this.props.setSongs(newSongListMain);
    this.setState({ activeSong: song });
  }
  filterByNumber(searchSongNumber) {
    var regex = /[0-9]+/;
    let {
      songBhojpuri,
      songEnglish,
      songHindi,
      songKurukh,
      songMundari,
      songSadri,
      songSanthaliEnglish,
      songSanthaliHindi
    } = this.props;
    let songList = {
      songBhojpuri,
      songEnglish,
      songHindi,
      songKurukh,
      songMundari,
      songSadri,
      songSanthaliEnglish,
      songSanthaliHindi
    };
    if (searchSongNumber !== "") {
      songList.songBhojpuri = _.filter(
        songBhojpuri,
        (item, index) => item.newNum.indexOf(searchSongNumber) >= 0
      );
      songList.songEnglish = _.filter(
        songEnglish,
        (item, index) => item.newNum.indexOf(searchSongNumber) >= 0
      );
      songList.songHindi = _.filter(
        songHindi,
        (item, index) => item.newNum.indexOf(searchSongNumber) >= 0
      );
      songList.songKurukh = _.filter(
        songKurukh,
        (item, index) => item.newNum.indexOf(searchSongNumber) >= 0
      );
      songList.songMundari = _.filter(
        songMundari,
        (item, index) => item.newNum.indexOf(searchSongNumber) >= 0
      );
      songList.songSadri = _.filter(
        songSadri,
        (item, index) => item.newNum.indexOf(searchSongNumber) >= 0
      );
      songList.songSanthaliHindi = _.filter(
        songSanthaliHindi,
        (item, index) => item.newNum.indexOf(searchSongNumber) >= 0
      );
      songList.songSanthaliEnglish = _.filter(
        songSanthaliEnglish,
        (item, index) => item.newNum.indexOf(searchSongNumber) >= 0
      );
    }
    this.setState({ songList });
  }
  componentDidMount() {
    let { setSongs } = this.props;
    this.setState({ isLoading: true });
    const thenFn = result => {
      setSongs(result && result.data&& result.data.songs||[]);
      this.setState({ isLoading: false });
      this.filterByNumber("");
    };
    const errorFn = () => {
      this.setState({ isLoading: false });
    };
    sendRequest(itemApi.getSongs, {
      success: { fn: thenFn },
      error: { fn: errorFn }
    });
  }
  render() {
    let { isLoading, songList } = this.state;
    let {
      songBhojpuri,
      songEnglish,
      songHindi,
      songKurukh,
      songMundari,
      songSadri,
      songSanthaliEnglish,
      songSanthaliHindi
    } = songList;
    return isLoading ? (
      <CircularProgress color="secondary" />
    ) : (
      <div style={{ paddingLeft: 10 }}>
        <CustomInput
          labelText="Search by Number"
          id="searchByNumber"
          formControlProps={{
            fullWidth: true
          }}
          inputProps={{
            onChange: e => {
              this.filterByNumber(e.target.value);
            }
          }}
        />
        <h4>Hindi</h4>
        <br />
        <div style={{ width: "100%", display: "flex", flexWrap: "wrap" }}>
          {_.map(songHindi, (item, index) => (
            <div key={item._id}>
              <div style={{ width: 250 }}>
                <SongCard
                  hindi={item.hindi}
                  songName={item.songName}
                  newNo={item.newNum}
                  oldNo={item.oldNum}
                  isDeletable={true}
                  onDelete={() => {}}
                  onClick={() => {
                    console.log(item);
                    this.setState({ activeSong: item, activeIndex: index });
                  }}
                />
              </div>
              <SongPreview
                toggle={() => this.toggleModal()}
                updateSong={song => this.updateSong(song, index)}
                isModal={this.state.activeSong.songName === item.songName}
                {...item}
                isSongList={true}
                activeSong={this.state.activeSong}
              />
            </div>
          ))}
        </div>
        <br />
        <h4>Sadri</h4>
        <br />
        <div style={{ width: "100%", display: "flex", flexWrap: "wrap" }}>
          {_.map(songSadri, (item, index) => (
            <div key={item._id}>
              <div style={{ width: 250 }}>
                <SongCard
                  hindi={item.hindi}
                  songName={item.songName}
                  newNo={item.newNum}
                  oldNo={item.oldNum}
                  isDeletable={true}
                  onDelete={() => this.props.onDelete(index)}
                  onClick={() => {
                    this.setState({ activeSong: item, activeIndex: index });
                  }}
                />
              </div>
              <SongPreview
                toggle={() => this.toggleModal()}
                updateSong={song => this.updateSong(song, index)}
                isModal={this.state.activeSong.songName === item.songName}
                {...item}
                isSongList={true}
                activeSong={this.state.activeSong}
              />
            </div>
          ))}
        </div>
        <br />
        <h4>Mundari</h4>
        <br />
        <div style={{ width: "100%", display: "flex", flexWrap: "wrap" }}>
          {_.map(songMundari, (item, index) => (
            <div key={item._id}>
              <div style={{ width: 250 }}>
                <SongCard
                  hindi={item.hindi}
                  songName={item.songName}
                  newNo={item.newNum}
                  oldNo={item.oldNum}
                  isDeletable={true}
                  onDelete={() => this.props.onDelete(index)}
                  onClick={() => {
                    this.setState({ activeSong: item, activeIndex: index });
                  }}
                />
              </div>
              <SongPreview
                toggle={() => this.toggleModal()}
                updateSong={song => this.updateSong(song, index)}
                isModal={this.state.activeSong.songName === item.songName}
                {...item}
                isSongList={true}
                activeSong={this.state.activeSong}
              />
            </div>
          ))}
        </div>
        <br />
        <h4>Bhojpuri</h4>
        <br />
        <div style={{ width: "100%", display: "flex", flexWrap: "wrap" }}>
          {_.map(songBhojpuri, (item, index) => (
            <div key={item._id}>
              <div style={{ width: 250 }}>
                <SongCard
                  hindi={item.hindi}
                  songName={item.songName}
                  newNo={item.newNum}
                  oldNo={item.oldNum}
                  isDeletable={true}
                  onDelete={() => this.props.onDelete(index)}
                  onClick={() => {
                    this.setState({ activeSong: item, activeIndex: index });
                  }}
                />
              </div>
              <SongPreview
                toggle={() => this.toggleModal()}
                updateSong={song => this.updateSong(song, index)}
                isModal={this.state.activeSong.songName === item.songName}
                {...item}
                isSongList={true}
                activeSong={this.state.activeSong}
              />
            </div>
          ))}
        </div>
        <br />
        <h4>KURUKH</h4>
        <br />
        <div style={{ width: "100%", display: "flex", flexWrap: "wrap" }}>
          {_.map(songKurukh, (item, index) => (
            <div key={item._id}>
              <div style={{ width: 250 }}>
                <SongCard
                  hindi={item.hindi}
                  songName={item.songName}
                  newNo={item.newNum}
                  oldNo={item.oldNum}
                  isDeletable={true}
                  onDelete={() => this.props.onDelete(index)}
                  onClick={() => {
                    this.setState({ activeSong: item, activeIndex: index });
                  }}
                />
              </div>
              <SongPreview
                toggle={() => this.toggleModal()}
                updateSong={song => this.updateSong(song, index)}
                isModal={this.state.activeSong.songName === item.songName}
                {...item}
                isSongList={true}
                activeSong={this.state.activeSong}
              />
            </div>
          ))}
        </div>
        <br />
        <h4>Santhali</h4>
        <br />
        <div style={{ width: "100%", display: "flex", flexWrap: "wrap" }}>
          {_.map(songSanthaliHindi, (item, index) => (
            <div key={item._id}>
              <div style={{ width: 250 }}>
                <SongCard
                  hindi={item.hindi}
                  songName={item.songName}
                  newNo={item.newNum}
                  oldNo={item.oldNum}
                  isDeletable={true}
                  onDelete={() => this.props.onDelete(index)}
                  onClick={() => {
                    this.setState({ activeSong: item, activeIndex: index });
                  }}
                />
              </div>
              <SongPreview
                toggle={() => this.toggleModal()}
                updateSong={song => this.updateSong(song, index)}
                isModal={this.state.activeSong.songName === item.songName}
                {...item}
                isSongList={true}
                activeSong={this.state.activeSong}
                updateSong={song => {
                  console.log(song);
                }}
              />
            </div>
          ))}
        </div>
        <br />
        <h4>English</h4>
        <br />
        <div style={{ width: "100%", display: "flex", flexWrap: "wrap" }}>
          {_.map(songEnglish, (item, index) => (
            <div key={item._id}>
              <div style={{ width: 250 }}>
                <SongCard
                  hindi={item.hindi}
                  songName={item.songName}
                  newNo={item.newNum}
                  oldNo={item.oldNum}
                  isDeletable={true}
                  onDelete={() => this.props.onDelete(index)}
                  onClick={() => {
                    this.setState({ activeSong: item, activeIndex: index });
                  }}
                />
              </div>
              <SongPreview
                toggle={() => this.toggleModal()}
                updateSong={song => this.updateSong(song, index)}
                isModal={this.state.activeSong.songName === item.songName}
                {...item}
                isSongList={true}
                activeSong={this.state.activeSong}
              />
            </div>
          ))}
        </div>
        <br />
        <h4>Santhali</h4>
        <br />
        <div style={{ width: "100%", display: "flex", flexWrap: "wrap" }}>
          {_.map(songSanthaliEnglish, (item, index) => (
            <div key={item._id}>
              <div style={{ width: 250 }}>
                <SongCard
                  hindi={item.hindi}
                  songName={item.songName}
                  newNo={item.newNum}
                  oldNo={item.oldNum}
                  isDeletable={true}
                  onDelete={() => this.props.onDelete(index)}
                  onClick={() => {
                    this.setState({ activeSong: item, activeIndex: index });
                  }}
                />
                <SongPreview
                  toggle={() => this.toggleModal()}
                  updateSong={song => this.updateSong(song, index)}
                  isModal={this.state.activeSong.songName === item.songName}
                  {...item}
                  isSongList={true}
                  activeSong={this.state.activeSong}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    songList: getSongs(state) || [],
    songHindi:
      _.filter(
        getSongs(state) || [],
        (item, index) =>
          item.hindi && (item.newNum && item.newNum.split(" ")[1] == undefined)
      ) || [],
    songSadri:
      _.filter(
        getSongs(state) || [],
        (item, index) =>
          item.hindi && (item.newNum && item.newNum.split(" ")[0] === "S")
      ) || [],
    songMundari:
      _.filter(
        getSongs(state) || [],
        (item, index) =>
          item.hindi && (item.newNum && item.newNum.split(" ")[0] === "M")
      ) || [],
    songKurukh:
      _.filter(
        getSongs(state) || [],
        (item, index) =>
          item.hindi && (item.newNum && item.newNum.split(" ")[0] === "K")
      ) || [],
    songBhojpuri:
      _.filter(
        getSongs(state) || [],
        (item, index) =>
          item.hindi && (item.newNum && item.newNum.split(" ")[0] === "B")
      ) || [],
    songSanthaliHindi:
      _.filter(
        getSongs(state) || [],
        (item, index) =>
          item.hindi && (item.newNum && item.newNum.split(" ")[0] === "Sa")
      ) || [],
    songSanthaliEnglish:
      _.filter(
        getSongs(state) || [],
        (item, index) =>
          !item.hindi && (item.newNum && item.newNum.split(" ")[0] === "Sa")
      ) || [],
    songEnglish:
      _.filter(
        getSongs(state) || [],
        (item, index) =>
          !item.hindi && (item.newNum && item.newNum.split(" ")[0] === "E")
      ) || []
  };
};
const mapDispatchToProps = dispatch => {
  return {
    setSongs: payload => dispatch(setSongs(payload))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SongListComponent);
