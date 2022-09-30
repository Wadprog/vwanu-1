/*eslint-disable */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Routes, Route, useNavigate } from "react-router-dom";
//core components
import FriendRequestButton from "../../features/friend/component/FriendRequestButton";
import FriendButton from "../../features/friend/component/FriendButton";
import MenuButton from "../../features/friend/component/MenuButton";
import Loader from "../../components/common/Loader";
import ProfileTabs from "./ProfileTabs";
import UploadPhotoCrop from "../../components/form/profile/UploadPhotoCrop";
import AboutTab from "./AboutTab";
import ViewFriend from "./ViewFriend";
import PostTab from "./PostTab";
import AlbumTab from "./AlbumTab";
import NetworkTab from "./NetworkTab";
import BlogTab from "./BlogTab";
import CommunityTab from "./CommunityTab";
import { allTabs1 } from "./Tablink.data";
import { checkFriendList } from "../../helpers/index";
import { FaUserEdit, FaUserAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import EditProfile from "../../pages/Profil/EditProfile";
import { useGetOnline } from "../../features/user/userSlice";
import { useGetBlogList } from "../../features/blog/blogSlice";
import InputModal from "../../features/post/components/InputModal";
import BlogComponent from "../../components/Newsfeed/BlogComponent";
import FollowingPreview from "../../components/Newsfeed/FollowingPreview";
import RecentlyActive from "../../components/Newsfeed/RecentlyActive";
// import CompleteProfile from "../../components/Newsfeed/CompleteProfile";
import UpdatesComponent from "../../components/Newsfeed/UpdatesComponent";
import GroupsPreview from "../../components/Newsfeed/GroupsPreview";
import { AiFillYoutube, AiFillTwitterCircle } from "react-icons/ai";
import { BsFacebook } from "react-icons/bs";
import { format } from "date-fns";

const ProfileHeader = ({
  user,
  otherUser,
  loadingFollowing,
  errorFollowing,
  listFollowers,
  listRequest,
  listFollowing,
  notificationList,
}) => {
  const navigate = useNavigate();
  const [edit, setEdit] = useState(false);

  const { data: blogList, isError, isLoading } = useGetBlogList(["blog", "all"], true);

  const {
    data: listOnline,
    isLoading: loadingOnline,
    isError: onlineError,
    hasNextPage: hasNextPageOnline,
    fetchNextPage: fetchNextPageOnline,
  } = useGetOnline(["user", "online"]);

  const groups = [
    {
      name: "Mountain Riders",
      image: "https://picsum.photos/200/300?image=0",
      members: "20",
    },
    {
      name: "Graphic Design",
      image: "https://picsum.photos/200/300?image=1",
      members: "20",
    },
    {
      name: "Nature Lovers",
      image: "https://picsum.photos/200/300?image=2",
      members: "19",
    },
    {
      name: "Coffee Addicts",
      image: "https://picsum.photos/200/300?image=3",
      members: "19",
    },
    {
      name: "Architecture",
      image: "https://picsum.photos/200/300?image=4",
      members: "17",
    },
  ];
  return (
    <>
      {!user && !otherUser ? (
        <Loader />
      ) : (
        <>
          <div className="flex justify-between w-full">
            <div className="w-[100vw] lg:w-[65vw] lg:basis-[72%]">
              <div className="border-gray-700 bg-white">
                <div className="relative w-full lg:w-[65vw]">
                  <div className="">
                    <img
                      src={otherUser ? otherUser?.coverPicture?.original : user?.coverPicture?.original}
                      className="mx-auto max-h-64 w-full object-cover lg:h-[250px]"
                      alt="cover_profile"
                    />
                    {!otherUser && (
                      <button
                        onClick={() => (window.location.href = "../../me/profile/edit?tabs=cover")}
                        className="absolute top-0 right-0 bg-white m-1 p-1 rounded-full hover:bg-primary hover:text-white"
                      >
                        <MdEdit size={"24px"} className="" />
                      </button>
                    )}
                  </div>
                  <div className="transform translate-y-1/4 absolute w-full left-0 bottom-0 z-30 flex justify-center">
                    <div className="flex items-center justify-center mask mask-squircle w-[126px] h-[126px] bg-gray-100">
                      {otherUser?.profilePicture?.original !== "null" || user?.profilePicture?.original !== "null" ? (
                        <div className="relative">
                          <img
                            src={otherUser ? otherUser?.profilePicture?.original : user?.profilePicture?.original}
                            className="object-cover mask mask-squircle w-[120px] h-[120px]"
                            alt="profile_picture"
                          />
                          {!otherUser && (
                            <button
                              onClick={() => (window.location.href = "../../me/profile/edit?tabs=profile")}
                              className="absolute top-0 right-0 bg-white m-1 p-1 rounded-full hover:bg-primary hover:text-white"
                            >
                              <MdEdit size={"24px"} className="" />
                            </button>
                          )}
                        </div>
                      ) : (
                        <FaUserAlt size="78px" className="" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-b-lg border border-gray-300 bg-white pt-[70px] lg:pt-8 min-h-[120px]">
                <div className=" py-4 text-center 0">
                  <div className="mb-4 lg:mb-2 block">
                    <h1 className="font-mock text-2xl font-semibold text-primary inline">
                      {otherUser ? otherUser?.firstName + " " + otherUser?.lastName : user?.firstName + " " + user?.lastName}
                    </h1>
                    <h4 className="font-mock text-sm text-gray-600 mb-2 lg:0 mt-2">
                      {"From "}
                      {otherUser ? otherUser?.country : user.country ? user.country : ""}
                      <span className="px-2">•</span>
                      <span>
                        {"Joined "}
                        {format(new Date(otherUser ? otherUser?.createdAt : user?.createdAt), "MMM dd, yyyy")}
                      </span>
                    </h4>
                    <h4 className="font-mock text-sm text-gray-600 mb-2 lg:-mt-1 ">
                      <span className="pr-2">
                        {otherUser ? listFollowers?.length : listFollowers?.length}
                        {" followers"}
                      </span>
                      <span className="pl-2">
                        {otherUser ? listFollowing?.length : listFollowing?.length}
                        {" following"}
                      </span>
                    </h4>
                    <h4 className="font-mock text-primary flex text-sm mx-auto mb-2 text-center justify-center items-center lg:mt-2 ">
                      <div className="inline w-8 h-8 mr-2">
                        <BsFacebook size={"24px"} className="mx-auto" />
                      </div>
                      <div className="inline w-8 h-8  mr-2">
                        <AiFillYoutube size={"24px"} className="mx-auto" />
                      </div>
                      <div className="inline w-8 h-8  mr-2">
                        <AiFillTwitterCircle size={"24px"} className="mx-auto" />
                      </div>
                    </h4>
                  </div>
                  <div>
                    {otherUser && <FriendRequestButton user={user} otherUser={otherUser} />}

                    {otherUser && <MenuButton user={user} otherUser={otherUser} />}
                  </div>
                </div>
              </div>
              <ProfileTabs user={user} otherUser={otherUser} />
              <div className="mt-8 px-2">
                <Routes>
                  <Route
                    path={allTabs1[0]}
                    element={
                      <PostTab user={user} otherUser={otherUser} listFollowing={listFollowing} notificationList={notificationList} />
                    }
                  />
                  <Route
                    path={allTabs1[1]}
                    element={<div>{edit ? <EditProfile user={user} /> : <AboutTab user={otherUser ? otherUser : user} />}</div>}
                  />
                  <Route
                    path={allTabs1[2]}
                    element={
                      <div>
                        <NetworkTab user={otherUser ? otherUser : user} />
                      </div>
                    }
                  />
                  <Route
                    path={allTabs1[3]}
                    element={
                      <div>
                        <AlbumTab user={otherUser ? otherUser : user} />
                      </div>
                    }
                  />
                  <Route
                    path={allTabs1[4]}
                    element={
                      <div>
                        <BlogTab user={otherUser ? otherUser : user} />
                      </div>
                    }
                  />
                  <Route
                    path={allTabs1[5]}
                    element={
                      <div>
                        <CommunityTab user={otherUser ? otherUser : user} />
                      </div>
                    }
                  />
                  {/* <Route path={allTabs1[6]} element={<div>Forum</div>} /> */}
                </Routes>
              </div>
            </div>

            <div className="hidden lg:block basis-[20%] ml-auto mx-2 mt-8">
              <BlogComponent data={blogList?.pages[0]?.data?.data || []} isLoading={isLoading} isError={isError} />
              <RecentlyActive
                data={listOnline || []}
                isLoading={loadingOnline}
                isError={onlineError}
                hasNextPage={hasNextPageOnline}
                fetchNextPage={fetchNextPageOnline}
              />
              <GroupsPreview data={groups || []} />
              {/* <CompleteProfile percentage={percentage} data={steps} /> */}
              <div className="block xl:hidden">
                <FollowingPreview isLoading={loadingFollowing} isError={errorFollowing} data={listFollowing} />
              </div>
              <div className="block xl:hidden mb-2">
                <UpdatesComponent data={notificationList} />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

ProfileHeader.propTypes = {
  user: PropTypes.object.isRequired,
  otherUser: PropTypes.object,
  listFriendRequest: PropTypes.array,
  listFriend: PropTypes.array,
  listFollowers: PropTypes.array,
  listRequest: PropTypes.array,
  listFollowing: PropTypes.array,
  notificationList: PropTypes.array,
  loadingFollowing: PropTypes.bool,
  errorFollowing: PropTypes.bool,
};

export default ProfileHeader;
