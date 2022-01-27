import React, { Component } from "react";
import {
  Col,
  Row,
  Form,
  FormGroup,
  Label,
  Input,
  Progress,
  Spinner
} from "reactstrap";
import { connect } from "react-redux";
import _ from "lodash";
import { NavLink, withRouter } from "react-router-dom";
import Button from "components/CustomButtons/Button.js";
import SimpleIcon from "components/simpleIcon/simpleIcon.js";
import Modal from "components/Modal/modal.js";
import SelectorInput from "components/CustomInput/selectorInput.js";
import AutoCompleteInput from "components/CustomInput/autocompleteSelectorInput.js";
import AutocompleteSelectorInputSearch from "components/CustomInput/autocompleteSelectorInputSearch.js";
import SongUploader from "components/CustomInput/songUploader";
import CustomInput from "components/CustomInput/CustomInput";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import CustomCheckbox from "components/CustomInput/CustomCheckbox";
import { Checkbox, CircularProgress } from "@material-ui/core";
import { sendRequest } from "utills/util";
import { itemApi } from "constant/api";
import Cookies from "universal-cookie";
import UnitInput from "components/CustomInput/unitInput";
import { categoriesApi } from "constant/api";
import AddPublisher from "./addPublisher";
import AddArtist from "./addArtist";
import SelectImage from "./selectImage";
import { adminApi, constantApi } from "constant/api";
import axios from "axios";
import DraggableList from "react-draggable-list";

let source;

const cookies = new Cookies();

class SongItem extends React.Component {
  state = {
    value: 0,
  };

  _inc() {
    this.setState({
      value: this.state.value + 1,
    });
  }

  getDragHeight() {
    return this.props.item.subtitle ? 47 : 28;
  }

  render() {
    const { item, itemSelected, dragHandleProps, testProp, commonProps } = this.props;
    const { value } = this.state;
    const scale = itemSelected * 0.05 + 1;
    const shadow = itemSelected * 15 + 1;
    const dragged = itemSelected !== 0;

    return (
      <div style={{
        backgroundColor: "rgb(255,255,255)",
        boxShadow: `rgba(0, 0, 0, 0.3) 0px ${shadow}px ${2 * shadow}px 0px`,
        display: "flex", flexDirection: "row"}} {...dragHandleProps}>
                <div style={{flex: 1}}>
                  <img src={item.albumArtId} style={{width: 30, height: 30}}/>
                </div>
                <div style={{flex: 2}}>
                  <h6>{item.name}</h6>
                  <audio controls id={item._id}>
                          <source src={item.songUrl} type="audio/mpeg" />
                        </audio>
                </div>
                <div style={{flex: 1}}>
                  <SimpleIcon onClick={()=>{commonProps&&commonProps.onDelete(item._id)}} iconColor="danger" iconName="mdi-close"/>
                </div>
              </div>
      
    );
  }
}
class ArtistItem extends React.Component {
  state = {
    value: 0,
  };

  _inc() {
    this.setState({
      value: this.state.value + 1,
    });
  }

  getDragHeight() {
    return this.props.item.subtitle ? 47 : 28;
  }

  render() {
    const { item, itemSelected, dragHandleProps, testProp, commonProps } = this.props;
    const { value } = this.state;
    const scale = itemSelected * 0.05 + 1;
    const shadow = itemSelected * 15 + 1;
    const dragged = itemSelected !== 0;

    return (
      <div style={{
        backgroundColor: "rgb(255,255,255)",
        boxShadow: `rgba(0, 0, 0, 0.3) 0px ${shadow}px ${2 * shadow}px 0px`}} {...dragHandleProps}>
                  <img src={item.pictureUrl} style={{width: 50, height: 50}}/>
                <div style={{flex: 2}}>
                  <h6>{item.name}</h6>
                </div>
                <div style={{flex: 1}}>
                <SimpleIcon onClick={()=>{commonProps&&commonProps.onDelete(item._id)}} iconColor="danger" iconName="mdi-close"/>
                 </div>
              </div>
      
    );
  }
}
class PlaylistItem extends React.Component {
  state = {
    value: 0,
  };

