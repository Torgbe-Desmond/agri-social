import CreatePost from "../CreatePost/CreatePost";
import DeletePostModal from "../DeletePostModal/DeletePostModal";
import DeletePredictionModal from "../DeletePredictionModal/DeletePredictionModal";
import ProfileModal from "../ProfileModal/ProfileModal";
import UpdateProfilePicModal from "../UploadProfilePicModal/UploadProfilePicModal";
import DeleteProductModal from "../DeleteProductModal/DeleteProductModal";
import CreateProduct from "../CreateProduct/CreateProduct";
// import SearchModal from "../SearchModal/SearchModal";
// import ErrorMessage from "../ErrorMessage/ErrorMessage";
import CreateGroupModal from "../CreateGroupModal/CreateGroupModal";
import SwipeableEdgeDrawer from "../SwipeableDrawer/SwipeableDrawer";
import CreateConversationModal from "../CreateConversationModal/CreateConversationModal";
import DeleteNotificationModal from "../Notification/DeleteNotificationModal";
import DynamicView from "../DynamicView/DynamicView";
import PostView from "../PostView/PostView";
import MediaModal from "../MediaModal/MediaModal";
import SellerInfoModal from "../SellerInfoModal/SellerInfoModal";
import ActionModal from "../ActionModal/ActionModal";
import SessionExpiredModal from "../SessionExpiredModal/SessionExpiredModal";
import RequestJoinGroup from "../RequestJoinGroup/RequestJoinGroup";
import AcceptJoinGroupRequest from "../AcceptJoinGroupRequest/AcceptJoinGroupRequest";

export const _componentMap = {
  MediaModal: (props) => <MediaModal {...props} />,
  RequestJoinGroup: (props) => <RequestJoinGroup {...props} />,
  SessionExpired: (props) => <SessionExpiredModal {...props} />,
  AcceptJoinGroupRequest: (props) => <AcceptJoinGroupRequest {...props} />,
  // DeletePost: (props) => <ActionModal {...props} />,
  DynamicView: (props) => <DynamicView {...props} />,
  SellerInfo: (props) => <SellerInfoModal {...props} />,
  CreatePost: (props) => <CreatePost {...props} />,
  PostView: (props) => <PostView {...props} />,
  DeletePost: (props) => <DeletePostModal {...props} />,
  Profile: (props) => <ProfileModal {...props} />,
  ProfileImage: (props) => <UpdateProfilePicModal {...props} />,
  DeletePrediction: (props) => <DeletePredictionModal {...props} />,
  DeleteProduct: (props) => <DeleteProductModal {...props} />,
  CreateProduct: (props) => <CreateProduct {...props} />,
  //   SearchModal: (props) => <SearchModal {...props} />,
  //   Error: (props) => <ErrorMessage {...props} />,
  CreateGroup: (props) => <CreateGroupModal {...props} />,
  SwipeDrawer: (props) => <SwipeableEdgeDrawer {...props} />,
  CreateConversation: (props) => <CreateConversationModal {...props} />,
  DeleteNotification: (props) => <DeleteNotificationModal {...props} />,
};
