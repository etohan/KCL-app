const express = require('express');
const router = express.Router();

const ps = require('@prisma/client');
const prisma = new ps.PrismaClient();

const pnum = 5; // ☆1ページ当たりの表示数

// ログインのチェック
const check = function (req, res) {
    if (req.session.electri_login == null) {
        req.session.electri_back = '/electri_boards';
        res.redirect('/electri_users/electri_login');
        return true;
    } else {
        return false;
    }
}

// トップページ
router.get('/', (req, res, next) => {
    res.redirect('/electri_boards/0');
});

// トップページにページ番号をつけてアクセス
router.get('/:page', (req, res, next) => {
    if (check(req, res)) { return };
    const pg = +req.params.page;
    prisma.electri_Board.findMany({
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
            login: req.session.electri_login,
            content: brds,
            page: pg
        }
        res.render('electri_boards/electri_index', data);
    });
});

// メッセージフォームの送信処理
router.post('/add', (req, res, next) => {
    if (check(req, res)) { return };
    prisma.electri_Board.create({
        data: {
            accountId: req.session.electri_login.id,
            message: req.body.msg
        }
    })
        .then(() => {
            res.redirect('/electri_boards');
        })
        .catch((err) => {
            res.redirect('/electri_boards/add');
        })
});

// 利用者のホーム
router.get('/home/:user/:id/:page', (req, res, next) => {
    if (check(req, res)) { return };
    const id = +req.params.id;
    const pg = +req.params.page;
    prisma.electri_Board.findMany({
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
            login: req.session.electri_login,
            accountId: id,
            userName: req.params.user,
            content: brds,
            page: pg
        }
        res.render('electri_boards/electri_home', data);
    });
});

module.exports = router;
