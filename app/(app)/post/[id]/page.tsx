import PostViewer from "@/components/post/PostViewer";

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  return <PostViewer id={id} />;
}
