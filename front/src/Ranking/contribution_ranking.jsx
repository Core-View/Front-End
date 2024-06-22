import React, { Component } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import './contribution_ranking.css';

class Ranking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contributors: [],
      currentPage: 0,
      contributorsPerPage: 20,
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    this.fetchContributors();
  }

  fetchContributors = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/post/top-contributors`
      );
      this.setState({ contributors: response.data, loading: false });
    } catch (error) {
      this.setState({ error: error.message, loading: false });
    }
  };

  handlePageClick = (data) => {
    let selected = data.selected;
    this.setState({ currentPage: selected });
  };

  render() {
    const { contributors, currentPage, contributorsPerPage, loading, error } =
      this.state;

    if (loading) {
      return <div className="ranking-container">Loading...</div>;
    }

    if (error) {
      return <div className="ranking-container">Error: {error}</div>;
    }

    const offset = currentPage * contributorsPerPage;
    const currentContributors = contributors.slice(
      offset,
      offset + contributorsPerPage
    );
    const pageCount = Math.ceil(contributors.length / contributorsPerPage);

    return (
      <div className="ranking-container">
        <h1>기여도 랭킹</h1>
        <table className="ranking-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>기여도 총합</th>
            </tr>
          </thead>
          <tbody>
            {currentContributors.map((contributor, index) => (
              <tr key={index}>
                <td>{contributor.user_id}</td>
                <td>{contributor.total_contribution}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <ReactPaginate
          previousLabel={'이전'}
          nextLabel={'다음'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={this.handlePageClick}
          containerClassName={'pagination'}
          activeClassName={'active'}
        />
      </div>
    );
  }
}

export default Ranking;
