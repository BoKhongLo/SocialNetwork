import axios from "axios";
import { LoginDto, SignUpDto, ValidateUserDto } from './dto';
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
