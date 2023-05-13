const Friends = ({ list, error }) => {
    return (
        <div className="mr-4 w-full sm:w-[25%] h-screen text-2xl font-bold rounded">
            <div className="mt-2 p-2 border-b text-center sticky top-0">
                🤖
                <span className="bg-gradient-to-r from-yellow-400 to-rose-700 bg-clip-text text-transparent">
                    Friends
                </span>
            </div>
            {list.length === 0 || error
                ? <EmptyFriends />
                : (
                    <div className="max-h-screen-viewport overflow-y-auto scrollbar">
                        <div className="drop-shadow-2xl rounded">
                            <div className="overflow-y-auto max-h-full">
                                {
                                    list.map((friend, i) => {
                                        return (
                                            <div
                                                onClick={() => {
                                                    navigator.clipboard.writeText(friend?.email);
                                                    alert('Email copied to clipboard!');
                                                }}
                                                className="m-1 flex items-center py-2 px-5 group hover:bg-gray-200 hover:bg-opacity-20 cursor-pointer rounded"
                                                key={i}
                                            >
                                                <div className="mr-2 bg-transparent">
                                                    {
                                                        friend?.profileImg && (
                                                            <img
                                                                src={friend?.profileImg}
                                                                alt="profile"
                                                                className="w-12 h-12 rounded-full"
                                                            />
                                                        )
                                                    }
                                                </div>
                                                <div className="flex-1 flex-col items-center bg-transparent">
                                                    <div className="text-sm font-bold bg-transparent">{friend?.name}</div>
                                                    <div className="text-sm font-bold bg-transparent">{friend?.email}</div>
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

const ProfileHeader = ({ name, photo }) => {
    return (
        <div className="w-full flex justify-between items-center">
            <div className="hover:animate-pulse">
                <img
                    src="/assets/peer-logo.png"
                    alt="profile"
                    className="w-8 h-8 sm:w-12 sm:h-12 rounded-full"
                />
            </div>
            <div className="flex items-center">
                <div className="sm:text-2xl font-bold">{name}</div>
                <div className="ml-2">
                    <img
                        src={photo}
                        alt="profile"
                        className="w-8 h-8 sm:w-12 sm:h-12 rounded-full"
                    />
                </div>
            </div>
        </div>
    );
};

const Intro = () => {
    return (
        <div className="relative flex flex-col justify-center items-center bg-transparent">
            <img src="/assets/intro.svg" alt="into img" className="bg-transparent w-[75%] animate-pulse" />
            <div className="absolute bottom-4 py-2 px-5 text-2xl font-bold text-center min-w-fit cursor-pointer rounded-full hover:-translate-y-1 hover:transition-transform hover:duration-300">
                Go Live 🚀
            </div>
        </div>
    );
};

const MainBody = ({ user }) => {
    return (
        <>
            <div className="flex flex-col">
                <div className="py-4 mx-2">
                    <ProfileHeader name={user.name} photo={user.profileImg} />
                </div>
                <div className="flex flex-col justify-center items-center">
                    <div className="p-4 w-full h-full flex flex-col justify-center items-center sm:h-[75vh] sm:w-[75%] bg-white bg-opacity-10 rounded-lg">
                        <Intro />
                    </div>
                </div>
            </div>
        </>
    );
};


function App() {

    const [list, setList] = React.useState([]);
    const [user, setUser] = React.useState({});
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);

    React.useEffect(() => {
        getUserByEmail()
            .then(data => {
                setUser(data);
                return getFriendList(data.email);
            }
            ).then(res => {
                res.map(friend => {
                    try {
                        getUserByEmail(friend)
                            .then(data => {
                                setList(list => [...list, data]);
                            }).catch(err => {
                                console.log(err);
                                setError(true);
                            });
                    } catch (error) {
                        console.log(error);
                        setError(true);
                    }
                });
                setLoading(false);
            }
            ).catch(err => {
                console.log(err);
                setLoading(false);
                setError(true);
            }
            );
    }, []);


    return (
        <main className="flex flex-col-reverse sm:flex-row">
            <Friends list={list} error={error}/>
            <MainBody user={user} />
        </main>
    );
}

ReactDOM.render(<App />, document.getElementById('home_root'));