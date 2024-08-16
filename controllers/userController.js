const JWT = require('jsonwebtoken');
const { hashPassword, comparePassword } = require("../helpers/authHelper");
const userModel = require("../models/userModel");
var { expressjwt: jwt } = require('express-jwt');

// middleware
const requireSignIn = jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
});

const registerController = async (req, res) => {
    try {
        const {username, password} = req.body;

        // validation
        if(!username){
            return res.status(400).send({
                success: false,
                message: 'Username is required'
            });
        }

        if(!password || password.length < 8){
            return res.status(400).send({
                success: false,
                message: 'Password is required and 8 character long'
            });
        }

        // exisiting user
        const exisitingUser = await userModel.findOne({username});
        if(exisitingUser){
            return res.status(500).send({
                success: false,
                message: 'User Already Register With This Username'
            });
        }

        // hashed password
        const hashedPassword = await hashPassword(password);

        // save user
        const user = await userModel({
            username, 
            password:hashedPassword
        }).save();

        return res.status(201).send({
            success: true,
            message: 'Registeration Successfully please login'
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error in Register API',
            error
        })
    }
};

const loginController = async (req, res) => {
    try {
        const {username, password} = req.body;

        // validation
        if(!username || !password){
            return res.status(500).send({
                success: false, 
                message: 'Please provide both username and password'
            })
        }

        // find user
        const user = await userModel.findOne({
            username: username
        });

        if(!user){
            return res.status(500).send({
                success: false,
                message: 'username or password is incorrect'
            });
        }

        // match password
        const match = await comparePassword(password, user.password);
        if(!match){
            return res.status(401).send({
                success: false,
                message: 'username or password is incorrect'
            });     
        }

        // Token JWT
        const token = await JWT.sign({_id: user._id}, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });
        
        // undefined password
        user.password = undefined;

        res.status(200).send({
            success: true,
            message: 'login successfully',
            token,
            user,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error in login api',
            error
        });
    }
}

module.exports = {
    requireSignIn,
    registerController,
    loginController
}




// const registerController = async (req, res) => {
//     try {
//         const {username, email, password} = req.body;

//         // validation
//         if(!username){
//             return res.status(400).send({
//                 success: false,
//                 message: 'Username is required'
//             });
//         }
//         if(!email){
//             return res.status(400).send({
//                 success: false,
//                 message: 'Email is required'
//             });
//         }
//         if(!password || password.length < 8){
//             return res.status(400).send({
//                 success: false,
//                 message: 'Password is required and 8 character long'
//             });
//         }

//         // exisiting user
//         const exisitingUser = await userModel.findOne({email});
//         if(exisitingUser){
//             return res.status(500).send({
//                 success: false,
//                 message: 'User Already Register With This Email'
//             });
//         }

//         // hashed password
//         const hashedPassword = await hashPassword(password);

//         // save user
//         const user = await userModel({
//             username, 
//             email, 
//             password:hashedPassword
//         }).save();

//         return res.status(201).send({
//             success: true,
//             message: 'Registeration Successfully please login'
//         })
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send({
//             success: false,
//             message: 'Error in Register API',
//             error
//         })
//     }
// };

// const loginController = async (req, res) => {
//     try {
//         const {identifier, password} = req.body;

//         // validation
//         if(!identifier || !password){
//             return res.status(500).send({
//                 success: false, 
//                 message: 'Please provide both identifier (email or username) and password'
//             })
//         }

//         // find user
//         const user = await userModel.findOne({
//             $or: [
//                 { email: identifier},
//                 { username: identifier }
//             ]
//         });

//         if(!user){
//             return res.status(500).send({
//                 success: false,
//                 message: 'User Not Found'
//             });
//         }

//         // const user = await userModel.findOne({email});
//         // if(!user){
//         //     return res.status(500).send({
//         //         success: false,
//         //         message: 'User Not Found'
//         //     });
//         // }

//         // match password
//         const match = await comparePassword(password, user.password);
//         if(!match){
//             return res.status(401).send({
//                 success: false,
//                 message: 'Invalid credentials'
//             });     
//         }

//         // Token JWT
//         const token = await JWT.sign({_id: user._id}, process.env.JWT_SECRET, {
//             expiresIn: '7d'
//         });
        
//         // undefined password
//         user.password = undefined;

//         res.status(200).send({
//             success: true,
//             message: 'login successfully',
//             token,
//             user,
//         });

//     } catch (error) {
//         console.log(error);
//         return res.status(500).send({
//             success: false,
//             message: 'Error in login api',
//             error
//         });
//     }
// }