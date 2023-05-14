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
                                                    toastr.info('Email copied to clipboard');
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

const Loader = () => {
    return (
        <>
            <div className="absolute flex flex-col justify-center items-center h-screen w-screen z-50 bg-transparent">
                <div className="animate-pulse">
                    <img src="/assets/peer-logo.png" alt="peer logo" />
                </div>
                <div className="text-xl text-gray-400 font-bold text-center bg-transparent">
                    Loading...
                </div>
                {/* dark bg */}
            </div>
            <div className="absolute h-screen w-screen bg-black opacity-50 z-10"></div>
        </>
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

const MainBody = ({ user, hostPeerId }) => {
    const [show, setShow] = React.useState(false);
    const [connectedFriend, setConnectedFriend] = React.useState({});
    const [msgInput, setMsgInput] = React.useState('');
    const [fileInput, setFileInput] = React.useState();
    const [friendEmail, setFriendEmail] = React.useState('');
    const [disconnect, setDisconnect] = React.useState(false);
    const messages = React.useRef(null);
    const sendButton = React.useRef(null);
    const conn = React.useRef(null);
    const peerMain = React.useRef(null);

    function toggleShow() {
        setShow(!show);
    }

    function disconnectConnection() {
        try {
            conn.current.close();
            setConnectedFriend({});
            console.log("connection closed by fefaule");
        } catch (error) {
            console.log(error);
        }
    }

    function startPeer(resolvedId) {
        const peer = new Peer(resolvedId);
        peerMain.current = peer;

        toggleShow();

        peer.on('open', () => {
            console.log("host id: " + peerMain.current.id);
            console.log("host name: " + user?.name);
        });

        peer.on('error', (error) => {
            console.error(error);
        });



        // incoming connection
        peer.on('connection', async (connection) => {
            conn.current = connection;

            conn.current.on('close', () => {
                console.log('connection closed');
                setDisconnect(false);
                setConnectedFriend({});
            });

            console.log("incoming connection from: " + conn.current.peer);
            setDisconnect(true);
            // add frind to friends list
            try {
                const tempFriend = await getUserById(conn.current.peer);
                setConnectedFriend(tempFriend);
                updateFriendList(
                    user?.email,
                    tempFriend?.email,
                )
                toastr.info(`${tempFriend?.name} added to your friend list`);
                console.log("friend added");
            } catch (error) {
                console.log(error);
            }
            conn.current.on('data', (data) => {
                if (typeof data === 'string') {
                    const messageElement = document.createElement('div');
                    messageElement.classList.add('msg_left');
                    messageElement.textContent = data;
                    messages.current.appendChild(messageElement);
                } else if (data.type === 'file') {
                    const fileBlob = new Blob([data.file], { type: data.filetype });
                    const url = URL.createObjectURL(fileBlob);
                    const linkElement = document.createElement('a');
                    linkElement.href = url;
                    linkElement.download = data.filename;
                    linkElement.classList.add('msg_right', 'text-blue-500', 'hover:underline', 'cursor-pointer',);
                    linkElement.textContent = data.filename;
                    messages.current.appendChild(linkElement);
                } else {
                    console.log(data);
                }
            });
        });
    }

    async function connectToPeer() {
        const message = msgInput.trim();
        const file = fileInput;

        const getFriendID = async () => {
            const fid = await getIdByEmail(friendEmail);
            return fid;

        }
        const friendId = await getFriendID();

        if (!conn.current && friendId != null) {
            conn.current = await peerMain.current.connect(friendId);
            console.log("outgoing connection to: " + conn.current.peer);
            // add frind to friends list
            try {
                const tempFriend = await getUserById(conn.current.peer);
                setConnectedFriend(tempFriend);
                updateFriendList(
                    user?.email,
                    tempFriend?.email,
                )
                toastr.info(`${tempFriend?.name} added to your friend list`);
                console.log("friend added");
            } catch (error) {
                console.log(error);
            }

            conn.current.on('close', () => {
                console.log('connection closed');
                setDisconnect(false);
                setConnectedFriend({});
            });

            conn.current.on('data', (data) => {
                if (typeof data === 'string') {
                    const messageElement = document.createElement('div');
                    messageElement.classList.add('msg_left');
                    messageElement.textContent = data;
                    messages.current.appendChild(messageElement);
                } else if (data.type === 'file') {
                    const fileBlob = new Blob([data.file], { type: data.filetype });
                    const url = URL.createObjectURL(fileBlob);
                    const linkElement = document.createElement('a');
                    linkElement.href = url;
                    linkElement.classList.add('msg_left', 'text-blue-500', 'hover:underline', 'cursor-pointer',);
                    linkElement.download = data.filename;
                    linkElement.textContent = data.filename;
                    messages.current.appendChild(linkElement);
                } else {
                    console.log(data);
                }
            });
        }

        if (file) {
            const filedata = new Uint8Array(await file.arrayBuffer());

            conn.current.send({
                type: 'file',
                file: filedata,
                filetype: file.type,
                filename: file.name,
            });
            const messageElement = document.createElement('div');
            messageElement.classList.add('msg_right','text-blue-500', 'hover:underline');
            messageElement.textContent = file.name;
            messages.current.appendChild(messageElement);
        } else {
            if (message != '') {
                conn.current.send(message);
                const messageElement = document.createElement('div');
                messageElement.classList.add('msg_right');
                messageElement.textContent = message;
                messages.current.appendChild(messageElement);
            }
        }
        setMsgInput('');
        setFileInput();
    };

    const Intro = ({ id }) => {
        const handleGoLive = async () => {
            const resolvedId = await id;
            startPeer(resolvedId);
        };

        return (
            <div className="relative p-4 w-full h-full flex flex-col justify-center items-center sm:h-[75vh] sm:w-[75%] bg-white bg-opacity-10 rounded-lg">
                <img src="/assets/intro.svg" alt="into img" className="bg-transparent w-[75%] animate-pulse" />
                <div
                    onClick={handleGoLive}
                    className="absolute bottom-4 py-2 px-5 text-2xl font-bold text-center min-w-fit cursor-pointer rounded-full hover:-translate-y-1 hover:transition-transform hover:duration-300 bg-black"
                >
                    Go Live 🚀
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="flex flex-col w-full h-full sm:h-[75vh] sm:min-w-[75%]">
                <div className="py-4 mx-2">
                    <ProfileHeader name={user.name} photo={user.profileImg} />
                </div>
                <div className="flex justify-center items-center">
                    {show
                        ? (
                            <>
                                <div className="flex flex-col w-full h-full p-4 mx-2 sm:mx-8 bg-white bg-opacity-10 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <div className="text-2xl font-bold text-center text-white">
                                            {
                                                connectedFriend.name ?
                                                    (
                                                        <div className="flex items-center">
                                                            <div className="ml-2">
                                                                <img
                                                                    src={connectedFriend?.profileImg}
                                                                    alt="profile"
                                                                    className="w-8 h-8 sm:w-12 sm:h-12 rounded-full"
                                                                />
                                                            </div>
                                                            <div className="sm:text-2xl font-bold">{connectedFriend?.name}</div>
                                                        </div>
                                                    ) : (
                                                        <div className="sm:text-2xl font-bold">Connect to a friend</div>
                                                    )
                                            }

                                        </div>
                                        <div className="flex justify-center items-center gap-2">
                                            <input
                                                className="w-fit p-2 rounded-lg bg-white bg-opacity-10 text-white"
                                                type={"text"}
                                                value={friendEmail}
                                                onChange={e => setFriendEmail(e.target.value)}
                                                placeholder="Enter friend's email"
                                                required={true}
                                            />
                                            {
                                                !disconnect ? (
                                                    <button
                                                        className="group w-full flex justify-center items-center gap-1 p-2 rounded-lg bg-white bg-opacity-10 text-white"
                                                        onClick={
                                                            () => {
                                                                connectToPeer();
                                                                setDisconnect(true);
                                                            }
                                                        }
                                                    >
                                                        Connect
                                                        <img className="group-hover:animate-pulse" width="28" height="28" src="https://img.icons8.com/dotty/80/01D108/business-network.png" alt="business-network" />
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="group w-full flex justify-center items-center gap-1 p-2 rounded-lg bg-white bg-opacity-10 text-white"
                                                        onClick={
                                                            () => {
                                                                disconnectConnection();
                                                                setDisconnect(false);
                                                            }
                                                        }
                                                    >
                                                        Disconnect
                                                        <img className="group-hover:animate-pulse" width="28" height="28" src="https://img.icons8.com/dotty/80/FC0000/business-network.png" alt="business-network" />
                                                    </button>
                                                )
                                            }

                                        </div>
                                    </div>
                                    <div className="gap-10 flex flex-col">

                                        <div
                                            className="p-4 relative min-h-[50vh] overflow-y-auto"
                                            ref={messages}
                                        >
                                        </div>

                                        <div className="flex items-center gap-5">
                                            <div className="min-w-[50vw]">
                                                <input
                                                    className="w-full p-2 rounded-lg bg-white bg-opacity-10 text-white"
                                                    type={"text"}
                                                    value={msgInput}
                                                    onChange={e => setMsgInput(e.target.value)}
                                                    placeholder="Enter your message"
                                                    required={true}
                                                />
                                            </div>
                                            <div className="w-fit flex justiy-center items-center gap-1">
                                                <input
                                                    className="w-full p-2 rounded-full bg-transparent bg-opacity-10 text-white"
                                                    type={"file"}
                                                    onChange={e => setFileInput(e.target.files[0])}
                                                />
                                                <button
                                                    className="group flex items-center justify-center gap-1 w-fit px-5 py-2 rounded-lg bg-white bg-opacity-10 text-white"
                                                    ref={sendButton}
                                                    onClick={connectToPeer}
                                                >
                                                    Send
                                                    <img className="group-hover:animate-pulse" width="24" height="24" src="https://img.icons8.com/material/24/F8B34B/filled-sent.png" alt="filled-sent" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )
                        : <Intro id={hostPeerId} />}
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
    const [id, setId] = React.useState('');

    React.useEffect(() => {
        getUserByEmail() // get user by email from cookies
            .then(data => {
                setUser(data);

                // async function
                async function resolveId() {
                    const resolvedId = await getIdByEmail(data.email); // get id by email
                    return resolvedId;
                }
                setId(resolveId);
                return getFriendList(data.email); // get friend list
            }
            ).then(res => {
                res.map(f => {
                    try {
                        getUserByEmail(f) // get friend details
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
        <main className="w-full flex flex-col-reverse sm:flex-row">
            <Friends list={list} error={error} />
            <MainBody user={user} hostPeerId={id} />
            {loading && <Loader />}
        </main>
    );
}

ReactDOM.render(<App />, document.getElementById('home_root'));