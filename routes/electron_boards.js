const express = require('express');
const router = express.Router();

const ps = require('@prisma/client');
const prisma = new ps.PrismaClient();

const pnum = 5; // ☆1ページ当たりの表示数

// ログインのチェック
const check = function (req, res) {
    if (req.session.electron_login == null) {
        req.session.electron_back = '/electron_boards';
        res.redirect('/electron_users/electron_login');
        return true;
    } else {
        return false;
    }
}

// トップページ
router.get('/', (req, res, next) => {
    res.redirect('/electron_boards/0');
});

// トップページにページ番号をつけてアクセス
router.get('/:page', (req, res, next) => {
    if (check(req, res)) { return };
    const pg = +req.params.page;
    prisma.electron_Board.findMany({
        skip: pg * pnum,
        take: pnum,
        orderBy: [
            { createdAt: 'desc' }
        ],
        include: {
            account: true,
        },
    }).then(brds => {
        var data = {
            title: 'Boards',
            login: req.session.electron_login,
            content: brds,
            page: pg
        }
        res.render('electron_boards/electron_index', data);
    });
});

// メッセージフォームの送信処理
router.post('/add', (req, res, next) => {
    if (check(req, res)) { return };
    prisma.electron_Board.create({
        data: {
            accountId: req.session.electron_login.id,
            message: req.body.msg
        }
    })
        .then(() => {
            res.redirect('/electron_boards');
        })
        .catch((err) => {
            res.redirect('/electron_boards/add');
        })
});

// 利用者のホーム
router.get('/home/:user/:id/:page', (req, res, next) => {
    if (check(req, res)) { return };
    const id = +req.params.id;
    const pg = +req.params.page;
    prisma.electron_Board.findMany({
        where: { accountId: id },
        skip: pg * pnum,
        take: pnum,
        orderBy: [
            { createdAt: 'desc' }
        ],
        include: {
            account: true,
        },
    }).then(brds => {
        const data = {
            title: 'Boards',
            login: req.session.electron_login,
            accountId: id,
            userName: req.params.user,
            content: brds,
            page: pg
        }
        res.render('electron_boards/electron_home', data);
    });
});

module.exports = router;
