import { type GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import { LoadingPage } from "~/components/Loading";
import { api } from "~/utils/api";
import PageLayout from "~/components/Layout";
import PostView from "~/components/PostView";
import { generateSsgHelper } from "~/server/helpers/ssgHelper";

const ProfileFeed = (props: { userId: string}) => {
    const {data, isLoading} = api.posts.getPostsByUserId.useQuery({
        userId: props.userId
    })

    if (isLoading) {
        return <LoadingPage/>
    }

    return (
        <>
        {data?.map(p => (<PostView post={p.post} author={p.author} key={p.post.id}/>))}
        </>
    )
}

interface PageProps {
    username: string 
}

const ProfilePage: NextPage<PageProps> = (props) => {
    const { data, isLoading } = api.profile.getUserByUsername.useQuery({
        username: props.username
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
                <title>Profile</title>
            </Head>
            <PageLayout>
                <div>{data.username}</div>
                <div>All posts
                    <ProfileFeed userId={data.id}/>
                </div>
            </PageLayout>
        </>
    );
};

export const getStaticProps: GetStaticProps = async (context) => {
    const helpers = generateSsgHelper();

    const slug = context.params?.slug;

    if (typeof slug !== 'string') {
        throw new Error('No slug!');
    }

    const username = slug.replace('@', '');

    await helpers.profile.getUserByUsername.prefetch({username});

    return {
        props: {
            trpcState: helpers.dehydrate(),
            username
        }
    }
}

export const getStaticPaths = () => {
    return {
        paths: [],
        fallback: 'blocking'
    }
}

export default ProfilePage;
