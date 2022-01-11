import React from "react";
import { connect } from "react-redux";
import _ from "lodash";
import CustomPagination from "components/CustomPagination";

class CustomListGrouping extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 0
    };
  }
  setPage(currentPage) {
    this.setState({ currentPage });
  }
  render() {
    let { currentPage } = this.state;
    let { itemSet, renderContent, max } = this.props;
    let itemSetGroup = _.chunk(itemSet, max);

    return (
      <div>
        <CustomPagination
          pages={itemSetGroup}
          currentPage={currentPage}
          onChange={newPageNumber => {
            this.setPage(newPageNumber);
          }}
        />
        {renderContent(itemSetGroup[currentPage], currentPage)}

        <CustomPagination
          pages={itemSetGroup}
          currentPage={currentPage}
          onChange={newPageNumber => {
            this.setPage(newPageNumber);
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    itemSet: ownProps.itemSet
  };
};
const mapDispatchToProps = dispatch => {
  return {};
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomListGrouping);
