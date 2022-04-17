
const roles = require("../../enum/roles")
const adminPolicy = require("./adminPolicy");
const superAdminPolicy = require("./superAdminPolicy");
const userPolicy = require("./userPolicy");

;

const opts={
    [roles.ADMIN]:{
        can:adminPolicy
    },
    [roles.USER]:{
       can:userPolicy
    },
    [roles.SUPERADMIN]:{
        can:superAdminPolicy
    }
}
module.exports=opts