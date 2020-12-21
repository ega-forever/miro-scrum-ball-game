const appId = '3074457352753106105';
const balls = 12;
const ballRadius = 50;
const bucketWidthHeight = Math.ceil(Math.sqrt(balls)) * ballRadius;
const memberCanTakeBalls = 1;

const startIcon =
  '<circle cx="12" cy="12" r="9" fill="none" fill-rule="evenodd" stroke="currentColor" stroke-width="2"></circle>'

miro.onReady(async () => {

  const info = await miro.board.info.get();
  const currentUserId = await miro.currentUser.getId();

  if (info.owner.id === currentUserId) {
    await miro.initialize({
      extensionPoints: {
        bottomBar: async () => {
          return {
            title: 'Scrum balls (start)',
            svgIcon: startIcon,
            onClick: start
          }
        }
      }
    });
  }
});

let initted = false;
const users = [];

async function start () {

  if (initted) {
    return;
  }

  const onlineUsers = await miro.board.getOnlineUsers();


  await addWidgetToUsers(onlineUsers);

  miro.addListener(miro.enums.event.ONLINE_USERS_CHANGED, async (ev) => {
    await addWidgetToUsers(ev.data);
  })

  initted = true;

  while (1) {
    const widgets = await miro.board.widgets.get();

    for (const widget of widgets) {
      if (widget.metadata && widget.metadata[appId] && typeof widget.metadata[appId].ballIndex === 'number') {
        await checkBallPosition(widget.id)
      }
    }

    await new Promise(res => setTimeout(res, 500));
  }
}

async function addWidgetToUsers (users) {
  const info = await miro.board.info.get();
  const memberUsers = users.filter(w => w.id !== info.owner.id);
  const widgets = await miro.board.widgets.get();

  let isPOExists = !!widgets.find(w => w.metadata && w.metadata[appId].bucketType)

  for (const user of memberUsers) {
    // if first user among all - then user is po

    if (user.id === info.owner.id) {
      continue;
    }

    if (!isPOExists) {
      await addPOWidgets(user.id, user.name);
      isPOExists = true;
    } else {
      await addMemberWidgets(user.id, user.name);
    }
  }

}

const addMemberWidgets = async (userId, username) => {
  const widgets = await miro.board.widgets.get();

  const isStickerExists = !!widgets
    .find(w => w.metadata[appId] && w.metadata[appId].owner === userId);

  if (!isStickerExists) {
    // todo create sticker for this user
    await miro.board.widgets.create({
      type: 'sticker',
      text: username,
      style: {
        stickerBackgroundColor: '#f16c7f'
      },
      x: -bucketWidthHeight - 100,
      y: 0,
      metadata: {
        [appId]: {
          owner: userId
        }
      },
      capabilities: {
        editable: false
      }
    })
  }
}

const addPOWidgets = async (currentUserId, currentUserName) => {
  const widgets = await miro.board.widgets.get();

  const buckets = [
    {
      type: 'source',
      color: '#cee741',
      x: 0,
      y: 0,
      height: bucketWidthHeight,
      width: bucketWidthHeight,
      text: currentUserName
    },
    {
      type: 'target',
      color: '#fac710',
      x: bucketWidthHeight + 100,
      y: 0,
      height: bucketWidthHeight,
      width: bucketWidthHeight,
      text: null
    },
    {
      type: 'draw',
      color: '#9c258e',
      x: (bucketWidthHeight + 100) * 2,
      y: 0,
      height: bucketWidthHeight,
      width: bucketWidthHeight,
      text: null
    }
  ];

  for (const bucket of buckets) {

    const isStickerExists = !!widgets
      .find(w => w.metadata[appId] && w.metadata[appId].owner === currentUserId && w.metadata[appId].bucketType === bucket.type);


    if (!isStickerExists) {
      await miro.board.widgets.create({
        type: 'shape',
        style: {
          backgroundColor: bucket.color
        },
        height: bucket.height,
        width: bucket.width,
        x: bucket.x,
        y: bucket.y,
        text: bucket.text,
        metadata: {
          [appId]: {
            owner: currentUserId,
            bucketType: bucket.type
          }
        }
      })
    }
  }

  for (let i = 0; i < balls; i++) {
    const isStickerExists = !!widgets
      .find(w => w.metadata[appId] && w.metadata[appId].ballIndex === i);


    if (!isStickerExists) {
      await miro.board.widgets.create({
        type: 'shape',
        style: {
          backgroundColor: '#2d9bf0',
          shapeType: 4
        },
        height: 50,
        width: 50,
        x: buckets[0].x,
        y: buckets[0].y,
        metadata: {
          [appId]: {
            ballIndex: i,
            owner: currentUserId,
            participatedUserIds: []
          }
        }
      })
    }
  }
}

