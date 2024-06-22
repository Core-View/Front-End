import React, { Component } from 'react';
import axios from 'axios';
import './contribution_ranking.css';

class Ranking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contributors: [],
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

  render() {
    const { contributors, loading, error } = this.state;

    if (loading) {
      return <div className="ranking-container">Loading...</div>;
    }

    if (error) {
      return <div className="ranking-container">Error: {error}</div>;
    }

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
            {contributors.map((contributor, index) => (
              <tr key={index}>
                <td>{contributor.user_id}</td>
                <td>{contributor.total_contribution}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Ranking;
