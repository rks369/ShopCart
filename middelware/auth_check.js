function authCheck(req, res, next) {
    if (req.session.is_logged_in) {
        if (req.session.is_mail_verified) {
            next();
            return;
        }
        else
        {
            res.redirect("/verifyMailFirst")
        }
    }
    else {
        res.json({data:"Not Login"});
    }
}

module.exports = authCheck;