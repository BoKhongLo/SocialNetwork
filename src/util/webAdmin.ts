import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "core-js/stable/atob";
import querystring from "querystring";

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


class LoginDto {
    public email: string;
    public password: string;

    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }
}

class CommandDto {
    public userId: string;
    public adminId: string;
    public command: string; // BANNED // UNBANNED // REMOVEADMIN
    constructor(userId: string, adminId: string, command: string) {
        this.userId = userId;
        this.adminId = adminId;
        this.command = command;
    }
}

class AdminDto {
    public userId: string;
    public secretKey: string; // the-kingdom-cum
    constructor(userId: string, secretKey: string, ) {
        this.userId = userId;
        this.secretKey = secretKey;
    }
}



export async function LoginAsync(dto: LoginDto) {
    const endpoint = 'http://103.155.161.116:3434/graphql';

    const QUERY =       
        `query Login ($email: String!, $password: String!) {
            Login(userDto: { 
                email: $email
                password: $password
                }) {
                access_token
                refresh_token
            }
        }`;

    const headers = {
        'Content-Type': 'application/json',
    };

    try {
        const response = await axios.post(
            endpoint,
            {
                query: QUERY,
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

        return saveData;
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function getUserDataByIdAsync(userId: string, accessToken: string) {
    const endpoint = 'http://103.155.161.116:3434/graphql';

    const QUERY = `
        query GetUser($userId: String!) {
            getUser(id: $userId) {
                id
                email
                detail {
                    name
                    nickName
                    birthday
                    gender
                    countryCode
                    description
                    phoneNumber
                    avatarUrl
                }
                created_at
                updated_at
                friends
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
                query: QUERY,
                variables: {
                    userId: userId
                },
            },
            { headers: headers }
        );
        console.log(response.data)
        if ("errors" in response.data) return response.data;
        return response.data.data.getUser

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}


export async function searchUserAsync(content: string, accessToken: string) {
    const endpoint = 'http://103.155.161.116:3434/graphql';

    const QUERY = `
    query FindUser ($content: String!){
        findUser(content: $content) {
            id
            email
            role
            created_at
            updated_at
            detail {
                name
                nickName
                birthday
                description
                phoneNumber
                countryCode
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
                query: QUERY,
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

export async function searchPostAsync(content: string, accessToken: string) {
    const endpoint = 'http://103.155.161.116:3434/graphql';

    const QUERY = `
    query SearchPost ($content: String!) {
        searchPost(content: $content) {
            id
            ownerUserId
            type
            linkedShare
            content
            fileUrl
            isDisplay
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
            comment {
                id
                userId
                roomId
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
                query: QUERY,
                variables: {
                    content: content
                },
            },
            { headers: headers }
        );
        if ("errors" in response.data) return response.data;
        return response.data.data.searchPost

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function banUserAsync(dto: CommandDto, accessToken: string,) {
    try {
        const formDataObject = {
            userId: dto.userId, 
            adminId: dto.adminId,
            command: dto.command
        };
      
        const formDataString = querystring.stringify(formDataObject);
        const response = await axios.post(`http://103.155.161.116:3434/auth/banUser`, formDataString, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        if (response.data == null) return null;
        return response.data
    } catch (error) {
        console.error('Error:', error);
    }
};

export async function unbanUserAsync(dto: CommandDto, accessToken: string,) {
    try {
        const formDataObject = {
            userId: dto.userId, 
            adminId: dto.adminId,
            command: dto.command
        };
      
        const formDataString = querystring.stringify(formDataObject);

        const response = await axios.post(`http://103.155.161.116:3434/auth/unbanUser`, formDataString, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        if (response.data == null) return null;
        return response.data
    } catch (error) {
        console.error('Error:', error);
    }
};

export async function addAdminAsync(dto: AdminDto, accessToken: string,) {
    try {

        const formDataObject = {userId: dto.userId, secretKey: dto.secretKey};

        const formDataString = querystring.stringify(formDataObject);

        const response = await axios.post(`http://103.155.161.116:3434/auth/addAdmin`, formDataString, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        if (response.data == null) return null;
        return response.data;
    } catch (error) {
        console.error('Error:', error);
    }
};

export async function removeAdminAsync(dto: CommandDto, accessToken: string,) {
    try {

        const formDataObject = {
            userId: dto.userId, 
            adminId: dto.adminId,
            command: dto.command
        };
      
        const formDataString = querystring.stringify(formDataObject);
        const response = await axios.post(`http://103.155.161.116:3434/auth/removeAdmin`, formDataString, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        if (response.data == null) return null;
        return response.data
    } catch (error) {
        console.error('Error:', error);
    }
};

export async function updateAccessTokenAsync(userId: string, refreshToken: string) {
    const endpoint = 'http://103.155.161.116:3434/graphql';

    const MUTATION = `
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
                query: MUTATION,
                variables: {
                    userId: userId
                },
            },
            { headers: headers }
        );
        if ("errors" in response.data) return response.data;
        const decoded = jwtDecode<JwtPayload>(response.data.data.Refresh.access_token);

        let saveData = {
            "id": decoded.id,
            "email": decoded.email,
            "accessToken": response.data.data.Refresh.access_token,
            "refreshToken": response.data.data.Refresh.refresh_token,
            "lastUpdated": new Date().toISOString()
        }

        return saveData;

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}


export async function getAllUserAsync(userId: string, assessToken: string) {
    const endpoint = 'http://103.155.161.116:3434/graphql';

    const MUTATION = `
        query GetAllUser ($userId: String!){
            getAllUser(userId: $userId) {
                id
                email
                role
                isOnline
                friends
                bookMarks
                created_at
                updated_at
                detail {
                    name
                    nickName
                    birthday
                    description
                    phoneNumber
                    gender
                    countryCode
                    avatarUrl
                }
            }
        }`;

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${assessToken}`,
    };

    try {
        const response = await axios.post(
            endpoint,
            {
                query: MUTATION,
                variables: {
                    userId: userId
                },
            },
            { headers: headers }
        );
        if ("errors" in response.data) return response.data;
        
        return response.data.data.getAllUser;

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function getAllPostAsync(userId: string, refreshToken: string) {
    const endpoint = 'http://103.155.161.116:3434/graphql';

    const MUTATION = `
        query GetAllPost ($userId: String!){
            getAllPost(userId: $userId) {
                id
                ownerUserId
                type
                linkedShare
                content
                fileUrl
                isDisplay
                created_at
                updated_at
                comment {
                    id
                    userId
                    roomId
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
                interaction {
                    id
                    content
                    userId
                    isDisplay
                    created_at
                    updated_at
                }
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
                query: MUTATION,
                variables: {
                    userId: userId
                },
            },
            { headers: headers }
        );
        if ("errors" in response.data) return response.data;
        return response.data.data.getAllPost;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}