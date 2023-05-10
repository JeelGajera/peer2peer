const list = [];
// const list = [
//     {
//         name: "John",
//         email: "john@example.com",
//         profileImg: "https://randomuser.me/api/portraits/men/1.jpg"
//     },
//     {
//         name: "John",
//         email: "john@example.com",
//         profileImg: "https://randomuser.me/api/portraits/men/1.jpg"
//     },
//     {
//         name: "John",
//         email: "john@example.com",
//         profileImg: "https://randomuser.me/api/portraits/men/1.jpg"
//     },
//     {
//         name: "John",
//         email: "john@example.com",
//         profileImg: "https://randomuser.me/api/portraits/men/1.jpg"
//     },
//     {
//         name: "John",
//         email: "john@example.com",
//         profileImg: "https://randomuser.me/api/portraits/men/1.jpg"
//     },
//     {
//         name: "John",
//         email: "john@example.com",
//         profileImg: "https://randomuser.me/api/portraits/men/1.jpg"
//     },
//     {
//         name: "John",
//         email: "john@example.com",
//         profileImg: "https://randomuser.me/api/portraits/men/1.jpg"
//     },
//     {
//         name: "John",
//         email: "john@example.com",
//         profileImg: "https://randomuser.me/api/portraits/men/1.jpg"
//     },
//     {
//         name: "John",
//         email: "john@example.com",
//         profileImg: "https://randomuser.me/api/portraits/men/1.jpg"
//     },
//     {
//         name: "John",
//         email: "john@example.com",
//         profileImg: "https://randomuser.me/api/portraits/men/1.jpg"
//     },
//     {
//         name: "John",
//         email: "john@example.com",
//         profileImg: "https://randomuser.me/api/portraits/men/1.jpg"
//     },
//     {
//         name: "John",
//         email: "john@example.com",
//         profileImg: "https://randomuser.me/api/portraits/men/1.jpg"
//     },
//     {
//         name: "John",
//         email: "john@example.com",
//         profileImg: "https://randomuser.me/api/portraits/men/1.jpg"
//     },
//     {
//         name: "John",
//         email: "john@example.com",
//         profileImg: "https://randomuser.me/api/portraits/men/1.jpg"
//     },
//     {
//         name: "John",
//         email: "john@example.com",
//         profileImg: "https://randomuser.me/api/portraits/men/1.jpg"
//     },
//     {
//         name: "John",
//         email: "john@example.com",
//         profileImg: "https://randomuser.me/api/portraits/men/1.jpg"
//     },
//     {
//         name: "John",
//         email: "john@example.com",
//         profileImg: "https://randomuser.me/api/portraits/men/1.jpg"
//     },
//     {
//         name: "John",
//         email: "john@example.com",
//         profileImg: "https://randomuser.me/api/portraits/men/1.jpg"
//     },
//     {
//         name: "John",
//         email: "john@example.com",
//         profileImg: "https://randomuser.me/api/portraits/men/1.jpg"
//     },
//     {
//         name: "John",
//         email: "john@example.com",
//         profileImg: "https://randomuser.me/api/portraits/men/1.jpg"
//     },
//     {
//         name: "John",
//         email: "john@example.com",
//         profileImg: "https://randomuser.me/api/portraits/men/1.jpg"
//     },
//     {
//         name: "John",
//         email: "john@example.com",
//         profileImg: "https://randomuser.me/api/portraits/men/1.jpg"
//     },
//     {
//         name: "John",
//         email: "john@example.com",
//         profileImg: "https://randomuser.me/api/portraits/men/1.jpg"
//     }
// ];

const Friends = ({ list }) => {
    return (
        <div className="mr-4 w-full sm:w-[25%] text-3xl font-bold rounded">
            <div className="p-2 border-b text-center sticky top-0">
                🤖
                <span className="bg-gradient-to-r from-yellow-400 to-rose-700 bg-clip-text text-transparent">
                    Friends
                </span>
            </div>
            {list.length === 0
                ? <EmptyFriends />
                : (
                    <div className="max-h-screen-viewport overflow-y-auto scrollbar">
                        <div className="drop-shadow-2xl rounded">
                            <div className="overflow-y-auto max-h-full">
                                {
                                    list.map((friend, i) => {
                                        return (
                                            <div className="m-1 flex items-center py-2 px-5 hover:bg-gray-200 hover:bg-opacity-20" key={i}>
                                                <div className="mr-2 bg-transparent">
                                                    <img
                                                        src={friend.profileImg}
                                                        alt="profile"
                                                        className="w-12 h-12 rounded-full"
                                                    />
                                                </div>
                                                <div className="flex-1 flex-col items-center bg-transparent">
                                                    <div className="text-sm font-bold bg-transparent">{friend.name}</div>
                                                    <div className="text-sm font-bold bg-transparent">{friend.email}</div>
                                                </div>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

const EmptyFriends = () => {
    return (
        <div className="mt-28 sm:mt-52">
            <div className="flex flex-col items-center mx-5">
                <div className="animate-pulse">
                    <img src="/assets/peer-logo.png" alt="peer logo" />
                </div>
                <div className="text-gray-400 opacity-40 font-bold text-center">
                    You don't have any friends yet.
                </div>
            </div>
        </div>
    );
};


function App() {
    return (
        <main className="flex flex-col-reverse sm:flex-row justify-between items-center">
            <Friends list={list} />
            <div className="w-full sm:w-[75%]">Main content</div>
        </main>
    );
}

ReactDOM.render(<App />, document.getElementById('home_root'));