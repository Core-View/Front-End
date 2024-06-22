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
      contributorsPerPage: 10,
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
      const contributors = await Promise.all(
        response.data.map(async (contributor) => {
          try {
            const userProfile = await axios.get(
              `http://localhost:3000/mypage/${contributor.user_id}`
            );
            const profile_picture = userProfile.data.profile_picture;
            if (
              !userProfile.profile_picture ||
              userProfile.profile_picture === 'null'
            ) {
              userProfile.profile_picture = `${process.env.PUBLIC_URL}/images/original_profile.png`;
            }
            return {
              ...contributor,
              ...userProfile.data,
              profile_picture,
            };
          } catch (error) {
            console.error(
              `Failed to fetch user profile for user ID ${contributor.user_id}:`,
              error
            );
            return {
              ...contributor,
              profile_picture: `${process.env.PUBLIC_URL}/images/original_profile.png`,
              user_nickname: 'Unknown',
              introduction: '',
            };
          }
        })
      );
      this.setState({ contributors, loading: false });
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
        <table className="ranking-table">
          <thead>
            <tr>
              <th>프로필</th>
              <th>기여도</th>
            </tr>
          </thead>
          <tbody>
            {currentContributors.map((contributor, index) => (
              <tr key={index}>
                <td>
                  <div className="profile-info">
                    <img src={contributor.profile_picture} alt="profile" />
                    <div>
                      <strong>{contributor.user_nickname}</strong>
                      <span className="profile-bio">
                        {contributor.introduction}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="contribution-score">
                  {contributor.user_contribute} 점
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ReactPaginate
          previousLabel={'Previous'}
          nextLabel={'Next'}
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