  _inc() {
    this.setState({
      value: this.state.value + 1,
    });
  }

  getDragHeight() {
    return this.props.item.subtitle ? 47 : 28;
  }

  render() {
    const { item, itemSelected, dragHandleProps, testProp, commonProps } = this.props;
    const { value } = this.state;
    const scale = itemSelected * 0.05 + 1;
    const shadow = itemSelected * 15 + 1;
    const dragged = itemSelected !== 0;

    return (
      <div style={{
        backgroundColor: "rgb(255,255,255)",
        boxShadow: `rgba(0, 0, 0, 0.3) 0px ${shadow}px ${2 * shadow}px 0px`}} {...dragHandleProps}>
                  <img src={item.albumArtId} style={{width: 50, height: 50}}/>
                <div style={{flex: 2}}>
                  <h6>{item.title}</h6>
                </div>
                <div style={{flex: 1}}>
                <SimpleIcon onClick={()=>{commonProps&&commonProps.onDelete(item._id)}} iconColor="danger" iconName="mdi-close"/>
                <SimpleIcon onClick={()=>{commonProps&&commonProps.onEdit(item._id)}} iconColor="danger" iconName="mdi-pencil"/>
                </div>
              </div>
      
    );
  }
}
//regex - ([S|M|K|B|Sa|E]\s)?[0-9]+
class AddItemForm extends Component {
  constructor(props) {
    source = axios.CancelToken.source()
    super(props);
    this.state = {
     songsSelected:[],
     artistsSelected:[],
     playlistsSelected: []
    };
  }
  
  submit = () => {
    let state = this.state;
    let submitData = {
      title: state&&state.title,
      publisherId: state&&state.publisherSelected&&state.publisherSelected._id,
      albumArtId: state&&state.albumArtId,
      songIds: _.map(state&&state.songsSelected||[], (item, index)=>item._id),
        adminId: cookies.get("userId"),
        isAlbum: state&&state.isAlbum
    };

      this.setState({ isLoading: true });
      const thenFn = res => {
        this.setState({
          
      title: "",
      songs: undefined,
        isLoading: false
        });
        alert("Playlist Added Successfully.")
      };
      const errorFn = (error) => {
        this.setState({ isLoading: false });
        alert(error);
      };
      sendRequest(adminApi.addPlaylist, {
        ...submitData,
        success: { fn: thenFn },
        error: { fn: errorFn }
      });
  };

  submitUpdate = () => {
    let { match, history } = this.props;
    let id = match && match.params && match.params.id;
    let state = this.state;
    let submitData = {
      title: state&&state.title,
      publisherId: state&&state.publisherSelected&&state.publisherSelected._id,
      albumArtId: state&&state.albumArtId,
      songIds: _.map(state&&state.songsSelected||[], (item, index)=>item._id),
        isAlbum: state&&state.isAlbum
    };
      this.setState({ isLoading: true });
      const thenFn = res => {
        this.setState({
          
      title: "",
      songs: undefined,
        isLoading: false
        });
        alert("Playlist Updated Successfully.")
      };
      const errorFn = (error) => {
        this.setState({ isLoading: false });
        alert(error);
      };
      sendRequest(adminApi.updatePlaylist, {
        playlistId: id,
        ...submitData,
        success: { fn: thenFn },
        error: { fn: errorFn }
      });
  };
  fetchFeaturedSong() {
    this.setState({ isFeaturedSongLoading: true });
    
    const thenFn = res => {
      let { data } = res;
      this.setState({
        isFeaturedSongLoading: false,
        songsSelected: data
      },()=>{
      });
    };
    const errorFn = error => {
      this.setState({ isFeaturedSongLoading: false });
      alert("Something went wrong. Please try again later.");
    };
    sendRequest(adminApi.fetchSongFeatured, {
      success: { fn: thenFn },
      error: { fn: errorFn }
    });
  };
  fetchFeaturedArtist() {
    this.setState({ isFeaturedArtistLoading: true });
    
    const thenFn = res => {
      let { data } = res;
      this.setState({
        isFeaturedArtistLoading: false,
        artistsSelected: data
      },()=>{
      });
    };
    const errorFn = error => {
      this.setState({ isFeaturedArtistLoading: false });
      alert("Something went wrong. Please try again later.");
    };
    sendRequest(adminApi.fetchArtistFeatured, {
      success: { fn: thenFn },
      error: { fn: errorFn }
    });
  };
  fetchFeaturedPlaylist() {
    this.setState({ isFeaturedPlaylistLoading: true });
    
    const thenFn = res => {
      let { data } = res;
      this.setState({
        isFeaturedPlaylistLoading: false,
        playlistsSelected: data
      },()=>{
      });
    };
    const errorFn = error => {
      this.setState({ isFeaturedPlaylistLoading: false });
      alert("Something went wrong. Please try again later.");
    };
    sendRequest(adminApi.fetchPlaylistFeatured, {
      success: { fn: thenFn },
      error: { fn: errorFn }
    });
  };
  
