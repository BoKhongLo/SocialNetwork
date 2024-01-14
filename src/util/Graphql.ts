import axios from "axios";
import { LoginDto, SignUpDto, ValidateUserDto, ChangePasswordDto, ValidateMessagesDto, RoomchatDto } from './dto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";
import "core-js/stable/atob";

class JwtPayload {
    id: string;
    email: string;
    iat: number;
    exp: number;

    constructor(id: string, email: string, iat: number, exp: number) {
        this.id = id;
        this.email = email;
        this.iat = iat;
        this.exp = exp;
    }
}


export async function saveDataUserLocal(userId: string, data: any): Promise<void> {
    try {
        const jsonValue = JSON.stringify(data);
        return await AsyncStorage.setItem(userId, jsonValue);
    } catch (e) {
        console.error('Error:', e);
    }
}

export async function getDataUserLocal(userId: string): Promise<any> {
    try {
        const jsonValue = await AsyncStorage.getItem(userId);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.error('Error:', e);
    }
}

export async function getAllIdUserLocal(): Promise<string[]> {
    let keys: string[] = [];
    try {
        const fetchedKeys: readonly string[] = await AsyncStorage.getAllKeys();
        keys = [...fetchedKeys];

    } catch (e) {
        console.error("Error fetching keys:", e);
    }
    return keys;
}

export async function deleteDataUserLocal(userId: string): Promise<void> {
    try {
        await AsyncStorage.removeItem(userId)
    } catch (e) {
        console.error('Error:', e);
    }
}


export async function LoginAsync(dto: LoginDto) {
    const endpoint = 'http://103.144.87.14:3434/graphql';

    const LOGIN_QUERY = `
      query Login($email: String!, $password: String!) {
        Login(userDto: {
          email: $email
          password: $password
        }) {
          access_token
          refresh_token
        }
      }
    `;

    const headers = {
        'Content-Type': 'application/json',
    };

    try {
        const response = await axios.post(
            endpoint,
            {
                query: LOGIN_QUERY,
                variables: {
                    email: dto.email,
                    password: dto.password
                },
            },
            { headers: headers }
        );
        if ("errors" in response.data) return response.data;
        const decoded = jwtDecode<JwtPayload>(response.data.data.Login.access_token);

        const saveData = {
            "id": decoded.id,
            "email": decoded.email,
            "accessToken": response.data.data.Login.access_token,
            "refreshToken": response.data.data.Login.refresh_token,
            "lastUpdated": new Date().toISOString()
        }

        await deleteDataUserLocal(decoded.id)
        await saveDataUserLocal(decoded.id, saveData)

        return saveData;
    } catch (error) {
        console.error('Error:', error);
    }
}


