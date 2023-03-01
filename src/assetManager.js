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
	getAsset: (name) => {
		return assetManager.assets[name];
	},
};
