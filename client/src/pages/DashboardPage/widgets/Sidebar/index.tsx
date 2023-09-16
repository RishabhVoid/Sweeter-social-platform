import { styled } from "styled-components";
import CustomButton from "../../../../common/components/CustomButton";
import AddPostModal from "../AddPostModal";
import { useState } from "react";
import CommentSection from "../CommentSection";

type props = {
  setSelectedCommentsId: React.Dispatch<React.SetStateAction<string>>;
  selectedCommentsId: String;
  addPost: (
    _id: string,
    posterName: string,
    posterEmail: string,
    desc: string,
    picturePath: string,
    commentsId: string,
    likes: Array<String>
  ) => void;
};

const Sidebar = ({
  selectedCommentsId,
  setSelectedCommentsId,
  addPost,
}: props) => {
  const [postsModalVis, setPostsModalVis] = useState(false);

  return (
    <Wrapper>
      {postsModalVis && (
        <AddPostModal setPostsModalVis={setPostsModalVis} addPost={addPost} />
      )}
      <CommentsWrapper>
        {selectedCommentsId.length !== 0 ? (
          <CommentSection
            selectedCommentsId={selectedCommentsId}
            setSelectedCommentsId={setSelectedCommentsId}
          />
        ) : (
          <>
            <h2>No comments selected</h2>
            <BottomButtons>
              <CustomButton
                title="Add new post +"
                stopBopping={true}
                callback={() => setPostsModalVis(!postsModalVis)}
              />
            </BottomButtons>
          </>
        )}
      </CommentsWrapper>
    </Wrapper>
  );
};

export default Sidebar;

const Wrapper = styled.div`
  width: 25rem;
  height: 100%;
  padding: 1rem;
  display: flex;
  flex-direction: column;

  h2 {
    font-weight: 300;
    font-size: 1rem;
  }
`;

const CommentsWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const BottomButtons = styled.div`
  margin-top: auto;
`;