const checkBallPosition = async (ballId) => {

  const info = await miro.board.info.get();
  const widgets = await miro.board.widgets.get();
  const ball = widgets.find(w => w.id === ballId);

  const stickers = widgets.filter(w => w.type === 'STICKER') // todo replace with enum
  const sourceBucket = widgets.find(w => w.metadata && w.metadata[appId] && w.metadata[appId].bucketType === 'source');
  const targetBucket = widgets.find(w => w.metadata && w.metadata[appId] && w.metadata[appId].bucketType === 'target');
  const drawBucket = widgets.find(w => w.metadata && w.metadata[appId] && w.metadata[appId].bucketType === 'draw');

  if (
    (ball.x - ball.width / 2) >= (targetBucket.x - targetBucket.width / 2) && (ball.x + ball.width / 2) <= (targetBucket.x + targetBucket.width / 2) &&
    (ball.y - ball.height / 2) >= (targetBucket.y - targetBucket.height / 2) && (ball.y + ball.height / 2) <= (targetBucket.y + targetBucket.height / 2)
  ) {
    if (stickers.length > ball.metadata[appId].participatedUserIds.length) {
      console.log('not all peers touched balls');
      miro.board.widgets.update({
        id: ball.id,
        x: sourceBucket.x,
        y: sourceBucket.y,
        text: '-',
        metadata: {
          [appId]: {
            ballIndex: ball.metadata[appId].ballIndex,
            participatedUserIds: [],
            owner: sourceBucket.metadata[appId].owner
          }
        }
      });
    }

    return;
  }

  const stickerWithBall = stickers.find(s => {
    return (ball.x - ball.width / 2) >= (s.bounds.x - s.bounds.width / 2) && (ball.x + ball.width / 2) <= (s.bounds.x + s.bounds.width / 2) &&
      (ball.y - ball.height / 2) >= (s.bounds.y - s.bounds.height / 2) && (ball.y + ball.height / 2) <= (s.bounds.y + s.bounds.height / 2)
  });

  const isInSourceBucket = (ball.x - ball.width / 2) >= (sourceBucket.x - sourceBucket.width / 2) && (ball.x + ball.width / 2) <= (sourceBucket.x + sourceBucket.width / 2) &&
    (ball.y - ball.height / 2) >= (sourceBucket.y - sourceBucket.height / 2) && (ball.y + ball.height / 2) <= (sourceBucket.y + sourceBucket.height / 2);

  const isInDrawBucket = (ball.x - ball.width / 2) >= (drawBucket.x - drawBucket.width / 2) && (ball.x + ball.width / 2) <= (drawBucket.x + drawBucket.width / 2) &&
    (ball.y - ball.height / 2) >= (drawBucket.y - drawBucket.height / 2) && (ball.y + ball.height / 2) <= (drawBucket.y + drawBucket.height / 2);


  if (!stickerWithBall && !isInSourceBucket && !isInDrawBucket) {
    console.log('outside of all cards');
    miro.board.widgets.update({ // todo move to drawn
      id: ball.id,
      x: drawBucket.x,
      y: drawBucket.y,
      text: '-',
      metadata: {
        [appId]: {
          ballIndex: ball.metadata[appId].ballIndex,
          participatedUserIds: [],
          owner: drawBucket.metadata[appId].owner
        }
      }
    });
    return;
  }

  if (stickerWithBall) {
    const stickerUserId = stickerWithBall.metadata[appId].userId;
    const ballOwnerUserId = ball.metadata[appId].owner;
    const ballMovedByUserId = ball.lastModifiedUserId;

    // todo should be moved by card owner (where card is placed)
    if (ballMovedByUserId !== ballOwnerUserId && ballMovedByUserId !== info.owner.id) {//todo info.owner should be replaced by account, who started the game
      console.log('wrong user moved ball to card (not owner)', ballMovedByUserId, ballOwnerUserId);
      miro.board.widgets.update({
        id: ball.id,
        x: drawBucket.x,
        y: drawBucket.y,
        text: '-',
        metadata: {
          [appId]: {
            ballIndex: ball.metadata[appId].ballIndex,
            participatedUserIds: [],
            owner: drawBucket.metadata[appId].owner
          }
        }
      });
      return;
    }

    if (ballMovedByUserId !== info.owner.id) {//todo info.owner should be replaced by account, who started the game
      if (ball.metadata[appId].participatedUserIds.includes(ballMovedByUserId)) {
        return;
      }

      ball.metadata[appId].participatedUserIds.push(ballMovedByUserId);
      ball.metadata[appId].owner = stickerUserId;
      // todo add text
      miro.board.widgets.update({
        id: ball.id,
        metadata: ball.metadata,
        text: ball.metadata[appId].participatedUserIds.length.toString()
      });
      console.log('added', ball.metadata)
    }
  }

}
