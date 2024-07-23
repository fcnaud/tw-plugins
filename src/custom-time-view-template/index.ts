import { widget as Widget } from '$:/core/modules/widgets/widget.js';
import { IChangedTiddlers } from 'tiddlywiki';

class TimeSinceWidget extends Widget {
    refresh(_changedTiddlers: IChangedTiddlers) {
        return false;
    }

    render(parent: Element, nextSibling: Element) {
        this.parentDomNode = parent;
        this.computeAttributes();
        this.execute();
        if (!this.hasAttribute("DateTime")) {
            return undefined;
        }
        console.log(this.getAttribute("DateTime"));
        const tiddlyWikiDateTimeStr = this.getAttribute("DateTime") as string;
        const dateTime = this.parseTiddlerDateTime(tiddlyWikiDateTimeStr);
        const formatTimeSince = this.formatTimeSince(dateTime);
        const containerElement = $tw.utils.domMaker('span', {
            text: formatTimeSince,
        });
        parent.insertBefore(containerElement, nextSibling);
        this.domNodes.push(containerElement);
    }

    formatTimeSince(dateTime: Date): string {
        const now = new Date();
        const timeDiff = now.getTime() - dateTime.getTime();
        const yearDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 365));
        const monthDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 30));
        const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hourDiff = Math.floor(timeDiff / (1000 * 60 * 60));
        
        if (yearDiff > 0) {
            return `${yearDiff}年前`;
        } else if (monthDiff > 0) {
            return `${monthDiff}个月前`;
        } else if (dayDiff > 0) {
            return `${dayDiff}天前`;
        } else if (hourDiff > 0) {
            return `${hourDiff}小时前`;
        } else {
            return '刚刚';
        }
    }

    parseTiddlerDateTime(dateTimeStr: string): Date {
        const year = parseInt(dateTimeStr.substring(0, 4), 10);
        const month = parseInt(dateTimeStr.substring(4, 6), 10) - 1; // JavaScript中月份是从0开始的
        const day = parseInt(dateTimeStr.substring(6, 8), 10);
        const hour = parseInt(dateTimeStr.substring(8, 10), 10);
        const minute = parseInt(dateTimeStr.substring(10, 12), 10);
        const second = parseInt(dateTimeStr.substring(12, 14), 10);
        const millisecond = dateTimeStr.length > 14 ? parseInt(dateTimeStr.substring(14), 10) : 0;
    
        return new Date(year, month, day, hour, minute, second, millisecond);
    }
    
}

declare let exports: {
    TimeSince: typeof TimeSinceWidget;
};
exports.TimeSince = TimeSinceWidget;
