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

const cookies = new Cookies();

//regex - ([S|M|K|B|Sa|E]\s)?[0-9]+
class AddPublisher extends Component {
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
  submit = (publisherId) => {
    let {onClose} = this.props;
    let checkState = _.cloneDeep(this.state);
    checkState = _.omit(checkState, [
      "isLoading",
    ]);
    this.setState({ isLoading: true });
      const thenFn = res => {
        this.setState({
        name: undefined,
        pictureUrl: undefined,
        isLoading: false},()=>{onClose(true);});
      };
      const errorFn = (err) => {
          console.log(err);
        this.setState({ isLoading: false });
        alert(`Error: ${err}`);
      };
      sendRequest(adminApi.addArtist, {
        publisherId,
        ...checkState,
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
  fetchItemDetails(id) {
    this.setState({ isLoading: true });
    const thenFn = res => {
      let { data, isVariant } = res;
      let newData = data;
      if (isVariant) {
        //don't change if isVariant true
        newData = _.omit(newData, ["isVariant", "item"]);
      }
      this.setState({
        ...newData,
        isLoading: false,
        emptyFields: {
          name: { empty: false, prestine: true },
          imageUrls: { empty: false, prestine: true }
        }
      });
    };
    const errorFn = error => {
      this.setState({ isLoading: false });
      alert("Something went wrong. Please try again later.");
    };
    sendRequest(itemApi.getItems, {
      success: { fn: thenFn },
      error: { fn: errorFn },
      id,
      adminId: cookies.get("userId")
    });
  }
  componentDidMount() {
    let { publisherId } = this.props;
    if (publisherId) {
      // this.fetchItemDetails(publisherId);
    }
  }
  render() {
    const {
      isLoading,
      pictureUrl
    } = this.state;
    let { match, onClose, isVisible, publisherId } = this.props;
    let id = match && match.params && match.params.id;
    return (
      <Modal buttonLabel="Name" className="modal" headerTitle="Add New Artist" 
      onSuccess={()=>{this.submit(publisherId)}}
      onClose={()=>{
          this.setState({
        name: undefined,
        pictureUrl: undefined
        },()=>onClose());
        }}
      isSuccessButtonActive={isLoading?true:false}
      isCancelButtonActive={isLoading?true:false}
    isVisible={isVisible}
      >
        {isLoading ? (
          <CircularProgress color="secondary" />
        ) : (
            <Form>
            <FormGroup>
              <GridContainer>
              <GridItem><CustomInput
              labelText="Artist Name"
              id="name"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                value: this.state.name,
                onChange: e => {
                  this.setState({
                   name: e.target.value
                  });
                }
              }}
            /></GridItem>
              
              </GridContainer>
              <GridContainer>
              <GridItem><Uploader
              value={pictureUrl}
              onChange={link => {
                this.setState({ pictureUrl: link });
              }}
            /></GridItem>
              </GridContainer>
            </FormGroup>
          </Form>
        )}
        
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
  )(AddPublisher)
);
