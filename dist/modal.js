/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/static/formType.ts
var FormType;
(function (FormType) {
    FormType[FormType["ball"] = 1] = "ball";
    FormType[FormType["bucket"] = 2] = "bucket";
    FormType[FormType["card"] = 3] = "card";
    FormType[FormType["userSticker"] = 4] = "userSticker";
})(FormType || (FormType = {}));
/* harmony default export */ const formType = (FormType);

;// CONCATENATED MODULE: ./src/static/colors.ts
/* harmony default export */ const colors = ({
    ball: '#2d9bf0',
    sourceBucket: '#fac710',
    targetBucket: '#cee741',
    drawBucket: '#d62828',
    sticker: '#f16c7f'
});

;// CONCATENATED MODULE: ./src/config/index.ts
/* harmony default export */ const config = ({
    appId: '3074457352753106105',
    balls: {
        initialAmount: 2,
        radius: 50
    },
    bucket: {
        widthHeight: 200
    },
    card: {
        height: 60
    },
    rules: {
        memberBallLimit: 1
    }
});

;// CONCATENATED MODULE: ./src/static/bucketType.ts
var BucketType;
(function (BucketType) {
    BucketType["source"] = "source";
    BucketType["target"] = "target";
    BucketType["draw"] = "draw";
})(BucketType || (BucketType = {}));
/* harmony default export */ const bucketType = (BucketType);

;// CONCATENATED MODULE: ./src/models/BucketModel.ts



class BucketModel {
    static get(type, widgets) {
        return widgets.find(w => w.metadata[config.appId] &&
            w.metadata[config.appId].formType === formType.bucket &&
            w.metadata[config.appId].bucketType === type);
    }
    static getMeta(type, widgets) {
        const widget = BucketModel.get(type, widgets);
        return widget ? widget.metadata[config.appId] : null;
    }
    static isBallInBucket(type, ball, widgets) {
        const widget = widgets.find(w => w.metadata[config.appId] &&
            w.metadata[config.appId].formType === formType.bucket &&
            w.metadata[config.appId].bucketType === type);
        if (!widget) {
            return false;
        }
        return (ball.x - ball.width / 2) >= (widget.x - widget.width / 2) && (ball.x + ball.width / 2) <= (widget.x + widget.width / 2) &&
            (ball.y - ball.height / 2) >= (widget.y - widget.height / 2) && (ball.y + ball.height / 2) <= (widget.y + widget.height / 2);
    }
    static async create(type, x, y, color, ownerId) {
        await miro.board.widgets.create({
            type: 'shape',
            style: {
                backgroundColor: color,
                textAlign: 'c',
                textAlignVertical: 'm',
                fontSize: 36,
                bold: 1
            },
            height: config.bucket.widthHeight,
            width: config.bucket.widthHeight,
            x,
            y,
            text: type === bucketType.source ? '' : '0',
            metadata: {
                [config.appId]: {
                    owner: ownerId,
                    bucketType: type,
                    formType: formType.bucket,
                    ballsCount: 0
                }
            },
            capabilities: {
                editable: false
            }
        });
    }
    static async updateBallsCount(type, widgets, ballsCount) {
        const bucket = BucketModel.get(type, widgets);
        bucket.metadata[config.appId].ballsCount = ballsCount;
        bucket.text = ballsCount.toString();
        await miro.board.widgets.update(bucket);
    }
    static checkBucketsOverFlow(widgets) {
        const buckets = widgets.filter(w => w.metadata[config.appId] && w.metadata[config.appId].formType === formType.bucket);
        for (let i = 0; i < buckets.length; i++) {
            for (let s = 0; s < buckets.length; s++) {
                if (i == s) {
                    continue;
                }
                const startXI = buckets[i].x - buckets[i].width / 2;
                const endXI = buckets[i].x + buckets[i].width / 2;
                const startXS = buckets[s].x - buckets[s].width / 2;
                const endXS = buckets[s].x + buckets[s].width / 2;
                const startYI = buckets[i].x - buckets[i].height / 2;
                const endYI = buckets[i].x + buckets[i].height / 2;
                const startYS = buckets[s].x - buckets[s].height / 2;
                const endYS = buckets[s].x + buckets[s].height / 2;
                if (((startXI >= startXS && startXI <= endXS) || (endXI >= startXS && endXI <= endXS)) &&
                    ((startYI >= startYS && startYI <= endYS) || (endYI >= startYS && endYI <= endYS))) {
                    return true;
                }
            }
        }
        return false;
    }
    static async resetBucketsPosition(x, y, widgets) {
        const sourceBucket = widgets.find(w => w.metadata[config.appId].bucketType === bucketType.source);
        const targetBucket = widgets.find(w => w.metadata[config.appId].bucketType === bucketType.target);
        const drawBucket = widgets.find(w => w.metadata[config.appId].bucketType === bucketType.draw);
        Object.assign(sourceBucket, {
            x,
            y
        });
        await miro.board.widgets.update(sourceBucket);
        Object.assign(targetBucket, {
            x: x + config.bucket.widthHeight + 100,
            y
        });
        await miro.board.widgets.update(targetBucket);
        Object.assign(drawBucket, {
            x: x + (config.bucket.widthHeight + 100) * 2,
            y
        });
        await miro.board.widgets.update(drawBucket);
    }
    static async resetProportions(bucket) {
        Object.assign(bucket, {
            height: config.bucket.widthHeight,
            width: config.bucket.widthHeight
        });
        await miro.board.widgets.update(bucket);
    }
}

