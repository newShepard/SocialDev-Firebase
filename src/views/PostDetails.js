import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Navigation from '../components/organisms/Navigation';
import GridTemplate from '../templates/GridTemplate';
import { firestore } from '../firebase/firebase';
import AddComment from '../components/molecules/AddComment';
import Comment from '../components/molecules/Comment';
import Post from '../components/molecules/Post';
const StyledWrapper = styled.div`
  width: 100%;
  overflow: hidden;
  @media (min-width: 650px) {
    display: grid;
    grid-template-columns: 0.5fr 3fr;
    grid-column-gap: 3rem;
  }
`;

class PostDetails extends React.Component {
  state = {
    post: null,
    comments: [],
  };

  unsubscribeFromPost = null;

  unsubscribeFromComments = null;

  componentDidMount() {
    this.unsubscribeFromPost = this.postRef.onSnapshot(snapshot => {
      const post = this.documentsCollection(snapshot);
      this.setState({ post });
    });

    this.unsubscribeFromComments = this.commentsRef.onSnapshot(snapshot => {
      const comments = snapshot.docs.map(this.documentsCollection);
      this.setState({ comments });
    });
  }

  componentWillUnmount() {
    this.unsubscribeFromPost();
    this.unsubscribeFromComments();
  }

  get postId() {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    return id;
  }

  get postRef() {
    return firestore.doc(`posts/${this.postId}`);
  }

  get commentsRef() {
    return this.postRef.collection(`comments`);
  }

  documentsCollection = doc => {
    return { id: doc.id, ...doc.data() };
  };

  createComment = comment => {
    console.log(comment);
  };

  render() {
    const { post, comments } = this.state;
    return (
      <StyledWrapper>
        <Navigation />
        <GridTemplate>
          {post && <Post {...post} />}
          <AddComment onCreate={this.createComment} />
          {comments.map(comment => (
            <Comment {...comment} key={comment.id} />
          ))}
        </GridTemplate>
      </StyledWrapper>
    );
  }
}
PostDetails.propTypes = {
  match: PropTypes.object.isRequired,
};

export default withRouter(PostDetails);
