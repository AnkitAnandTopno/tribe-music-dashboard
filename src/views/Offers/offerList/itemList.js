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

class ItemList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { itemList: [] };
  }
  componentDidMount() {
    let { orderId } = this.props;
    this.setState({ isLoading: true });
    let thenFn = res => {
      this.setState({ isPaid: res && res.data, isLoading: false });

      // sendRequest(itemApi.orderItemList, {
      //   itemList: itemList || [],
      //   success: { fn: thenFn },
      //   error: { fn: errorFn }
      // });
    };
    let errorFn = error => {
      this.setState({ isLoading: false });
    };
    sendRequest(orderApi.isOrderPaid, {
      orderId: orderId || "",
      success: { fn: thenFn },
      error: { fn: errorFn }
    });
  }
  render() {
    let { isLoading, isPaid } = this.state;
    let { itemList } = this.props;
    return (
      <div>
        {isLoading ? (
          <CircularProgress color="secondary" />
        ) : (
          <div>
          <Button color={isPaid?"success":"danger"}>{isPaid?"Paid": "Cash On Delivery"}</Button>
            <Table>
              <TableHead>
                <TableCell>Index</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Discount</TableCell>
                <TableCell>Tax</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell>Count per unit</TableCell>
                <TableCell>Total</TableCell>
              </TableHead>
              <TableBody>
                {_.map(itemList, (item, index) => {
                  let cost =
                    (item.price -
                      item.price * ((item.discount || 0) / 100) +
                      item.price * ((item.tax || 0) / 100)) *
                    item.count;
                  return (
                    <TableRow>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.price}</TableCell>
                      <TableCell>{item.discount}</TableCell>
                      <TableCell>{item.tax}</TableCell>
                      <TableCell>{`${item.unit}`}</TableCell>
                      <TableCell>{item.count}</TableCell>
                      <TableCell
                        style={{
                          display: "flex",
                          alignItems: "flex-end",
                          flexDirection: "column"
                        }}
                      >{`${cost}`}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              <TableFooter>
                <TableCell>Total</TableCell>
                <TableCell>{`${itemList.length} items`}</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    flexDirection: "column"
                  }}
                >
                  {_.sumBy(itemList, (item, index) => {
                    let cost =
                      (item.price -
                        item.price * ((item.discount || 0) / 100) +
                        item.price * ((item.tax || 0) / 100)) *
                      item.count;

                    return cost;
                  })}
                </TableCell>
              </TableFooter>
            </Table>
          </div>
        )}
      </div>
    );
  }
}

export default ItemList;
