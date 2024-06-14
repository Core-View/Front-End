import React, { useEffect } from "react";
import "./admin_post.css";
import axios from "axios";

const AdminPost = () => {
  const getAdminPosts = () => {
    axios.get("http://localhost:3000/post/latest").then((response) => {
      console.log(response.data);
    });
  };

  useEffect(() => {
    getAdminPosts();
  }, []);
  return (
    <div className="admin_post_container">
      <ul className="ad_post_list">
        <li>1.asdfasdfasdf</li>
        <li>1.assdsdfasdf</li>
        <li>1.asdfasdfasdf</li>
        <li>1.asdfasdfasdf</li>
      </ul>
    </div>
  );
};

export default AdminPost;
