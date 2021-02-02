import IShapeWidget = SDK.IShapeWidget;
import IWidget = SDK.IWidget;
import config from '../config/index';
import BucketType from '../static/bucketType';
import FormType from '../static/formType';

interface Meta {
  owner: string,
  bucketType: BucketType,
  formType: FormType.bucket,
  ballsCount: number
}

export default class BucketModel {

  public static get(type: BucketType, widgets: IWidget[]): IShapeWidget | null {
    return widgets.find(w =>
      w.metadata[config.appId] &&
      w.metadata[config.appId].formType === FormType.bucket &&
      w.metadata[config.appId].bucketType === type
    ) as any;
  }

  public static getMeta(type: BucketType, widgets: IWidget[]): Meta | null {
    const widget = BucketModel.get(type, widgets);
    return widget ? widget.metadata[config.appId] : null;
  }

  public static isBallInBucket(type: BucketType, ball: IShapeWidget, widgets: IWidget[]): boolean {
    const widget = widgets.find(w =>
      w.metadata[config.appId] &&
      w.metadata[config.appId].formType === FormType.bucket &&
      w.metadata[config.appId].bucketType === type
    ) as any;

    if (!widget) {
      return false;
    }

    return (ball.x - ball.width / 2) >= (widget.x - widget.width / 2) && (ball.x + ball.width / 2) <= (widget.x + widget.width / 2) &&
      (ball.y - ball.height / 2) >= (widget.y - widget.height / 2) && (ball.y + ball.height / 2) <= (widget.y + widget.height / 2);
  }

  public static async create(type: BucketType, x: number, y: number, color: string, ownerId: string): Promise<void> {
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
      text: type === BucketType.source ? '' : '0',
      metadata: {
        [config.appId]: {
          owner: ownerId,
          bucketType: type,
          formType: FormType.bucket,
          ballsCount: 0
        } as Meta
      },
      capabilities: {
        editable: false
      }
    });
  }

  public static async updateBallsCount(type: BucketType, widgets: IWidget[], ballsCount): Promise<void> {
    const bucket = BucketModel.get(type, widgets);
    bucket.metadata[config.appId].ballsCount = ballsCount;
    bucket.text = ballsCount.toString();
    await miro.board.widgets.update(bucket);
  }

  public static checkBucketsOverFlow(widgets: IWidget[]) {
    const buckets: any = widgets.filter(w => w.metadata[config.appId] && w.metadata[config.appId].formType === FormType.bucket)

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

        if (
          ((startXI >= startXS && startXI <= endXS) || (endXI >= startXS && endXI <= endXS)) &&
          ((startYI >= startYS && startYI <= endYS) || (endYI >= startYS && endYI <= endYS))
      ) {
          return true;
        }
      }
    }

    return false;
  }

  public static async resetBucketsPosition(x, y, widgets: IWidget[]) {
    const sourceBucket: any = widgets.find(w => w.metadata[config.appId].bucketType === BucketType.source);
    const targetBucket: any = widgets.find(w => w.metadata[config.appId].bucketType === BucketType.target);
    const drawBucket: any = widgets.find(w => w.metadata[config.appId].bucketType === BucketType.draw);

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

  public static async resetProportions(bucket: any): Promise<void> {

    Object.assign(bucket, {
      height: config.bucket.widthHeight,
      width: config.bucket.widthHeight
    });

    await miro.board.widgets.update(bucket);
  }


}
