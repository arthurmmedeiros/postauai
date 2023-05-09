import { type GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import PageLayout from "~/components/Layout";
import { LoadingPage } from "~/components/Loading";
import { generateSsgHelper } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";

const SinglePostPage: NextPage<{id: string}> = ({id}) => {
  const { data, isLoading } = api.posts.getById.useQuery({
      id
  })

  if (isLoading) {
      return <LoadingPage/>
  }

  if (!data) {
      return <div>404</div>
  }
  return (
    <>
        <Head>
            <title>Post</title>
        </Head>
        <PageLayout>
          <div>Single post page</div>    
          <div>{data.author.username}</div>
          <div>{data.post.content}</div>
        </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const helpers = generateSsgHelper();

  const id = context.params?.id;

  if (typeof id !== 'string') {
      throw new Error('No id!');
  }  

  await helpers.posts.getById.prefetch({id});

  return {
      props: {
          trpcState: helpers.dehydrate(),
          id
      }
  }
}

export const getStaticPaths = () => {
  return {
      paths: [],
      fallback: 'blocking'
  }
}

export default SinglePostPage;