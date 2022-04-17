const { CREATE_POST, LIKE_POST, CREATE_COMMENT } = require("../../../src/posts/endPointsPost");
const { PROFILR_LOGIN, EDIT_PROFILE_PIC, EDIT_PROFILE_COVER, SHARE_PROFILE } = require("../../../src/users/endPoints");

module.exports=[
    PROFILR_LOGIN,
    EDIT_PROFILE_PIC,
    EDIT_PROFILE_COVER,
    CREATE_POST,
    LIKE_POST,
    CREATE_COMMENT,
    
    SHARE_PROFILE
]