export const assetManager = {
	assets: {},
	loadAssets: (manifest, callback) => {
		const loader = new createjs.LoadQueue();
		loader.addEventListener('fileload', (event) => {
			assetManager.assets[event.item.name] = event.result;
		});
		loader.addEventListener('complete', () => {
			callback();
		});
		loader.loadManifest(manifest);
	},
	addAsset(name, url) {
		if (!this.assets[name]) {
			this.assets[name] = new Image();
			this.assets[name].src = url;
		} else {
			console.error(`Asset with name ${name} already exists.`);
		}
	},
	getAsset: (name) => {
		return assetManager.assets[name];
	},
};
