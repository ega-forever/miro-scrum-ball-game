import BucketModel from './BucketModel';
import config from '../config/index';
import formType from '../static/formType';
import BallModel from './BallModel';
import IWidget = SDK.IWidget;
import IShapeWidget = SDK.IShapeWidget;

export default class CommonUserModel {

  protected listener: any;

  public addCanvasListener() {
    if (this.listener) {
      return;
    }

    this.listener = this.checkCanvas.bind(this);
    miro.addListener('CANVAS_CLICKED', this.listener);
  }

  public hasCanvasListener() {
    return !!this.listener;
  }

  public async checkCanvas() {
    const widgets = await miro.board.widgets.get();
    const userId = await miro.currentUser.getId();

    if(!(await this.customCheck(userId, widgets))){
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

      if (
        widget.metadata &&
        widget.metadata[config.appId] &&
        widget.metadata[config.appId].formType === formType.ball
      ) {
        if (widget.metadata[config.appId].owner === userId) {
          await BallModel.checkBallProportions(widget as any);
          await this.checkOwnBallPosition(userId, widget as any, widgets);
        }

        if (widget.metadata[config.appId].owner !== userId && widget.lastModifiedUserId === userId) {
          await this.checkWrongMovedBallPosition(widget as any, widgets);
        }
      }

    }
  }

  protected async customCheck(userId: string, widgets: IWidget[]){
    return true;
  }

  protected async checkOwnBallPosition(userId: string, ball: IShapeWidget, widgets: IWidget[]){
  }

  protected async checkWrongMovedBallPosition(ball: IShapeWidget, widgets: IWidget[]){}

  protected async checkBucketProportions(bucket: any) {
    if (bucket.height !== config.bucket.widthHeight || bucket.width !== config.bucket.widthHeight) {
      await BucketModel.resetProportions(bucket);
    }
  }

}
