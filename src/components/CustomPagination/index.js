import React from "react";
import { connect } from "react-redux";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";
import _ from "lodash";

class CustomPagination extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1
    };
  }
  setPage(currentPage) {
    this.setState({ currentPage });
  }
  render() {
    let { currentPage } = this.state;
    let { pages, onChange } = this.props;
    return (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          listStyle: "none"
        }}
      >
        <PaginationItem>
          <PaginationLink
            first
            onClick={() => {
              this.setPage(1);
              onChange(0);
            }}
          />
        </PaginationItem>
        {_.map(pages, (item, index) => (
          <PaginationItem key={index + 1} active={currentPage == index + 1}>
            <PaginationLink
              onClick={() => {
                this.setPage(index + 1);
                onChange(index);
              }}
            >
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationLink
            last
            onClick={() => {
              this.setPage((pages || []).length);
              onChange((pages || []).length - 1);
            }}
          />
        </PaginationItem>
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    pages: ownProps.pages,
    currentPage: ownProps.currentPage
  };
};
export default connect(
  mapStateToProps,
  {}
)(CustomPagination);
