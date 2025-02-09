// import PostType from "../post/post.type";

export default interface TagType {
  _id: string;
  ids: Array<string>;
  name: object;
  slug: object;
  posts: Array<any>;
  status: "show" | "hide";
}
