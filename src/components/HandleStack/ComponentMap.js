import CreatePost from "../CreatePost/CreatePost";
import DeletePostModal from "../DeletePostModal/DeletePostModal";
import DeletePredictionModal from "../DeletePredictionModal/DeletePredictionModal";
import ProfileModal from "../ProfileModal/ProfileModal";
import UpdateProfilePicModal from "../UploadProfilePicModal/UploadProfilePicModal";
import DeleteProductModal from "../DeleteProductModal/DeleteProductModal";
import CreateProduct from "../CreateProduct/CreateProduct";
import SearchModal from "../SearchModal/SearchModal";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import CreateGroupModal from "../CreateGroupModal/CreateGroupModal";
import SwipeableEdgeDrawer from "../SwipeableDrawer/SwipeableDrawer";

export const componentMap = {
  CreatePost: (props) => <CreatePost {...props} />,
  DeletePost: (props) => <DeletePostModal {...props} />,
  Profile: (props) => <ProfileModal {...props} />,
  ProfileImage: (props) => <UpdateProfilePicModal {...props} />,
  DeletePrediction: (props) => <DeletePredictionModal {...props} />,
  DeleteProduct: (props) => <DeleteProductModal {...props} />,
  CreateProduct: (props) => <CreateProduct {...props} />,
  SearchModal: (props) => <SearchModal {...props} />,
  Error: (props) => <ErrorMessage {...props} />,
  CreateGroup: (props) => <CreateGroupModal {...props} />,
  SwipeDrawer: (props) => <SwipeableEdgeDrawer {...props} />,
};

// "Server error: This result object does not return rows. It has been closed automatically."
