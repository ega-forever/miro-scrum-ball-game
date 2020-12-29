import IStickerWidget = SDK.IStickerWidget;
import IWidget = SDK.IWidget;
import IShapeWidget = SDK.IShapeWidget;
import FormType from '../static/formType';
import config from '../config/index';
import colors from '../static/colors';
import BucketType from '../static/bucketType';

interface Meta {
  owner: string,
  formType: FormType.userSticker
}

export default class UserModel {

  public static get(userId: string, widgets: IWidget[]): IStickerWidget | null {
    return widgets.find(w =>
      w.metadata[config.appId] &&
      w.metadata[config.appId].owner === userId &&
      w.metadata[config.appId].formType === FormType.userSticker
    ) as any || null;
  }

  public static getMeta(widget: IWidget): Meta | null {
    return widget ? widget.metadata[config.appId] : null;
  }

  public static async create(userId: string, username: string, x: number, y: number): Promise<void> {

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
          formType: FormType.userSticker
        } as Meta
      },
      capabilities: {
        editable: false
      }
    });

    await miro.board.widgets.sendBackward(result.id);
  }

  public static getAllCreatedUsers(widgets: IWidget[]): IStickerWidget[] {
    return widgets.filter(w => w.metadata[config.appId] && w.metadata[config.appId].formType === FormType.userSticker) as any;
  }

  public static async remove(userId: string, widgets: IWidget[]): Promise<void>{
    const widget = UserModel.get(userId, widgets);
    await miro.board.widgets.deleteById(widget.id);
  }

}
