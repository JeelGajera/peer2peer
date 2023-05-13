//Create & Update User and set cookies
function createUser({ name, email, profileImg }) {
    const user = {
        name,
        profileImg,
        email,
        friendList: []
    };
    fetch('/api/peer/createPeer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(response => {
            if (response.ok) {
                console.log('User created successfully');
                window.location.href = '/home';
            } else {
                return response.json().then(error => {
                    throw new Error(error.message);
                });
            }
        })
        .catch(error => {
            alert(error.message);
        });

    // Clear cookies and set email cookie to expire in 1 month
    document.cookie = 'email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = `email=${email}; expires=${new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toUTCString()}; path=/;`;
}

//Get User by email
async function getUserByEmail(email) {
    try {
        // If email parameter is not provided, get it from cookies
        if (!email) {
            email = document.cookie.split('; ').find(row => row.startsWith('email')).split('=')[1];
        }

        const response = await fetch(`/api/peer/${email}`);

        if (response.ok) {
            return response.json();
        } else {
            const error = await response.json();
            throw new Error(error.message);
        }
    } catch (error) {
        alert(error.message);
    }
}


//Update User Friend List
const updateFriendList = async (hostEmail, friendEmail) => {
    try {
        const response = await fetch('/api/peer/update-friend-list', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                hostEmail: hostEmail,
                friendEmail: friendEmail
            })
        });
        if (response.ok) {
            const data = await response.text();
            console.log(data); // Friend list updated successfully
        } else {
            console.log('Request failed:', response.status);
        }
    } catch (error) {
        console.log('Request failed:', error);
    }
};

//Get User Friend List
const getFriendList = async (email) => {
    try {
        const response = await fetch(`/api/peer/get-friend-list/${email}`);
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.log('Request failed:', response.status);
        }
    } catch (error) {
        console.log('Request failed:', error);
    }
};