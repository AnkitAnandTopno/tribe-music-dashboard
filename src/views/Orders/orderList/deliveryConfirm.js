import React from "react";
import { sendRequest } from "utills/util";
import { userApi } from "constant/api";
import {
  TableBody,
  Table,
  TableCell,
  TableRow,
  TableHead,
  TableFooter,
  CircularProgress
} from "@material-ui/core";
import Button from "components/CustomButtons/Button.js";
import { itemApi } from "constant/api";
import _ from "lodash";
import { orderApi } from "constant/api";
import CustomInput from "components/CustomInput/CustomInput";

class DeliveryConfirm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { itemList: [] };
  }
  confirmDelivery() {
    let { orderId, onConfirm } = this.props;
    let { deliveryCode } = this.state;
    this.setState({ isLoading: true });
    let thenFn = res => {
      console.log(res);
      this.setState({ isDelivered: true, isLoading: false });
      onConfirm();
      // sendRequest(itemApi.orderItemList, {
      //   itemList: itemList || [],
      //   success: { fn: thenFn },
      //   error: { fn: errorFn }
      // });
    };
    let errorFn = error => {
      this.setState({ isLoading: false });
    };
    sendRequest(orderApi.confirmDelivery, {
      id: orderId || "",
      deliveryCode,
      success: { fn: thenFn },
      error: { fn: errorFn }
    });
  }
  render() {
    let { isLoading, isPaid, isDelivered } = this.state;
    let { itemList, onClose } = this.props;
    return (
      <div>
        {isLoading ? (
          <CircularProgress color="secondary" />
        ) : isDelivered ? (
          <div>
            <h1 style={{ color: "green" }}>Success</h1>
          </div>
        ) : (
          <div>
            <h2>Confirm Delivery</h2>
            <CustomInput
              labelText="Delivery Code"
              id="deliveryCode"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                value: this.state.deliveryCode,
                onChange: e => {
                  this.setState({
                    deliveryCode: e.target.value
                  });
                }
              }}
            />
            <Button
              onClick={() => {
                this.confirmDelivery();
              }}
              color="primary"
            >
              OK
            </Button>
            <Button
              onClick={() => {
                onClose();
              }}
            >
              Close
            </Button>
          </div>
        )}
      </div>
    );
  }
}

export default DeliveryConfirm;
