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
  submit = () => {
      let {onClose} = this.props;
    let checkState = _.cloneDeep(this.state);
    checkState = _.omit(checkState, [
      "isLoading",
    ]);
    this.setState({ isLoading: true });
      const thenFn = res => {
        this.setState({companyName: "",
        nameOfHead: undefined,
        email: undefined,
        password: undefined,
        contactNumber: null,
        validity: null,
        isLoading: false},()=>{onClose(true);});
      };
      const errorFn = (err) => {
          console.log(err);
        this.setState({ isLoading: false });
        alert(`Error: ${err}`);
      };
      sendRequest(adminApi.addPublisher, {
        adminId: cookies.get("userId"),
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
      this.fetchItemDetails(publisherId);
    }
  }
  render() {
    const {
      isLoading,
    } = this.state;
    let { match, onClose, isVisible } = this.props;
    let id = match && match.params && match.params.id;
    return (
      <Modal buttonLabel="Name" className="modal" headerTitle="Add New Publisher" 
      onSuccess={()=>{this.submit()}}
      onClose={()=>{
          this.setState({companyName: "",
        nameOfHead: undefined,
        email: undefined,
        password: undefined,
        contactNumber: null,
        validity: null},()=>onClose(false));
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
              labelText="Company Name"
              id="companyName"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                value: this.state.companyName,
                onChange: e => {
                  this.setState({
                    companyName: e.target.value
                  });
                }
              }}
            /></GridItem>
              <GridItem><CustomInput
              labelText="Name Of Owner"
              id="nameOfHead"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                value: this.state.nameOfHead,
                onChange: e => {
                  this.setState({
                    nameOfHead: e.target.value
                  });
                }
              }}
            /></GridItem></GridContainer>
            <GridContainer>
              <GridItem><CustomInput
              labelText="E-mail Address"
              id="email"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                value: this.state.email,
                onChange: e => {
                  this.setState({
                    email: e.target.value
                  });
                }
              }}
            /></GridItem>
              <GridItem><CustomInput
              labelText="Password"
              id="password"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                type: "password",
                value: this.state.password,
                onChange: e => {
                  this.setState({
                    password: e.target.value
                  });
                }
              }}
            /></GridItem>
              </GridContainer>
              <GridContainer>
              <GridItem><CustomInput
              labelText="Contact Number"
              id="contact"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                type: "number",
                value: this.state.contact,
                onChange: e => {
                  this.setState({
                    contactNumber: e.target.value
                  });
                }
              }}
            /></GridItem>
              <GridItem><CustomInput
              labelText="Validity"
              id="validity"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                type: "date",
                value: this.state.validity,
                onChange: e => {
                  this.setState({
                    validity: e.target.value
                  });
                }
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
