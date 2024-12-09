const { CreateToken } = require("../middleware/jwt");
const prisma = require("../utils/prisma");




const bcrypt = require("bcrypt");

exports.userRegister = async (req, res) => {
    const { email, password, name } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const NewUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,  
            },
        });

        res.status(200).json(NewUser);
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).json({ error: "Failed to create  user" });
    }
};
exports.userLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const LoginUser = await prisma.user.findUnique({
            where: { email },
        });

        if (!LoginUser) {
            return res.status(404).json("User does not exist");
        }

        const isPasswordValid = await bcrypt.compare(password, LoginUser.password);

        if (!isPasswordValid) {
            return res.status(401).json("Password does not match");
        }

        const token = await CreateToken(LoginUser.id);
        return res.status(200).json({ token });
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
