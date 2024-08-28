const HEADER_COLOR = "#5423B7";
const SECOND_COLOR = true ? "#fff" : "#1a1a1a";
const BACKGROUND_COLOR = true ? "#F3F4F8" : "";
const PRIMARY_TEXT_COLOR = true ? "#1E1E1E" : "#fff";
const SECONDARY_TEXT_COLOR = true ? "#898E92" : "";

const commonStyle = {
  container: {
    display: "flex",
    flex: 1,
  },
  mainColor: {
    color: HEADER_COLOR,
  },
  secondColor: {
    color: SECOND_COLOR,
  },
};

export default commonStyle;
export {
  HEADER_COLOR,
  SECOND_COLOR,
  BACKGROUND_COLOR,
  PRIMARY_TEXT_COLOR,
  SECONDARY_TEXT_COLOR,
};