  async searchSongs(searchString) {
    source.cancel();
    this.setState({ isSongsLoading: false });
    const thenFn = res => {
      let { data } = res;
      this.setState({
        searchSongList: data,
        isSongsLoading: false,
      });
    };
    const errorFn = error => {
      this.setState({ isSongsLoading: false });
      console.log(error);
    };
    await sendRequest(adminApi.searchSongs, {
      q: searchString,
      success: { fn: thenFn },
      error: { fn: errorFn },
      adminId: cookies.get("userId")
    });
  }
  async searchArtists(searchString) {
    source.cancel();
    this.setState({ isArtistsLoading: false });
    const thenFn = res => {
      let { data } = res;
      console.log(data);
      this.setState({
        searchArtistList: data,
        isArtistsLoading: false,
      });
    };
    const errorFn = error => {
      this.setState({ isArtistsLoading: false });
      console.log(error);
    };
    await sendRequest(adminApi.searchArtists, {
      q: searchString,
      success: { fn: thenFn },
      error: { fn: errorFn },
      adminId: cookies.get("userId")
    });
  }
  async searchPlaylists(searchString) {
    source.cancel();
    this.setState({ isPlaylistsLoading: false });
    const thenFn = res => {
      let { data } = res;
      console.log(data);
      this.setState({
        searchPlaylistList: data,
        isPlaylistsLoading: false,
      });
    };
    const errorFn = error => {
      this.setState({ isPlaylistsLoading: false });
      console.log(error);
    };
    await sendRequest(adminApi.searchPlaylists, {
      q: searchString,
      success: { fn: thenFn },
      error: { fn: errorFn },
      adminId: cookies.get("userId")
    });
  }

  //update song feature
  updateSongFeatured(){
    let {songsSelected, isFeaturedSongLoading} = this.state;
    let featuredSongs = _.map(songsSelected, (item, index)=>{return {itemId: item._id, rank: index};});
    this.setState({ isFeaturedSongLoading: true });
    
    const thenFn = res => {
      let { data } = res;
      alert("Featured Song successfully Updated");
      this.setState({
        isFeaturedSongLoading: false,
      },()=>{
      });
    };
    const errorFn = error => {
      this.setState({ isFeaturedSongLoading: false });
      alert("Something went wrong. Please try again later.");
    };
    sendRequest(adminApi.updateSongFeatured, {
      success: { fn: thenFn },
      error: { fn: errorFn },
      song: featuredSongs
    });
  }

  //update artist feature
  updateArtistFeatured(){
    let {artistsSelected} = this.state;
    let featuredArtists = _.map(artistsSelected, (item, index)=>{return {itemId: item._id, rank: index};});

    this.setState({ isFeaturedArtistLoading: true });
    
    const thenFn = res => {
      let { data } = res;
      alert("Featured Artist successfully Updated");
      this.setState({
        isFeaturedArtistLoading: false,
      },()=>{
      });
    };
    const errorFn = error => {
      this.setState({ isFeaturedArtistLoading: false });
      alert("Something went wrong. Please try again later.");
    };
    sendRequest(adminApi.updateArtistFeatured, {
      success: { fn: thenFn },
      error: { fn: errorFn },
      artist: featuredArtists
    });
  }

