import { AnimatePresence, motion } from "framer-motion";
import { type NextPage } from "next";
import { useEffect, useState } from "react";
import PageLayout from "~/components/Layout";

const loadingContainerVariants = {
    start: {
      transition: {
        staggerChildren: 0.2,
      },
    },
    end: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const loadingCircleVariants = {
    start: {
      y: "0%",
    },
    end: {
      y: "100%",
    },
  }

  const loadingCircleTransition = {
    duration: 0.9,
    //yoyo: Infinity,
    ease: "easeInOut",
    repeat: Infinity
  }

const loadingContainer = {
    width: '2rem',
    height: '2rem',
    display: 'flex',
    justifyContent: 'space-around'
}

const loadingCircle = {
    display: 'block',
    width: '0.5rem',
    height: '0.5rem',
    //backgroundColor: 'black',
    borderRadius: '0.25rem'
}

const Loading  = () => {
    return <motion.div
    style={loadingContainer}
    variants={loadingContainerVariants}
    initial='start'
    animate='end'    
  >
    <motion.span
      className='bg-cyan-500'
      style={loadingCircle}
      variants={loadingCircleVariants}
      transition={loadingCircleTransition}
    />
    <motion.span
      className='bg-cyan-500'
      style={loadingCircle}
      variants={loadingCircleVariants}
      transition={loadingCircleTransition}
    />
    <motion.span
      className='bg-cyan-500'
      style={loadingCircle}
      variants={loadingCircleVariants}
      transition={loadingCircleTransition}
    />
  </motion.div>
}


const CardView = ({ id, onClick }: {id: number, onClick: (id: number) => void}) => {
    return (
        <motion.div 
            className='h-32 w-72 mb-4 p-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800'
            
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring" }}>
                    
            <div className='flex flex-col justify-between h-full'>
                <div>{`Card ${id}`}</div>
                    <div className='flex flex-row-reverse'>
                        <button 
                            className='px-3 py-2 text-xs bg-blue-500 hover:bg-blue-700 text-white font-bold rounded'
                            onClick={() => onClick(id)}>
                            Start
                        </button>
                    </div>
                </div>
        </motion.div>
    )
}

const CardsPage: NextPage = () => {
    const [cards, setCards] = useState<number[]>();
    const [inProgress, setInProgress] = useState<number>();

    useEffect(() => {
        setCards([1, 2, 3, 4])
    }, []);    

    return <PageLayout>
        <div>cards</div>

        <div className='flex flex-col items-center'>
            <AnimatePresence>
                {inProgress && <motion.div
                    //initial={{ x : -200 }}
                    //animate={{ x: 200 }}
                    transition={{
                        type: 'spring'
                    }}
                    className='h-32 w-72 mb-4 p-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800'
                >
                    <div className='flex'>
                        <strong className='mr-2'>{inProgress}</strong> 
                        <span className='mr-2'>is in progress</span>                                             
                        <Loading/>
                    </div>
                </motion.div>}
                {cards?.map(c => 
                    <CardView 
                        key={c} 
                        id={c} 
                        onClick={() => {
                            const newList = cards.filter(cardId => cardId !== c);
                            setCards(inProgress ? [inProgress, ...newList] : newList);
                            setInProgress(undefined);

                            setInProgress(c);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    </PageLayout>
}

export default CardsPage;