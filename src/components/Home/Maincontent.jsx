import Post from "./Post";
import Suggest from "./Suggest";
import NewPost from "./newpost";
export default function () {
  return (
    <>
      <main className="col-span-6  p-9  ">
        <NewPost />
        {/* <Suggest /> */}
        <Post />
      </main>
    </>
  );
}