;// CONCATENATED MODULE: ./src/models/CommonUserModel.ts




class CommonUserModel {
    addCanvasListener() {
        if (this.listener) {
            return;
        }
        this.listener = this.checkCanvas.bind(this);
        miro.addListener('CANVAS_CLICKED', this.listener);
    }
    hasCanvasListener() {
        return !!this.listener;
    }
    async checkCanvas() {
        const widgets = await miro.board.widgets.get();
        const userId = await miro.currentUser.getId();
        if (!(await this.customCheck(userId, widgets))) {
            return;
        }
        const areBucketsOverFlow = BucketModel.checkBucketsOverFlow(widgets);
        if (areBucketsOverFlow) {
            await BucketModel.resetBucketsPosition(0, 0, widgets);
        }
        for (const widget of widgets) {
            if (widget.metadata && widget.metadata[config.appId] && widget.metadata[config.appId].formType === formType.bucket) {
                await this.checkBucketProportions(widget);
            }
            if (widget.metadata &&
                widget.metadata[config.appId] &&
                widget.metadata[config.appId].formType === formType.ball) {
                if (widget.metadata[config.appId].owner === userId) {
                    await BallModel.checkBallProportions(widget);
                    await this.checkOwnBallPosition(userId, widget, widgets);
                }
                if (widget.metadata[config.appId].owner !== userId && widget.lastModifiedUserId === userId) {
                    await this.checkWrongMovedBallPosition(widget, widgets);
                }
            }
        }
    }
    async customCheck(userId, widgets) {
        return true;
    }
    async checkOwnBallPosition(userId, ball, widgets) {
    }
    async checkWrongMovedBallPosition(ball, widgets) { }
    async checkBucketProportions(bucket) {
        if (bucket.height !== config.bucket.widthHeight || bucket.width !== config.bucket.widthHeight) {
            await BucketModel.resetProportions(bucket);
        }
    }
}

;// CONCATENATED MODULE: ./src/models/UserModel.ts










