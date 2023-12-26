import axios from "axios";
import { LoginDto, SignUpDto } from './dto';
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


export async function saveDataUser(userId: string, data: any): Promise<void> {
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

export async function deleteDataUser(userId: string): Promise<void> {
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
        const decoded = jwtDecode<JwtPayload>(response.data.data.Login.access_token);

        const saveData = {
            "id": decoded.id,
            "email": decoded.email,
            "accessToken": response.data.data.Login.access_token,
            "refreshToken": response.data.data.Login.refresh_token,
            "lastUpdated": new Date().toISOString()
        }

        await deleteDataUser(decoded.id)
        await saveDataUser(decoded.id, saveData)

        return saveData;
    } catch (error) {
        console.error('Error:', error);
    }
}


export async function SignupAsync(dto: SignUpDto) {
    const endpoint = 'http://103.144.87.14:3434/graphql';

    const SIGNUP_MUTATION = `
            mutation SignUp($email: String!, $password: String!, $name: String!, $birthday: Date, $phoneNumber: String) {
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
        const decoded = jwtDecode<JwtPayload>(response.data.data.Login.access_token);

        const saveData = {
            "id": decoded.id,
            "email": decoded.email,
            "accessToken": response.data.data.Login.access_token,
            "refreshToken": response.data.data.Login.refresh_token,
            "lastUpdated": new Date().toISOString()
        }

        await deleteDataUser(decoded.id)
        await saveDataUser(decoded.id, saveData)

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
        return response.data.data.getUser;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
