const peer = new Peer(); // Create a new PeerJS object // Enter id in contructor
let conn; // Connection object for the other peer

const messages = document.getElementById('messages'); // Element for displaying messages
const messageInput = document.getElementById('message-input'); // Input element for entering messages
const fileInput = document.getElementById('file-input'); // Input element for selecting files
const sendButton = document.getElementById('send-button'); // Button for sending messages and files


peer.on('open', () => {
    console.log(peer.id)
})
// Handle errors
peer.on('error', (error) => {
    console.error(error);
});

// Handle incoming connections
peer.on('connection', (connection) => {
    conn = connection;

    //connection = peer.connect(peer.id);
    // Handle incoming data
    conn.on('data', (data) => {
        if (typeof data === 'string') {
            // Received a text message
            const messageElement = document.createElement('div');
            messageElement.textContent = 'Other: ' + data;
            messages.appendChild(messageElement);
        } else if (data.type === 'file') {
            // Received a file
            console.log("in recevier 2");
            const fileBlob = new Blob([data.file], { type: data.filetype });
            const url = URL.createObjectURL(fileBlob);
            const linkElement = document.createElement('a');
            linkElement.href = url;
            console.log(url)
            linkElement.download = data.filename;
            linkElement.textContent = data.filename;
            messages.appendChild(linkElement);
        } else {
            console.log(data);
        }

        // Handle click event for the send button
        sendButton.addEventListener('click', () => {
            const message = messageInput.value.trim();
            const file = fileInput.files[0];

            if (!message && !file) {
                return;
            }

            if (!conn) {
                // Connect to other peer
                const otherPeerID = prompt('Enter other peer ID:');
                conn = peer.connect(otherPeerID);

                // Handle incoming data after connecting
                conn.on('data', (data) => {
                    if (typeof data === 'string') {
                        // Received a text message
                        const messageElement = document.createElement('div');
                        messageElement.textContent = 'Other: ' + data;
                        messages.appendChild(messageElement);
                    } else if (data.type === 'file') {
                        // Received a file
                        console.log("in recevier 1");
                        const fileBlob = new Blob([data.file], { type: data.filetype });
                        const url = URL.createObjectURL(fileBlob);
                        const linkElement = document.createElement('a');
                        linkElement.href = url;
                        console.log(url);
                        linkElement.download = data.filename;
                        linkElement.textContent = data.filename;
                        messages.appendChild(linkElement);
                    } else {
                        console.log(data);
                    }
                });
            }

            if (file) {
                // Send the file
                const filedata = undefined;
                const fileReader = new FileReader();
                fileReader.onload = (event) => {
                    filedata = new Uint8Array(event.target.result);

                }
                conn.send({
                    type: 'file',
                    file: filedata,
                    filetype: file.type,
                    filename: file.name,
                });


                const fileBlob = new Blob([file], { type: file.type });
                // Add the file to the UI
                const linkElement = document.createElement('a');
                linkElement.href = URL.createObjectURL(fileBlob);
                linkElement.download = file.name;
                linkElement.textContent = file.name;
                messages.appendChild(linkElement);
            } else {
                // Send the message
                conn.send(message);

                // Add the message to the UI
                const messageElement = document.createElement('div');
                messageElement.textContent = 'You: ' + message;
                messages.appendChild(messageElement);
            }

            // Clear the input fields
            messageInput.value = '';
            fileInput.value = '';
        });
    });
});
