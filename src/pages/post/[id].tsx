import { type NextPage } from "next";
import Head from "next/head";
import PageLayout from "~/components/Layout";

const SinglePostPage: NextPage = () => {
  return (
    <>
        <Head>
            <title>Post</title>
        </Head>
        <PageLayout>
          <div>Single post page</div>    
        </PageLayout>
    </>
  );
};

export default SinglePostPage;