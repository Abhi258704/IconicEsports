import express
    from "express";

import {
    verifyJWT,
}
    from "../middlewares/auth.middleware.js";

import {
    verifyAdmin,
}
    from "../middlewares/admin.middleware.js";

import {

    getCurrentUser,

    updateUserRole,

    searchUser,

    getModerators,

    getModerator,

}
    from "../controllers/user.controller.js";

const router =
    express.Router();

router.get(
    "/me",
    verifyJWT,
    getCurrentUser
);

router.get(
    "/search",
    verifyJWT,
    verifyAdmin,
    searchUser
);

router.get(
    "/moderators",
    verifyJWT,
    verifyAdmin,
    getModerators
);

router.get(
    "/moderators/:id",
    verifyJWT,
    verifyAdmin,
    getModerator
);

/* promote/demote */

router.patch(
    "/:id/role",
    verifyJWT,
    verifyAdmin,
    updateUserRole
);

export default router;