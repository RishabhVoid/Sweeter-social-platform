import { styled } from "styled-components";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import colors from "../../../common/data/colors";

type props = {
  bucketNo: number;
  setBucketNo: React.Dispatch<React.SetStateAction<number>>;
};

const DmHeader = ({ bucketNo, setBucketNo }: props) => {
  const goBack = () => {
    if (bucketNo === -1) return;
    setBucketNo((bucketNo) => bucketNo - 1);
  };

  const goFroward = () => {
    setBucketNo((bucketNo) => bucketNo + 1);
  };

  return (
    <Wrapper>
      <FriendProfileBar>
        <button onClick={goBack}>
          <ArrowLeftIcon sx={{ color: colors.__colors_accent_pr }} />
        </button>
        <h2>{`${bucketNo}`}</h2>
        <button onClick={goFroward}>
          <ArrowLeftIcon
            sx={{
              color: colors.__colors_accent_pr,
              transform: "rotateZ(180deg)",
            }}
          />
        </button>
      </FriendProfileBar>
    </Wrapper>
  );
};

export default DmHeader;

const Wrapper = styled.div`
  width: 100%;
  padding: 10px;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
`;

const FriendProfileBar = styled.div`
  background: var(--colors-accent-pr);
  height: 100%;
  padding: 0.5rem;
  border-radius: 50px;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 15rem;
  position: relative;
  z-index: 10;

  img {
    width: 35px;
    border-radius: 100px;
    object-fit: cover;
    height: 35px;
  }

  h2 {
    color: var(--colors-bg-pr);
    font-size: 1.2rem;
    font-weight: 300;
  }

  button {
    border-radius: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0px;
    width: 35px;
    height: 35px;
    cursor: pointer;
  }
`;
