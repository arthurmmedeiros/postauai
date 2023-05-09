import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { type RouterOutputs, api } from "~/utils/api";
import Image from 'next/image';
import { LoadingPage } from "~/components/Loading";
import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import PageLayout from "~/components/Layout";

dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const [content, setContent] = useState<string>('');
  const { user }= useUser();

  const ctx = api.useContext();

  const { 
    mutate, 
    isLoading: isPosting, } = api.posts.create.useMutation({
      onSuccess: () => {
        setContent('');
        void ctx.posts.getAll.invalidate();
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors.content;
        if (errorMessage && errorMessage[0]) {
          toast.error(errorMessage[0])
        } else {
          toast.error('Failed to post. Please try again later.')
        }        
      }
    });

  if (!user) {
    return null;
  }

  return (
    <div className='flex gap-3 w-full border-b border-slate-400 p-4'>
        <Image
          className='rounded-full'
          src={user.profileImageUrl} 
          alt='Profile image'
          width={56}
          height={56}/>
        <input
          placeholder='Type something'
          className='bg-transparent grow outline-none'
          value={content}
          onChange={e => [
            setContent(e.target.value)
          ]}
          disabled={isPosting}
        />
        <div className='flex items-center'>
          <button 
            disabled={isPosting}
            onClick={() => {mutate({content})}}
            className='px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
            Post
          </button>
        </div>

    </div>
  )
}

type PostWithUser = RouterOutputs['posts']['getAll'][number];

const PostView = (props: PostWithUser) => {
  const displayDate = dayjs(props.post.createdAt).fromNow();

  return (
    <div key={props.post.id} className='border-b border-slate-400 p-4 flex items-center gap-3'>
      <Image
        className='rounded-full'
        src={props.author?.profileImageUrl} 
        alt='Profile image'
        width={56}
        height={56}/>
      <div>
        <div>
          <Link href={`/@${props.author?.username}`}>
            <strong>
              {`@${props.author?.username}`}
            </strong>
          </Link>
          <Link href={`/post/${props.post.id}`}>
            <span className='font-thin'>{` · ${displayDate}`}</span>
          </Link> 
        </div>
        <div>
          {props.post.content}
        </div>
      </div>   
  </div>
  )
}

const Feed = () => {
  const {data, isLoading: postsLoading} = api.posts.getAll.useQuery();

  if (postsLoading) {
    return <LoadingPage/>
  }

  if (!data) {
    return <div>Something went wrong!</div>
  }

  return  <div className='flex flex-col'>
    {data?.map(({post, author}) => (<PostView key={post.id} post={post} author={author}/>))}
  </div>  
}

const Home: NextPage = () => {
  const {
    user, 
    isLoaded: userLoaded,
    isSignedIn
  } = useUser();

  //fetch asap
  api.posts.getAll.useQuery();

  if (!userLoaded) {
    return <div></div>
  }

  return (
    <>
      <PageLayout>
        <SignIn path='/sign-in' routing='path' signUpUrl='/sign-up' />
            <div className='flex justify-between items-center border-b border-slate-400 p-4'>
              <h1>Welcome {isSignedIn && user.firstName}</h1>
              {!isSignedIn 
                ?<SignInButton><button className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'>Sign in</button></SignInButton>
                : <SignOutButton><button className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'>Sign out</button></SignOutButton>}  
            </div>   
            <CreatePostWizard/>
            
            <Feed/>
      </PageLayout>
    </>
  );
};

export default Home;