class UserModel extends CommonUserModel {
    constructor(widget) {
        super();
        this.widget = widget;
    }
    static get(userId, widgets) {
        const widget = widgets.find(w => w.metadata[config.appId] &&
            w.metadata[config.appId].owner === userId &&
            w.metadata[config.appId].formType === formType.userSticker) || null;
        return widget ? new UserModel(widget) : null;
    }
    /*
      public static getMeta(widget: IWidget): Meta | null {
        return widget ? widget.metadata[config.appId] : null;
      }
    */
    static async create(userId, username, x, y) {
        const [result] = await miro.board.widgets.create({
            type: 'sticker',
            text: username,
            style: {
                stickerBackgroundColor: colors.sticker
            },
            x,
            y,
            metadata: {
                [config.appId]: {
                    owner: userId,
                    formType: formType.userSticker
                }
            },
            capabilities: {
                editable: false
            }
        });
        await miro.board.widgets.sendBackward(result.id);
        return new UserModel(result);
    }
    static getAllCreatedUsers(widgets) {
        return widgets.filter(w => w.metadata[config.appId] && w.metadata[config.appId].formType === formType.userSticker);
    }
    async customCheck(userId, widgets) {
        const userWidget = UserModel.get(userId, widgets);
        if (!userWidget) {
            await this.stopTrack();
            return false;
        }
        return true;
    }
    async checkCanvas() {
        const widgets = await miro.board.widgets.get();
        const userId = await miro.currentUser.getId();
        const userWidget = UserModel.get(userId, widgets);
        if (!userWidget) {
            miro.removeListener('CANVAS_CLICKED', this.listener);
            this.listener = null;
            return;
        }
        const areBucketsOverFlow = BucketModel.checkBucketsOverFlow(widgets);
        if (areBucketsOverFlow) {
            await BucketModel.resetBucketsPosition(0, 0, widgets);
        }
        for (const widget of widgets) {
            if (widget.metadata && widget.metadata[config.appId] && widget.metadata[config.appId].formType === formType.bucket) {
                await this.checkBucketProportions(widget);
            }
            if (widget.metadata &&
                widget.metadata[config.appId] &&
                widget.metadata[config.appId].formType === formType.ball) {
                if (widget.metadata[config.appId].owner === userId) {
                    await BallModel.checkBallProportions(widget);
                    await this.checkOwnBallPosition(userId, widget, widgets);
                    continue;
                }
                if (widget.metadata[config.appId].owner !== userId && widget.lastModifiedUserId === userId) {
                    await this.checkWrongMovedBallPosition(widget, widgets);
                }
            }
        }
    }
    async checkOwnBallPosition(userId, ball, widgets) {
        const ballMeta = BallModel.getMeta(ball);
        const userCardWithBall = BallModel.userCardWithBall(ball, widgets);
        const allUserBallsCount = BallModel.getUserBallsAmount(userCardWithBall, widgets);
        // const drawBucketMeta = BucketModel.getMeta(BucketType.draw, widgets); //todo uncomment once meta will work
        const drawBucket = BucketModel.get(bucketType.draw, widgets);
        if (userCardWithBall && allUserBallsCount > config.rules.memberBallLimit) {
            console.log('user reached limit in balls. Moving to draw bucket');
            BallModel.destroy(ball);
            BucketModel.updateBallsCount(bucketType.draw, widgets, parseInt(drawBucket.text) + 1);
            return;
        }
        if (userCardWithBall && userId !== userCardWithBall.metadata[config.appId].owner) {
            if (ball.lastModifiedUserId !== userId) {
                console.log('wrong user touched ball');
                BallModel.destroy(ball);
                BucketModel.updateBallsCount(bucketType.draw, widgets, parseInt(drawBucket.text) + 1);
                return;
            }
            if (ballMeta.participatedUserIds.indexOf(userCardWithBall.metadata[config.appId].owner) === -1) {
                ballMeta.participatedUserIds.push(userCardWithBall.metadata[config.appId].owner);
            }
            ballMeta.owner = userCardWithBall.metadata[config.appId].owner;
            ballMeta.bucketType = null;
            BallModel.updateMeta(ball, ballMeta);
            return;
        }
        const usersWidgets = UserModel.getAllCreatedUsers(widgets);
        // const targetBucketMeta = BucketModel.getMeta(BucketType.target, widgets); //todo uncomment once meta will work
        const targetBucket = BucketModel.get(bucketType.target, widgets);
        const isInTargetBucket = BucketModel.isBallInBucket(bucketType.target, ball, widgets);
        if (isInTargetBucket) {
            if (usersWidgets.length + 1 > ballMeta.participatedUserIds.length) {
                console.log('not all peers touched balls', usersWidgets.length, ballMeta.participatedUserIds);
                BallModel.destroy(ball);
                BucketModel.updateBallsCount(bucketType.draw, widgets, parseInt(drawBucket.text) + 1);
                return;
            }
            BallModel.destroy(ball);
            BucketModel.updateBallsCount(bucketType.target, widgets, parseInt(targetBucket.text) + 1);
            return;
        }
        if (!userCardWithBall && !isInTargetBucket) {
            console.log('outside of all valid cards');
            BallModel.destroy(ball);
            BucketModel.updateBallsCount(bucketType.draw, widgets, parseInt(drawBucket.text) + 1);
            return;
        }
    }
    async checkWrongMovedBallPosition(ball, widgets) {
        const POId = POModel.getOwnerId(widgets);
        if (ball.metadata[config.appId].owner === POId) {
            console.log('i`ve moved owner ball');
            BallModel.moveToBucket(bucketType.source, ball, widgets);
            return;
        }
        // const drawBucketMeta = BucketModel.getMeta(BucketType.draw, widgets); // todo uncomment once meta will work
        const drawBucket = BucketModel.get(bucketType.draw, widgets);
        // todo check
        BallModel.destroy(ball);
        BucketModel.updateBallsCount(bucketType.draw, widgets, parseInt(drawBucket.text) + 1);
    }
    async stopTrack() {
        await miro.board.widgets.deleteById(this.widget.id);
        miro.removeListener('CANVAS_CLICKED', this.listener);
        this.listener = null;
    }
}

