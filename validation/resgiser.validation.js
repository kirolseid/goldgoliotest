const { check } = require('express-validator');

module.exports.talented=[
    // check('full_name').isAlpha(),
    check('email').isEmail(),
    // check('phone').isMobilePhone(),
    check('password').matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
    // check('gender').isAlpha(),


    // check('confirmPassword').custom((value, { req }) => {
    //     if (value !== req.body.password) {
    //         return false;
    //     }
    //         return true;
    //     }),
]

//{ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: false, pointsPerUnique: 1, pointsPerRepeat: 0.5, pointsForContainingLower: 10, pointsForContainingUpper: 10, pointsForContainingNumber: 10, pointsForContainingSymbol: 10 }




module.exports.personal=[
    // check('full_name').isAlpha(),
    check('email').isEmail(),
    // check('phone').isMobilePhone(),
    check('password').matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
    
    // check('confirmPassword').custom((value, { req }) => {
    //     if (value !== req.body.password) {
    //         return false;
    //     }
    //         return true;
    //     }),
]


module.exports.coporation=[
    // check('company_name').isAlpha(),
    // check('company_field').isAlpha(),
    check('email').isEmail(),
    // check('phone').isMobilePhone(),
    check('password').matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
    // check('address').isAlpha(),

    // check('confirmPassword').custom((value, { req }) => {
    //     if (value !== req.body.password) {
    //         return false;
    //     }
    //         return true;
    //     }),
]

//{ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: false, pointsPerUnique: 1, pointsPerRepeat: 0.5, pointsForContainingLower: 10, pointsForContainingUpper: 10, pointsForContainingNumber: 10, pointsForContainingSymbol