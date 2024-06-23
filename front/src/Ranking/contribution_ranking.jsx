import React, { Component } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import './contribution_ranking.css';
import Contribution from '../Common/Contribution';
import { Cookies } from 'react-cookie';

class Ranking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contributors: [],
      currentPage: 0,
      contributorsPerPage: 10,
      loading: true,
      error: null,
      myPosition: null,
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
      const cookies = new Cookies();
      const loggedInUserId = cookies.get('user_id');
      const contributors = response.data.map((contributor) => ({
        ...contributor,
        profile_picture:
          contributor.user_image ||
          `${process.env.PUBLIC_URL}/images/original_profile.png`,
        user_nickname: contributor.user_nickname || 'Unknown',
        introduction: contributor.user_intro || '',
      }));

      const myPosition = contributors.findIndex(
        (contributor) => contributor.user_id === loggedInUserId
      );

      this.setState({ contributors, loading: false, myPosition });
    } catch (error) {
      this.setState({ error: error.message, loading: false });
    }
  };

  handlePageClick = (data) => {
    let selected = data.selected;
    this.setState({ currentPage: selected });
  };

  handleMyPositionClick = () => {
    const { myPosition, contributorsPerPage } = this.state;
    const myPage = Math.floor(myPosition / contributorsPerPage);
    this.setState({ currentPage: myPage });
  };

  render() {
    const {
      contributors,
      currentPage,
      contributorsPerPage,
      loading,
      error,
      myPosition,
    } = this.state;

    if (loading) {
      return <div className="ranking-container loading">Loading...</div>;
    }

    if (error) {
      return <div className="ranking-container error">Error: {error}</div>;
    }

    const offset = currentPage * contributorsPerPage;
    const currentContributors = contributors.slice(
      offset,
      offset + contributorsPerPage
    );
    const pageCount = Math.ceil(contributors.length / contributorsPerPage);

    return (
      <div className="ranking-container">
        <h1>기여도 순위</h1>
        {myPosition !== -1 && (
          <button
            onClick={this.handleMyPositionClick}
            className="my-position-button"
          >
            내 위치 보기
          </button>
        )}
        <table className="ranking-table">
          <thead>
            <tr>
              <th>순위</th>
              <th>유저</th>
              <th>기여도</th>
            </tr>
          </thead>
          <tbody>
            {currentContributors.map((contributor, index) => (
              <tr key={index}>
                <td>{offset + index + 1}</td>
                <td>
                  <div className="profile-info">
                    <img src={contributor.profile_picture} alt="profile" />
                    <div className="contribution-icon-style">
                      <Contribution contribute={contributor.user_contribute} />
                    </div>
                    <div>
                      <strong>{contributor.user_nickname}</strong>
                      <span className="profile-bio">
                        {contributor.introduction}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="contribution-score">
                  {contributor.user_contribute}
                </td>
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
          forcePage={currentPage}
        />
      </div>
    );
  }
}

export default Ranking;