;// CONCATENATED MODULE: ./src/models/BallModel.ts





class BallModel {
    static async get(ballId) {
        const widgets = await miro.board.widgets.get();
        return widgets.find(w => w.id === ballId) || null;
    }
    static getMeta(widget) {
        return widget ? widget.metadata[config.appId] : null;
    }
    static async create(x, y, owner, index, color, bucketType, ownerId) {
        await miro.board.widgets.create({
            type: 'shape',
            style: {
                backgroundColor: color,
                shapeType: 4
            },
            height: 50,
            width: 50,
            x,
            y,
            metadata: {
                [config.appId]: {
                    owner,
                    participatedUserIds: [ownerId],
                    bucketType,
                    formType: formType.ball
                }
            }
        });
    }
    static userCardWithBall(ball, widgets) {
        const usersCards = UserModel.getAllCreatedUsers(widgets);
        return usersCards.find(s => {
            return (ball.x - ball.width / 2) >= (s.bounds.x - s.bounds.width / 2) && (ball.x + ball.width / 2) <= (s.bounds.x + s.bounds.width / 2) &&
                (ball.y - ball.height / 2) >= (s.bounds.y - s.bounds.height / 2) && (ball.y + ball.height / 2) <= (s.bounds.y + s.bounds.height / 2);
        });
    }
    static getUserBallsAmount(userStickerWidget, widgets) {
        if (!userStickerWidget) {
            return 1;
        }
        const userBallsAmount = widgets.filter((w) => w.metadata[config.appId] &&
            w.metadata[config.appId].formType === formType.ball &&
            (w.x - w.width / 2) >= (userStickerWidget.bounds.x - userStickerWidget.bounds.width / 2) && (w.x + w.width / 2) <= (userStickerWidget.bounds.x + userStickerWidget.bounds.width / 2) &&
            (w.y - w.height / 2) >= (userStickerWidget.bounds.y - userStickerWidget.bounds.height / 2) && (w.y + w.height / 2) <= (userStickerWidget.bounds.y + userStickerWidget.bounds.height / 2)).length;
        return userBallsAmount ? userBallsAmount : 1;
    }
    static getBucketBallsAmount(bucketType, widgets) {
        const bucketMeta = BucketModel.getMeta(bucketType, widgets);
        return bucketMeta.ballsCount;
    }
    static getBucketBalls(bucketType, widgets) {
        return widgets.filter(w => w.metadata[config.appId] &&
            w.metadata[config.appId].formType === formType.ball &&
            w.metadata[config.appId].bucketType === bucketType);
    }
    static async updateMeta(ball, ballMeta) {
        Object.assign(ball, {
            metadata: {
                [config.appId]: ballMeta
            },
            text: (ballMeta.participatedUserIds.length - 1).toString()
        });
        await miro.board.widgets.deleteById(ball.id);
        const [created] = await miro.board.widgets.create(ball);
        // @ts-ignore
        ball.id = created.id;
    }
    static async moveToBucket(bucketType, ball, widgets) {
        const bucket = BucketModel.get(bucketType, widgets);
        const update = {
            id: ball.id,
            x: bucket.x,
            y: bucket.y,
            text: '',
            metadata: ball.metadata
        };
        Object.assign(ball, update);
        await miro.board.widgets.update(update);
    }
    static async destroy(ball) {
        await miro.board.widgets.deleteById([ball.id]);
    }
    static async resetProportions(ball) {
        Object.assign(ball, {
            bounds: {
                ...ball.bounds,
                height: config.balls.radius,
                width: config.balls.radius
            },
            height: config.balls.radius,
            width: config.balls.radius
        });
        await miro.board.widgets.update(ball);
    }
    static async checkBallProportions(ball) {
        if (ball.bounds.height !== config.balls.radius || ball.bounds.width !== config.balls.radius) {
            await BallModel.resetProportions(ball);
        }
    }
}

