/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./src/config/index.ts
/* harmony default export */ var config = ({
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

// CONCATENATED MODULE: ./src/static/formType.ts
var FormType;
(function (FormType) {
    FormType[FormType["ball"] = 1] = "ball";
    FormType[FormType["bucket"] = 2] = "bucket";
    FormType[FormType["card"] = 3] = "card";
    FormType[FormType["userSticker"] = 4] = "userSticker";
    FormType[FormType["guestUserCard"] = 5] = "guestUserCard";
})(FormType || (FormType = {}));
/* harmony default export */ var formType = (FormType);

// CONCATENATED MODULE: ./src/static/colors.ts
/* harmony default export */ var colors = ({
    ball: '#2d9bf0',
    sourceBucket: '#cee741',
    targetBucket: '#fac710',
    drawBucket: '#9c258e',
    sticker: '#f16c7f'
});

// CONCATENATED MODULE: ./src/static/bucketType.ts
var BucketType;
(function (BucketType) {
    BucketType["source"] = "source";
    BucketType["target"] = "target";
    BucketType["draw"] = "draw";
})(BucketType || (BucketType = {}));
/* harmony default export */ var static_bucketType = (BucketType);

// CONCATENATED MODULE: ./src/models/BucketModel.ts



class BucketModel_BucketModel {
    static get(type, widgets) {
        return widgets.find(w => w.metadata[config.appId] &&
            w.metadata[config.appId].formType === formType.bucket &&
            w.metadata[config.appId].bucketType === type);
    }
    static getMeta(type, widgets) {
        const widget = BucketModel_BucketModel.get(type, widgets);
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
            text: type === static_bucketType.source ? '' : '0',
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
        const bucket = BucketModel_BucketModel.get(type, widgets);
        bucket.metadata[config.appId].ballsCount = ballsCount;
        bucket.text = ballsCount.toString();
        await miro.board.widgets.update(bucket);
    }
    static checkBucketsOverFlow(widgets) {
        const buckets = widgets.filter(w => w.metadata[config.appId].formType === formType.bucket);
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
        const sourceBucket = widgets.find(w => w.metadata[config.appId].bucketType === static_bucketType.source);
        const targetBucket = widgets.find(w => w.metadata[config.appId].bucketType === static_bucketType.target);
        const drawBucket = widgets.find(w => w.metadata[config.appId].bucketType === static_bucketType.draw);
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

// CONCATENATED MODULE: ./src/models/CommonUserModel.ts




class CommonUserModel_CommonUserModel {
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
        const areBucketsOverFlow = BucketModel_BucketModel.checkBucketsOverFlow(widgets);
        if (areBucketsOverFlow) {
            await BucketModel_BucketModel.resetBucketsPosition(0, 0, widgets);
        }
        for (const widget of widgets) {
            if (widget.metadata && widget.metadata[config.appId].formType === formType.bucket) {
                await this.checkBucketProportions(widget);
            }
            if (widget.metadata &&
                widget.metadata[config.appId] &&
                widget.metadata[config.appId].formType === formType.ball) {
                if (widget.metadata[config.appId].owner === userId) {
                    await BallModel_BallModel.checkBallProportions(widget);
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
            await BucketModel_BucketModel.resetProportions(bucket);
        }
    }
}

// CONCATENATED MODULE: ./src/models/UserModel.ts










class UserModel_UserModel extends CommonUserModel_CommonUserModel {
    constructor(widget) {
        super();
        this.widget = widget;
    }
    static get(userId, widgets) {
        const widget = widgets.find(w => w.metadata[config.appId] &&
            w.metadata[config.appId].owner === userId &&
            w.metadata[config.appId].formType === formType.userSticker) || null;
        return widget ? new UserModel_UserModel(widget) : null;
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
        return new UserModel_UserModel(result);
    }
    static getAllCreatedUsers(widgets) {
        return widgets.filter(w => w.metadata[config.appId] && w.metadata[config.appId].formType === formType.userSticker);
    }
    async customCheck(userId, widgets) {
        const userWidget = UserModel_UserModel.get(userId, widgets);
        if (!userWidget) {
            miro.removeListener('CANVAS_CLICKED', this.listener);
            this.listener = null;
            return false;
        }
        return true;
    }
    async checkCanvas() {
        const widgets = await miro.board.widgets.get();
        const userId = await miro.currentUser.getId();
        const userWidget = UserModel_UserModel.get(userId, widgets);
        if (!userWidget) {
            miro.removeListener('CANVAS_CLICKED', this.listener);
            this.listener = null;
            return;
        }
        const areBucketsOverFlow = BucketModel_BucketModel.checkBucketsOverFlow(widgets);
        if (areBucketsOverFlow) {
            await BucketModel_BucketModel.resetBucketsPosition(0, 0, widgets);
        }
        for (const widget of widgets) {
            if (widget.metadata && widget.metadata[config.appId].formType === formType.bucket) {
                await this.checkBucketProportions(widget);
            }
            if (widget.metadata &&
                widget.metadata[config.appId] &&
                widget.metadata[config.appId].formType === formType.ball) {
                if (widget.metadata[config.appId].owner === userId) {
                    await BallModel_BallModel.checkBallProportions(widget);
                    await this.checkOwnBallPosition(userId, widget, widgets);
                }
                if (widget.metadata[config.appId].owner !== userId && widget.lastModifiedUserId === userId) {
                    await this.checkWrongMovedBallPosition(widget, widgets);
                }
            }
        }
    }
    async checkOwnBallPosition(userId, ball, widgets) {
        const ballMeta = BallModel_BallModel.getMeta(ball);
        const userCardWithBall = BallModel_BallModel.userCardWithBall(ball, widgets);
        const allUserBallsCount = BallModel_BallModel.getUserBallsAmount(userCardWithBall, widgets);
        const drawBucketMeta = BucketModel_BucketModel.getMeta(static_bucketType.draw, widgets);
        if (userCardWithBall &&
            this.widget.metadata[config.appId].owner === userCardWithBall.metadata[config.appId].owner &&
            allUserBallsCount > config.rules.memberBallLimit) {
            console.log('user reached limit in balls. Moving to draw bucket');
            BallModel_BallModel.destroy(ball);
            BucketModel_BucketModel.updateBallsCount(static_bucketType.draw, widgets, drawBucketMeta.ballsCount + 1);
            return;
        }
        if (userCardWithBall && userId !== userCardWithBall.metadata[config.appId].owner) {
            if (ball.lastModifiedUserId !== userId) {
                console.log('wrong user touched ball');
                BallModel_BallModel.destroy(ball);
                BucketModel_BucketModel.updateBallsCount(static_bucketType.draw, widgets, drawBucketMeta.ballsCount + 1);
                return;
            }
            if (ballMeta.participatedUserIds.indexOf(userCardWithBall.metadata[config.appId].owner) === -1) {
                ballMeta.participatedUserIds.push(userCardWithBall.metadata[config.appId].owner);
            }
            ballMeta.owner = userCardWithBall.metadata[config.appId].owner;
            ballMeta.bucketType = null;
            BallModel_BallModel.updateMeta(ball, ballMeta);
            return;
        }
        const targetBucketMeta = BucketModel_BucketModel.getMeta(static_bucketType.target, widgets);
        const isInTargetBucket = BucketModel_BucketModel.isBallInBucket(static_bucketType.target, ball, widgets);
        if (isInTargetBucket) {
            BallModel_BallModel.destroy(ball);
            BucketModel_BucketModel.updateBallsCount(static_bucketType.target, widgets, targetBucketMeta.ballsCount + 1);
            return;
        }
        if (!userCardWithBall && !isInTargetBucket) {
            console.log('outside of all valid cards');
            BallModel_BallModel.destroy(ball);
            BucketModel_BucketModel.updateBallsCount(static_bucketType.draw, widgets, drawBucketMeta.ballsCount + 1);
            return;
        }
    }
    //todo move po ball / or more to another card
    async checkWrongMovedBallPosition(ball, widgets) {
        const POId = POModel_POModel.getOwnerId(widgets);
        if (ball.metadata[config.appId].owner === POId) {
            console.log('ive moved owner ball');
            BallModel_BallModel.moveToBucket(static_bucketType.source, ball, widgets);
            return;
            // todo move ball back
        }
        const drawBucketMeta = BucketModel_BucketModel.getMeta(static_bucketType.draw, widgets);
        // todo remove ball
        BallModel_BallModel.destroy(ball);
        BucketModel_BucketModel.updateBallsCount(static_bucketType.draw, widgets, drawBucketMeta.ballsCount + 1);
    }
    async stopTrack() {
        await miro.board.widgets.deleteById(this.widget.id);
        miro.removeListener('CANVAS_CLICKED', this.listener);
        this.listener = null;
    }
}

// CONCATENATED MODULE: ./src/models/BallModel.ts





class BallModel_BallModel {
    static async get(ballId) {
        const widgets = await miro.board.widgets.get();
        return widgets.find(w => w.id === ballId) || null;
    }
    static getMeta(widget) {
        return widget ? widget.metadata[config.appId] : null;
    }
    static async create(x, y, owner, index, color, bucketType) {
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
                    ballIndex: index,
                    owner,
                    participatedUserIds: [],
                    bucketType,
                    formType: formType.ball
                }
            }
        });
    }
    static userCardWithBall(ball, widgets) {
        const usersCards = UserModel_UserModel.getAllCreatedUsers(widgets);
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
        const bucketMeta = BucketModel_BucketModel.getMeta(bucketType, widgets);
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
            text: ballMeta.participatedUserIds.length.toString()
        });
    }
    static async moveToBucket(bucketType, ball, widgets) {
        const bucket = BucketModel_BucketModel.get(bucketType, widgets);
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
            await BallModel_BallModel.resetProportions(ball);
        }
    }
}

