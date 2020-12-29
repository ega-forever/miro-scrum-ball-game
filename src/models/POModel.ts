import ICardWidget = SDK.ICardWidget;
import formType from '../static/formType';
import colors from '../static/colors';
import BucketModel from './BucketModel';
import BucketType from '../static/bucketType';
import config from '../config/index';
import BallModel from './BallModel';
import IWidget = SDK.IWidget;

export default class POModel {

  private readonly widget: ICardWidget;
  public readonly sourceBucket: BucketModel;
  public readonly targetBucket: BucketModel;
  public readonly drawBucket: BucketModel;

  public constructor(widget: ICardWidget, sourceBucket: BucketModel, targetBucket: BucketModel, drawBucket: BucketModel) {
    this.widget = widget;
    this.sourceBucket = sourceBucket;
    this.targetBucket = targetBucket;
    this.drawBucket = drawBucket;
  }

  public static async create(userId, username, x, y, widgets: IWidget[]): Promise<void> {

    const buckets = [
      {
        type: BucketType.source,
        color: colors.sourceBucket,
        x,
        y,
        text: ''
      },
      {
        type: BucketType.target,
        color: colors.targetBucket,
        x: x + config.bucket.widthHeight + 100,
        y,
        text: '0'
      },
      {
        type: BucketType.draw,
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

    await miro.board.widgets.create({
      type: 'card',
      title: `game PO: ${ username }`,
      x: x - config.bucket.widthHeight - 100,
      y: y + config.card.height + config.card.height / 2,
      metadata: {
        [config.appId]: {
          gamePO: userId,
          formType: formType.card
        }
      }
    });


    for (let i = 0; i < config.balls.initialAmount; i++) {
      await BallModel.create(buckets[0].x, buckets[0].y, userId, i, colors.ball, buckets[0].type)
    }

  }

  public static getOwnerId(widgets: IWidget[]): string | null {
    const bucketMeta = BucketModel.getMeta(BucketType.source, widgets);
    return bucketMeta ? bucketMeta.owner : null;
  }

}