;// CONCATENATED MODULE: ./src/locales/en.ts
/* harmony default export */ const en = ({
    modal: {
        name: "Scrum balls game",
        startGamePO: 'Start game as PO',
        resetGamePO: 'Reset Scores',
        endGamePO: 'End Game',
        joinGameUser: 'Join Game',
        leaveGameUser: 'Leave Game',
        description: 'You can check out game rules <a href="#" onclick="window.open(`https://github.com/ega-forever/miro-scrum-ball-game/blob/master/rules-en.md`, `_blank`)">here</a>'
    },
    cards: {
        poCard: 'Game PO'
    }
});

;// CONCATENATED MODULE: ./src/locales/ru.ts
/* harmony default export */ const ru = ({
    modal: {
        name: "Волшебные шары",
        startGamePO: 'Начать игру как ВП',
        resetGamePO: 'обнулить счетчики',
        endGamePO: 'Закончить игру',
        joinGameUser: 'Присоединиться к игре',
        leaveGameUser: 'Покинуть игру',
        description: 'Посмотреть правила игры можно <a href="#" onclick="window.open(`https://github.com/ega-forever/miro-scrum-ball-game/blob/master/rules-ru.md`, `_blank`)">тут</a>'
    },
    cards: {
        poCard: 'ВП'
    }
});

;// CONCATENATED MODULE: ./src/locales/index.ts


const getLocale = (locale) => {
    if (locale.toLowerCase().includes('ru')) {
        return ru;
    }
    return en;
};

;// CONCATENATED MODULE: ./src/models/POModel.ts











