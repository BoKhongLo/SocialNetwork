import { StyleSheet } from "react-native"

const styles = StyleSheet.create ({
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
    headerContainer:{
        justifyContent:  'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        marginHorizontal: 20
    },

    LoginContainer:{
        flex : 1,
        // backgroundColor : 'white',
        paddingTop: 50,
        paddingHorizontal: 12
    },

    logoContainer:{
        alignItems: 'center',
        marginTop: 60
    },

    imgLogo: {
        height: 90,
        width: 100,
        marginBottom: 60
    },
    logo: {
        width: 100,
        height:50,
        resizeMode : 'contain',
    },
    iconContainer: {
        flexDirection: 'row',
    },
    icon :{
        width: 30,
        height : 30,
        marginLeft :10,
        resizeMode: 'contain' 
    },
    unreadBadge:{
        backgroundColor: '#FF3250',
        position: 'absolute',
        left: 20,
        bottom: 18,
        width : 25,
        height:18,
        borderRadius: 25,
        alignItems: 'center',
        zIndex: 100
    },
    unreadBadgeText:{
        color: 'white',
        fontSize: 600
    },
    
    story:{
        width: 70,
        height: 70,
        borderRadius: 50,
        marginLeft: 6,
        borderWidth: 3,
        borderColor: 'ff8501'
    },

    // Login form styles
    wrapper:{
        marginBottom: 80,
    },
    inputField:{
        borderRadius: 4,
        padding: 15,
        backgroundColor: '#FAFAFA',
        marginBottom: 10,
        borderWidth: 1
    },
    buttonLogin: {
        backgroundColor: '#0096F6',
        alignItems: 'center',
        justifyContent:'center',
        minHeight: 42,
        borderRadius: 4
    },
    buttonLoginText : {
        fontWeight: '500',
        color: '#fff',
        fontSize: 20
    },
    signupContainer:{
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        marginTop: 50
    }


})

export default styles;