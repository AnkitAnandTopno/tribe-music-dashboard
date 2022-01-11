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
import Uploader from "components/CustomInput/uploader";
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
import { adminApi } from "constant/api";
import { fileApi } from "constant/api";

const cookies = new Cookies();

//regex - ([S|M|K|B|Sa|E]\s)?[0-9]+
class SelectImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
  addAlbumArt = (link) => {
    let {onClose, publisherId} = this.props;
    this.setState({ isLoading: true });
      const thenFn = res => {
        this.setState({
        selectedAlbumArt: link,
        albumArts:res&&res.data||[],
        isLoading: false});
      };
      const errorFn = (err) => {
          console.log(err);
        this.setState({ isLoading: false });
      };
      sendRequest(adminApi.addAlbumArt, {
        publisherId,      
        adminId: cookies.get("userId"),
        albumArtUrl: link,
        success: { fn: thenFn },
        error: { fn: errorFn }
      });
  };

  submitUpdate = () => {
    let { match, history } = this.props;
    let id = match && match.params && match.params.id;
    let checkState = _.cloneDeep(this.state);
    checkState = _.omit(checkState, [
      "emptyFields",
      "isLoading",
      "categories",
      "items",
      "categoryLoading"
    ]);
    if (
      _.filter(this.state.emptyFields, (value, key) => value.empty).length > 0
    ) {
      alert("Some Fields Seems Empty. Please Check.");
    } else {
      this.setState({ isLoading: true });
      const thenFn = res => {
        this.setState({
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
          isVariant: false,
          parentItem: {},
          emptyFields: {
            altName: { empty: true, prestine: true },
            name: { empty: true, prestine: true },
            imageUrls: { empty: true, prestine: true }
          },
          isLoading: false
        });
        history.push("/admin/itemList");
      };
      const errorFn = () => {
        this.setState({ isLoading: false });
        alert("Something went wrong. Please try again later.");
      };
      sendRequest(itemApi.updateItem, {
        id,
        item: checkState,
        success: { fn: thenFn },
        error: { fn: errorFn }
      });
    }
  };
  fetchCategories() {
    this.setState({ categoriesLoading: true });
    const thenFn = res => {
      this.setState({
        categories: res && res.data,
        categoriesLoading: false,
        items: (res && res.items) || []
      });
    };
    const errorFn = error => {
      console.log(error);
      this.setState({ categoriesLoading: false });
    };
    sendRequest(categoriesApi.getCategories, {
      success: { fn: thenFn },
      error: { fn: errorFn }
    });
  }
  fetchAlbumArt() {
    this.setState({ isLoading: true });
    const thenFn = res => {
      let { data } = res;
      this.setState({
        albumArts: data,
        isLoading: false
      });
      console.log(data);
    };
    const errorFn = error => {
      console.error(error);
      this.setState({ isLoading: false });
      alert(`${error&&error.message}`);
    };
    sendRequest(adminApi.getAlbumArt, {
      success: { fn: thenFn },
      error: { fn: errorFn },
      adminId: cookies.get("userId")
    });
  }
  componentDidMount() {
    let { publisherId } = this.props;
    this.fetchAlbumArt();
    if (publisherId) {
      // this.fetchItemDetails(publisherId);
    }
  }
  render() {
    const {
      isLoading,
      pictureUrl,
      albumArts, selectedAlbumArt
    } = this.state;
    
    let { match, onClose, onSubmit, isVisible, publisherId } = this.props;
    let id = match && match.params && match.params.id;
    return (
      <Modal buttonLabel="Name" className="modal" headerTitle="Select Image" 
      onSuccess={()=>{onSubmit(selectedAlbumArt)}}
      onClose={()=>{
          this.setState({
        pictureUrl: undefined
        },()=>onClose());
        }}
      isSuccessButtonActive={isLoading?true:false}
      isCancelButtonActive={isLoading?true:false}
    isVisible={isVisible}
      >
            <Form>
            <FormGroup>
              <GridContainer>
              
        {isLoading ? (
          <CircularProgress color="secondary" />
        ) : (<div style={{width: 500, display: "flex", flexDirection: "row"}}>{_.map(albumArts, (item, index)=>{
          return <div onClick={()=>{this.setState({selectedAlbumArt: item.albumArtUrl})}} key={item._id} style={{
            border: `5px ${item.albumArtUrl===selectedAlbumArt?"red":"white"} solid`,
            margin: 10,width: 100, height: 100, cursor: "pointer"}}>
            <img style={{width: 100, height: 100}} src={item.albumArtUrl}/>
          </div>
        })}</div>)}
              </GridContainer>
              <GridContainer>
              <GridItem><Uploader
              value={selectedAlbumArt}
              onChange={link => {
                this.addAlbumArt(link);
              }}
            /></GridItem>
              </GridContainer>
            </FormGroup>
          </Form>
        
        </Modal>
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
  )(SelectImage)
);