class POModel extends CommonUserModel {
    constructor(widget) {
        super();
        this.widget = widget;
    }
    static async create(userId, username, x, y, widgets, locale) {
        const buckets = [
            {
                type: bucketType.source,
                color: colors.sourceBucket,
                x,
                y,
                text: ''
            },
            {
                type: bucketType.target,
                color: colors.targetBucket,
                x: x + config.bucket.widthHeight + 100,
                y,
                text: '0'
            },
            {
                type: bucketType.draw,
                color: colors.drawBucket,
                x: x + (config.bucket.widthHeight + 100) * 2,
                y,
                height: config.bucket.widthHeight,
                width: config.bucket.widthHeight,
                text: '0'
            }
        ];
        for (const bucket of buckets) {
            let b = BucketModel.get(bucket.type, widgets);
            if (!b) {
                await BucketModel.create(bucket.type, bucket.x, bucket.y, bucket.color, userId);
            }
        }
        const [widget] = await miro.board.widgets.create({
            type: 'card',
            title: `${getLocale(locale).cards.poCard}: ${username}`,
            x: x - config.bucket.widthHeight - 100,
            y: y + config.card.height + config.card.height / 2,
            metadata: {
                [config.appId]: {
                    owner: userId,
                    formType: formType.card
                }
            }
        });
        for (let i = 0; i < config.balls.initialAmount; i++) {
            await BallModel.create(buckets[0].x, buckets[0].y, userId, i, colors.ball, buckets[0].type, userId);
        }
        return new POModel(widget);
    }
    static getOwnerId(widgets) {
        const bucketMeta = BucketModel.getMeta(bucketType.source, widgets);
        return bucketMeta ? bucketMeta.owner : null;
    }
    static get(widgets) {
        const bucketMeta = BucketModel.getMeta(bucketType.source, widgets);
        if (!bucketMeta) {
            return null;
        }
        const widget = widgets.find(w => w.metadata[config.appId] &&
            w.metadata[config.appId].owner === bucketMeta.owner &&
            w.metadata[config.appId].formType === formType.card) || null;
        return widget ? new POModel(widget) : null;
    }
    async customCheck(userId, widgets) {
        if (POModel.getOwnerId(widgets) === null) {
            await this.stopTrack();
            return false;
        }
        await this.checkIfSourceBucketHasEnoughBalls(userId, widgets);
        return true;
    }
    async checkIfSourceBucketHasEnoughBalls(userId, widgets) {
        const sourceBucket = BucketModel.get(bucketType.source, widgets);
        const sourceBucketMeta = BucketModel.getMeta(bucketType.source, widgets);
        const ballsInSourceBucket = BallModel.getBucketBalls(bucketType.source, widgets);
        for (let i = 0; i <= (config.balls.initialAmount - ballsInSourceBucket.length); i++) {
            await BallModel.create(sourceBucket.x, sourceBucket.y, sourceBucketMeta.owner, 1, colors.ball, bucketType.source, userId);
        }
    }
    async checkOwnBallPosition(userId, ball, widgets) {
        const ballMeta = BallModel.getMeta(ball);
        const userCardWithBall = BallModel.userCardWithBall(ball, widgets);
        const drawBucket = BucketModel.get(bucketType.draw, widgets);
        // const drawBucketMeta = BucketModel.getMeta(BucketType.draw, widgets); //todo uncomment once meta will work
        // const targetBucketMeta = BucketModel.getMeta(BucketType.target, widgets);
        const targetBucket = BucketModel.get(bucketType.target, widgets); // todo uncomment once meta will work
        if (userCardWithBall && ball.lastModifiedUserId !== userId) {
            BallModel.destroy(ball);
            BucketModel.updateBallsCount(bucketType.draw, widgets, parseInt(drawBucket.text) + 1);
            return;
        }
        const usersWidgets = UserModel.getAllCreatedUsers(widgets); // todo replace with enum
        const isInTargetBucket = BucketModel.isBallInBucket(bucketType.target, ball, widgets);
        if (isInTargetBucket && usersWidgets.length + 1 > ballMeta.participatedUserIds.length) {
            console.log('not all peers touched balls');
            BallModel.destroy(ball);
            BucketModel.updateBallsCount(bucketType.draw, widgets, parseInt(drawBucket.text) + 1);
            return;
        }
        if (isInTargetBucket && usersWidgets.length === ballMeta.participatedUserIds.length) {
            console.log('move ball to target');
            BallModel.destroy(ball);
            BucketModel.updateBallsCount(bucketType.target, widgets, parseInt(targetBucket.text) + 1);
            return;
        }
        const isInSourceBucket = BucketModel.isBallInBucket(bucketType.source, ball, widgets);
        if (userCardWithBall) {
            const allUserBallsCount = BallModel.getUserBallsAmount(userCardWithBall, widgets);
            if (userCardWithBall &&
                allUserBallsCount > config.rules.memberBallLimit) {
                console.log('user reached limit in balls. Moving to draw bucket');
                BallModel.destroy(ball);
                BucketModel.updateBallsCount(bucketType.draw, widgets, parseInt(drawBucket.text) + 1);
                return;
            }
            ballMeta.participatedUserIds.push(userCardWithBall.metadata[config.appId].owner);
            ballMeta.owner = userCardWithBall.metadata[config.appId].owner;
            ballMeta.bucketType = null;
            BallModel.updateMeta(ball, ballMeta);
            return;
        }
        if (!userCardWithBall && !isInSourceBucket && !isInTargetBucket) {
            console.log('outside of all cards');
            BallModel.destroy(ball);
            BucketModel.updateBallsCount(bucketType.draw, widgets, parseInt(drawBucket.text) + 1);
            return;
        }
    }
    async checkWrongMovedBallPosition(ball, widgets) {
        const userCardWithBall = BallModel.userCardWithBall(ball, widgets);
        // const drawBucketMeta = BucketModel.getMeta(BucketType.draw, widgets); //todo uncomment
        const drawBucket = BucketModel.get(bucketType.draw, widgets);
        if (!userCardWithBall || userCardWithBall.metadata[config.appId].owner !== ball.metadata[config.appId].owner) {
            console.log('out of user card!!');
            BallModel.destroy(ball);
            BucketModel.updateBallsCount(bucketType.draw, widgets, parseInt(drawBucket.text) + 1);
        }
    }
    async stopTrack() {
        const widgets = await miro.board.widgets.get();
        const filtered = widgets.filter(w => w.metadata[config.appId]);
        for (const widget of filtered) {
            await miro.board.widgets.deleteById([widget.id]);
        }
        miro.removeListener('CANVAS_CLICKED', this.listener);
        this.listener = null;
    }
    async resetScores() {
        const widgets = await miro.board.widgets.get();
        BucketModel.updateBallsCount(bucketType.draw, widgets, 0);
        BucketModel.updateBallsCount(bucketType.target, widgets, 0);
    }
}

