import React, { Component } from "react";
import {
  Col,
  Row,
  Form,
  FormGroup,
  Label,
  Input,
  Progress
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
//regex - ([S|M|K|B|Sa|E]\s)?[0-9]+
class AddItemForm extends Component {
  constructor(props) {
    source = axios.CancelToken.source()
    super(props);
    this.state = {
      songsSelected:[],
      altName: undefined,
      inventory: 0,
      imageUrls: [""],
      name: undefined,
      category: "fruit",
      isFeatured: false,
      price: 0,
      unit: "1 kg",
      description: "",
      discount: 0, //percentage
      tax: 0,
      isVariant: false,
      emptyFields: {
        name: { empty: true, prestine: true },
        imageUrls: { empty: true, prestine: true }
      },
      categories: [
        { value: "fruit", name: "Fruit" },
        { value: "veggies", name: "Veggies" },
        { value: "cooking", name: "Cooking" },
        { value: "healthcare", name: "Healthcare" },
        { value: "homecare", name: "Homecare" },
        { value: "kids", name: "Kids" },
        { value: "others", name: "Others" }
      ],
      items: []
    };
  }
  isEmpty(type, id, value) {
    let newEmptyFields = _.cloneDeep(this.state.emptyFields);
    newEmptyFields[id].prestine = false;
    switch (type) {
      case "array":
        if (value[0] === "") {
          newEmptyFields[id].empty = true;
        } else {
          newEmptyFields[id].empty = false;
        }
        break;
      case "string":
        if (value === "") {
          newEmptyFields[id].empty = true;
        } else {
          newEmptyFields[id].empty = false;
        }
        break;
    }

    this.setState({ emptyFields: newEmptyFields });
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
    console.log(submitData);
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
  fetchConstants() {
    this.setState({ constantsLoading: true });
    const thenFn = res => {
      this.setState({
        genres: res && res.data&& res.data.genre,
        languages: res&&res.data&& res.data.language,
        constantsLoading: false
      });
    };
    const errorFn = error => {
      console.log(error);
      this.setState({ constantsLoading: false });
    };
    sendRequest(constantApi.getConstantList, {
      success: { fn: thenFn },
      error: { fn: errorFn }
    });
  }
  fetchItemDetails(id) {
    this.setState({ isLoading: true });
    const thenFn = res => {
      let { data } = res;
      let newData = data;
      console.log(newData);
      this.setState({
        ...newData,
        isLoading: false,
      }, ()=>{
        
    this.fetchPublisherList();
      });
    };
    const errorFn = error => {
      this.setState({ isLoading: false });
      alert("Something went wrong. Please try again later.");
    };
    sendRequest(adminApi.getPlaylist, {
      success: { fn: thenFn },
      error: { fn: errorFn },
      playlistId: id,
      adminId: cookies.get("userId")
    });
  }
  fetchPublisherList() {
    let {publisherId} = this.state;
    this.setState({ isPublishersLoading: true });
    const thenFn = res => {
      let { data } = res;
      console.log(publisherId,_.find(data, (item, index)=>item._id==publisherId));
      this.setState({
        publisherList: data,
        publisherSelected: publisherId?_.find(data, (item, index)=>item._id==publisherId):undefined,
        isPublishersLoading: false,
      },()=>{
      });
    };
    const errorFn = error => {
      this.setState({ isPublishersLoading: false });
      alert("Something went wrong. Please try again later.");
    };
    sendRequest(adminApi.getPublisher, {
      success: { fn: thenFn },
      error: { fn: errorFn },
      adminId: cookies.get("userId")
    });
  }
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
      alert("Something went wrong. Please try again later.");
    };
    await sendRequest(adminApi.searchSongs, {
      q: searchString,
      success: { fn: thenFn },
      error: { fn: errorFn },
      adminId: cookies.get("userId")
    });
  }
  componentDidMount() {
    this.fetchConstants(); //also fetch constants
    let { match } = this.props;
    let id = match && match.params && match.params.id;
    if (id) {
      this.fetchItemDetails(id);
    }
    else{
      
    this.fetchPublisherList();
    }
  }
  render() {
    const {
      isLoading,
      isSongsLoading,
      isPublisherAdderVisible,
      isPublishersLoading,
      isAlbumArtAdderVisible,
      albumArtId,
      publisherList,
      publisherSelected,
      searchSongList,
      songsSelected
    } = this.state;
    let { match } = this.props;
    let id = match && match.params && match.params.id;
    return (
      <div
        style={{
          background: "#fff",
          padding: 10
        }}
      >
      <GridContainer>
      <Label>Playlist Title</Label>
              <GridItem style={{display: "flex", flexDirection: "column"}}><CustomInput
              labelText="Playlist Title"
              id="title"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                value: this.state.title,
                onChange: e => {
                  this.setState({
                   title: e.target.value
                  });
                }
              }}
            /></GridItem>
              
              </GridContainer>
        {isLoading ? (
          <CircularProgress color="secondary" />
        ) : (
          <Form>
            <FormGroup>
            
            <GridContainer>
            <GridItem>
            <Label>Publisher</Label>
            {isPublishersLoading ? (
              <CircularProgress color="secondary" />
            ) :(<AutoCompleteInput
            keyExtractor={(item, index)=>item._id}
              label="Search Publishers"
              options={publisherList}
              objectKey="companyName"
              onChange={option => {
                this.setState({ publisherSelected: option }, ()=>{});
              }}
              value={this.state.publisherSelected}
            />)}<AddPublisher isVisible={isPublisherAdderVisible}
            onClose={(isSubmit)=>{this.setState({isPublisherAdderVisible: false}, ()=>{
              if(isSubmit){
                this.fetchPublisherList();
              }
            });}}
            /><Button
            color="primary"
            onClick={() => {
              this.setState({isPublisherAdderVisible: true});
            }}
          >
            Add New Publisher
          </Button>
            </GridItem>
            </GridContainer>
            </FormGroup>
            <FormGroup><GridContainer>
            <GridItem style={{display: "flex", flexDirection: "column"}}>
            
            <Label>Album Art</Label>
            <img style={{width: 100, height: 100}} src={albumArtId||"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAS1BMVEW1tbX///+2trbR0dGvr6/MzMyysrL7+/v19fXX19e/v7/i4uKpqamenp7BwcGioqLs7OyYmJjn5+eLi4vU1NTHx8eFhYWQkJDw8PA11woWAAADG0lEQVR4nO3c23aqMBSF4STGgALiier7P+kGD+1Wi1ddaznXmP9NB72J30gAibYheS+k4DsK8aMQPwrxoxA/CvGjED8K8aMQPwrxoxA/CvGjED8K8aMQPwrxoxA/CvGjED8K8aMQPwrxoxA/CvGjED8K8aMQPwrxoxA/CvGjED8K8aMQPwrxoxA/CvGjED8K8aPw7yuX9MZTF25WU4PegNrCcoxT+6w2orpwcRHW7oVxrTailbBRm0Qrod4kmglrrRuGmTA2SkQ7YTzqnIqGwnhUmUVLYVxpEE2FKueirTBug7jRWBirtTTRWhirQZhoLoxxKUv8AKEw0U5Y/xBFF6qdcEj/XW4ER7QTLtt++33TEJxEQ2FO3fJ+sJAjWgpDatf3k9KpMKR8Pxk3YiPaCsfj2yzKvQm3FoZ83V6sW6kRzYWhXG+MnoXX34g98NsLQ/E+hyFvvQtLMx32Uq/jU4TVzruw8TyH+TweDa1nYTUeiS3STxBO79vOnoVleoRaiy3STxDuJa+knyAM42l47BwLL4u0c7qLcf3NOIUrwUVqLxwf8vcHn7uJd2G/+8qSr8FcGFJJoi/BXigdhX+dV+Ht+5Z5/OFSWMKw2tZj52YZHApLaqr4XXX2Jhx98fecCMtQzQCdCMtyzhfj4EFYhnlgFP+ayS1R4foNUPDztMckhWX7Tig27FOSws07YJTbmXlMUDhtwLzp5EA4e6OYagS3Zh4SFL69zsRW68v6VsJGa5FKCtMbYHXy8PcWuZ4XdmIfNb0keaU5zgJ7ye3Dp0Tv+DMX0/NO6zo6JSr8/Vqz+NJbokH6nXd6ncV9fxDdHn1J+Ompf3r+bdpxAnX3voSfgFPXr+7zWO03p4O2T34XI5Xu1Oe0Trk7HLqs7tPYiUqp5Lbv21ySgU9pvzRdkh/n98GV97z1oxA/CvGjED8K8aMQPwrxoxA/CvGjED8K8aMQPwrxoxA/CvGjED8K8aMQPwrxoxA/CvGjED8K8aMQPwrxoxA/CvGjED8K8aMQPwrxoxA/CvGjED8K8aMQPwrxoxC/dPunFY77B+gCGJm/tIG1AAAAAElFTkSuQmCC"}/>
              {isAlbumArtAdderVisible?<SelectImage isVisible={isAlbumArtAdderVisible}
              publisherId={publisherSelected&&publisherSelected._id}
              onSubmit={(image)=>{
                this.setState({albumArtId: image,isAlbumArtAdderVisible: false});
              }}
              onClose={()=>{this.setState({isAlbumArtAdderVisible: false}, ()=>{
                
              });}}/>:null}
              <Button
            disabled={publisherSelected?false:true}
            color="primary"
            onClick={() => {
              this.setState({isAlbumArtAdderVisible: true});
            }}
          >
            Change Album Art
          </Button>
            </GridItem></GridContainer>
            </FormGroup>
            <FormGroup><GridContainer>
            <GridItem>
            <Label>Add Songs</Label>
            <DraggableList
            itemKey={(item)=>item._id}
            template={SongItem}
            list={songsSelected||[]}
            commonProps={{onDelete:(itemId)=>{
              let confirm = window.confirm("Removing song from this playlist?");
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
              <AutocompleteSelectorInputSearch
              label="search song"
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
                this.setState({ songsSelected: newSongsSelected});
              }}
              />
              </GridItem>
              
              </GridContainer>
              
            </FormGroup>
            <div>
              <Button
                color={"primary"}
                onClick={() => (id ? this.submitUpdate() : this.submit())}
                disabled={isLoading}
              >
                {id ? "Update Playlist" : "Add Playlist"}
              </Button>
            </div>
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