  //update playlist feature
  updatePlaylistFeatured(){
    let { playlistsSelected} = this.state;
    let featuredPlaylists = _.map(playlistsSelected, (item, index)=>{return {itemId: item._id, rank: index};});

    this.setState({ isFeaturedPlaylistLoading: true });
    
    const thenFn = res => {
      let { data } = res;
      alert("Featured Playlist successfully Updated");
      this.setState({
        isFeaturedPlaylistLoading: false,
      },()=>{
      });
    };
    const errorFn = error => {
      this.setState({ isFeaturedPlaylistLoading: false });
      alert("Something went wrong. Please try again later.");
    };
    sendRequest(adminApi.updatePlaylistFeatured, {
      success: { fn: thenFn },
      error: { fn: errorFn },
      playlist: featuredPlaylists
    });
  }

  componentDidMount() {
    this.fetchFeaturedSong();
    this.fetchFeaturedArtist();
    this.fetchFeaturedPlaylist();
    
  }
  render() {
    const {
      isLoading,
      isSongsLoading,
      isArtistsLoading,
      isPlaylistsLoading,
      isFeaturedSongLoading,
      isFeaturedArtistLoading,
      isFeaturedPlaylistLoading,
      isPublisherAdderVisible,
      isPublishersLoading,
      isAlbumArtAdderVisible,
      albumArtId,
      publisherList,
      publisherSelected,
      searchSongList,
      songsSelected,
      searchArtistList,
      artistsSelected,
      searchPlaylistList,
      playlistsSelected,
    } = this.state;
    let { match, history } = this.props;
    let id = match && match.params && match.params.id;
    return (
      <div
        style={{
          background: "#fff",
          padding: 10
        }}
      >
      
        {isLoading ? (
          <CircularProgress color="secondary" />
        ) : (
          <Form>
            
            <FormGroup>
            <Label>Featured Songs</Label><GridContainer style={{borderBottom: "1px solid #444"}}>
            {isFeaturedSongLoading?<CircularProgress color="secondary" />:<GridItem>
            
            <AutocompleteSelectorInputSearch
            label="search song to add"
            searchList={searchSongList}
            onType={(searchText)=>{
              this.searchSongs(searchText);
            }}
            objectKey="name" 
            keyExtractor={(item)=>{
              try{return item._id;}
              catch(err){
                console.error("Error"+err);
              }
            }}
            thumbnailUrlKey="albumArtId"
            isLoading={isSongsLoading}
            onChange={(value)=>{
              let {songsSelected} = this.state;
              let newSongsSelected = _.concat(songsSelected, [value]);
              console.log(newSongsSelected);
              this.setState({ songsSelected: newSongsSelected});
            }}
            />
            <DraggableList
            itemKey={(item, index)=>item&&item._id||index}
            template={SongItem}
            list={songsSelected||[]}
            commonProps={{onDelete:(itemId)=>{
              let confirm = window.confirm("Removing song from Featured?");
              if(confirm){
                
                let {songsSelected} = this.state;
                let newSongsSelected = _.filter(songsSelected, (item, index)=>item._id!=itemId);
                this.setState({ songsSelected: newSongsSelected});
              }
              else{

              }
            }}}
            onMoveEnd={(newList) => {
              this.setState({songsSelected: newList});
            }}
            
          />
              </GridItem>}
              <GridItem>
                
              <div>
              <Button
                color={"primary"}
                onClick={() => (this.updateSongFeatured())}
                disabled={isSongsLoading}
              >
                Update Featured Song
              </Button>
            </div>
              </GridItem>
              </GridContainer>
              <Label>Featured Artists</Label>
              <GridContainer style={{borderBottom: "1px solid #444"}}>
              {isFeaturedArtistLoading?<CircularProgress color="secondary" />:<GridItem>
              
              <AutocompleteSelectorInputSearch
              label="search artist to add"
              searchList={searchArtistList}
              onType={(searchText)=>{
                this.searchArtists(searchText);
              }}
              objectKey="name" 
              keyExtractor={(item)=>{
                try{return item._id;}
                catch(err){
                  console.error("Error"+err);
                }
              }}
              thumbnailUrlKey="pictureUrl"
              isLoading={isSongsLoading}
              onChange={(value)=>{
                let {artistsSelected} = this.state;
                let newArtistsSelected = _.concat(artistsSelected, [value]);
                this.setState({ artistsSelected: newArtistsSelected});
              }}
              />
              <DraggableList
              itemKey={(item)=>item._id}
              template={ArtistItem}
              list={artistsSelected||[]}
              commonProps={{onDelete:(itemId)=>{
                let confirm = window.confirm("Removing artist from featured?");
                if(confirm){
                  
                  let {artistsSelected} = this.state;
                  let newArtistsSelected = _.filter(artistsSelected, (item, index)=>item._id!=itemId);
                  this.setState({ artistsSelected: newArtistsSelected});
                }
                else{
  
                }
              },
              onEdit: (itemId)=>{
                history.push(`/admin/addPlaylist/${itemId}`);
              }
            }}
              onMoveEnd={(newList) => {
                this.setState({artistsSelected: newList});
              }}
              
            />
                </GridItem>}
                
              <GridItem>
                
              <div>
              <Button
                color={"primary"}
                onClick={() => (this.updateArtistFeatured())}
                disabled={isArtistsLoading}
              >
                Update Featured Artist
                              </Button>
            </div>
              </GridItem>
                </GridContainer>
                
              <Label>Featured Playlists</Label>
              <GridContainer style={{borderBottom: "1px solid #444"}}>
              {isFeaturedPlaylistLoading?<CircularProgress color="secondary" />:<GridItem>
              
              <AutocompleteSelectorInputSearch
              label="search playlist to add"
              searchList={searchPlaylistList}
              onType={(searchText)=>{
                this.searchPlaylists(searchText);
              }}
              objectKey="title" 
              keyExtractor={(item)=>{
                try{return item._id;}
                catch(err){
                  console.error("Error"+err);
                }
              }}
              thumbnailUrlKey="albumArtId"
              isLoading={isPlaylistsLoading}
              onChange={(value)=>{
                let {playlistsSelected} = this.state;
                let newPlaylistsSelected = _.concat(playlistsSelected, [value]);
                this.setState({ playlistsSelected: newPlaylistsSelected});
              }}
              />
              <DraggableList
              itemKey={(item)=>item._id}
              template={PlaylistItem}
              list={playlistsSelected||[]}
              commonProps={{onDelete:(itemId)=>{
                let confirm = window.confirm("Removing playlist from featured?");
                if(confirm){
                  
                  let {playlistsSelected} = this.state;
                  let newPlaylistsSelected = _.filter(playlistsSelected, (item, index)=>item._id!=itemId);
                  this.setState({ playlistsSelected: newPlaylistsSelected});
                }
                else{
  
                }
              },
              onEdit: (itemId)=>{
                history.push(`/admin/addPlaylist/${itemId}`);
              }
            }}
              onMoveEnd={(newList) => {
                this.setState({playlistsSelected: newList});
              }}
              
            />
                </GridItem>}
                
              <GridItem>
                
              <div>
              <Button
                color={"primary"}
                onClick={() => (this.updatePlaylistFeatured())}
                disabled={isPlaylistsLoading}
              >
                Update Featured Playlist
              </Button>
            </div>
              </GridItem>
                </GridContainer>
                
              
            </FormGroup>
            
          </Form>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {};
};
const mapDispatchToProps = dispatch => {
  return {};
};
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AddItemForm)
);