;// CONCATENATED MODULE: ./src/static/actionType.ts
var ActionType;
(function (ActionType) {
    ActionType[ActionType["startNewGamePO"] = 1] = "startNewGamePO";
    ActionType[ActionType["leaveGameUser"] = 2] = "leaveGameUser";
    ActionType[ActionType["joinGameUser"] = 3] = "joinGameUser";
    ActionType[ActionType["endGamePO"] = 4] = "endGamePO";
    ActionType[ActionType["resetGamePO"] = 5] = "resetGamePO";
})(ActionType || (ActionType = {}));
/* harmony default export */ const actionType = (ActionType);

;// CONCATENATED MODULE: ./src/modal.ts





let globalLocale = null;
//@ts-ignore
window.onStartGameClick = async () => {
    await miro.board.ui.closeModal({ option: actionType.startNewGamePO, locale: globalLocale });
};
//@ts-ignore
window.onUserLeaveGameClick = async () => {
    await miro.board.ui.closeModal({ option: actionType.leaveGameUser });
};
//@ts-ignore
window.onUserJoinGameClick = async () => {
    await miro.board.ui.closeModal({ option: actionType.joinGameUser });
};
//@ts-ignore
window.onEndGameClick = async () => {
    await miro.board.ui.closeModal({ option: actionType.endGamePO });
};
//@ts-ignore
window.onResetGameClick = async () => {
    await miro.board.ui.closeModal({ option: actionType.resetGamePO });
};
//@ts-ignore
window.setLocale = (locale) => {
    globalLocale = locale;
    document.getElementById('start-game-po').textContent = getLocale(locale).modal.startGamePO;
    document.getElementById('reset-game-po').textContent = getLocale(locale).modal.resetGamePO;
    document.getElementById('end-game-po').textContent = getLocale(locale).modal.endGamePO;
    document.getElementById('join-game-user').textContent = getLocale(locale).modal.joinGameUser;
    document.getElementById('leave-game-user').textContent = getLocale(locale).modal.leaveGameUser;
    document.getElementById('description').innerHTML = getLocale(locale).modal.description;
    document.getElementById('name').innerHTML = getLocale(locale).modal.name;
    const enLocaleButton = document.getElementById('locale-btn-en');
    const ruLocaleButton = document.getElementById('locale-btn-ru');
    if (locale.toLowerCase().includes('en')) {
        ruLocaleButton.classList.add('btn-secondary');
        ruLocaleButton.classList.remove('btn-primary');
        enLocaleButton.classList.remove('btn-secondary');
        enLocaleButton.classList.add('btn-primary');
    }
    if (locale.toLowerCase().includes('ru')) {
        enLocaleButton.classList.add('btn-secondary');
        enLocaleButton.classList.remove('btn-primary');
        ruLocaleButton.classList.remove('btn-secondary');
        ruLocaleButton.classList.add('btn-primary');
    }
};
const init = async () => {
    const currentUserId = await miro.currentUser.getId();
    const widgets = await miro.board.widgets.get();
    let PO = POModel.get(widgets);
    if (PO && PO.widget.metadata[config.appId].owner === currentUserId) {
        document.getElementById('end-game-po').style.display = 'inline-block';
        document.getElementById('reset-game-po').style.display = 'inline-block';
    }
    if (!PO) {
        document.getElementById('start-game-po').style.display = 'inline-block';
    }
    let user = UserModel.get(currentUserId, widgets);
    if (user) {
        document.getElementById('leave-game-user').style.display = 'inline-block';
    }
    if (PO && PO.widget.metadata[config.appId].owner !== currentUserId && !user) {
        document.getElementById('join-game-user').style.display = 'inline-block';
    }
    const isCurrentLanguageSupported = !!(window.navigator.language.toLowerCase().includes('ru') || window.navigator.language.toLowerCase().includes('en'));
    // @ts-ignore
    window.setLocale(isCurrentLanguageSupported ? window.navigator.language : 'en');
};
miro.onReady(init);

/******/ })()
;