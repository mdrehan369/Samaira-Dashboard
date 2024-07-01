const auth = () => {
    
    let isLogIn = false;

    return {
        check: (req, res, next) => {
            if(isLogIn) next();
            else res
            .status(200)
            .json("Not Authorized")
        },
        logout: (req, res, next) => {
            isLogIn = false
            res
            .status(200)
        },
        login: (req, res, next) => {
            isLogIn = true;
            next();
            res
            .status(200)
            .json("Authorized")
        }
    }
}

export const { check, login, logout } = auth();
