import { ThreeDots } from "react-loading-icons";

const Loader = ({ show }) => {
  return (
    <>
      {show && (
        <div
          className="top-0 left-0 fixed flex items-center justify-center z-50 w-full h-full"
          style={{ width: "100vw", backgroundColor: "rgba(0, 0, 0, .6)" }}
        >
          <ThreeDots style={{ width: "90px" }} />
        </div>
      )}
    </>
  );
};

export default Loader;
