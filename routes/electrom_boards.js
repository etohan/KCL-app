const express = require('express');
const router = express.Router();

const ps = require('@prisma/client');
const prisma = new ps.PrismaClient();

const pnum = 5; // ☆1ページ当たりの表示数

// ログインのチェック
const check = function (req, res) {
    if (req.session.electrom_login == null) {
        req.session.electrom_back = '/electrom_boards';
        res.redirect('/electrom_users/electrom_login');
        return true;
    } else {
        return false;
    }
}

// トップページ
router.get('/', (req, res, next) => {
    res.redirect('/electrom_boards/0');
});

// トップページにページ番号をつけてアクセス
router.get('/:page', (req, res, next) => {
    if (check(req, res)) { return };
    const pg = +req.params.page;
    prisma.electrom_Board.findMany({
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
            login: req.session.electrom_login,
            content: brds,
            page: pg
        }
        res.render('electrom_boards/electrom_index', data);
    });
});

// メッセージフォームの送信処理
router.post('/add', (req, res, next) => {
    if (check(req, res)) { return };
    prisma.electrom_Board.create({
        data: {
            accountId: req.session.electrom_login.id,
            message: req.body.msg
        }
    })
        .then(() => {
            res.redirect('/electrom_boards');
        })
        .catch((err) => {
            res.redirect('/electrom_boards/add');
        })
});

// 利用者のホーム
router.get('/home/:user/:id/:page', (req, res, next) => {
    if (check(req, res)) { return };
    const id = +req.params.id;
    const pg = +req.params.page;
    prisma.electrom_Board.findMany({
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
            login: req.session.electrom_login,
            accountId: id,
            userName: req.params.user,
            content: brds,
            page: pg
        }
        res.render('electrom_boards/electrom_home', data);
    });
});

module.exports = router;
