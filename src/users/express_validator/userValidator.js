const{body}=require("express-validator")

const signUpValidator=[
    body("userName").isString().withMessage("invalid userName Validation"),
    body("email").isEmail().withMessage("invalid Email Syntax"),
    body("password").isStrongPassword().withMessage("invalid Password Validation"),
    body('passwordConfirmation').custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation does not match password');
        }
        return true;
      }),
    
]

module.exports={
    signUpValidator
}