// CONCATENATED MODULE: ./src/models/POModel.ts










class POModel_POModel extends CommonUserModel_CommonUserModel {
    constructor(widget) {
        super();
        this.widget = widget;
    }
    static async create(userId, username, x, y, widgets) {
        const buckets = [
            {
                type: static_bucketType.source,
                color: colors.sourceBucket,
                x,
                y,
                text: ''
            },
            {
                type: static_bucketType.target,
                color: colors.targetBucket,
                x: x + config.bucket.widthHeight + 100,
                y,
                text: '0'
            },
            {
                type: static_bucketType.draw,
                color: colors.drawBucket,
                x: x + (config.bucket.widthHeight + 100) * 2,
                y,
                height: config.bucket.widthHeight,
                width: config.bucket.widthHeight,
                text: '0'
            }
        ];
        for (const bucket of buckets) {
            let b = BucketModel_BucketModel.get(bucket.type, widgets);
            if (!b) {
                await BucketModel_BucketModel.create(bucket.type, bucket.x, bucket.y, bucket.color, userId);
            }
        }
        const [widget] = await miro.board.widgets.create({
            type: 'card',
            title: `game PO: ${username}`,
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
            await BallModel_BallModel.create(buckets[0].x, buckets[0].y, userId, i, colors.ball, buckets[0].type);
        }
        return new POModel_POModel(widget);
    }
    static getOwnerId(widgets) {
        const bucketMeta = BucketModel_BucketModel.getMeta(static_bucketType.source, widgets);
        return bucketMeta ? bucketMeta.owner : null;
    }
    static get(widgets) {
        const bucketMeta = BucketModel_BucketModel.getMeta(static_bucketType.source, widgets);
        if (!bucketMeta) {
            return null;
        }
        const widget = widgets.find(w => w.metadata[config.appId] &&
            w.metadata[config.appId].owner === bucketMeta.owner &&
            w.metadata[config.appId].formType === formType.card) || null;
        return widget ? new POModel_POModel(widget) : null;
    }
    async customCheck(userId, widgets) {
        await this.checkIfSourceBucketHasEnoughBalls(widgets);
        return true;
    }
    async checkIfSourceBucketHasEnoughBalls(widgets) {
        const sourceBucket = BucketModel_BucketModel.get(static_bucketType.source, widgets);
        const sourceBucketMeta = BucketModel_BucketModel.getMeta(static_bucketType.source, widgets);
        const ballsInSourceBucket = BallModel_BallModel.getBucketBalls(static_bucketType.source, widgets);
        for (let i = 0; i <= (config.balls.initialAmount - ballsInSourceBucket.length); i++) {
            await BallModel_BallModel.create(sourceBucket.x, sourceBucket.y, sourceBucketMeta.owner, 1, colors.ball, static_bucketType.source);
        }
    }
    async checkOwnBallPosition(userId, ball, widgets) {
        const ballMeta = BallModel_BallModel.getMeta(ball);
        const userCardWithBall = BallModel_BallModel.userCardWithBall(ball, widgets);
        const drawBucketMeta = BucketModel_BucketModel.getMeta(static_bucketType.draw, widgets);
        const targetBucketMeta = BucketModel_BucketModel.getMeta(static_bucketType.target, widgets);
        if (userCardWithBall && ball.lastModifiedUserId !== userId) {
            BallModel_BallModel.destroy(ball);
            BucketModel_BucketModel.updateBallsCount(static_bucketType.draw, widgets, drawBucketMeta.ballsCount + 1);
            return;
        }
        const usersWidgets = UserModel_UserModel.getAllCreatedUsers(widgets); // todo replace with enum
        const isInTargetBucket = BucketModel_BucketModel.isBallInBucket(static_bucketType.target, ball, widgets);
        if (isInTargetBucket && usersWidgets.length > ballMeta.participatedUserIds.length) {
            console.log('not all peers touched balls');
            BallModel_BallModel.destroy(ball);
            BucketModel_BucketModel.updateBallsCount(static_bucketType.draw, widgets, drawBucketMeta.ballsCount + 1);
            return;
        }
        if (isInTargetBucket && usersWidgets.length === ballMeta.participatedUserIds.length) {
            console.log('move ball to target');
            BallModel_BallModel.destroy(ball);
            BucketModel_BucketModel.updateBallsCount(static_bucketType.target, widgets, targetBucketMeta.ballsCount + 1);
            return;
        }
        const isInSourceBucket = BucketModel_BucketModel.isBallInBucket(static_bucketType.source, ball, widgets);
        const isInDrawBucket = BucketModel_BucketModel.isBallInBucket(static_bucketType.draw, ball, widgets);
        if (!isInDrawBucket && ballMeta.bucketType === static_bucketType.draw) {
            ballMeta.bucketType = static_bucketType.draw;
            BallModel_BallModel.destroy(ball);
            BucketModel_BucketModel.updateBallsCount(static_bucketType.draw, widgets, drawBucketMeta.ballsCount + 1);
            return;
        }
        if (userCardWithBall) {
            const allUserBallsCount = BallModel_BallModel.getUserBallsAmount(userCardWithBall, widgets);
            if (userCardWithBall &&
                allUserBallsCount > config.rules.memberBallLimit) {
                console.log('user reached limit in balls. Moving to draw bucket');
                BallModel_BallModel.destroy(ball);
                BucketModel_BucketModel.updateBallsCount(static_bucketType.draw, widgets, drawBucketMeta.ballsCount + 1);
                return;
            }
            ballMeta.participatedUserIds.push(userCardWithBall.metadata[config.appId].owner);
            ballMeta.owner = userCardWithBall.metadata[config.appId].owner;
            ballMeta.bucketType = null;
            BallModel_BallModel.updateMeta(ball, ballMeta);
            return;
        }
        if (!userCardWithBall && !isInSourceBucket && !isInTargetBucket) {
            console.log('outside of all cards');
            BallModel_BallModel.destroy(ball);
            BucketModel_BucketModel.updateBallsCount(static_bucketType.draw, widgets, drawBucketMeta.ballsCount + 1);
            return;
        }
    }
    async checkWrongMovedBallPosition(ball, widgets) {
        const userCardWithBall = BallModel_BallModel.userCardWithBall(ball, widgets);
        const drawBucketMeta = BucketModel_BucketModel.getMeta(static_bucketType.draw, widgets);
        if (!userCardWithBall || userCardWithBall.metadata[config.appId].owner !== ball.metadata[config.appId].owner) {
            console.log('out of user card!!');
            BallModel_BallModel.destroy(ball);
            BucketModel_BucketModel.updateBallsCount(static_bucketType.draw, widgets, drawBucketMeta.ballsCount + 1);
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
}

// CONCATENATED MODULE: ./src/index.ts



const startIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><title>BUSINESS</title><g id="scrum_ball_game" data-name="02.TARGET"><path d="M25.06,9.76a11,11,0,1,1-2.82-2.82l1.43-1.43a13,13,0,1,0,2.82,2.82Z"/><path d="M20.06,9.12A7.9,7.9,0,0,0,16,8a8,8,0,1,0,8,8,7.9,7.9,0,0,0-1.12-4.06l-1.47,1.47A5.9,5.9,0,0,1,22,16a6,6,0,1,1-6-6,5.9,5.9,0,0,1,2.59.59Z"/><circle cx="16" cy="16" r="2"/><path d="M28.78,3.22V.78L26.59,3l-.44,1.77a1,1,0,0,0-.58.27l-7.77,7.77a1,1,0,1,0,1.41,1.41L27,6.43a1,1,0,0,0,.27-.58L29,5.41l2.2-2.2Z"/></g></svg>`;
miro.onReady(async () => {
    await miro.initialize({
        extensionPoints: {
            bottomBar: async () => {
                return {
                    title: 'Scrum balls (start / stop)',
                    svgIcon: startIcon,
                    onClick: onClick
                };
            }
        }
    });
});
let user = null;
let PO = null;
async function onClick() {
    const isAuthorized = await miro.isAuthorized();
    if (!isAuthorized) {
        await miro.authorize({
            response_type: 'token',
            redirect_uri: 'https://ega-forever.github.io/miro-scrum-ball-game/auth-success.html'
        });
        return;
    }
    // @ts-ignore
    const onlineUsers = await miro.board.getOnlineUsers();
    const currentUserId = await miro.currentUser.getId();
    const currentUsername = onlineUsers.find(u => u.id === currentUserId).name;
    const widgets = await miro.board.widgets.get();
    PO = POModel_POModel.get(widgets);
    if (PO && PO.widget.metadata[config.appId].owner === currentUserId) {
        await PO.stopTrack();
        return;
    }
    if (!PO) {
        PO = await POModel_POModel.create(currentUserId, currentUsername, 0 - config.bucket.widthHeight - 100, 0, widgets);
        PO.addCanvasListener();
        return;
    }
    user = UserModel_UserModel.get(currentUserId, widgets);
    if (user && user.hasCanvasListener()) {
        await user.stopTrack(currentUserId);
        return;
    }
    if (!user) {
        user = await UserModel_UserModel.create(currentUserId, currentUsername, -config.bucket.widthHeight * 2 - 100, 0);
    }
    user.addCanvasListener();
}


/***/ })
/******/ ]);