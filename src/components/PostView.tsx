import dayjs from 'dayjs';
import { type RouterOutputs } from "~/utils/api";
import Image from 'next/image';
import Link from "next/link";


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

export default PostView;