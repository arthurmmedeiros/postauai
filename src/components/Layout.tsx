import type { PropsWithChildren } from 'react';

const PageLayout = (props: PropsWithChildren) => {
    return (
        <main className='flex justify-center h-screen '>
            <div className='w-full h-full md:max-w-2xl border-x border-slate-400'>
                {props.children}
            </div>      
      </main>
    )
};

export default PageLayout;