export async function SignupAsync(dto: SignUpDto) {
    const endpoint = 'http://103.144.87.14:3434/graphql';

    const SIGNUP_MUTATION = `
            mutation SignUp($email: String!, $password: String!, $name: String!, $birthday: DateTime, $phoneNumber: Float) {
                SignUp(userDto: {
                    email: $email
                    password: $password
                    name: $name
                    birthday: $birthday
                    phoneNumber: $phoneNumber
                }) {
                    access_token
                    refresh_token
                }
            }
        `;

    const headers = {
        'Content-Type': 'application/json',
    };

    try {
        const response = await axios.post(
            endpoint,
            {
                query: SIGNUP_MUTATION,
                variables: {
                    email: dto.email,
                    password: dto.password,
                    name: dto.name,
                    birthday: dto.birthday,
                    phoneNumber: dto.phoneNumber
                },
            },
            { headers: headers }
        );

        if ("errors" in response.data) return response.data;
        const decoded = jwtDecode<JwtPayload>(response.data.data.SignUp.access_token);

        const saveData = {
            "id": decoded.id,
            "email": decoded.email,
            "accessToken": response.data.data.SignUp.access_token,
            "refreshToken": response.data.data.SignUp.refresh_token,
            "lastUpdated": new Date().toISOString()
        }

        await deleteDataUserLocal(decoded.id)
        await saveDataUserLocal(decoded.id, saveData)

        return saveData;

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function validateUserDataAsync(dto: ValidateUserDto, accessToken: string) {
    const endpoint = 'http://103.144.87.14:3434/graphql';

    const VALIDATE_USER_QUERY = `
        mutation ValidateUser ($userId: String!, $name: String!, $nickName: String!, $description: String!, $avatarUrl: String, $birthday: DateTime) {
            validateUser(
                validateUser: {
                    userId: $userId
                    name: $name
                    nickName: $nickName
                    description: $description
                    avatarUrl: $avatarUrl
                    birthday: $birthday
                }
            ) {
                id
                email
                isOnline
                friends
                created_at
                updated_at
                detail {
                    name
                    nickName
                    birthday
                    age
                    description
                    phoneNumber
                    avatarUrl
                }
            }
        }`;

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
    };

    try {
        const response = await axios.post(
            endpoint,
            {
                query: VALIDATE_USER_QUERY,
                variables: {
                    userId: dto.userId,
                    name: dto.name,
                    nickName: dto.nickName,
                    description: dto.description,
                    avatarUrl: dto.avatarUrl,
                    birthday: dto.birthday,
                },
            },
            { headers: headers }
        );
        if ("errors" in response.data) return response.data;
        return response.data.data.validateUser
        
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}


export async function updateAccessTokenAsync(userId: string, refreshToken: string) {
    const endpoint = 'http://103.144.87.14:3434/graphql';

    const SIGNUP_MUTATION = `
        query Refresh ($userId: String!) {
            Refresh(id: $userId) {
                access_token
                refresh_token
            }
        }`;

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${refreshToken}`,
    };

    try {
        const response = await axios.post(
            endpoint,
            {
                query: SIGNUP_MUTATION,
                variables: {
                    userId: userId
                },
            },
            { headers: headers }
        );
        if ("errors" in response.data) return response.data;
        const decoded = jwtDecode<JwtPayload>(response.data.data.Refresh.access_token);

        const saveData = {
            "id": decoded.id,
            "email": decoded.email,
            "accessToken": response.data.data.Refresh.access_token,
            "refreshToken": response.data.data.Refresh.refresh_token,
            "lastUpdated": new Date().toISOString()
        }

        await deleteDataUserLocal(decoded.id)
        await saveDataUserLocal(decoded.id, saveData)

        return saveData;

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}


export async function getUserDataAsync(userId: string, accessToken: string) {
    const endpoint = 'http://103.144.87.14:3434/graphql';

    const GET_USER_QUERY = `
        query GetUser($userId: String!) {
            getUser(id: $userId) {
                id
                email
                detail {
                    name
                    nickName
                    birthday
                    age
                    description
                    phoneNumber
                    avatarUrl
                }
                created_at
                updated_at
                notification {
                    id
                    type
                    content
                    fileUrl
                    created_at
                    updated_at
                }
                friends
                member
                bookMarks
                isOnline
            }
        }`;

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
    };

    try {
        const response = await axios.post(
            endpoint,
            {
                query: GET_USER_QUERY,
                variables: {
                    userId: userId
                },
            },
            { headers: headers }
        );
        if ("errors" in response.data) return response.data;
        return response.data.data.getUser
        
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function getAllRoomchatAsync(userId: string, accessToken: string) {
    const endpoint = 'http://103.144.87.14:3434/graphql';

    const GET_ALL_ROOMCHAT_QUERY = `
    query GetAllRomchatByUserId ($userId: String!) {
        getAllRomchatByUserId(id: $userId) {
            isDisplay
            isSingle
            ownerUserId
            description
            imgDisplay
            member
            created_at
            updated_at
            memberOut {
                memberId
                messageCount
                created_at
                updated_at
            }
            id
            title
        }
    }`;

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
    };

    try {
        const response = await axios.post(
            endpoint,
            {
                query: GET_ALL_ROOMCHAT_QUERY,
                variables: {
                    userId: userId
                },
            },
            { headers: headers }
        );
        if ("errors" in response.data) return response.data;
        return response.data.data.getAllRomchatByUserId

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function getRoomchatAsync(id: string, accessToken: string) {
    const endpoint = 'http://103.144.87.14:3434/graphql';

    const GET_ROOMCHAT_QUERY = `
    query GetRomchatById ($roomchatId: String!) {
        getRomchatById(roomchatId: $roomchatId) {
            id
            isDisplay
            ownerUserId
            description
            imgDisplay
            isSingle
            member
            created_at
            updated_at
            data {
                id
                userId
                isDisplay
                content
                fileUrl
                created_at
                updated_at
                interaction {
                    id
                    content
                    userId
                    isDisplay
                    created_at
                    updated_at
                }
            }
            memberOut {
                memberId
                messageCount
                created_at
                updated_at
            }
            title
        }
    }`;

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
    };

    try {
        const response = await axios.post(
            endpoint,
            {
                query: GET_ROOMCHAT_QUERY,
                variables: {
                    roomchatId: id
                },
            },
            { headers: headers }
        );
        if ("errors" in response.data) return response.data;
        return response.data.data.getRomchatById

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}


export async function changePasswordAsync(dto: ChangePasswordDto, accessToken: string) {
    const endpoint = 'http://103.144.87.14:3434/graphql';

    const CHANGE_PASSWORD_QUERY = `
    mutation ChangePassword ($userId: String!, $currentPassword: String!, $newPassword: String!, $validatePassword: String!) {
        changePassword(
            changePassword: {
                userId: $userId
                currentPassword: $currentPassword
                newPassword: $newPassword
                validatePassword: $validatePassword
            }
        ) {
            id
            isOnline
            created_at
            updated_at
        }
    }`;

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
    };

    try {
        const response = await axios.post(
            endpoint,
            {
                query: CHANGE_PASSWORD_QUERY,
                variables: {
                    userId: dto.userId,
                    currentPassword: dto.currentPassword,
                    newPassword: dto.newPassword,
                    validatePassword: dto.validatePassword
                },
            },
            { headers: headers }
        );
        if ("errors" in response.data) return response.data;
        return response.data.data.changePassword

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}


export async function removeMessageAsync(dto: ValidateMessagesDto, accessToken: string) {
    const endpoint = 'http://103.144.87.14:3434/graphql';

    const GET_USER_QUERY = `
    mutation RemoveMessageRoomchat ($userId: String!, $roomchatId: String!, $messageId: String!) {
        removeMessageRoomchat(
            removeMessage: {
                roomchatId: $roomchatId
                userId: $userId
                messageId: $messageId
            }
        ) {
            data
        }
    }`;

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
    };

    try {
        const response = await axios.post(
            endpoint,
            {
                query: GET_USER_QUERY,
                variables: {
                    userId: dto.userId,
                    roomchatId: dto.roomchatId,
                    messageId: dto.messagesId
                },
            },
            { headers: headers }
        );
        if ("errors" in response.data) return response.data;
        return response.data.data.removeMessageRoomchat

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}



export async function createRoomchatAsync(dto : RoomchatDto, accessToken: string) {
    const endpoint = 'http://103.144.87.14:3434/graphql';

    const GET_USER_QUERY = `
    mutation CreateRoomChat ($userId: String!, $member: [String!]!, $title: String!, $isSingle: Boolean!, $description: String, $imgDisplay: String) {
        createRoomChat(
            createRoom: {
                userId: $userId
                member: $member
                title: $title
                isSingle: $isSingle 
                description: $description
                imgDisplay: $imgDisplay
            }
        ) {
            id
            ownerUserId
            member
            created_at
            updated_at
            memberOut {
                memberId
                messageCount
                created_at
                updated_at
            }
            description
            imgDisplay
            isDisplay
            isSingle
            title
            data {
                id
                userId
                isDisplay
                content
                fileUrl
                created_at
                updated_at
            }
        }
    }`;

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
    };

    try {
        const response = await axios.post(
            endpoint,
            {
                query: GET_USER_QUERY,
                variables: {
                    userId: dto.userId,
                    member: dto.member,
                    title: dto.title,
                    isSingle: dto.isSingle,
                    description: dto.description,
                    imgDisplay: dto.imgDisplay,
                },
            },
            { headers: headers }
        );
        if ("errors" in response.data) return response.data;
        return response.data.data.createRoomChat

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}


export async function removeRoomchatAsync(userId: string, roomchatId: string, accessToken: string) {
    const endpoint = 'http://103.144.87.14:3434/graphql';

    const GET_USER_QUERY = `
    mutation RemoveRoomChat ($userId: String!, $roomchatId: String!) {
        removeRoomChat( removeRoomChat: { 
            userId: $userId
            roomchatId: $roomchatId
            }
        ) {
            data
        }
    }`;

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
    };

    try {
        const response = await axios.post(
            endpoint,
            {
                query: GET_USER_QUERY,
                variables: {
                    userId: userId,
                    roomchatId: roomchatId
                },
            },
            { headers: headers }
        );
        if ("errors" in response.data) return response.data;
        return response.data.data.removeRoomChat

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}


export async function findFriendAsync(content: string, accessToken: string) {
    const endpoint = 'http://103.144.87.14:3434/graphql';

    const GET_USER_QUERY = `
    query FindUser ($content: String!){
        findUser(content: $content) {
            id
            email
            friends
            created_at
            updated_at
            detail {
                name
                nickName
                birthday
                age
                description
                phoneNumber
                avatarUrl
            }
        }
    }`;

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
    };

    try {
        const response = await axios.post(
            endpoint,
            {
                query: GET_USER_QUERY,
                variables: {
                    content: content
                },
            },
            { headers: headers }
        );
        if ("errors" in response.data) return response.data;
        return response.data.data.findUser

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}


export async function addFriendAsync(userId: string, friendId: string, accessToken: string) {
    const endpoint = 'http://103.144.87.14:3434/graphql';

    const GET_USER_QUERY = `
    mutation AddFriendUser ($userId: String!, $friendId: String!){
        addFriendUser(
            addFriend: {
                userId: $userId
                friendId: $friendId
            }
        ) {
            id
            receiveUserId
            value
            created_at
            updated_at
            createdUserId
            isDisplay
        }
    }`;

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
    };

    try {
        const response = await axios.post(
            endpoint,
            {
                query: GET_USER_QUERY,
                variables: {
                    userId: userId,
                    friendId: friendId
                },
            },
            { headers: headers }
        );
        if ("errors" in response.data) return response.data;
        return response.data.data.addFriendUser

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function acceptFriendAsync(userId: string, friendId: string, accessToken: string) {
    const endpoint = 'http://103.144.87.14:3434/graphql';

    const GET_USER_QUERY = `
    query AcceptFriendUser ($userId: String!, $friendId: String!) {
        acceptFriendUser(
            acceptFriend: {
                userId: $userId
                friendId: $friendId
            }
        ){
            id
            createdUserId
            receiveUserId
            value
            isDisplay
            created_at
            updated_at
        }
    }`;

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
    };

    try {
        const response = await axios.post(
            endpoint,
            {
                query: GET_USER_QUERY,
                variables: {
                    userId: userId,
                    friendId: friendId
                },
            },
            { headers: headers }
        );
        if ("errors" in response.data) return response.data;
        return response.data.data.acceptFriendUser

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function removeFriendAsync(userId: string, friendId: string, accessToken: string) {
    const endpoint = 'http://103.144.87.14:3434/graphql';

    const GET_USER_QUERY = `
    mutation RemoveFriendUser ($userId: String!, $friendId: String!) {
        removeFriendUser(removeFriend: {
            userId: $userId
            friendId: $friendId
            }
        ) {
            id
            createdUserId
            receiveUserId
            value
            isDisplay
            created_at
            updated_at
        }
    }`;

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
    };

    try {
        const response = await axios.post(
            endpoint,
            {
                query: GET_USER_QUERY,
                variables: {
                    userId: userId,
                    friendId: friendId
                },
            },
            { headers: headers }
        );
        if ("errors" in response.data) return response.data;
        return response.data.data.removeFriendUser

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function getFriendRequestAsync(userId: string, accessToken: string) : Promise<[]> {
    const endpoint = 'http://103.144.87.14:3434/graphql';

    const GET_USER_QUERY = `
    query GetFriendRequest ($userId: String!) {
        getFriendRequest(id: $userId) {
            id
            createdUserId
            receiveUserId
            value
            isDisplay
            created_at
            updated_at
        }
    }`;

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
    };

    try {
        const response = await axios.post(
            endpoint,
            {
                query: GET_USER_QUERY,
                variables: {
                    userId: userId,
                },
            },
            { headers: headers }
        );
        if ("errors" in response.data) return response.data;
        return response.data.data.getFriendRequest
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}