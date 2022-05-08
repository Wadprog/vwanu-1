import React from "react";
import { Link } from "react-router-dom";
import { Container, Grid, Paper, styled } from "@mui/material";
import InfiniteScroll from "react-infinite-scroller"; //for infinite scrolling
import { Facebook } from "react-content-loader";
import { FiRefreshCcw } from "react-icons/fi";

//Core components

import PostList from "../../features/post/PostList";
import { useGetTimelineList } from "../../features/post/postSlice";
import InputModal from "../../features/post/components/InputModal";
import BlogComponent from "../../components/Newsfeed/BlogComponent";
import FollowingPreview from "../../components/Newsfeed/FollowingPreview";
import CompleteProfile from "../../components/Newsfeed/CompleteProfile";

const NewsFeed = () => {
  // const user = useOutletContext();

  const { data: list, isLoading, fetchNextPage, hasNextPage, isError } = useGetTimelineList(["post", "home"]);

  function reloadPage() {
    window.location.reload();
  }

  const Item = styled(Paper)(() => ({
    backgroundColor: "inherit",
  }));

  const blogs = [
    {
      title: "Tackle Your closest Spring cleaning",
      date: "May 14, 2019",
      image: "https://res.cloudinary.com/dnesmf7ah/image/upload/v1651626639/vwanu/profile/kma3lennundnkiacntoq.jpg",
    },
    {
      title: "The Truth About Business Blogging",
      date: "May 14, 2019",
      image: "https://picsum.photos/200/300?image=0",
    },
    {
      title: "10 Tips to stay healthy when you're not alone",
      date: "May 14, 2019",
      image: "https://picsum.photos/200/300?image=1",
    },
    {
      title: "Visiting Amsterdam on a Budget",
      date: "May 8, 2019",
      image: "https://picsum.photos/200/300?image=2",
    },
    {
      title: `OMA completes renovation of Sotheby's New things appeared for a reason`,
      date: "May 8, 2019",
      image: "https://picsum.photos/200/300?image=3",
    },
  ];

  const followings = [
    { image: "https://picsum.photos/200/300?image=0" },
    { image: "https://picsum.photos/200/300?image=1" },
    { image: "https://picsum.photos/200/300?image=2" },
    { image: "https://picsum.photos/200/300?image=3" },
    { image: "https://picsum.photos/200/300?image=4" },
    { image: "https://picsum.photos/200/300?image=5" },
    { image: "https://picsum.photos/200/300?image=6" },
    { image: "https://picsum.photos/200/300?image=7" },
    { image: "https://picsum.photos/200/300?image=8" },
    { image: "https://picsum.photos/200/300?image=9" },
    { image: "https://picsum.photos/200/300?image=10" },
    { image: "https://picsum.photos/200/300?image=11" },
    { image: "https://picsum.photos/200/300?image=12" },
  ];

  const percentage = 73;

  const steps = [
    { title: "General Information", total: 6, complete: 5 },
    { title: "Work Experience", total: 3, complete: 1 },
    { title: "Profile Photo", total: 1, complete: 1 },
    { title: "Cover Photo", total: 1, complete: 1 },
  ];

  let content;
  if (isLoading) {
    content = <Facebook foregroundColor="#fff" />;
  } else if (list?.pages?.length > 0) {
    content = (
      <>
        <div>
          <InfiniteScroll
            /* next is the function for fetching data from backend when the user reaches the end */
            hasMore={hasNextPage}
            loadMore={fetchNextPage}
            loader={<Facebook />}
            isReverse={true}
            initialLoad={true}
            pageStart={0}
          >
            {list?.pages.map((page) => {
              return page?.data?.posts?.map((post) => {
                return <PostList key={post.id} post={post} pageTitle={""} />;
              });
            })}
          </InfiniteScroll>
        </div>
        <div className="w-full mt-6 mb-6 mx-auto text-center">
          <button className="" onClick={() => reloadPage()}>
            <FiRefreshCcw className="h-7 mx-auto" />
          </button>
        </div>
      </>
    );
  } else if (isError) {
    content = (
      <div className="my-20 m-auto text-center lg:pl-16 lg:pr-10 px-2 lg:px-0 bg-white shadow-md">
        <Facebook />
        {"Failed to load post. "}{" "}
        <Link className="text-secondary hover:text-primary" to={""} onClick={() => reloadPage()}>
          Reload the page
        </Link>{" "}
      </div>
    );
  } else {
    content = (
      <div className="py-4 my-4 m-auto text-center lg:pl-16 lg:pr-10 px-2 lg:px-0 bg-white shadow-lg rounded-lg">{"No posts "} </div>
    );
  }

  return (
    <>
      <Container elevation={0} className="mt-6 max-w-screen-2xl">
        <Grid elevation={0} sx={{ display: "flex" }}>
          <Grid sx={{ display: { xs: "none", md: "block" } }} elevation={0} xs={5}>
            <Item elevation={0}>
              <Grid
                sx={{ display: { xs: "none", md: "block" } }}
                elevation={0}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "10px",
                  border: "0.2px solid #dcdcdc",
                }}
              >
                <BlogComponent data={blogs} />
              </Grid>

              {/*People you're following*/}
              <Grid
                sx={{ display: { xs: "none", md: "block" } }}
                elevation={0}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "10px",
                  border: "0.2px solid #dcdcdc",
                  marginTop: "2rem",
                  paddingLeft: "1rem",
                  paddingRight: "1rem",
                }}
              >
                <FollowingPreview data={followings} />
              </Grid>
            </Item>
          </Grid>
          <Grid sx={6} md={7}>
            <Item elevation={0}>
              <div className="px-3">
                <h2 className="pb-5 text-3xl font-bold">Activity Feed</h2>
                <InputModal reference="newsfeed" />
                <div className="w-full">{content}</div>
              </div>
            </Item>
          </Grid>

          <Grid elevation={0} xs={5}>
            <Item elevation={0}>
              <Grid
                sx={{ display: { xs: "none", md: "block" } }}
                elevation={0}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "10px",
                  border: "0.2px solid #dcdcdc",
                  paddingLeft: "1rem",
                  paddingRight: "1rem",
                }}
              >
                <CompleteProfile percentage={percentage} data={steps} />
              </Grid>
            </Item>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default NewsFeed;
