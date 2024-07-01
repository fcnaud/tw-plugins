import { widget as Widget } from '$:/core/modules/widgets/widget.js';
import { IChangedTiddlers, IParseTreeNode, IWidgetInitialiseOptions, Tiddler } from 'tiddlywiki';
import flatpickr from './flatpickr.min.js';
import { DateTime } from './luxon.min.js';
import './index.css';

class DatePickerWidget extends Widget {
  id: string = "";
  currentTiddler: Tiddler | undefined;
  content: string = "";
  dateTime: DateTime = DateTime.now();

  execute() {
    if (this.attributes) {
      this.computeAttributes();
    }
    const currentTiddlerTitle = this.getVariable("currentTiddler");
    this.currentTiddler = $tw.wiki.getTiddler(currentTiddlerTitle);
    this.id = this.getAttribute("id", this.id);

    if (!this.hasAttribute("id")) {
      this.content = "未设置id属性";
      return undefined;
    }

    if (this.currentTiddler == undefined) {
      return undefined;
    }

    if (!this.currentTiddler.hasField(this.id)) {
      $tw.wiki.addTiddler(new $tw.Tiddler(this.currentTiddler.fields, { [this.id]: DateTime.now().toString() }));
    }

    this.dateTime = DateTime.fromISO(this.currentTiddler?.getFieldString(this.id));

    if (!this.dateTime.isValid) {
      this.content = "无效日期";
      return undefined;
    }

    this.content = this.dateTime.toFormat("yyyy年MM月dd日");
  }


  refresh(_changedTiddlers: IChangedTiddlers) {
    this.refreshSelf();
    return true;
  }

  render(parent: Element, nextSibling: Element) {
    this.parentDomNode = parent;
    this.execute();
    const containerElement = $tw.utils.domMaker('span', {
      text: this.content,
      class: "gltzeba-datepicker"
    });
    flatpickr(containerElement, {
      enableTime: true,
      dateFormat: 'Y-m-d H:i',
      defaultDate: this.dateTime.toJSDate(),
      onChange: (selectedDates: Date[], dateStr: string, instance: any) => {
        console.log(dateStr, selectedDates[0].toString());
        if (this.currentTiddler) {
          $tw.wiki.addTiddler(new $tw.Tiddler(this.currentTiddler.fields, { [this.id]: DateTime.fromJSDate(selectedDates[0]).toISO() }));
        }
      }
    });
    parent.insertBefore(containerElement, nextSibling);
    this.domNodes.push(containerElement);
  }
}

// zh tips
// 此处导出的模块变量名RandomNumber将作为微件（widget）的名称。使用<$RandomNumber/>调用此微件。
// Widget在tiddlywiki中的条目名、源文件以及源文件.meta文件名和Widget名字可以不一致。
// 比如Widget条目名可以为My-Widget,源文件以及源文件.meta文件名可以称为index.ts与index.ts.meta。最终的Widget名却是：RandomNumber，且使用<$RandomNumber/>调用此微件。
// 如果为一个脚本文件添加了 .meta 将会被视为入口文件。
// en tips
// The module variable name RandomNumber exported here will be used as the name of the widget. Use <$RandomNumber/> to call this Widget.
// The Widget's tiddler name, source file, and source file .meta file name in tiddlywiki can be inconsistent with the Widget name.
// For example, the Widget entry name could be My-Widget, and the source and source.meta file names could be index.ts and index.ts.meta, but the final Widget name could be RandomNumber, and the widget would be called with <$RandomNumber/>.
// If a .meta is added to a script file it will be treated as an entry file.
declare let exports: {
  DatePicker: typeof DatePickerWidget;
};
exports.DatePicker = DatePickerWidget;
