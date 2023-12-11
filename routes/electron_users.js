var express = require('express');
var router = express.Router();

const ps = require('@prisma/client');
const prisma = new ps.PrismaClient();

/* GET users listing. */


router.get('/electron_login', (req, res, next) => {
    var data = {
        title: 'Users/Login',
        content: '名前とパスワードを入力下さい。'
    }
    res.render('electron_users/electron_login', data);
});

router.post('/electron_login', (req, res, next) => {
    prisma.electron_User.findMany({
        where: {
            name: req.body.name,
            pass: req.body.pass,
        }
    }).then(usr => {
        if (usr != null && usr[0] != null) {
            req.session.electron_login = usr[0];
            let back = req.session.electron_back;
            if (back == null) {
                back = '/';
            }
            res.redirect(back);
        } else {
            var data = {
                title: 'Users/Login',
                content: '名前かパスワードに問題があります。再度入力下さい。'
            }
            res.render('electron_users/electron_login', data);
        }
    })
});


module.exports = router;
