import { Plugin, moment } from 'obsidian';


export default class MyPlugin extends Plugin {
	statusBarItemEl = this.addStatusBarItem();
	
	async onload() {
		this.registerEvent(this.app.workspace.on('file-open', this.updateStatusBar.bind(this)));
		this.updateStatusBar();
	}
	
	updateStatusBar() {
		let ctime = this.app.workspace.getActiveFile()?.stat.ctime;
		let mtime = this.app.workspace.getActiveFile()?.stat.mtime;
		if (ctime === undefined) {
			ctime = 0;
		}
		if (mtime === undefined) {
			mtime = 0;
		}
		this.statusBarItemEl.setText(`作成日:${getJPDay(ctime)}   更新日:${getJPDay(mtime)}`);
	}

	onunload() {
		
	}
}

const dateFormat = (datetime: Date):String => {
	const today = new Date();
	const yesterday = new Date(today);
	yesterday.setDate(today.getDate() - 1);
	const oneWeekAgo = new Date(today);
	oneWeekAgo.setDate(today.getDate() - 7);

	if (datetime.toDateString() === today.toDateString()) {
		return '今日';
	} else if (datetime.toDateString() === yesterday.toDateString()) {
		return '昨日';
	} else if (datetime > oneWeekAgo) {
		return moment(datetime).format('ddd');
	} else {
		return moment(datetime).format('YYYY/MM/DD');
	}
}

function getJPDay(unixtime:number):string {
	let dateTime = new Date((unixtime / 1000) * 1000);
	const date = dateFormat(dateTime);
	const hours = dateTime.getHours().toString();
	const minutes = dateTime.getMinutes().toString();
	return `${date} ${hours}:${minutes}`;
}
