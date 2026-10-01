import React, { useContext, useEffect, useRef } from 'react';
import  UserContext  from '../context/UserContext';
import Message from './Message';

const Chat = ({ convo }) => {
    const { user } = useContext(UserContext);

    const getDateLabel = (timestamp) => {
        const date = new Date(timestamp);
        const today = new Date();

        if (date.toDateString() === today.toDateString()) {
            return "Today";
        }

        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        if (date.toDateString() === yesterday.toDateString()) {
            return "Yesterday";
        }

        const diffInDays = Math.floor(
            (today - date) / (1000 * 60 * 60 * 24)
        );

        if (diffInDays < 7) {
            return date.toLocaleDateString("en-IN", {
                weekday: "long"
            });
        }

        return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };
const bottomRef = useRef(null);
    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [convo]);
    console.log(convo)

    return (
        <div className="p-2 flex flex-col">

            {convo?.map((item, index) => {

                const type =
                    user?._id === item.senderId
                        ? "sender"
                        : "recipient";

                const currentLabel = getDateLabel(item.createdAt);

                const previousLabel =
                    index > 0
                        ? getDateLabel(convo[index - 1].createdAt)
                        : null;

                return (
                    <React.Fragment key={item._id}>

                        {currentLabel !== previousLabel && (
                            <div className="flex justify-center my-3">
                                <div className="bg-slate-700 text-slate-200 text-xs px-3 py-1 rounded-full">
                                    {currentLabel}
                                </div>
                            </div>
                        )}

                        <Message
                            type={type}
                            item={item}
                        />

                    </React.Fragment>
                );
            })}
<div ref={bottomRef} />
        </div>
    );
};

export default Chat;