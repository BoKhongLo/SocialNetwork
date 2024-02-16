import axios from "axios";
import {
    LoginDto,
    SignUpDto,
    ValidateUserDto,
    ChangePasswordDto,
    ValidateMessagesDto,
    RoomchatDto,
    PostDto,
    InteractDto,
    BookmarksDto,
    ForgetPasswordDto,
    PaymentDto,
    ValidateMemberRoomDto,
    MemberRoomDto,
    ValidateRoomchatDto,
    ValidatePrivacyUserDto
} from './dto';
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

        await deleteDataUserLocal(decoded.id)
        await saveDataUserLocal(decoded.id, saveData)

        return saveData;
    } catch (error) {
        console.error('Error:', error);
    }
}


export async function CreateOtpCodeAsync(email: string, type: string) {
    const endpoint = 'http://103.155.161.116:3434/graphql';

    const MUTATION = `
            mutation CreateOtpCode($email: String!, $type: String!) {
                createOtpCode(createOtp: { 
                        email: $email
                        type: $type
                    }) {
                    isRequest
                }
            }`;

    const headers = {
        'Content-Type': 'application/json',
    };

    try {
        const response = await axios.post(
            endpoint,
            {
                query: MUTATION,
                variables: {
                    email: email,
                    type: type,
                },
            },
            { headers: headers }
        );

        if ("errors" in response.data) return response.data;
        return response.data.data.createOtpCode
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
export async function ValidateOtpCodeAsync(email: string, otpCode: string, type: string) {
    const endpoint = 'http://103.155.161.116:3434/graphql';

    const MUTATION = `
            mutation ValidateOtpCode ($email: String!, $otpCode: String, $type: String!){
                validateOtpCode(validateOtp: { 
                    email: $email
                    otpCode: $otpCode
                    type: $type
                }) {
                    isRequest
                    otpId
                }
            }`;

    const headers = {
        'Content-Type': 'application/json',
    };

    try {
        const response = await axios.post(
            endpoint,
            {
                query: MUTATION,
                variables: {
                    email: email,
                    otpCode:otpCode,
                    type: type
                },
            },
            { headers: headers }
        );

        if ("errors" in response.data) return response.data;
        return response.data.data.validateOtpCode


    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
export async function forgetPasswordValidate(dto: ForgetPasswordDto) {
    const endpoint = 'http://103.155.161.116:3434/graphql';

    const MUTATION = `
            query ForgetPasswordValidate ($email: String!, $otpCode: String!, $newPassword: String!, $validatePassword: String!) {
                forgetPasswordValidate(
                    forgetPassword: {
                        email: $email
                        otpId: $otpCode
                        newPassword: $newPassword
                        validatePassword: $validatePassword
                    }
                ) {
                    id
                    email
                    role
                    isOnline
                    friends
                    bookMarks
                    created_at
                    updated_at
                }
            }`;

    const headers = {
        'Content-Type': 'application/json',
    };

    try {
        const response = await axios.post(
            endpoint,
            {
                query: MUTATION,
                variables: {
                    email: dto.email,
                    otpId: dto.otpId,
                    newPassword: dto.newPassword,
                    validatePassword: dto.validatePassword,
                },
            },
            { headers: headers }
        );

        if ("errors" in response.data) return response.data;
        return response.data.data.forgetPasswordValidate

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
export async function SignupAsync(dto: SignUpDto) {
    const endpoint = 'http://103.155.161.116:3434/graphql';

    const MUTATION = `
        mutation SignUp ($email: String!, $password: String!, $name: String!, $otpId: String!, $birthday: DateTime, $phoneNumber: String,  $gender: String, $countryCode: String) {
            SignUp(
                userDto: {
                    name: $name
                    otpId: $otpId
                    password: $password
                    birthday: $birthday
                    gender: $gender
                    phoneNumber: $phoneNumber
                    countryCode: $countryCode
                    email: $email
                }
            ) {
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
                query: MUTATION,
                variables: {
                    email: dto.email,
                    password: dto.password,
                    name: dto.name,
                    birthday: dto.birthday,
                    phoneNumber: dto.phoneNumber,
                    otpId: dto.otpId,
                    gender: dto.gender,
                    countryCode: dto.countryCode
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
    const endpoint = 'http://103.155.161.116:3434/graphql';

    const QUERY = `
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
                    description
                    phoneNumber
                    avatarUrl
                    gender
                    countryCode
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
        // const keys = await getAllIdUserLocal();
        // const dataLocal = await getDataUserLocal(keys[keys.length - 1]);
        // saveData.id = dataLocal.id
        // await deleteDataUserLocal(dataLocal.id)
        // await saveDataUserLocal(dataLocal.id, saveData)
        return saveData;

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}


export async function getUserDataAsync(userId: string, accessToken: string) {
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
                notification {
                    id
                    type
                    isRead
                    isDisplay
                    created_at
                    updated_at
                    content {
                        roomId
                        userDtoId
                    }
                }
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
        if ("errors" in response.data) return response.data;
        return response.data.data.getUser

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function getUserDataLiteAsync(userId: string, accessToken: string) {
    const endpoint = 'http://103.155.161.116:3434/graphql';

    const QUERY = `
        query GetUser ($id: String!) {
            getUser(id: $id) {
                id
                role
                isOnline
                friends
                created_at
                updated_at
                detail {
                    name
                    nickName
                    gender
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
                    id: userId
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
    const endpoint = 'http://103.155.161.116:3434/graphql';

    const QUERY = `
    query GetAllRomchatByUserId ($userId: String!) {
        getAllRomchatByUserId(id: $userId) {
            isDisplay
            role
            memberNickname
            isBlock
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
                query: QUERY,
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
    const endpoint = 'http://103.155.161.116:3434/graphql';

    const QUERY = `
        query GetRomchatById ($roomchatId: String!) {
            getRomchatById(roomchatId: $roomchatId) {
                title
                isDisplay
                isSingle
                isBlock
                ownerUserId
                description
                imgDisplay
                member
                memberNickname
                role
                created_at
                updated_at
                id
                memberOut {
                    memberId
                    messageCount
                    created_at
                    updated_at
                }
                data {
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

export async function getRoomchatByTitleAsync(id: string, accessToken: string) {
    const endpoint = 'http://103.155.161.116:3434/graphql';

    const QUERY = `
        query GetRomchatByTitle ($roomchatId: String!) {
            getRomchatByTitle (roomchatId: $roomchatId) {
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
                query: QUERY,
                variables: {
                    roomchatId: id
                },
            },
            { headers: headers }
        );
        if ("errors" in response.data) return response.data;
        return response.data.data.getRomchatByTitle

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function addMemberRoomchatAsync(payload: MemberRoomDto, accessToken: string) {
    const endpoint = 'http://103.155.161.116:3434/graphql';

    const QUERY = `
        mutation AddMemberRomchat ($userId: String!, $roomchatId: String!, $member: [String!]!) {
            addMemberRomchat(
                addMember: { 
                    userId: $userId
                    roomchatId: $roomchatId
                    member: $member
                }
            ) {
                id
                title
                isDisplay
                isSingle
                isBlock
                ownerUserId
                description
                imgDisplay
                member
                memberNickname
                role
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
                query: QUERY,
                variables: {
                    userId: payload.userId,
                    roomchatId: payload.roomId,
                    member: [...payload.member]
                },
            },
            { headers: headers }
        );
        if ("errors" in response.data) return response.data;
        return response.data.data.addMemberRomchat

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function removeMemberRoomchatAsync(payload: MemberRoomDto, accessToken: string) {
    const endpoint = 'http://103.155.161.116:3434/graphql';

    const QUERY = `
        mutation RemoveMemberRoomchat ($userId: String!, $roomchatId: String!, $member: [String!]!) {
            removeMemberRoomchat(
                removeMember: { 
                    userId: $userId
                    roomchatId: $roomchatId
                    member: $member
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
                query: QUERY,
                variables: {
                    userId: payload.userId,
                    roomchatId: payload.roomId,
                    member: payload.member
                },
            },
            { headers: headers }
        );
        if ("errors" in response.data) return response.data;
        return response.data.data.removeMemberRoomchat

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function blockRoomchatAsync(userId: string, roomId: string, accessToken: string) {
    const endpoint = 'http://103.155.161.116:3434/graphql';

    const QUERY = `
        mutation BlockRoomchat ($userId: String!, $title: String!, $roomchatId: String!)  {
            blockRoomchat(
                blockRoomchat: { 
                    userId: $userId
                    title: $title
                    roomchatId: $roomchatId
                    }
                ) {
                    id
                    title
                    isDisplay
                    isSingle
                    isBlock
                    ownerUserId
                    description
                    imgDisplay
                    member
                    memberNickname
                    role
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
                query: QUERY,
                variables: {
                    userId: userId,
                    title: "-1",
                    roomchatId: roomId
                },
            },
            { headers: headers }
        );
        if ("errors" in response.data) return response.data;
        return response.data.data.blockRoomchat

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function unblockRoomchatAsync(userId: string, roomId: string, accessToken: string) {
    const endpoint = 'http://103.155.161.116:3434/graphql';

    const QUERY = `
        mutation UnblockRoomchat ($userId: String!, $title: String!, $roomchatId: String!) {
            unblockRoomchat(
                unblockRoomchat: { 
                    userId: $userId
                    title: $title
                    roomchatId: $roomchatId
                }
            ) {
                id
                title
                isDisplay
                isSingle
                isBlock
                ownerUserId
                description
                imgDisplay
                member
                memberNickname
                role
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
                query: QUERY,
                variables: {
                    userId: userId,
                    title: "-1",
                    roomchatId: roomId
     
                },
            },
            { headers: headers }
        );
        if ("errors" in response.data) return response.data;
        return response.data.data.unblockRoomchat

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function addModRoomchatAsync(payload: MemberRoomDto, accessToken: string) {
    const endpoint = 'http://103.155.161.116:3434/graphql';

    const QUERY = `
        mutation AddModRoomchat ($userId: String!, $roomchatId: String!, $member: [String!]!){
            addModRoomchat(
                addMod: { 
                    userId: $userId
                    roomchatId: $roomchatId
                    member: $member
                }
            ) {
                id
                title
                isDisplay
                isSingle
                isBlock
                ownerUserId
                description
                imgDisplay
                member
                memberNickname
                role
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
                query: QUERY,
                variables: {
                    userId: payload.userId,
                    roomchatId: payload.roomId,
                    member: payload.member
                },
            },
            { headers: headers }
        );
        console.log(response.data);
        if ("errors" in response.data) return response.data;
        return response.data.data.addModRoomchat

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function removeModRoomchatAsync(payload: MemberRoomDto, accessToken: string) {
    const endpoint = 'http://103.155.161.116:3434/graphql';

    const QUERY = `
        mutation RemoveModRoomchat ($userId: String!, $roomchatId: String!, $member: [String!]!){
            removeModRoomchat(
                removeMod: { 
                    userId: $userId
                    roomchatId: $roomchatId
                    member: $member
                }
            ) {
                id
                title
                isDisplay
                isSingle
                isBlock
                ownerUserId
                description
                imgDisplay
                member
                memberNickname
                role
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
                query: QUERY,
                variables: {
                    userId: payload.userId,
                    roomchatId: payload.roomId,
                    member: payload.member
                },
            },
            { headers: headers }
        );
        if ("errors" in response.data) return response.data;
        return response.data.data.removeModRoomchat

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}


export async function validateNicknameMemberRoomchatAsync(payload: ValidateMemberRoomDto, accessToken: string) {
    const endpoint = 'http://103.155.161.116:3434/graphql';

    const QUERY = `
    mutation ValidateNicknameMemberRoomchat ($userId: String!, $roomchatId: String!, $nickName: String, $fileUrl: [String!]) {
        validateNicknameMemberRoomchat(
            validateNicknameMember: {
                userId: $userId
                roomchatId: $roomchatId
                nickName: $nickName
                fileUrl: $fileUrl
            }
        ) {
            id
            title
            isDisplay
            isSingle
            isBlock
            ownerUserId
            description
            imgDisplay
            member
            memberNickname
            role
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
                query: QUERY,
                variables: {
                    userId: payload.userId,
                    roomchatId: payload.roomId,
                    nickName: payload.nickname,
                    fileUrl: payload.fileUrl
                },
            },
            { headers: headers }
        );
        if ("errors" in response.data) return response.data;
        return response.data.data.validateNicknameMemberRoomchat

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
export async function changePasswordAsync(dto: ChangePasswordDto, accessToken: string) {
    const endpoint = 'http://103.155.161.116:3434/graphql';

    const QUERY = `
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
                query: QUERY,
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
    const endpoint = 'http://103.155.161.116:3434/graphql';

    const QUERY = `
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
                query: QUERY,
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



export async function createRoomchatAsync(dto: RoomchatDto, accessToken: string) {
    const endpoint = 'http://103.155.161.116:3434/graphql';

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
            role
            memberNickname
            isBlock
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


export async function validateRoomchatAsync(dto: ValidateRoomchatDto, accessToken: string) {
    const endpoint = 'http://103.155.161.116:3434/graphql';
    
    const GET_USER_QUERY = `
        mutation ValidateRomchat ($userId: String!, $roomchatId: String!, $title: String!, $description: String, $imgDisplay: String){
            validateRomchat(
                validateRoom: {
                    roomchatId: $roomchatId
                    title: $title
                    userId: $userId
                    imgDisplay: $imgDisplay
                    description: $description
                }
            ) {
                id
                title
                isDisplay
                isSingle
                isBlock
                ownerUserId
                description
                imgDisplay
                member
                memberNickname
                role
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
                    userId: dto.userId,
                    roomchatId: dto.roomId,
                    title: dto.title,
                    description: dto.description,
                    imgDisplay: dto.imgDisplay,
                },
            },
            { headers: headers }
        );
        if ("errors" in response.data) return response.data;
        return response.data.data.validateRomchat

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function removeRoomchatAsync(userId: string, roomchatId: string, accessToken: string) {
    const endpoint = 'http://103.155.161.116:3434/graphql';

    const GET_USER_QUERY = `
    mutation RemoveRoomChat ($roomchatId: String!, $title: String!, $userId: String!) {
        removeRoomChat(
            removeRoomChat: { 
                roomchatId: $roomchatId
                title: $title
                userId: $userId
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
                    roomchatId: roomchatId,
                    title: "-1",
                    userId: userId,
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
    const endpoint = 'http://103.155.161.116:3434/graphql';

    const QUERY = `
    query FindUser ($content: String!){
        findUser(content: $content) {
            id
            email
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


export async function addFriendAsync(userId: string, friendId: string, accessToken: string) {
    const endpoint = 'http://103.155.161.116:3434/graphql';

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
    const endpoint = 'http://103.155.161.116:3434/graphql';

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
    const endpoint = 'http://103.155.161.116:3434/graphql';

    const GET_USER_QUERY = `
        mutation RemoveFriendUser ($userId: String!, $friendId: String!) {
            removeFriendUser(removeFriend: {
                userId: $userId
                friendId: $friendId
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

export async function getFriendRequestAsync(userId: string, accessToken: string): Promise<[]> {
    const endpoint = 'http://103.155.161.116:3434/graphql';

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

export async function getFriendReceiveAsync(userId: string, accessToken: string): Promise<[]> {
    const endpoint = 'http://103.155.161.116:3434/graphql';

    const QUERY = `
    query GetFriendReceive ($userId: String!) {
        getFriendReceive(id: $userId) {
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
                query: QUERY,
                variables: {
                    userId: userId,
                },
            },
            { headers: headers }
        );
        if ("errors" in response.data) return response.data;
        return response.data.data.getFriendReceive
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function createPostAsync(dto: PostDto, accessToken: string) {
    const endpoint = 'http://103.155.161.116:3434/graphql';

    const QUERY = `
    mutation CreatePost ($userId: String!, $type: String!, $content: String, $fileUrl: [String!]!) {
        createPost(
            createPost: {
                userId: $userId
                type: $type
                content: $content
                fileUrl: $fileUrl
            }
        ) {
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
        'Authorization': `Bearer ${accessToken}`,
    };

    try {
        const response = await axios.post(
            endpoint,
            {
                query: QUERY,
                variables: {
                    userId: dto.userId,
                    type: dto.type,
                    content: dto.content,
                    fileUrl: dto.fileUrl
                },
            },
            { headers: headers }
        );
        if ("errors" in response.data) return response.data;
        return response.data.data.createPost
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}


export async function findPostAsync(content: string, accessToken: string) {
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


export async function getPostDailyAsync(userId: string, accessToken: string) {
    const endpoint = 'http://103.155.161.116:3434/graphql';

    const QUERY = `
    query GetDailyPostByUserId($userId: String!) {
        getDailyPostByUserId(userId: $userId) {
            id
            ownerUserId
            type
            updated_at
            created_at
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
            isDisplay
            fileUrl
            content
            linkedShare
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
        if ("errors" in response.data) return response.data;
        return response.data.data.getDailyPostByUserId

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function getPostAsync(postId: string, accessToken: string) {
    const endpoint = 'http://103.155.161.116:3434/graphql';

    const FIND_POST_QUERY = `
    query GetPostById ($id: String!){
        getPostById(id: $id) {
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
                query: FIND_POST_QUERY,
                variables: {
                    id: postId
                },
            },
            { headers: headers }
        );
        if ("errors" in response.data) return response.data;
        return response.data.data.getPostById

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function getAllPostUserAsync(userId: string, accessToken: string) {
    const endpoint = 'http://103.155.161.116:3434/graphql';

    const QUERY = `
    query GetAllPostByUserId($userId: String!) {
        getAllPostByUserId(userId: $userId) {
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
                interaction {
                    id
                    content
                    userId
                    isDisplay
                    created_at
                    updated_at
                }
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
                query: QUERY,
                variables: {
                    userId: userId
                },
            },
            { headers: headers }
        );
        if ("errors" in response.data) return response.data;
        return response.data.data.getAllPostByUserId

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function validatePostAsync(dto: PostDto, accessToken: string) {
    const endpoint = 'http://103.155.161.116:3434/graphql';

    const QUERY = `
    mutation ValidatePost ($userId: String!, $postId: String!, $content: String, $fileUrl: [String!]!){
        validatePost(
            validatePost: {
                userId: $userId
                postId: $postId
                content: $content
                fileUrl: $fileUrl
            }
        ) {
            id
            isDisplay
            fileUrl
            created_at
            updated_at
            ownerUserId
            type
            linkedShare
            content
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
                    userId: dto.userId,
                    postId: dto.postId,
                    content: dto.content,
                    fileUrl: dto.fileUrl
                },
            },
            { headers: headers }
        );
        if ("errors" in response.data) return response.data;
        return response.data.data.validatePost

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function removePostAsync(userId: string, postId: string, accessToken: string) {
    const endpoint = 'http://103.155.161.116:3434/graphql';

    const QUERY = `
        mutation RemovePost ($userId: String!, $postId: String!, $fileUrl: [String!]!) {
            removePost(
                removePost: {
                    userId: $userId
                    postId: $postId
                    fileUrl: $fileUrl
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
                query: QUERY,
                variables: {
                    userId: userId,
                    postId: postId,
                    fileUrl: []
                },
            },
            { headers: headers }
        );
        if ("errors" in response.data) return response.data;
        return response.data.data.removePost

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function addCommentPostAsync(dto: ValidateMessagesDto, accessToken: string) {
    const endpoint = 'http://103.155.161.116:3434/graphql';

    const QUERY = `
    mutation AddComment ($userId: String!, $postId: String!, $content: String!, $fileUrl: [String!]!){
        addComment(
            addComment: {
                userId: $userId
                postId: $postId
                content: $content
                fileUrl: $fileUrl
            }
        ) {
            id
            userId
            roomId
            isDisplay
            content
            fileUrl
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
                    userId: dto.userId,
                    postId: dto.roomchatId,
                    content: dto.content,
                    fileUrl: dto.fileUrl
                },
            },
            { headers: headers }
        );
        if ("errors" in response.data) return response.data;
        return response.data.data.addComment

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function removeCommentPostAsync(dto: ValidateMessagesDto, accessToken: string) {
    const endpoint = 'http://103.155.161.116:3434/graphql';
    
    const QUERY = `
        mutation RemoveComment ($userId: String!, $postId: String!, $commentId: String, $content: String!, $fileUrl: [String!]!){
            removeComment(
                removeComment: {
                    fileUrl: $fileUrl
                    content: $content
                    userId: $userId
                    postId: $postId
                    commentId: $commentId
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
                query: QUERY,
                variables: {
                    userId: dto.userId,
                    postId: dto.roomchatId,
                    commentId: dto.messagesId,
                    content: dto.content,
                    fileUrl: dto.fileUrl
                },
            },
            { headers: headers }
        );
        if ("errors" in response.data) return response.data;
        return response.data.data.removeComment

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function addInteractPostAsync(dto: InteractDto, accessToken: string) {
    const endpoint = 'http://103.155.161.116:3434/graphql';

    const QUERY = `
    mutation InteractPost ($userId: String!, $postId: String!, $content: String){
        interactPost(
            addInteractPost: {
                userId: $userId
                postId: $postId
                content: $content
            }
        ) {
            id
            content
            userId
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
                query: QUERY,
                variables: {
                    userId: dto.userId,
                    postId: dto.postId,
                    content: dto.content,
                },
            },
            { headers: headers }
        );
        if ("errors" in response.data) return response.data;
        return response.data.data.interactPost

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function removeInteractPostAsync(dto: InteractDto, accessToken: string) {
    const endpoint = 'http://103.155.161.116:3434/graphql';

    const QUERY = `
    mutation RemoveInteractionPost ($userId: String!, $postId: String!, $interactionId: String) {
        RemoveInteractionPost(
            removeInteractionPost: {
                userId: $userId
                postId: $postId
                interactionId: $interactionId
            }
        ) {
            data
        }
    }`
    

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
                    userId: dto.userId,
                    postId: dto.postId,
                    interactionId: dto.interactId
                },
            },
            { headers: headers }
        );
        console.log(response.data);
        if ("errors" in response.data) return response.data;
        return response.data.data.RemoveInteractionPost

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}


export async function addInteractCommentAsync(dto: InteractDto, accessToken: string) {
    const endpoint = 'http://103.155.161.116:3434/graphql';

    const QUERY = `
    mutation InteractComment ($userId: String!, $postId: String!, $commentId: String, $content: String){
        InteractComment(
            addInteractComment: {
                userId: $userId
                postId: $postId
                commentId: $commentId
                content: $content
            }
        ) {
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
    `;

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
                    userId: dto.userId,
                    postId: dto.postId,
                    commentId: dto.commentId,
                    content: dto.content,
                },
            },
            { headers: headers }
        );
        if ("errors" in response.data) return response.data;
        return response.data.data.InteractComment

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}


export async function removeInteractCommentAsync(dto: InteractDto, accessToken: string) {
    const endpoint = 'http://103.155.161.116:3434/graphql';

    const QUERY = `
        mutation RemoveInteractionComment ($userId: String!, $postId: String!, $commentId: String, $interactionId: String) {
            RemoveInteractionComment(
                removeInteractionComment: {
                    userId: $userId
                    postId: $postId
                    commentId: $commentId
                    interactionId: $interactionId
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
                query: QUERY,
                variables: {
                    userId: dto.userId,
                    postId: dto.postId,
                    commentId: dto.commentId,
                    interactionId: dto.interactId
                },
            },
            { headers: headers }
        );
        console.log(response.data);
        if ("errors" in response.data) return response.data;
        return response.data.data.RemoveInteractionComment

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}


export async function addBookmarkAsync(dto: BookmarksDto, accessToken: string) {
    const endpoint = 'http://103.155.161.116:3434/graphql';

    const QUERY = `
        mutation AddBookMarkUser ($userId: String!, $bookMarkId: String!) {
            addBookMarkUser(
                addBookMark: { 
                    userId: $userId
                    bookMarkId: $bookMarkId
            }) {
                userId
                bookmarkId
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
                    userId: dto.userId,
                    bookMarkId: dto.postId
                },
            },
            { headers: headers }
        );
        console.log(response.data);
        if ("errors" in response.data) return response.data;
        return response.data.data.addBookMarkUser

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function removeBookmarkAsync(dto: BookmarksDto, accessToken: string) {
    const endpoint = 'http://103.155.161.116:3434/graphql';

    const QUERY = `
        mutation RemoveBookMarkUser ($userId: String!, $bookMarkId: String!) {
            removeBookMarkUser(
                removeBookMark: { 
                    bookMarkId: $bookMarkId
                    userId: $userId
                }) {
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
                query: QUERY,
                variables: {
                    userId: dto.userId,
                    bookMarkId: dto.postId,
                },
            },
            { headers: headers }
        );
        console.log(response.data);
        if ("errors" in response.data) return response.data;
        return response.data.data.removeBookMarkUser

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}


export async function GenerateMomoPaymentAsync(dto: PaymentDto, accessToken: string) {
    const endpoint = 'http://103.155.161.116:3434/graphql';

    const QUERY = `
        mutation GenerateMomoPayment ($userId: String!, $method: String!, $select: String!) {
            generateMomoPayment(
                payment: {
                    userId: $userId
                    method: $method
                    select: $select
                }
            ) {
                status
                url
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
                    userId: dto.userId,
                    method: dto.method,
                    select: dto.select
                },
            },
            { headers: headers }
        );
        console.log(response.data);
        if ("errors" in response.data) return response.data;
        return response.data.data.generateMomoPayment

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function GenerateVnpayPaymentAsync(dto: PaymentDto, accessToken: string) {
    const endpoint = 'http://103.155.161.116:3434/graphql';

    const QUERY = `
        mutation GenerateVnpayPayment ($userId: String!, $method: String!, $select: String!) {
            generateVnpayPayment(
                payment: {
                    userId: $userId
                    method: $method
                    select: $select
                }
            ) {
                status
                url
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
                    userId: dto.userId,
                    method: dto.method,
                    select: dto.select
                },
            },
            { headers: headers }
        );
        console.log(response.data);
        if ("errors" in response.data) return response.data;
        return response.data.data.generateVnpayPayment

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function removeNotificationAsync(userId: string, notiId: string, accessToken: string) {
    const endpoint = 'http://103.155.161.116:3434/graphql';

    const QUERY = `
            mutation RemoveNotificationUser ($userId: String!, $notificationId: String!) {
                removeNotificationUser(
                    removeNotification: { 
                        userId: $userId
                        notificationId: $notificationId
                        }
                ) {
                    id
                    email
                    hash
                    refreshToken
                    role
                    isOnline
                    friends
                    bookMarks
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
                query: QUERY,
                variables: {
                    userId: userId,
                    notificationId: notiId,
                },
            },
            { headers: headers }
        );
        console.log(response.data);
        if ("errors" in response.data) return response.data;
        return response.data.data.removeNotificationUser

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}


export async function validatePrivacyUserAsync(dto: ValidatePrivacyUserDto, accessToken: string) {
    const endpoint = 'http://103.155.161.116:3434/graphql';

    const QUERY = `
        mutation ValidatePrivacyUser ($userId: String!, $name: String!, $nickName: String!, $description: String!, $gender: String, $phoneNumber: String, $countryCode: String){
            validatePrivacyUser(
                validateUser: {
                    userId: $userId
                    phoneNumber: $phoneNumber
                    gender: $gender
                    countryCode: $countryCode
                    name: $name
                    nickName: $nickName
                    description: $description
                }
            ) {
                id
                email
                role
                isOnline
                friends
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
                bookMarks
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
                query: QUERY,
                variables: {
                    userId: dto.userId,
                    name: dto.name,
                    nickName: dto.nickName,
                    description: dto.description,
                    gender: dto.gender,
                    phoneNumber: dto.phoneNumber,
                    countryCode: dto.countryCode,
                    
                },
            },
            { headers: headers }
        );
        console.log(response.data);
        if ("errors" in response.data) return response.data;
        return response.data.data.validatePrivacyUser

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}