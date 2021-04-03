/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 323:
/***/ ((module) => {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" version=\"1.1\" x=\"0px\" y=\"0px\" viewBox=\"0 0 100 100\" enable-background=\"new 0 0 100 100\" xml:space=\"preserve\" fill-rule=\"evenodd\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M39.769,12.172l-8.809-1.717l0.945,2.75C16.64,19.761,5.918,34.932,5.918,52.57c0,5.741,1.156,11.212,3.215,16.22  c-1.399,1.219-2.29,3.008-2.29,5.005c0,3.661,2.979,6.64,6.639,6.64s6.639-2.979,6.639-6.64s-2.979-6.64-6.639-6.64  c-0.584,0-1.148,0.083-1.688,0.226c-1.845-4.582-2.876-9.575-2.876-14.811c0-16.325,9.878-30.374,23.966-36.517l0.993,2.89  L39.769,12.172z M17.122,73.795c0,2.007-1.632,3.64-3.639,3.64s-3.639-1.633-3.639-3.64s1.632-3.64,3.639-3.64  S17.122,71.788,17.122,73.795z M91.111,58.763c0.299-2.023,0.473-4.087,0.473-6.192c0-21.387-15.761-39.148-36.275-42.315  c-0.478-3.196-3.232-5.657-6.558-5.657c-3.661,0-6.639,2.979-6.639,6.64s2.979,6.64,6.639,6.64c2.96,0,5.472-1.948,6.326-4.629  c18.967,3.04,33.507,19.512,33.507,39.323c0,1.875-0.149,3.713-0.404,5.518l-2.846-0.654l2.632,8.581l6.116-6.568L91.111,58.763z   M48.751,14.877c-2.007,0-3.639-1.633-3.639-3.64s1.632-3.64,3.639-3.64s3.639,1.633,3.639,3.64S50.758,14.877,48.751,14.877z   M84.021,67.155c-3.661,0-6.64,2.979-6.64,6.64c0,1.729,0.67,3.302,1.758,4.484c-7.312,8.63-18.217,14.124-30.388,14.124  c-8.825,0-16.98-2.896-23.589-7.772l1.963-2.234l-8.801-1.76l2.878,8.502l1.976-2.249c7.142,5.338,15.99,8.514,25.573,8.514  c13.196,0,25.001-6.013,32.864-15.427c0.747,0.292,1.557,0.458,2.405,0.458c3.66,0,6.639-2.979,6.639-6.64  S87.681,67.155,84.021,67.155z M84.021,77.435c-2.007,0-3.64-1.633-3.64-3.64s1.633-3.64,3.64-3.64s3.639,1.633,3.639,3.64  S86.027,77.435,84.021,77.435z\"/></svg>\n";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {

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
                    console.log('super user owner', widget.metadata[config.appId].owner, widget.lastModifiedUserId);
                    await this.checkWrongMovedBallPosition(widget, widgets);
                }
            }
        }
    }
    async checkOwnBallPosition(userId, ball, widgets) {
        const ballMeta = BallModel.getMeta(ball);
        const userCardWithBall = BallModel.userCardWithBall(ball, widgets);
        const allUserBallsCount = BallModel.getUserBallsAmount(userCardWithBall, widgets);
        const drawBucketMeta = BucketModel.getMeta(bucketType.draw, widgets);
        if (userCardWithBall &&
            this.widget.metadata[config.appId].owner === userCardWithBall.metadata[config.appId].owner &&
            allUserBallsCount > config.rules.memberBallLimit) {
            console.log('user reached limit in balls. Moving to draw bucket');
            BallModel.destroy(ball);
            BucketModel.updateBallsCount(bucketType.draw, widgets, drawBucketMeta.ballsCount + 1);
            return;
        }
        if (userCardWithBall && userId !== userCardWithBall.metadata[config.appId].owner) {
            if (ball.lastModifiedUserId !== userId) {
                console.log('wrong user touched ball');
                BallModel.destroy(ball);
                BucketModel.updateBallsCount(bucketType.draw, widgets, drawBucketMeta.ballsCount + 1);
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
        const targetBucketMeta = BucketModel.getMeta(bucketType.target, widgets);
        const isInTargetBucket = BucketModel.isBallInBucket(bucketType.target, ball, widgets);
        if (isInTargetBucket) {
            if (usersWidgets.length + 1 > ballMeta.participatedUserIds.length) {
                console.log('not all peers touched balls', usersWidgets.length, ballMeta.participatedUserIds);
                BallModel.destroy(ball);
                BucketModel.updateBallsCount(bucketType.draw, widgets, drawBucketMeta.ballsCount + 1);
                return;
            }
            BallModel.destroy(ball);
            BucketModel.updateBallsCount(bucketType.target, widgets, targetBucketMeta.ballsCount + 1);
            return;
        }
        if (!userCardWithBall && !isInTargetBucket) {
            console.log('outside of all valid cards');
            BallModel.destroy(ball);
            BucketModel.updateBallsCount(bucketType.draw, widgets, drawBucketMeta.ballsCount + 1);
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
        const drawBucketMeta = BucketModel.getMeta(bucketType.draw, widgets);
        console.log('wrong user 123');
        // todo check
        BallModel.destroy(ball);
        BucketModel.updateBallsCount(bucketType.draw, widgets, drawBucketMeta.ballsCount + 1);
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
            }
        });
        await miro.board.widgets.update({
            id: ball.id,
            metadata: {
                [config.appId]: ballMeta
            },
            text: (ballMeta.participatedUserIds.length - 1).toString()
        });
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
        const drawBucketMeta = BucketModel.getMeta(bucketType.draw, widgets);
        const targetBucketMeta = BucketModel.getMeta(bucketType.target, widgets);
        if (userCardWithBall && ball.lastModifiedUserId !== userId) {
            BallModel.destroy(ball);
            BucketModel.updateBallsCount(bucketType.draw, widgets, drawBucketMeta.ballsCount + 1);
            return;
        }
        const usersWidgets = UserModel.getAllCreatedUsers(widgets); // todo replace with enum
        const isInTargetBucket = BucketModel.isBallInBucket(bucketType.target, ball, widgets);
        if (isInTargetBucket && usersWidgets.length + 1 > ballMeta.participatedUserIds.length) {
            console.log('not all peers touched balls');
            BallModel.destroy(ball);
            BucketModel.updateBallsCount(bucketType.draw, widgets, drawBucketMeta.ballsCount + 1);
            return;
        }
        if (isInTargetBucket && usersWidgets.length === ballMeta.participatedUserIds.length) {
            console.log('move ball to target');
            BallModel.destroy(ball);
            BucketModel.updateBallsCount(bucketType.target, widgets, targetBucketMeta.ballsCount + 1);
            return;
        }
        const isInSourceBucket = BucketModel.isBallInBucket(bucketType.source, ball, widgets);
        /*    const isInDrawBucket = BucketModel.isBallInBucket(BucketType.draw, ball, widgets);
    
            if (!isInDrawBucket && ballMeta.bucketType === bucketType.draw) {
              ballMeta.bucketType = BucketType.draw;
              BallModel.destroy(ball);
              BucketModel.updateBallsCount(BucketType.draw, widgets, drawBucketMeta.ballsCount + 1)
              return;
            }*/
        if (userCardWithBall) {
            const allUserBallsCount = BallModel.getUserBallsAmount(userCardWithBall, widgets);
            if (userCardWithBall &&
                allUserBallsCount > config.rules.memberBallLimit) {
                console.log('user reached limit in balls. Moving to draw bucket');
                BallModel.destroy(ball);
                BucketModel.updateBallsCount(bucketType.draw, widgets, drawBucketMeta.ballsCount + 1);
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
            BucketModel.updateBallsCount(bucketType.draw, widgets, drawBucketMeta.ballsCount + 1);
            return;
        }
    }
    async checkWrongMovedBallPosition(ball, widgets) {
        const userCardWithBall = BallModel.userCardWithBall(ball, widgets);
        const drawBucketMeta = BucketModel.getMeta(bucketType.draw, widgets);
        if (!userCardWithBall || userCardWithBall.metadata[config.appId].owner !== ball.metadata[config.appId].owner) {
            console.log('out of user card!!');
            BallModel.destroy(ball);
            BucketModel.updateBallsCount(bucketType.draw, widgets, drawBucketMeta.ballsCount + 1);
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

// EXTERNAL MODULE: ./assets/icon_28_28.svg
var icon_28_28 = __webpack_require__(323);
;// CONCATENATED MODULE: ./src/index.ts




// @ts-ignore

const init = async () => {
    let currentUserId;
    let widgets;
    let PO;
    let user;
    try {
        currentUserId = await miro.currentUser.getId();
        widgets = await miro.board.widgets.get();
        PO = POModel.get(widgets);
        user = UserModel.get(currentUserId, widgets);
    }
    catch (e) {
    }
    if (PO && PO.widget.metadata[config.appId].owner === currentUserId && !PO.hasCanvasListener()) {
        PO.addCanvasListener();
    }
    if (user && !user.hasCanvasListener()) {
        user.addCanvasListener();
    }
    const onClick = async () => {
        const isAuthorized = await miro.isAuthorized();
        const boardInfo = await miro.board.info.get();
        if (!isAuthorized) {
            await miro.authorize({
                response_type: 'token',
                redirect_uri: 'https://ega-forever.github.io/miro-scrum-ball-game/auth-success.html',
                state: JSON.stringify({ board: `https://miro.com/app/board/${boardInfo.id}/` })
            });
            return;
        }
        const result = await miro.board.ui.openModal('modal.html', {
            width: 450,
            height: 150
        });
        if (result) {
            await processSelectedAction(result.option, result.locale);
        }
        return;
    };
    await miro.initialize({
        extensionPoints: {
            bottomBar: async () => {
                return {
                    title: 'Scrum balls',
                    svgIcon: icon_28_28,
                    onClick: onClick
                };
            }
        }
    });
    const processSelectedAction = async (option, locale) => {
        // @ts-ignore
        const onlineUsers = await miro.board.getOnlineUsers();
        currentUserId = await miro.currentUser.getId();
        const currentUsername = onlineUsers.find(u => u.id === currentUserId).name;
        widgets = await miro.board.widgets.get();
        if (option === actionType.startNewGamePO) {
            PO = await POModel.create(currentUserId, currentUsername, 0 - config.bucket.widthHeight - 100, 0, widgets, locale);
            PO.addCanvasListener();
        }
        if (option === actionType.leaveGameUser) {
            await user.stopTrack();
        }
        if (option === actionType.joinGameUser) {
            user = await UserModel.create(currentUserId, currentUsername, -config.bucket.widthHeight * 2 - 100, 0);
            user.addCanvasListener();
        }
        if (option === actionType.endGamePO) {
            await PO.stopTrack();
        }
        if (option === actionType.resetGamePO) {
            await PO.resetScores();
        }
    };
};
miro.onReady(init);

})();

/******/ })()
;